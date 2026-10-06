# Changelog — Hanzo Aim Gauntlet

## [v1.3] - 2026-10-06
### Changed
- Real maps replace Workshop Expanse: Dorado, Eichenwalde, Havana, Hollywood, Junkertown, King's Row, Numbani, Rialto and Route 66. You get real terrain, cover and the normal health packs. Every map name is taken from a real exported Skirmish script.
- The run starts when the trainee leaves spawn, and bots hold fire while the trainee is in the spawn room.
### Added
- A bot that loses line of sight to the trainee for 4 seconds repositions to a new spot in front of them.
- A "LEAVE SPAWN TO START THE RUN" HUD prompt.

## [v1.2] - 2026-10-06
### Fixed
- The in-game import failed with "Expected a game mode setting after 'General {'" (E002). The `modes > General` block is removed.
### Changed
- Bot 80% health moved from lobby settings into a rule (`Set Max Health`), and the `heroes > Team 2` block is removed. Bots don't use ultimates, so that setting wasn't needed.
- The kill cam and respawn timer now use game defaults. Respawns were already handled by script, so play is unaffected.

## [v1.1] - 2026-10-06
### Fixed
- The in-game import failed with "Expected a map name after 'Expanse'". The paste importer rejects `Workshop Expanse Night`, even though OverPy's map table lists it, so it's removed. The mode now uses only Workshop Expanse.

## [v1.0] - 2026-10-06
### Added
- The full mode is in `hanzo-aim-gauntlet.ow`.
- **Survival waves:** the director keeps bot slots filled, and a wave clears after N kills.
- **Wave difficulty scaling.** Each wave raises bot count, damage, aim spread, aim lag, fire rhythm, strafing, jumping, spawn arc and the hero roster.
- **Bot AI:**
  - burst fire with line-of-sight checks,
  - aim lag and spread,
  - side-to-side strafing (A/D) with range keeping and jumps,
  - respawning as a random hero from the pool, in front of the trainee.
- **Scoring:**
  - accuracy (charged and tapped arrows),
  - headshot rate and streak,
  - kill and headshot-kill scoring,
  - healing on kills,
  - best run kept for the session.
- **Lobby tunables:** 14 Workshop Settings.
- **HUD:**
  - wave and score,
  - a wave progress bar,
  - a threat line,
  - a stats panel,
  - how-to-play text.
