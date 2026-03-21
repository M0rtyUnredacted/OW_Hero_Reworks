# Design Doc — Symmetra

---

## Hero Name
Symmetra

---

## Rework Summary
Battlemage replaces Symmetra's passive turret playstyle with an aggressive momentum loop. Dealing damage builds a combo meter that shortens her Surge cooldown; Surge itself turns her into a frontline threat who generates sustain and empowers nearby allies. The fantasy is a combat mage who gets stronger the more she fights.

---

## Abilities Changed

### Ability 1: Sentry Turret → Surge
- **Old Behavior:** Places deployable turrets that auto-target nearby enemies.
- **New Behavior:** Disabled (Workshop removes turret functionality). Pressing Shift (Ability 1) activates Surge — a 6-second self-buff granting +30% move speed and +30% damage dealt, with a yellow sparkle visual effect. 14-second base cooldown reduced by the Shield Vampire passive.

### Passive: Passive → Shield Vampire (Combat CDR)
- **Old Behavior:** No passive in live OW2.
- **New Behavior:** Every 250 cumulative damage dealt reduces Surge's cooldown by 1 second and cuts 1 second off the Teleporter's current cooldown. The accumulator carries over between thresholds — no damage is wasted.

### Teleporter (Ability 2)
- **Old Behavior:** Unchanged in function — places a teleporter for allies.
- **New Behavior:** Unchanged in function, but now passively benefits from the Shield Vampire passive (cooldown reduction on damage dealt) and is immediately reset when Siege Matrix activates.

### Ultimate: Photon Barrier → Siege Matrix
- **Old Behavior:** Deploys a large moving energy barrier.
- **New Behavior:** Immediately resets Teleporter, activates a 12-second extended Surge (aqua sparkle VFX instead of yellow), and expands the Command Aura window for allies. During this window the team benefits from aura buffs for the full 12 seconds.

---

## Passive Changes
Shield Vampire accumulates all damage dealt (primary fire, orb, any source). Every 250 damage threshold crossed: -1s Surge CD, -1s Teleporter CD. This creates a natural pacing — a sustained primary fire fight (100 DPS avg) generates ~1s CDR per 2.5 seconds of combat.

---

## Ultimate Changes
Siege Matrix is the apex of the Surge loop. It resets Teleporter (useful for repositioning the team before or during the window), activates Surge for 12 seconds (twice the normal duration), and simultaneously provides 12 seconds of aura coverage for nearby allies.

---

## Playstyle Intent
Symmetra should feel like a support who earns her buffs through personal aggression. Hiding at range and never fighting means a permanently long Surge cooldown and no passive procs. Diving with the team, landing beam contacts, and positioning near enemies converts into reduced cooldowns, lifesteal, and ally empowerment. Against this Symmetra, enemies face a choice: ignore her and let her sustain herself and her team indefinitely, or focus her and pull attention away from the main threat.

The aura is the team payoff — her individual Surge becomes a team-wide buff when she fights near her allies. This makes grouping with Symmetra actively rewarding rather than incidental.

---

## Command Aura
Allies within 15m of Symmetra during Surge or Siege Matrix receive:
- **+75 bonus shields** (recoverable, replenish over time like standard shields)
- **30 HP/s heal-over-time** (sourced from Symmetra for assist credit)
- **+15% move speed**

All three are removed the moment the player exits range or the Surge/Matrix window ends.

---

## Known Limitations
*(To be filled in by technical director)*
