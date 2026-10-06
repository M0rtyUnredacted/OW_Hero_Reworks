# Design Doc — Hanzo Aim Gauntlet

## Summary
A solo survival aim trainer for Hanzo. You fight bots that strafe, jump and shoot back. Each cleared wave adds bots, tightens their aim and speeds up their movement. When you die, the run ends and you get your stats.

## Core Loop
1. Leave spawn. A 3-second countdown follows, then wave 1 starts with one Soldier: 76 bot in front of you.
2. Each kill fills the wave bar. Five kills (tunable) clears the wave.
3. Clearing a wave grants +250 × wave score and restores 40% health. The next wave is harder.
4. You die: the run ends. You see a summary, your best run is saved for the session and a new run auto-starts.

## Pressure (what makes it hard)
| Lever | Wave 1 | Scaling per wave | Floor or cap |
|---|---|---|---|
| Bots alive | 1 | +1 every 2 waves | max 4 (tunable, up to 6) |
| Bot damage | 35% | +6% | 500% |
| Aim spread at target | 1.5 m | −0.11 m | 0.25 m |
| Aim lag (bots aim where you were) | 0.30 s | −0.025 s | 0.03 s |
| Pause between bursts | 1.4–2.3 s | −0.09 s | 0.35 s |
| Burst length | 0.45–0.8 s | +0.1 s | 2.2 s |
| Strafe direction change | 0.7–1.5 s | faster | 0.18 s |
| Jump chance per strafe | 0% | +3.5% | 35% |
| Spawn arc in front of you | ±45° | +10° | ±160° (they flank) |

Counterplay: aim lag means moving dodges bullets. Strafe and Lunge, and stop only to take a shot.

## Enemy Roster
These heroes join the pool as you clear waves. Bot health is 80%, so a fully charged Hanzo headshot kills any of them.
- Wave 1: Soldier: 76
- Wave 2: + Cassidy
- Wave 3: + Ashe
- Wave 4: + Hanzo (arrow duels, toggleable)
- Wave 5: + Widowmaker (toggleable)
- Wave 6: + Tracer (small and fast, toggleable)

## Maps and Cover
- **Maps:** Skirmish on real maps: Dorado, Eichenwalde, Havana, Hollywood, Junkertown, King's Row, Numbani, Rialto and Route 66. You get real terrain, cover, high ground and the normal health packs.
- **Spawning:** bots spawn at a random walkable point in an arc in front of you. Up to 8 points are tried to find one with line of sight.
- **Reacting to cover:** a bot that can't see you for 4 seconds repositions. That keeps the pressure on when you break line of sight, and it also means hiding behind cover only buys you about 4 seconds.
- **Spawn room:** the run starts only once you leave spawn. Bots don't fire while you're inside it.

## Healing
- Health packs on the map.
- Passive regen is off.
- A kill heals 30. A headshot kill heals 60.
- Clearing a wave heals 40% of max health.

## Stats (HUD)
- **Wave, score and wave progress bar.**
- **Threat line:** current bot count and bot damage.
- **Accuracy:** charged and tapped arrows only. Storm Arrows are excluded.
- **Headshot rate and headshot streak** (with your best streak).
- **Kills and headshot kills.**
- **Best run** this session.

## Lobby Tunables (Settings > Workshop > Hanzo Aim Gauntlet)
- Starting wave
- Kills per wave
- Max bots
- Bot damage at wave 1 and per wave
- Aim spread multiplier
- Bot strafe speed
- Heal on kill
- Bot min and max range
- Hanzo, Widowmaker and Tracer bot toggles
- Bot respawn delay

## Known Limitations
- **No pathfinding.** Bots walk in straight lines to keep their range, so on real maps they can bump into walls. Repositioning covers that, but sometimes a bot will appear somewhere odd, such as on a roof.
- **Shot counting is approximate.** Shots are counted on primary-fire release. A tap that's cancelled before an arrow leaves would still count.
- **Bots don't use abilities**, only primary fire.
- **The match is solo.** A human who joins Team 2 is removed.
