# Contributing Guide

This guide is written for the game design coordinator. No coding knowledge is required.

---

## Your Role vs. the Technical Director's Role

| You (Coordinator) | Technical Director (AI) |
|---|---|
| Decide what each rework should *do* | Write the Workshop code that makes it happen |
| Fill out `design-doc.md` for each hero | Translate the design doc into a `.ow` script |
| Review in-game feel and request tweaks | Update the script and changelog accordingly |
| Maintain the Hero Index in `README.md` | — |

---

## How to Start a New Hero Rework

1. **Copy the template folder**
   Duplicate `_template/` and place the copy inside `heroes/`.
   Name the new folder using the hero's slug (see Naming Rules below).
   Example: `heroes/tracer/`

2. **Rename the script file**
   Inside your new folder, rename `hero.ow` to match the folder name.
   Example: `tracer.ow`

3. **Fill out `design-doc.md`**
   Open the file and complete every section. The more detail you provide, the more accurately the script will reflect your vision. You do not need to fill in "Known Limitations" — the technical director will add that after reviewing your design.

4. **Hand off to the technical director**
   Share the completed `design-doc.md`. The technical director will generate the `.ow` script and create the first changelog entry.

---

## How to Request Changes to an Existing Script

Describe the change clearly in plain English. For example:
- "Reduce Tracer's Blink charges from 3 to 2"
- "Genji's Deflect should also reflect Moira's orb"
- "The on-screen text during Reaper's ult is too large"

The technical director will update the `.ow` file and add a new entry to `CHANGELOG.md`.

---

## Naming Rules

These conventions keep every folder and file consistent and predictable.

| What | Rule | Examples |
|---|---|---|
| Hero folder name | All lowercase, words separated by hyphens, no punctuation | `tracer`, `soldier-76`, `wrecking-ball`, `dva` |
| Workshop script filename | Same as the folder name, with `.ow` extension | `tracer.ow`, `soldier-76.ow` |
| Design doc filename | Always exactly `design-doc.md` | — |
| Changelog filename | Always exactly `CHANGELOG.md` (all caps) | — |

**Special hero name conversions:**
| Hero Name | Slug |
|---|---|
| D.Va | `dva` |
| Soldier: 76 | `soldier-76` |
| Wrecking Ball | `wrecking-ball` |
| Lúcio | `lucio` |
| Torbjörn | `torbjorn` |
| Junker Queen | `junker-queen` |

---

## Versioning

Scripts use a `vMAJOR.MINOR` version number tracked in the changelog and in the script's header comment.

- **Increment MINOR** (e.g., v1.0 → v1.1) for any tweak, fix, or small addition
- **Increment MAJOR** (e.g., v1.x → v2.0) only when the core rework concept is significantly redesigned

The technical director manages version numbers — you don't need to track them manually.
