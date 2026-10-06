# Overwatch Workshop Guide (for hero reworks)

This is the working reference for writing `.ow` scripts in this repo. Read it
before writing code. For exact names and argument order, use `docs/api/`;
this guide explains how the engine behaves.

Last researched 2026-10-06. Sources are linked inline. Anything marked
**(unverified)** must be tested in game before you rely on it.

---

## 0. Toolchain and resources

| What | Where | Use it for |
|---|---|---|
| Local validator | `node tools/validate.js` | Parses and lints every `.ow` file. Run it after every edit. |
| API reference | `docs/api/*.md` (generated) | Exact action, value, enum, hero, event and lobby-setting names. |
| OverPy | [Zezombye/overpy](https://github.com/Zezombye/overpy) | The compiler/decompiler our validator runs on. Its data tables are kept in sync with the live game. Pinned in `tools/setup.sh`. |
| OSTW | [ItsDeltin/Overwatch-Script-To-Workshop](https://github.com/ItsDeltin/Overwatch-Script-To-Workshop) | C#-like alternative language. Its wiki is worth reading. |
| workshop.codes wiki | <https://workshop.codes/wiki> | Per-action articles. The [OW2 bug list](https://workshop.codes/wiki/articles/ow2-workshop-changesbugs) and the [server-crash guide](https://workshop.codes/wiki/articles/help-my-server-is-crashing-a-guide-on-how-to-improve-server-stability-for-your-codes) are especially useful. |
| Example hero-kit repos | [ow1-emulator](https://github.com/Overwatch-1-Emulator/ow1-emulator) (OverPy, active, rebuilds OW1 kits), [overwatch-apex-protocol](https://github.com/NikolasGeorge/overwatch-apex-protocol) (29 reworked heroes), [MysteryUltimates](https://github.com/CactusPuppy/MysteryUltimates) | Patterns for real kit changes. |

Two workshop.codes pages, "Set Ability Damage Override" and "Set Deployable
Damage Multiplier", describe actions that **do not exist**. If an action is
not in `docs/api/actions.md`, you cannot use it.

No new Workshop actions or values have shipped since 2023 (Projectiles were
the last addition). New heroes do arrive, along with their lobby settings.

---

## 1. Script format (raw Workshop text)

A pasteable script contains these top-level blocks, in this order:

```
settings { main {..} lobby {..} modes {..} heroes {..} }   // optional
variables { global: 0: Name ... player: 0: Name ... }
subroutines { 0: Name }
rule("Name") { event {..} conditions {..} actions {..} }
```

- **Comments.**
  - Use `//` lines at the top level only.
  - Inside a rule, a comment is a quoted string on its own line directly
    before an action or condition, like `"explains next line"`. This is the
    official form and it survives export.
  - `#` is not valid syntax.
- **Event block.** It has one line for Global rules and three lines otherwise:
  event name, team (`All`, `Team 1`, `Team 2`) and player filter (`All`,
  `Slot 0`–`Slot 11`, or a hero name such as `Lúcio`, accents included).
  Subroutine rules use `Subroutine;` followed by the subroutine's name.
- **Variables.**
  - Write them as `Event Player.Name = X;` and `Global.Name = X;`.
  - Use `Modify Player Variable(Event Player, Name, Add, 1);` for
    arithmetic and arrays. `+=` and `-=` also parse.
  - Index into arrays with `Event Player.Arr[2]`.
- **Control flow.**
  - `If(...); ... Else If(...); ... Else; ... End;`
  - `While(...); ... End;`
  - `For Player Variable(Event Player, I, start, stop, step); ... End;`
  - `Abort If(...)`, `Loop If Condition Is True`, `Skip If(...)`
- **Strings.**
  - Use `Custom String("text {0} {1} {2}", a, b, c)`.
  - Each string takes at most **128 characters** and **3 arguments**. Nest
    Custom Strings to go past either limit.
- **Disabling a rule.** Prefix it: `disabled rule("...")`.

`_template/hero.ow` is a correct, validated example of every block.

---

## 2. Rule execution semantics

### When a rule fires

**Conditions fire on a rising edge.**
- An `Ongoing` rule runs its actions once when **all** of its conditions
  become true.
- It will not run again until some condition has gone false and then true
  again.
- Holding a button therefore triggers the rule once, not every frame.

**A running rule will not restart.**
- If the rule is still executing (for example, in a `Wait`), its conditions
  re-passing does nothing.
- The one exception is a wait with `Restart When True`.
- This causes the "buff refresh doesn't work" class of bugs.

**Event rules** (`Player Dealt Damage` and the like) run once per event,
provided the conditions are true at that moment. On a damage rule,
`Restart When True` restarts the rule on every new hit, which gives you a
"refresh duration on hit" for free.

**Each Player rules.**
- `Ongoing - Each Player` runs one instance per player.
- With a hero filter, the rule triggers when a player *becomes* that hero.
  That happens on spawn and on every swap back, so creation logic re-runs
  and you must clean up on swap (see §6).

**Filters are cheaper than conditions.** Filter with the event's team and
hero slots rather than writing `Hero Of(Event Player) == Hero(X)` as a
condition. Put cheap conditions first.

### Waits and loops

**Tick rate.**
- The server runs at 62.5 Hz.
- The minimum `Wait` is 0.016 s. Waits round up to whole ticks.

**Wait behaviours.**
- `Ignore Condition` is never interrupted.
- `Abort When False` stops the rule if any condition turns false.
- `Restart When True` restarts the rule from its first action.

**`Wait Until(cond, timeout)`** ignores the rule's conditions. It also does
not treat non-zero numbers as true, so compare explicitly with `== True`.

**Loops.** Every loop needs a `Wait`. A loop with no wait runs every
iteration in the same tick and can crash the server.

**Game length.** A game can last up to 16,200 s. Use `99999`, not `9999`,
for "forever" waits, durations and chase destinations.

### Subroutines

- `Call Subroutine(S)` blocks the caller and inherits its context (Event
  Player, Victim and so on).
- `Start Rule(S, Do Nothing | Restart Rule)` runs `S` in parallel.
- Subroutines take no parameters, can't have conditions, and you can have at
  most 128.
- **Crash bug.** Repeatedly calling `Start Rule(S, Restart Rule)` on a
  subroutine that is in the middle of a `Wait` crashes the server after about
  465 restarts. The count is shared across all subroutines. Avoid waits in
  restartable subroutines.

---

## 3. Events and event values

**Event names** are listed in `docs/api/heroes-and-events.md`.

**Who `Event Player` is.**

| Event | Event Player |
|---|---|
| Player Dealt Damage | the Attacker |
| Player Took Damage | the Victim |
| Player Dealt Healing | the Healer |
| Player Received Healing | the Healee |

**Event values.**
- `Event Damage` is the amount after modifiers.
- `Event Was Critical Hit` is true for headshots.
- `Event Was Environment` is true for environmental kills.
- `Event Direction`
- `Event Ability` returns a `Button(...)`.

**`Event Ability` is unreliable**
([source](https://workshop.codes/wiki/articles/event+ability)).

These return **null**:
- Symmetra Sentry Turret
- Illari pylon
- Ramattra, Junker Queen, Venture, Anran and Jetpack Cat primary fire
- Mauga, Kiriko and Wuyang primary and secondary fire
- Almost all of Lifeweaver's kit
- Freja's Take Aim explosion
- Sombra's Virus damage over time (the initial impact returns Ability 1)

These return the **wrong button**:
- Illari secondary fire returns Primary Fire.
- Vendetta's projectiles return Primary Fire.
- Junker Queen's melee while Gracie is equipped returns Secondary Fire.

Because of this:
- Match by exclusion. `Event Ability != Button(Primary Fire)` is true for
  null. This is how `symmetra.ow` detects turret damage.
- Before building on `Event Ability` for a hero not listed above, log it in
  game: `Log To Inspector(Custom String("{0} {1}", Event Ability, Event Damage))`.
- Torbjörn's turret, B.O.B., Mei's wall and Junkrat's trap are
  **(unverified)**.

**Owner credit.** Damage from deployables and pets is credited to the owning
hero. There is no "is a turret" value.

**Scripted damage.** `Damage(...)` and `Start Damage Over Time(...)` credit
the `damager` argument you pass. Pass `Null` and nobody gets credit.

**Load.** High-rate sources (beams, SMGs, damage over time) fire a very large
number of damage events. Keep damage-event rules small and filter them by
hero.

---

## 4. Engine bugs and gotchas

These are the ones that have bitten this repo or will.

1. **Chased variables don't trigger conditions (OW2 bug).**
   - While a variable is being chased (`Chase Player Variable At Rate/Over
     Time`), conditions that read it do **not** re-evaluate until the chase
     reaches its destination or is stopped.
   - The validator flags this as `w_ow2_rule_condition_chase`.
   - For timers, prefer `Wait` inside the rule (see the template's
     "Buff On Cast"). Otherwise chase *exactly to* the threshold you test,
     or poll with a loop.
   - A chased variable also breaks any `For` loop that uses it as the counter.
2. **`Set X` modifiers replace each other; they don't stack.**
   - This covers `Set Damage Dealt`, `Set Damage Received`,
     `Set Healing Dealt`, `Set Move Speed`, `Set Projectile Speed` and the
     rest.
   - Each is a single percentage of base, and the last call wins.
   - If two effects can overlap, track each factor in its own variable and
     set the product.
   - For per-target scaling, use `Start Damage Modification`. Store the ID in
     a variable before reevaluating with it.
3. **Cooldowns on charge-based abilities.** See §5.
4. **Targeting includes the dead.** `Closest Player To`,
   `Farthest Player From` and `Player Closest To Reticle` include dead and
   unspawned players at (0,0,0). Filter with `Is Alive` and `Has Spawned`.
5. **Workshop Setting Combo.** A non-zero default makes option 0
   unselectable. Always default to 0.
6. **Set Max Health.** Overhealth from abilities scales from the hero's
   *true* max health. Prefer `Add Health Pool To Player` for extra HP, or use
   the lobby `Health:` setting.
7. **Create Projectile.** It leaks "ghost" entities that count toward the
   limit, and `Last Created Entity` doesn't return projectiles.
8. **Editor literal cap.** A percentage typed as a literal is capped at
   1000% in the editor. Computed values go up to 10,000%.
9. **Lobby settings that won't paste.** Juno "Glide Boost Duration Scalar",
   Mizuki "Katashiro Return Duration Scalar" and Vendetta "Soaring Slice
   Distance" are dropped on paste. Set them in the in-game UI.
10. **Map names the importer rejects.** Some names in OverPy's map table fail in the live paste importer. Confirmed: `Workshop Expanse Night` in Skirmish fails with "Expected a map name after 'Expanse'". The validator can't catch these. Enable as few maps as possible, and when an import error names a map, remove that map.
11. **HUD positioning.** HUD texts that share a position are centred
    relative to each other. Small messages sometimes don't show.

---

## 5. Changing hero kits

**Pick the cheapest tool that works.**

1. **Lobby settings** (`settings > heroes`, see `docs/api/hero-settings.md`).
   These cover:
   - Cooldown %
   - Health, damage dealt and received, healing %
   - Move speed, gravity and projectile speed %
   - Clip size and infinite ammo
   - Ultimate generation and duration
   - Per-ability on/off, plus hero-specific scalars (for example, Mei's
     freeze rate or Pharah's fuel)

   They cost no server load and can't desync. Example: "turrets recharge 20%
   faster" is simply `Sentry Turret Cooldown Time: 80%`.
2. **Set/Start actions** for conditional or temporary changes.
3. **Fully custom abilities.** Disable the native ability
   (`Set Ability 1 Enabled(..., False)` or `Disallow Button`), detect
   `Is Button Held(Event Player, Button(Ability 1))`, and implement the
   effect yourself.

**Cooldowns, charges and resources.**
- **Actions and values.**
  - `Set Ability Cooldown(p, Button(X), s)` and `Ability Cooldown`
    (maximum 1000 s).
  - `Set Ability Charge` and `Ability Charge`, for charge abilities such as
    Blink, mines and turrets.
  - `Set Ability Resource` and `Ability Resource`, as a percentage of
    capacity (for example Defense Matrix or Hover Jets).
- **Charge-based abilities report 0** from `Ability Cooldown`.
- **`Set Ability Cooldown` fails on** Symmetra A1, Soldier A1, Lifeweaver A1,
  Junkrat A1 (set charges instead), Zenyatta A1/A2, Brigitte A2, D.Va A2,
  Emre A2 and Mercy's Flash Heal.
- **It only works partially on:**
  - Genji A1: only while already on cooldown.
  - Anran A1 and Freja A1: only below 2 charges.
- **Reads return null or 0 for** Baptiste Immortality Field, Soldier Helix,
  Tracer Recall, Genji Swift Strike, D.Va Micro Missiles and Lifeweaver Dash.
- Source: the [OW2 bug list](https://workshop.codes/wiki/articles/ow2-workshop-changesbugs).

**State queries.**
- **Available:** `Is Using Ability 1/2`, `Is Using Ultimate`,
  `Is Firing Primary/Secondary`, `Is Button Held`, `Is Reloading`,
  `Is Meleeing`, `Is In Alternate Form` (Ball, Baby D.Va, Bastion, Lúcio's
  speed song, Mercy's pistol, Torbjörn's hammer) and `Is Duplicating` (Echo).
- **Bugs:**
  - Ramattra's Nemesis Form always reads false in `Is In Alternate Form`.
  - Lifeweaver's `Is Reloading` is always false.
- **`Is Using Ability 1` is true for the whole cast or deploy.** Rules
  conditioned on it fire once per cast, which makes it a good cast detector.
  It does not tell you whether the ability *hit* anything; use damage events
  for that.

**Other useful actions.**
- **Health:** `Add Health Pool To Player` takes Health, Armor or Shields, with
  up to 16 pools per type. Keep the ID from `Last Created Health Pool`.
- **Statuses:** `Set Status` supports Hacked, Burning, Knocked Down, Asleep,
  Frozen, Stunned, Rooted, Phased Out, Invincible and Unkillable.
  `Has Status` also detects statuses applied by hero abilities.
- **Movement:** `Apply Impulse` (use `Cancel Contrary Motion XYZ`),
  `Start Accelerating`, `Set Gravity` and `Set Jump Vertical Speed`.
- **Kill credit:** `Set Environment Credit Player` gives credit when a
  custom knockback kills.
- **Assists:** `Start Assist` grants assist credit for custom abilities.
- **Weapons and ammo:** `Set Ammo`, `Set Max Ammo` and `Set Weapon` are
  buggy for many heroes. Check the bug list and test in game.

---

## 6. Lifecycle discipline

Most "works once, then breaks" bugs come from missing cleanup. For every
piece of state a rework creates, write all three exits.

| Created by | Exit: expiry | Exit: death | Exit: hero swap / leave |
|---|---|---|---|
| `Set Damage Dealt(p, 120)` | reset to 100 | `Player Died` rule | swap-cleanup rule |
| `Create Effect` / `Create HUD Text` | `Destroy ...(stored ID)` | same | same |
| `Start Damage Modification` | `Stop Damage Modification(ID)` | same | same |
| Debuff on a *victim* | timer on the victim | the victim's `Player Died` | — |

The template implements this with three pieces:
- a `ResetReworkState` subroutine,
- a `Player Died` rule filtered to the hero,
- an `Ongoing - Each Player; All; All` rule with the conditions
  `Hero Of(Event Player) != Hero(X)` and "still has rework state".

**Race condition seen in `symmetra.ow`.** When an expiry rule tests
"timer ≤ 0 AND effect ID ≠ 0", set the timer *before* assigning the effect
ID. Otherwise the expiry rule fires the moment the ID is assigned.

---

## 7. Limits and server load

| Limit | Value |
|---|---|
| Script elements | 32,768 (the validator prints usage) |
| Global variables / player variables / subroutines | 128 each |
| Array length | 1000 |
| Texts (HUD, in-world and progress bars, combined) | 128 |
| Entities (effects, beams, icons, projectiles) | 128, or 256 with an extension |
| Custom String | 128 characters, 3 arguments |
| Workshop settings | 128 |
| Players | 12 real players (24 slots with bots and an extension) |

**Reducing server load.**
- Put a wait in every loop.
- Run polling at 0.1–0.25 s rather than every tick.
- Prefer hero filters to conditions.
- Use `Disable Inspector Recording` in release builds.
- Use `Play Effect` (one-shot, never counted toward the entity limit) for
  impacts rather than create-then-destroy.
- Avoid `Update Every Frame` unless you need it.
- Read lobby `Workshop Setting` values once into globals at startup.

---

## 8. Polish checklist (before calling a mode "done")

- [ ] `node tools/validate.js --strict` passes, or every warning is
      justified in the commit.
- [ ] `settings.main` has a Description (version and source) and a Mode Name.
- [ ] Flat tuning lives in `settings > heroes`, not in rules.
- [ ] Tunables are exposed as `Workshop Setting ...` under one category named
      after the rework.
- [ ] HUD text:
  - [ ] A short kit summary on the left, visible to the hero's player only.
  - [ ] Live state shown with a `Create Progress Bar HUD Text`, or a
        header/subheader pair, at the top.
  - [ ] Each line at most 128 characters.
- [ ] Feedback for every custom proc:
  - [ ] a `Play Effect` and sound,
  - [ ] optionally a `Small Message`,
  - [ ] effects visible to others where gameplay-relevant.
- [ ] Persistent effects don't block first-person view. A radius of about 1
      at waist height works; spheres around the camera don't.
- [ ] Every created entity, text and modifier has expiry, death and swap
      exits (§6).
- [ ] Tested in game:
  - [ ] the main proc,
  - [ ] the refresh or recast path,
  - [ ] dying mid-effect,
  - [ ] swapping hero mid-effect,
  - [ ] two players on the hero at once,
  - [ ] bots as targets.
- [ ] Update `CHANGELOG.md`, the version header, the README hero index and
      `CURRENT_BUILD.md`.

---

## 9. Debugging in game

- Open the Workshop Inspector (Settings > Workshop Inspector) to step through
  executed actions and variable values.
- `Log To Inspector(Custom String(...))` prints probe values. Put
  `Enable Inspector Recording` back while debugging, because the template
  disables recording.
- A temporary debug HUD helps, for example
  `Create HUD Text(Event Player, Custom String("{0}", Event Player.X), ...)`.
- Paste errors in game name only the first failing line. Run
  `node tools/validate.js` locally instead; it names the rule and the token.
