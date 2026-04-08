# Change Log

## 2026-04-08 - Replaced Fill+Gap with Width+Height+Gap(offset)

**What Changed:**
- Replaced `P.fi` (fill) with `P.wd` (width, 0.1–1.0) — piece thickness perpendicular to edge
- Added `P.ht` (height, 0.1–1.0) — piece length along edge, independent of gap
- Gap (`P.ga`) now offsets pieces outward from grid center instead of shrinking them. Default changed from 3 to 0.
- Slider order: Width, Height, Gap, Taper, Rounding
- Updated plankPts: halfW uses P.wd, halfL uses P.ht, midpoint offset uses P.ga
- All 6 piece shapes use the new geometry

**Why:**
- User wanted intuitive width/height sizing with gap as spacing (margin) rather than size reduction (padding)

**Files Modified:**
- `iso-icon-generator.html` - Replaced P.fi with P.wd/P.ht, changed gap to offset, updated UI and readouts

---

## 2026-04-08 - Added 6 piece shape types

**What Changed:**
- Added `P.ps` parameter with 6 piece shapes: bar (trapezoid), diamond, hex, arrow, chevron, hourglass
- Piece shape buttons in the controls panel, switching triggers rerender
- `plankPts()` rewritten with `pt()` helper and per-shape point generation
- All shapes respect fill, taper, and gap parameters
- Bar: original trapezoid (4pts). Diamond: pointed both ends (4pts). Hex: wider middle (6pts). Arrow: triangle pointed toward node 2 (3pts). Chevron: V-notched (5pts). Hourglass: pinched middle (6pts).

**Why:**
- User wanted different base piece shapes beyond the default trapezoid

**Files Modified:**
- `iso-icon-generator.html` - Added P.ps, piece shape buttons, rewrote plankPts with 6 shape modes

---

## 2026-04-08 - Fixed 5-column grid, infinite scroll with Load More

**What Changed:**
- Grid fixed at 5 columns, page scrolls naturally as icons accumulate
- Removed Count slider — Generate produces 50 icons, "Load 50 more" appends another 50 (deduped)
- Right panel is now sticky so controls stay visible while scrolling
- Selection uses lightweight class toggle instead of full re-render
- `appendGrid()` efficiently adds new icons without rebuilding existing DOM
- `generateUniqueSeeds()` extracted as shared helper for batch and load-more

**Why:**
- User wanted fixed 5-column layout, scrollable page, and incremental loading instead of a count slider

**Files Modified:**
- `iso-icon-generator.html` - Removed P.cn, added BATCH, loadMore(), appendGrid(), sticky panel, fixed grid columns

---

## 2026-04-08 - Show unique variation count for current settings

**What Changed:**
- Added "Unique variations" readout in the controls panel
- `countVariations()` samples up to 5000 random seeds, fingerprints each, counts distinct results
- Stops early if 500 consecutive duplicates found (meaning the space is exhausted)
- Shows exact number if exhausted, or "N+" if more exist beyond the sample
- Runs asynchronously after every regeneration so it doesn't block UI

**Why:**
- User wanted to see how many distinct symbols are possible with current settings

**Files Modified:**
- `iso-icon-generator.html` - Added countVariations(), unique variations display

---

## 2026-04-08 - Count up to 200, deduplicate identical icons

**What Changed:**
- Count slider max increased from 24 to 200
- Added `iconFingerprint()` — hashes an icon by its sorted edge keys
- `generateBatch()` and `regenerate()` now reject seeds that produce duplicate edge sets
- Up to 20× attempts per slot to find unique icons; stops gracefully if the parameter space is exhausted
- Existing seeds that become duplicates after param changes are filtered out and replaced

**Why:**
- User noticed different seeds producing identical icons after symmetry stamping (e.g. multiple seeds mapping to the same arm shape)

**Files Modified:**
- `iso-icon-generator.html` - Added dedup logic, increased count max

---

## 2026-04-08 - Added 4 new symmetry modes

**What Changed:**
- Added 2 mirror (D2): 90° wedge, mirror + 2 rotation = 4 copies. Cross/butterfly patterns.
- Added 3-fold (C3): 120° wedge, 3 rotation, no mirror. Chiral triangular patterns.
- Added 2-fold (C2): 180° wedge, 2 rotation. Playing-card symmetry with large arm shapes.
- Added mirror (D1): 180° wedge, single mirror. Rorschach bilateral.
- Refactored stamping code with stamp/stampRot/stampRotMir helpers
- Total symmetry modes: 8 (up from 4)

**Why:**
- User wanted more modes producing interesting results like dihedral

**Files Modified:**
- `iso-icon-generator.html` - Added 4 symmetry modes, refactored stamping, updated button labels

---

## 2026-04-08 - Shape selector, piece clipping, grid as outlines

