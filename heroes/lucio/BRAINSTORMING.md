# Brainstorming — Lucio

Ideation space for potential changes, balance adjustments, and experimental mechanics.
These are *not* committed changes — just exploration and rationale for future iterations.

---

## Current Issue: Power Level
Lucio v1.0 may be overtuned. Healing output is extremely high, especially at high charge values.

---

## Proposed Change Set v1.1: Damage-Scaled Charge & Aura Rebalance

### Change 1: Damage Modifier vs Speed Modifier
**Current Behavior:**
- Horizontal speed directly scales charge generation.
- A Lucio at 110% speed generates charge from movement alone.

**Proposed Behavior:**
- Speed no longer directly generates charge.
- Instead, speed acts as a **damage multiplier**: standing still = 80% normal damage, every 1% speed above normal adds 1% damage multiplier.
  - Example: at 110% move speed, you deal 90% baseline damage (80% + 10% from speed bonus).
  - Charge is generated from damage dealt, so the speed benefit indirectly increases charge via higher damage output.

**Rationale:**
- Removes the "free charge generation" from existing Lucio passive (which already grants speed auras).
- Makes damage a core resource rather than speed.
- High-speed Lucio still generates charge, but it's earned through *combat output*, not passive movement.
- Disincentivizes sitting in Healing Aura passively and moving in circles.

### Change 2: Aura-Based Decay Asymmetry
**Current Behavior:**
- Charge decays at different rates depending on how high the charge is (8% per tick if >50, flat decay if ≤50).
- Decay is constant regardless of aura state.

**Proposed Behavior:**
- **While Healing Aura is active:** Charge decays rapidly (e.g., 15% per tick or flat 2 instead of 0.375).
  - Rationale: Healing Aura is powerful (AOE healing); maintaining high charge while actively healing should come at a cost.
- **While Speed Boost Aura is active:** Charge does NOT decay (paused).
  - Rationale: Speed Boost is utility-focused and doesn't directly scale with charge; allowing charge to accumulate freely during speed phases encourages tactical aura swaps.

### Change 3: Amp It Up Re-balance
**Current Behavior:**
- Amp It Up sets charge floor to 40 and pauses decay for 3s (does not reset charge to 0).

**Proposed Behavior:**
- If current charge is below 25, set it to 25.
- If current charge is at or above 25, leave it as-is.
- While Amp It Up is active: All charge generation and decay is paused (frozen).
  - Rationale: Prevents Amp It Up from being a "free damage window" where Lucio continues building charge; it becomes a tactical freeze point instead.

---

## Alternative Explorations (Not Yet Committed)

### Idea: Healing Aura Scaling on Charge
- Current: Healing Aura heals allies for 1.5× (or fixed value).
- Proposed: Healing scales with charge. At 0 charge, baseline healing. At 100 charge, 150% healing (or higher).
- Trade-off: High healing is locked behind charge accumulation, making it a *reward* for maintaining momentum rather than a passive baseline.

### Idea: Speed Boost Locked Behind Charge Threshold
- Proposed: Speed Boost Aura only activates if Lucio is above X charge (e.g., 50).
- Rationale: Forces Lucio to earn his utility through combat output; can't just use Speed Boost while standing still doing no damage.
- Drawback: Might make Lucio feel too rigid/punishing on weak matches.

### Idea: Environmental Kill Charge Scaling
- Current: +50 flat charge for environmental kills.
- Proposed: +50 + (25 per nearby ally) = more charge if the kill enables teammate cleanup.
- Rationale: Rewards team coordination and setups, not just luck.

---

## Testing Notes
- Playtesting feedback on healing throughput (is it still OP with reduced aura uptime due to rapid decay while healing)?
- Check if "damage as charge driver" feels good — does it incentivize combat positioning as intended?
- Verify Speed Boost doesn't become too strong if decay is paused during it.

---

## Backlog / Future Exploration
- Could Sound Barrier Resonance also pause decay (like the new Amp It Up)?
- Should the passive speed aura itself generate charge, or remain external to the charge loop?
- Environmental kill follow-ups: do teammates get a brief charge boost too, or just Lucio?
