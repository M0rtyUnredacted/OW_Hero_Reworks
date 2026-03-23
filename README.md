# Overwatch Hero Reworks

A collection of custom hero reworks built in the Overwatch Workshop. Each rework modifies one hero's abilities, passives, or ultimate to explore new playstyles or balance concepts.

---

## How to Use a Script In-Game

1. Navigate to the hero folder under `heroes/` (e.g., `heroes/tracer/`)
2. Open the `.ow` file (e.g., `tracer.ow`) and copy **all** of its contents
3. In Overwatch, go to **Play > Game Browser > Create**
4. Select **Workshop** mode and open the **Workshop Editor**
5. Click **Import** (or press the import button in the editor) and paste the copied text
6. Save and start your custom game

> **Note:** Each script is self-contained. It includes all settings, variables, and rules needed to run. No additional setup is required unless the design doc notes otherwise.

---

## Hero Index

| Hero | Current Version | Scripts | Last Updated |
|---|---|---|---|
| [Lúcio](heroes/lucio/) | v5.0 | [v1.0](heroes/lucio/lucio.ow) · [v5.0](heroes/lucio/lucio_v5.ow) | 2026-03-22 |
| [Symmetra](heroes/symmetra/) | v1.0 | [v1.0](heroes/symmetra/symmetra.ow) | 2026-03-21 |

---

## Adding a New Hero Rework

1. Copy the `_template/` folder and rename it to the hero's slug (e.g., `heroes/soldier-76/`)
2. Rename `hero.ow` to match the folder name (e.g., `soldier-76.ow`)
3. Fill out `design-doc.md` with the rework details
4. Share the filled-in design doc with the technical director to generate the Workshop script

See [CONTRIBUTING.md](CONTRIBUTING.md) for naming rules and full workflow.

---

## Folder Structure

```
OW_Hero_Reworks/
├── README.md              ← You are here
├── CONTRIBUTING.md        ← Workflow guide for coordinators
├── .gitignore
├── _template/             ← Copy this to start a new hero
│   ├── hero.ow
│   ├── design-doc.md
│   └── CHANGELOG.md
└── heroes/
    └── <hero-slug>/
        ├── <hero-slug>.ow        ← Latest Workshop script (paste this in-game)
        ├── <hero-slug>_v*.ow     ← Versioned scripts (kept for reference)
        ├── design-doc.md         ← Design brief for this rework
        ├── CHANGELOG.md          ← History of all versions
        ├── BRAINSTORMING.md      ← Ideation and future iteration notes
        └── CURRENT_BUILD.md      ← Quick-reference for the live version
```
