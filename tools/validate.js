#!/usr/bin/env node
// Validates Overwatch Workshop scripts (.ow) offline using OverPy.
//
//   node tools/validate.js                 # every .ow under heroes/ and _template/
//   node tools/validate.js heroes/lucio    # a folder or specific files
//   node tools/validate.js --strict ...    # warnings fail the run too
//   node tools/validate.js --opy FILE      # also print the decompiled OverPy
//
// Pass 1 (decompile) parses the raw Workshop text against OverPy's full
// action/value/constant tables: unknown function names, wrong argument
// counts, bad enum constants and missing semicolons fail here.
// Pass 2 (recompile) runs OverPy's linter over the parsed script: workshop
// engine bugs (chased vars in conditions, closest-player at origin...),
// event-value misuse (e.g. Victim in an Ongoing rule) and the element limit.
// Pass 3 runs repo-specific lint rules (see LINTS below).
//
// It cannot prove gameplay is right. Always paste into the game to confirm.

"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OVERPY = path.join(ROOT, ".tools/overpy/out/overpy_standalone.js");
const ELEMENT_LIMIT = 32768;

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const showOpy = args.includes("--opy");
const targets = args.filter((a) => !a.startsWith("--"));

if (!fs.existsSync(OVERPY)) {
    console.error("OverPy is not built. Run: tools/setup.sh");
    process.exit(2);
}

function collect(p, out) {
    const st = fs.statSync(p);
    if (st.isDirectory()) {
        for (const e of fs.readdirSync(p)) {
            if (e.startsWith(".") || e === "node_modules") continue;
            collect(path.join(p, e), out);
        }
    } else if (p.endsWith(".ow")) {
        out.push(p);
    }
    return out;
}

// Raw-text checks OverPy does not perform (or that it silently tolerates).
const LINTS = [
    {
        id: "hash-comment",
        test: (line) => /^\s*#/.test(line),
        msg: "'#' comments are not Workshop syntax and will fail to paste. Use a quoted comment string before the action, or '//'.",
    },
    {
        id: "chase-9999",
        test: (line) => /Chase (Player|Global) Variable (At Rate|Over Time)\([^;]*\b9999\b/.test(line),
        msg: "Chasing to 9999 runs out in long matches; use 99999.",
    },
];

function lintRaw(src) {
    const issues = [];
    let inString = false;
    src.split(/\r?\n/).forEach((line, i) => {
        for (const l of LINTS) {
            if (l.test(line)) issues.push({ line: i + 1, id: l.id, msg: l.msg, text: line.trim() });
        }
        // Custom String literals are capped at 128 characters in-game.
        for (const m of line.matchAll(/Custom String\("((?:[^"\\]|\\.)*)"/g)) {
            if (m[1].length > 128) {
                issues.push({ line: i + 1, id: "custom-string-length", msg: `Custom String literal is ${m[1].length} chars (max 128). Split it or use multiple HUD lines.`, text: m[1].slice(0, 60) + "..." });
            }
        }
    });
    return issues;
}

// OverPy translates every recognised setting/map/hero name into a camelCase
// key. Anything still containing spaces or capitals was not recognised and
// will be rejected (or silently dropped) by the game.
function unknownSettings(opy) {
    const start = opy.indexOf("settings {");
    if (start !== 0 && !opy.startsWith("settings {")) return [];
    let depth = 0;
    let end = -1;
    for (let i = start + 9; i < opy.length; i++) {
        if (opy[i] === "{") depth++;
        else if (opy[i] === "}" && --depth === 0) {
            end = i + 1;
            break;
        }
    }
    let settings;
    try {
        settings = JSON.parse(opy.slice(start + 9, end));
    } catch {
        return [];
    }
    const bad = [];
    const looksRaw = (k) => /\s/.test(k) || /^[A-Z]/.test(k);
    const walk = (node, trail) => {
        if (Array.isArray(node)) {
            for (const x of node) if (typeof x === "string" && looksRaw(x)) bad.push(`${trail.join(" > ")}: "${x}"`);
        } else if (node && typeof node === "object") {
            for (const [k, v] of Object.entries(node)) {
                // Free-text fields keep their spelling.
                if (["description", "modeName"].includes(k)) continue;
                if (looksRaw(k)) bad.push(`${trail.join(" > ")} > "${k}"`);
                walk(v, [...trail, k]);
            }
        }
    };
    walk(settings, ["settings"]);
    return bad;
}

