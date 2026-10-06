# Error Log

Every error the coordinator reports from the game (failed paste, broken mechanic, wrong behaviour) gets an entry here once it's fixed. **Read this file before writing or editing any `.ow` script.**

For each entry:
1. Add it at the top with the next ID (`E002`, `E003`, ...).
2. If the mistake can be spotted in the raw text (a name, a pattern), add a rule to `tools/known-errors.json`. `node tools/validate.js` then fails on it. Set the rule's `id` to the entry ID.
3. If it's a general lesson about how the engine behaves, also add it to `docs/WORKSHOP_GUIDE.md`.

---

## E002 — "Expected a game mode setting after 'General {'"
- **Date:** 2026-10-06
- **Script:** `modes/hanzo-aim-gauntlet/hanzo-aim-gauntlet.ow` v1.1, line 50 (also present in `_template/hero.ow`)
- **Symptom:** The in-game import failed: `Error: Expected a game mode setting after 'General {' on line 50`.
- **Root cause:** The script had a `modes > General` block (`Game Mode Start: Immediately`, `Hero Limit`, `Kill Cam`, `Respawn Time Scalar`) with only Skirmish enabled. The importer rejected the first setting in it. OverPy's schema and older real exports both accept that block, so validation passed. Skirmish probably doesn't expose these settings in the current client. Only the first line was confirmed bad; the other three are untested.
- **Fix:** v1.2 removes the whole `modes > General` block from the mode and the template.
  - The `heroes > Team 2` block (`Health: 80%`, `Passive Health Regeneration`, `Ultimate Ability`) is also gone, to cut the number of untested settings.
  - Bot health is now set in a rule: `Set Max Health(Event Player, 80)`.
- **Prevention:**
  - `tools/known-errors.json` rule `E002-skirmish-general-settings` flags those four settings in any file that enables Skirmish.
  - **Lesson:** every lobby setting is something the live client can reject. Keep the `settings` block minimal: map list, lobby slots, enabled heroes and essential per-hero toggles. Do everything else in rules, using actions from `docs/api/actions.md`.

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