**What Changed:**
- Added shape selector (3, 4, 5, 6, 8, circle) controlling the grid boundary polygon
- Pieces and grid edges are now filtered to only exist inside the selected shape
- `insideShape()` uses regular polygon math to test point containment
- Ghost grid pieces rendered as stroke outlines (`#ddd`, 0.5px) instead of gray fills
- Shape outline drawn in `#ccc` at 1px
- Both `generateIcon` and `gridSVG` respect the shape boundary

**Why:**
- User wanted configurable grid outline shape with pieces clipped to it, and grid shown as outlines

**Files Modified:**
- `iso-icon-generator.html` - Added P.sh, shape buttons, shapeVerts(), insideShape(), updated gridSVG and generateIcon

---

## 2026-04-08 - Grid overlay now shows actual piece shapes

**What Changed:**
- Replaced thin-line triangular grid with ghost plank shapes matching current fill, taper, gap, and rounding settings
- Ghost pieces are rendered in light gray (`#e8e8e4`) using the same `plankPts` and rounding logic as real pieces
- Full-grid polarity is computed so ghost taper alternation matches real piece behavior
- Grid updates live when visual params change (via `rerender()`)

**Why:**
- Previous grid was an abstract line overlay that didn't correspond to actual piece geometry

**Files Modified:**
- `iso-icon-generator.html` - Rewrote `gridSVG()` to render ghost plank shapes instead of lines

---

## 2026-04-08 - Added grid size slider

**What Changed:**
- Added `P.gr` parameter (range 2-7, default 5) controlling the hex grid radius
- Smaller grid = fewer, larger-looking pieces; larger grid = more room for complexity
- Replaces all hardcoded `R=5` in generateIcon, gridSVG, and iconToSVG
- Triggers regeneration on change (seeds preserved)

**Why:**
- User wanted control over piece scale relative to the hex boundary

**Files Modified:**
- `iso-icon-generator.html` - Added grid size param, slider, parameterized all radius references

---

## 2026-04-08 - Seeded regeneration on all parameter changes

**What Changed:**
- Seeds are now stored separately in `allSeeds[]` and persist across parameter changes
- Added `regenerate()` function that rebuilds all icons from stored seeds with current params
- Arm size, scatter, symmetry, and count sliders now call `regenerate()` — icons update live
- Moving a slider back to a previous value returns the exact same icons (deterministic)
- Count changes grow/shrink the seed pool without replacing existing seeds
- Generate button still rolls fresh seeds
- Visual-only params (fill, taper, gap, rounding) still use lightweight `rerender()`

**Why:**
- User wanted to explore parameter space without losing interesting seeds

**Files Modified:**
- `iso-icon-generator.html` - Added allSeeds, regenerate(), updated all structural param handlers

---

## 2026-04-08 - Added hex outline and triangular grid overlay to preview

**What Changed:**
- Added `gridSVG()` function that renders the full triangular lattice (radius 5) as light gray lines (`#ddd`, 0.5px) and the hexagonal boundary as a slightly heavier outline (`#ccc`, 1px)
- Grid is shown in the preview thumbnails only, not in SVG exports
- Preview uses a fixed viewBox based on the full grid extent; exports keep the tight piece-fitting viewBox

**Why:**
- User requested visible hex outline and underlying grid structure for visual context

**Files Modified:**
- `app/iso-icon-generator-03.html` - Added gridSVG(), modified iconToSVG() with showGrid flag and dual viewBox logic
- `app/iso-icon-generator-05.html` - Backup of previous version

---

## 2026-04-08 - Changed Scatter from percentage to piece count, added total display

**What Changed:**
- Scatter slider now goes 0-8 (integer piece count) instead of 0-1 (percentage)
- Arm size and scatter are now independent: arm = tree pieces, scatter = random pieces
- Added "Total pieces" readout showing arm + scatter combined
- Added `updPieces()` helper to keep all three values in sync
- Updated Copy Seed output to include total count

**Why:**
- User requested scatter as a concrete piece count rather than a ratio, with total pieces displayed

**Files Modified:**
- `app/iso-icon-generator-03.html` - Changed scatter slider, added total display, updated generation logic
- `app/iso-icon-generator-04.html` - Backup of previous version

---

## 2026-04-08 - Added Scatter slider for tree vs random piece ratio

**What Changed:**
- Added "Scatter" slider (0-1) to control the ratio between tree-grown (connected) pieces and randomly placed (unconnected) pieces
- At 0: all pieces grow via connected random walk from center (original behavior)
- At 1: all pieces are randomly placed anywhere in the wedge
- Mixed values split the arm size budget between both methods
- Added `P.sc` parameter, included in Copy Seed output

**Why:**
- User requested a control to adjust the ratio between tree-generated and randomly placed pieces

**Files Modified:**
- `app/iso-icon-generator2.html` - Added scatter slider UI, modified generateIcon() to split between tree growth and random placement
- `app/iso-icon-generator2-01.html` - Backup of previous version

---
