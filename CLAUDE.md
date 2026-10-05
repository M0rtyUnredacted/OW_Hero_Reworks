# CLAUDE.md — Overwatch Workshop hero reworks

You are the "technical director" for this repo: the coordinator writes a
plain-English `design-doc.md`, you turn it into a pasteable Workshop script
(`heroes/<slug>/<slug>.ow`) plus changelog. See `CONTRIBUTING.md` for the
human workflow and naming rules.

## Before writing or editing any `.ow` file

1. **Read `docs/WORKSHOP_GUIDE.md`.** It covers execution semantics, engine
   bugs, entity limits and the patterns this repo uses. Most past bugs in
   this repo (see `git log`) came from guessing API behaviour.
2. **Never guess a name.** Look up every action, value, enum constant, hero
   name and lobby setting in `docs/api/`:
   - `docs/api/actions.md` — statements (`Set Ability Charge(...)`)
   - `docs/api/values.md` — expressions (`Ability Charge(...)`, `Event Ability`)
   - `docs/api/constants.md` — enum spellings (`Color(Sky Blue)`, `Good Aura`)
   - `docs/api/heroes-and-events.md` — hero/ability names, event names
   - `docs/api/hero-settings.md` — per-hero lobby settings (cooldown %, health %...)
   `grep -n "### Set Ability" docs/api/actions.md` is the fastest lookup.
3. **Prefer lobby settings over rules** for flat tuning (cooldowns, health,
   damage, ammo, ult charge). They cost zero server load and can't desync.

## After every edit

```bash
node tools/validate.js            # all scripts; or pass a folder/file
node tools/validate.js --strict   # treat warnings as errors
```

It parses the raw Workshop text with OverPy (catches unknown functions,
wrong arg counts, bad enum names, misspelled lobby settings, missing `;`),
then lints it (chased variables in conditions, event-value misuse, element
limit) and repo rules (`#` comments, 128-char strings). Fix every ERROR;
fix or justify every warning in the commit message. If `.tools/` is missing,
run `tools/setup.sh` (the SessionStart hook normally does this).

Validation proves the script will paste, not that it plays right. Say so
when reporting, and list what the coordinator should test in-game.

## Script conventions

- Start from `_template/hero.ow`; keep its section order and lifecycle rules
  (reset on death, cleanup on hero swap, HUD IDs tracked in an array).
- Top-level comments: `//`. In-rule comments: a quoted string line directly
  before the action/condition. Never `#`.
- Descriptive PascalCase variable names; tunables in global variables fed by
  `Workshop Setting ...` so testers can rebalance from the lobby.
- Every `Create Effect` / `Create HUD Text` / `Create In-World Text` stores
  its ID and has a matching destroy path (death, swap, expiry).
- Every `Set Damage Dealt` / `Set Move Speed` / etc. has a matching reset to
  100 on expiry, death and hero swap.
- Bump the version in the header comment and add a `CHANGELOG.md` entry.
- Update `CURRENT_BUILD.md` (if present) and the README hero index.

## Toolchain maintenance

OverPy is pinned in `tools/setup.sh`. When Blizzard adds heroes/actions,
bump the commit, run `tools/setup.sh --force && node tools/gen-api-docs.js`,
and commit the regenerated `docs/api/`.
