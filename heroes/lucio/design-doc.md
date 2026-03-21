# Design Doc — Lúcio

---

## Hero Name
Lúcio

---

## Rework Summary
Kinetic Rhythm replaces Lúcio's static healing output with a momentum-based charge system. Velocity is the core resource — staying mobile, dealing damage while moving, and booping enemies off the map all feed into a charge value that directly scales how much healing Lúcio's aura delivers. The fantasy is a DJ who hits hardest when he's in full flow.

---

## Abilities Changed

### Passive / Healing Aura
- **Old Behavior:** Heals nearby allies at a fixed rate (12 HP/s base, 24 HP/s amped). Switching songs toggles between speed and heal auras.
- **New Behavior:** Healing Dealt modifier is derived from Kinetic Charge (R). Below 50 charge: healing = R × 2 (scales linearly up to 100%). Above 50: healing = 100 + (R − 50) (uncapped scaling beyond baseline). Charge accumulates from speed and damage; decays passively.

### Soundwave (implicit — The Drop)
- **Old Behavior:** Knocks enemies back. Environmental kills credit as normal elims.
- **New Behavior:** Environmental kills (boop kills) additionally grant +50 flat charge and a sound cue, rewarding map-awareness play.

### Amp It Up (Ability 2)
- **Old Behavior:** Amplifies the current song's effect for its duration.
- **New Behavior:** Additionally floors charge at 40 and pauses decay for 3 seconds, ensuring a minimum healing burst during the amp window regardless of current momentum.

### Sound Barrier (Ultimate)
- **Old Behavior:** Grants a large temporary health shield to nearby allies.
- **New Behavior:** Additionally floors charge at 40 and pauses decay for 3 seconds (same as Amp It Up), syncing the ult window with peak healing output.

---

## Passive Changes
The charge system IS the passive. Horizontal speed above ~5.5 m/s generates charge each tick. Damage dealt generates charge proportional to current speed (faster = more charge per hit). Above 50 charge, 8% decay per tick keeps high charge from being trivially maintained; below 50, flat 0.375 decay per tick encourages staying above the threshold.

---

## Ultimate Changes
Sound Barrier's Workshop trigger (Is Using Ultimate) is used to detect activation and apply the charge floor + decay pause. The barrier itself is unchanged.

---

## Playstyle Intent
Lúcio should feel like a speedrunner who heals through momentum. Standing still and amp-spamming should still work at a baseline level, but the ceiling belongs to players who stay in motion, combo boop kills, and dive with their team rather than hovering at range. Against this Lúcio, enemies need to respect the threat of getting booped off the map — each environmental kill gives a noticeable healing spike to his team.

---

## Known Limitations
*(To be filled in by technical director)*