function silence(fn) {
    // OverPy logs warnings straight to the console; capture them instead.
    const orig = { log: console.log, warn: console.warn, error: console.error };
    const captured = [];
    console.log = console.warn = console.error = (...a) => captured.push(a.join(" "));
    return Promise.resolve()
        .then(fn)
        .finally(() => Object.assign(console, orig))
        .then((r) => ({ r, captured }));
}

(async () => {
    const op = require(OVERPY);
    await op.readyPromise;

    const files = (targets.length ? targets : ["heroes", "_template"].map((d) => path.join(ROOT, d)))
        .filter((p) => fs.existsSync(p))
        .flatMap((p) => collect(path.resolve(p), []));

    if (!files.length) {
        console.error("No .ow files found.");
        process.exit(2);
    }

    let errors = 0;
    let warnings = 0;

    for (const file of files) {
        const rel = path.relative(ROOT, file);
        const src = fs.readFileSync(file, "utf8");
        const lines = [];
        let fileErrors = 0;
        let fileWarnings = 0;

        // Group raw-lint hits by rule so one bad habit doesn't flood the output.
        const byId = new Map();
        for (const issue of lintRaw(src)) {
            if (!byId.has(issue.id)) byId.set(issue.id, []);
            byId.get(issue.id).push(issue);
        }
        for (const [id, hits] of byId) {
            lines.push(`  warn  [${id}] ${hits[0].msg} (${hits.length} hit(s))`);
            for (const h of hits.slice(0, 3)) lines.push(`        > line ${h.line}: ${h.text}`);
            if (hits.length > 3) lines.push(`        > ... and ${hits.length - 3} more`);
            fileWarnings += hits.length;
        }

        let opy = null;
        try {
            const { r } = await silence(() => op.decompileAllRules(src, "en-US"));
            opy = r;
        } catch (e) {
            lines.push(`  ERROR [parse] ${String(e && e.message ? e.message : e).replace(/^OpyError: /, "")}`);
            fileErrors++;
        }

        if (opy !== null) {
            for (const b of unknownSettings(opy)) {
                lines.push(`  ERROR [settings] Unrecognised setting/name ${b} — check docs/api/hero-settings.md for the exact spelling.`);
                fileErrors++;
            }
            try {
                const { r } = await silence(() => op.compile(opy, "en-US", path.dirname(file) + "/", "main.opy"));
                const opyLines = opy.split("\n");
                for (const w of r.encounteredWarnings || []) {
                    const fs0 = (w.fileStack || [])[0];
                    const where = fs0 && fs0.startLine ? opyLines[fs0.startLine - 1]?.trim() : null;
                    const sev = w.severity === "error" ? "ERROR" : "warn ";
                    const msg = String(w.message).split("\n")[0];
                    lines.push(`  ${sev} [lint] ${msg}` + (where ? `\n        > (OverPy) ${where}` : ""));
                    if (w.severity === "error") fileErrors++;
                    else fileWarnings++;
                }
                const pct = ((r.nbElements / ELEMENT_LIMIT) * 100).toFixed(1);
                lines.push(`  info  elements: ${r.nbElements} / ${ELEMENT_LIMIT} (${pct}%)`);
            } catch (e) {
                lines.push(`  ERROR [compile] ${String(e && e.message ? e.message : e)}`);
                fileErrors++;
            }
        }

        const status = fileErrors ? "FAIL" : fileWarnings ? "WARN" : "OK";
        console.log(`${status.padEnd(4)}  ${rel}`);
        for (const l of lines) console.log(l);
        if (showOpy && opy) console.log("\n----- OverPy -----\n" + opy + "\n------------------");
        errors += fileErrors;
        warnings += fileWarnings;
    }

    console.log(`\n${files.length} file(s), ${errors} error(s), ${warnings} warning(s).`);
    process.exit(errors || (strict && warnings) ? 1 : 0);
})();
