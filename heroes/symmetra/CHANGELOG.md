# Changelog — Symmetra

All changes to this hero's Workshop script are documented here.
Newest entries go at the top. Versions use `vMAJOR.MINOR` format.

---

## [v1.0] - 2026-03-21
### Added
- Initial rework script: Battlemage system
- Init rule — disables Sentry Turrets, resets all variables, creates HUD
- HUD display — live Surge CD, "SURGE ACTIVE" indicator, combo meter (X/250)
- Passive: Shield Vampire — every 250 cumulative damage reduces Surge_CD by 1s and cuts 1s from Teleporter cooldown
- Ability 1: Surge — Shift activates a 6s self-buff (+30% speed, +30% damage, yellow sparkles). 14s base cooldown
- Combat Loop: Surge Lifesteal — 30% of all damage dealt heals Symmetra while Surge is active
- Cleanup: Death Reset — destroys active VFX and resets all state modifiers immediately on death
- Ultimate: Siege Matrix — resets Teleporter, activates extended 12s Surge (aqua VFX)
- Aura: Command Aura Loop — 0.25s polling loop; allies within 15m during Surge/Matrix receive +75 bonus shields, 30 HP/s HoT, +15% speed

---

<!--
HOW TO ADD A NEW ENTRY:
Copy the block below, paste it above the previous most-recent entry,
fill in the version number and date, then list your changes.

## [vX.Y] - [YYYY-MM-DD]
### Added
- (New mechanics or rules added)
### Changed
- (Existing behavior adjusted)
### Fixed
- (Bugs or unintended behavior corrected)
### Removed
- (Mechanics or rules removed)

Only include sections that apply — delete the others.
-->
