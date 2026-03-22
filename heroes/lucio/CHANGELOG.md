# Changelog — Lúcio

All changes to this hero's Workshop script are documented here.
Newest entries go at the top. Versions use `vMAJOR.MINOR` format.

---

## [v5.0] - 2026-03-22
### Added
- `lucio_v5.ow` — new script file (v1.0 preserved as reference)
- Variable `A` (aura state: False = Heal, True = Speed) — tracks Crossfade toggle
- Variable `AB` (previous Crossfade button state) — enables rising-edge detection in loop
- Stasis indicator HUD line (yellow) showing remaining freeze seconds
### Changed
- **Healing curve**: formula is now `Set Healing Dealt = 50 + Charge`, implementing the `Multiplier = 0.50 + (R/100)` spec. 0 charge = 50% retail, 50 = 100%, 110 = 160%.
- **Charge generation**: hard cap lowered to 100 (was uncapped). `Damage * (HorizontalSpeed / 5.5)` engine unchanged. Battery rule blocked during stasis (`P > 0` condition added).
- **Decay** replaced with aura-asymmetric linear rates:
  - Speed Aura: 0 decay at 0–50 charge; -5/s (-1.25/tick) above 50
  - Heal Aura: -25/s (-6.25/tick) across all charge levels
- **Amp It Up**: now grants +10 instant charge (overcap to 110 — only mechanism to breach 100), then 3s stasis freezing all gen and decay. Previously: floored charge at 40 and paused decay.
- **Sound Barrier Resonance**: now grants 3s stasis only (no floor, no overcap). Previously: floored charge at 40.
- **Death Reset**: now also clears `P`, `A`, and `AB` in addition to `R`. Previously only cleared `R`.
- **Crossfade tracking**: main loop now detects Ability 1 rising edge each tick and flips `A` to track which aura is active.
- HUD updated: peak line moved to same row as charge, added aura state + heal% row, stasis row added. Instructions updated to V5 economy.
### Removed
- Uncapped charge ceiling — hard cap of 100 enforced in all normal gen paths
- `H` variable (healing dealt buffer) — formula simplified to inline `50 + R`

---

## [v1.0] - 2026-03-21
### Added
- Initial rework script: Kinetic Rhythm system
- 4 Hz main loop — charge accumulation, decay, and healing scaling
- Kinetic Battery rule — damage dealt generates charge scaled by horizontal speed
- The Drop rule — environmental kills grant +50 flat charge burst
- Sound Barrier Resonance rule — ult floors charge at 40, pauses decay 3s
- Amp Override rule — Amp It Up mirrors ult floor/pause behaviour
- Death State Reset rule — charge clears to 0 on death
- HUD display: live charge (green), peak charge (purple), rework info (aqua)

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
