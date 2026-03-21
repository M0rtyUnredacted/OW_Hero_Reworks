# Symmetra — Current Build (v1.0)

This document serves as a quick reference for the current **working** version of the Symmetra Battlemage rework.

---

## Status
✅ **Committed to repo** — `heroes/symmetra/symmetra.ow`
✅ **Tested** — Compiles with zero errors. Surge activates, sparkles work, death cleanup verified.
✅ **Ready for gameplay iteration**

---

## Core Mechanics
- **Surge (Shift)**: +30% speed, +30% damage, 30% lifesteal, 6s duration, 14s base CD
- **Shield Vampire (Passive)**: Every 250 damage reduces Surge CD and Teleporter CD by 1s each
- **Siege Matrix (Ult)**: Resets TP, extends Surge to 12s with aqua VFX, expands aura window
- **Command Aura**: Allies within 15m during Surge/Matrix get +75 shields, 30 HPS, +15% speed
- **HUD**: Shows live Surge CD, "SURGE ACTIVE" state, combo meter (X/250)
- **Death Cleanup**: Destroys VFX and resets all modifiers on death

---

## Known Working
- Button detection (Shift / Ability 1 with disabled turrets)
- Passive damage accumulation and CD reduction
- Lifesteal during Surge
- Persistent aura loop (0.25s polling for allies)
- HUD displays (no feedback issues reported)
- Death cleanup (prevents VFX leaking)

---

## Known Issues / Limitations
*(None currently reported)*

---

## Next Steps for Tomorrow
- (Populate as needed after testing session)

---

## Reference
Full code: `symmetra.ow` in this folder
Design intent: `design-doc.md`
Change history: `CHANGELOG.md`
