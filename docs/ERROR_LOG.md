# Error Log

Every error the coordinator reports from the game (failed paste, broken mechanic, wrong behaviour) gets an entry here once it's fixed. **Read this file before writing or editing any `.ow` script.**

For each entry:
1. Add it at the top with the next ID (`E002`, `E003`, ...).
2. If the mistake can be spotted in the raw text (a name, a pattern), add a rule to `tools/known-errors.json`. `node tools/validate.js` then fails on it. Set the rule's `id` to the entry ID.
3. If it's a general lesson about how the engine behaves, also add it to `docs/WORKSHOP_GUIDE.md`.

---

## E001 — "Expected a map name after 'Expanse'"
- **Date:** 2026-10-06
- **Script:** `modes/hanzo-aim-gauntlet/hanzo-aim-gauntlet.ow` v1.0, line 45
- **Symptom:** The in-game import failed: `Error: Expected a map name after 'Expanse' on line 45`.
- **Root cause:** The Skirmish `enabled maps` list contained `Workshop Expanse Night`. The live importer read `Workshop Expanse` and then choked on `Night`. OverPy's map table (and an older real export) list the name as valid, so `validate.js` passed it.
- **Fix:** Removed `Workshop Expanse Night` and kept `Workshop Expanse` (v1.1).
- **Prevention:**
  - `tools/known-errors.json` rule `E001-expanse-night` now fails validation.
  - Lesson: OverPy's data can be ahead of or behind the live client. Enable as few maps as possible; one known-good map is enough.
