# Claude Instructions

## Project Overview

Iso Icon Generator — a browser-based tool for generating hexagonal icons from isometric trapezoid pieces. Single HTML file (`app/iso-icon-generator2.html`), vanilla JS, no dependencies or build step.

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

1. **Back up the current file** to `bkp/` with the date and time of its last edit appended (e.g. `bkp/iso-icon-generator-2026-04-08-1423.html`). Use the file's actual last-modified timestamp, not the current time. Create `bkp/` if it doesn't exist.
2. **Make the code change(s)** — always edit the main file directly (e.g. `iso-icon-generator.html`), never rename or version-number it.
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
- `iso-icon-generator.html` — main app (single-file, self-contained). Always edit this file directly.
- `bkp/` — timestamped backups (e.g. `iso-icon-generator-2026-04-08-1423.html`)
- `README.md` — detailed technical documentation of grid math, piece geometry, symmetry modes
- `docs/log.md` — change log

### Active Features
- Hexagonal icon generation with 4 symmetry stamping modes
- Scatter slider: ratio between connected tree-growth pieces and randomly placed pieces
- Fill, taper, gap, rounding controls for piece geometry
- Batch generation (4-24 icons), grid preview, SVG/seed export
