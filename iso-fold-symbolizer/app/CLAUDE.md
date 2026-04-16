# Claude Instructions

## Project Overview

Hexfold — a browser-based tool for generating hexagonal icons from procedural tile pieces. Single HTML file (`app/hexfold.html`), vanilla JS, no dependencies or build step.

Icons are built from **trapezoids on a triangular lattice**, grown via random walk within an angular wedge, then stamped with rotational symmetry (4 modes: 6-fold, 3 mirror, 3 flip, dihedral). Each icon is deterministic from a 32-bit seed + parameters.

**Key Features:**
- Procedural icon generation with seeded PRNG (mulberry32)
- 4 symmetry modes producing hexagonal silhouettes
- Controls: arm size, scatter (tree vs random placement), fill, taper, gap, rounding, background color
- SVG export and seed/parameter recipe copying for reproducibility

---

## Documentation

When new features, integrations, architecture decisions, or other noteworthy information comes up during work, document it in `docs/readme.md`. Keep it updated as a living reference for the project.

---

## Plans

All implementation plans must be saved to `docs/plans/`. Filenames must start with the date in `YYYY-MM-DD` format, followed by a descriptive name (e.g., `docs/plans/2026-03-27-auth-system.md`, `docs/plans/2026-03-27-cms-migration.md`). This ensures plans are versioned, reviewable, and accessible across sessions.

---

## Logging Requirements

**CRITICAL:** For every code change or feature addition:

1. **Write a log entry** describing what was changed and why
2. **Save to `docs/log.md`** in the following format:

### Log Entry Format

```markdown
## [YYYY-MM-DD] - [Brief Change Title]

**What Changed:**
- Specific file(s) modified or created
- Description of the change

**Why:**
- Reason for the change (feature request, bug fix, refactor, etc.)

**Files Modified:**
- `path/to/file.ext`
- `path/to/file.ext`

---
```

### Example

```markdown
## 2026-03-27 - Added Parent Name field to notification form

**What Changed:**
- Added "Parent Name" input field to the email notification modal
- Updated `submitNotify()` to collect and send parent name to Google Apps Script

**Why:**
- Parents want to be identified when registering interest, not just by email

**Files Modified:**
- `index.html` - Added input field and updated form submission logic

---
```

### When to Log

Log entries are needed for:
- ✅ New features
- ✅ Bug fixes
- ✅ File modifications
- ✅ New file creation
- ✅ Schema/structure changes (e.g., adding columns to Google Sheet)

Don't log:
- ❌ Reading files to understand context
- ❌ Running tests/verification
- ❌ Responding to questions without code changes



### Workflow

1. **Back up the current file** to `bkp/` with the date and time of its last edit appended (e.g. `bkp/hexfold-2026-04-08-1423.html`). Use the file's actual last-modified timestamp, not the current time. Create `bkp/` if it doesn't exist.
2. **Make the code change(s)** — always edit the main file directly (e.g. `hexfold.html`), never rename or version-number it.
3. **Write the log entry** in the format above
4. **Append to `docs/log.md`**
5. **Inform the user** of what was done in your response

---

### How to Update `docs/log.md`

```javascript
// Pseudocode - in practice, use Read → Edit/Write
const logEntry = `
## [YYYY-MM-DD] - [Title]

**What Changed:**
- ...

**Why:**
- ...

**Files Modified:**
- ...

---
`;

// Append to docs/log.md
```

Always preserve existing log entries. New entries go at the **top** (most recent first) for easy scanning.

---

## Current Project State

### File Inventory
- `hexfold.html` — main app (single-file, self-contained). Always edit this file directly.
- `bkp/` — timestamped backups (e.g. `hexfold-2026-04-08-1423.html`)
- `README.md` — detailed technical documentation of grid math, piece geometry, symmetry modes
- `docs/log.md` — change log

### Active Features
- Hexagonal icon generation with 4 symmetry stamping modes
- Scatter slider: ratio between connected tree-growth pieces and randomly placed pieces
- Fill, taper, gap, rounding controls for piece geometry
- Batch generation (4-24 icons), grid preview, SVG/seed export

---

## Design Context

### Users
Designers, generative-art tinkerers, and identity/iconography explorers using the tool to produce hexagonal icon sets from procedural trapezoid pieces. Sessions are exploratory — users push sliders, re-seed, compare variants, copy recipes. The interface is a *workbench*, not a document; it should reward close inspection rather than fatigue the eye.

### Brand Personality
**Tactile. Precise. Playful.**

Voice: confident and unadorned, like a piece of hardware. No marketing warmth, no hand-holding. Labels are short; values are numeric and monospaced. The interface should feel like a calculator or an OP-1 — an instrument that invites play but respects the operator's intelligence. Emotional goal: *focused delight* — the satisfaction of a well-machined tool, with occasional pops of color that reward looking.

### Aesthetic Direction
**Reference:** [Thomas McInnis on the Teenage Engineering calculator](https://thomasmcinnis.com/posts/teenage-engineering-calculator/). Tactile buttons with real depth (inset shadows, subtle gradients, pressed-state physics), Swiss-precision typography, numeric monospace readouts, and accent colors used sparingly as functional signal rather than decoration.

**Theme:** Light only. Cream / off-white canvas, light lavender panels, deep charcoal text. Accents (blue / orange / green) are reserved for state, action, and category — never ambient decoration.

**Anti-references:** Generic SaaS / Material. Avoid flat accent-blue-everything, uniform 8px rounded corners, Inter-on-grey, shadcn defaults, Bootstrap button stacks. If the interface could be mistaken for a generic dashboard, it has failed.

### Color Palette
```
Accents (state/action)
  Blue    #59B3F0 → hover #3d9fd4 → active #2b7ab8
  Orange  #fe562b → hover #e63d12 → active #cc2600
  Green   #00cb72 → hover #00a85b → active #008545

Canvas & neutrals
  Cream/off-white   #ece9e6, #ffffff
  Light lavender    #E0DEEB, #f0eefb, #FCFAFD
  Gray-blue         #e6e9f3
  Medium gray       #DADADA, #c2c4cc, #999
  Charcoal (text)   #232323, #1c1d1e

Secondary accents (sparingly)
  Muted purple-gray #7D7E8A
  Dusty rose        #d6567b
  Light blue-purple #93a2e5
  Medium blue       #1B84C5

Depth / shadow support
  #3F3F49, #878E96 (gradient endpoints); rgba(...) for insets and cast shadows
```

### Design Principles
1. **Tactile over flat.** Every interactive control has depth — inset channels for sliders, pressed-state displacement for buttons, subtle gradients/shadows that make the eye believe in the object. Flat SaaS rectangles are the anti-pattern.
2. **Accent as signal, not decoration.** The three accents carry meaning. A sea of neutral cream with one orange button is more powerful than ten colored buttons.
3. **Numeric, monospaced, unapologetic.** Values are numbers in a monospaced face. No rounding for aesthetics, no hiding precision. The workbench tells the truth.
4. **Swiss rhythm.** Tight vertical spacing, hierarchy through weight and size rather than dividers and boxes. Labels are small-caps/uppercase-tracked; values dominate.
5. **Density rewards attention.** This is a controls-heavy tool; don't hide complexity behind progressive disclosure for its own sake. Pack information, but keep the grid honest.
