# Change Log

## 2026-04-10 - Bulk export feature

**What Changed:**
- Added bulk export section to the Export panel with a count input (1-500, default 20)
- "Grid SVG" button: generates N unique variations and downloads as a single SVG with all icons in a grid layout
- "Individual SVGs" button: generates N unique variations and downloads as an HTML file containing all SVGs at 256px (easy to view/save individually)
- Status text shows generation progress and result count

**Why:**
- Users need to export many variations at once for design exploration and asset generation

**Files Modified:**
- `iso-icon-generator.html` — HTML for bulk export UI, bulkExportGrid() and bulkExportIndividual() functions

---

## 2026-04-09 - Preview header row, corners button repositioned

**What Changed:**
- Moved title, unique variations count, seed info, Generate and Reset buttons into a single header row at the top of the preview area
- Removed "Unique variations" from Structure section (now in header)
- Moved "corners" toggle button to left of the rounding value readout
- Made Generate/Reset buttons smaller to fit the header row
- "Load more" button kept below grid, full width

**Why:**
- Consolidates preview-area controls into one compact header
- Corners button position is more natural next to the label

**Files Modified:**
- `iso-icon-generator.html` — HTML restructure, new CSS for preview-header

---

## 2026-04-09 - Performance optimizations

**What Changed:**
- Reduced BATCH from 50 to 20 (60% fewer icons per generate)
- Cached plankPts() results in iconToSVG() — was computing each edge twice (once for bounds, once for render)
- Extracted shared `shapeVerts()` function from plankPts() and renderShapePreview() — eliminates duplicated shape pipeline code
- Made countVariations() non-blocking: processes in 200-icon chunks via requestAnimationFrame instead of blocking UI for 3-5 seconds
- Removed border (`bd`) parameter and all related rendering code (strokeAttr)

**Why:**
- Slider changes were slow due to re-rendering 50 icons with double plankPts computation per edge
- countVariations() blocked the main thread for seconds after batch operations
- Code duplication between plankPts and renderShapePreview made both slower and harder to maintain

**Files Modified:**
- `iso-icon-generator.html` — BATCH reduction, plankPts cache, shared shapeVerts(), async countVariations(), border removal

---

## 2026-04-09 - Move rounding to Shape, fix preview, remove border

**What Changed:**
- Moved Rounding slider + per-corner controls from Spacing section to Shape section
- Fixed shape preview to reflect all parameters: width/height proportions, trapeze, rounding (with per-corner), skew, indent, point, rotate
- Removed Border feature (`bd` parameter, `strokeAttr` rendering, slider, all references)
- Spacing section now only contains Gap and Spacing

**Why:**
- Rounding is a shape property, not a spacing property
- Shape preview was using fixed dimensions and missing rounding, making it not reflect actual shape
- Border feature removed per user request

**Files Modified:**
- `iso-icon-generator.html` — HTML restructure, renderShapePreview rewrite, border removal

---

## 2026-04-09 - Shape controls redesign: flat base, trapeze, rotate, link

**What Changed:**
- Fixed base shape orientation: flat edge at bottom (was diamond/vertex at top)
- Replaced taper (`ta`) with trapeze (`pz`): polarity-aware taper that narrows one end of each piece, alternating direction at adjacent nodes
- Removed pinch (`pp`): redundant with indent
- Added rotate (`pr`): rotates piece shape 0-360 degrees
- Added width/height link toggle: locks ratio so both sliders move together
- Reordered controls: Width > link > Height > Sides > Trapeze > Skew > Indent > Point > Rotate
- Updated presets, reset, seed copy, and preset loading with backward compatibility (old `ta` maps to `pz`)

**Why:**
- Diamond orientation made it impossible to create basic trapezoid shapes
- Taper and pinch were confusingly similar; trapeze is more intuitive
- Control order now flows from basic dimensions to modifiers

**Files Modified:**
- `iso-icon-generator.html` — plankPts rewrite, HTML restructure, new functions, preset/compat updates
- `docs/plans/2026-04-09-shape-controls-redesign.md` — design doc
- `docs/plans/2026-04-09-shape-controls-impl.md` — implementation plan

---

## 2026-04-09 - Shape preview in toolbar

**What Changed:**
- Added small 80x80 SVG preview of the current piece shape in the Shape section
- Preview shows above the preset buttons, updates live as shape sliders change
- Uses same parametric pipeline (n-gon + skew/point/pinch/indent) rendered in local coords
- Reflects taper effect on width

**Why:**
- Gives immediate visual feedback of the piece shape without needing to look at the icon grid

**Files Modified:**
- `iso-icon-generator.html` — added shapePreview div, renderShapePreview() function, hooked into rerender and init

---

## 2026-04-08 - Parametric shape system replaces hardcoded piece shapes

**What Changed:**
- Replaced 6 hardcoded piece shapes (bar, diamond, hex, arrow, chevron, hourglass) with a unified parametric generator
- New parameters: Sides (3-8), Skew (-1 to 1), Indent (-1 to 1), Pinch (0-1), Point (0-1)
- `plankPts()` rewritten: generates n-gon base polygon, applies 4 deformation passes (skew, point, pinch, indent)
- Old presets kept as shortcut buttons that set slider values
- Renamed "Geometry" section to "Shape" with description "Piece shape and deformation"
- Backward compatibility: old presets with integer `P.ps` auto-migrate to parametric values
- Bug fix: clamped endProximity/centerProximity to [0,1] to prevent self-intersecting geometry when skew + point/pinch combined
- Fixed copySeed to use toFixed(2) for shape params

**Why:**
- Hardcoded shapes limited creative range; parametric system allows infinite variations from continuous sliders
- Users can start from a preset and tweak, or create entirely new shapes

**Files Modified:**
- `iso-icon-generator.html` — new params, plankPts rewrite, HTML sliders, preset buttons, compat updates
- `docs/plans/2026-04-08-parametric-shape-design.md` — design doc
- `docs/plans/2026-04-08-parametric-shape-impl.md` — implementation plan

---

## 2026-04-08 - Per-corner rounding controls

**What Changed:**
- Added `P.rc` array (4 corner multipliers, default [1,1,1,1]) to parameters
- Added 4 per-corner sliders (C1–C4) in Spacing section, shown only when Rounding > 0
- Each corner slider is a 0–1 multiplier on the global rounding value
- Added "reset" button to restore all corners to 1.0
- Corner index wraps with `i % 4` for pieces with more/fewer than 4 vertices
- Preset load handles missing/invalid `rc` gracefully (defaults to [1,1,1,1])
- Reset button now also resets corner values

**Why:**
- User requested per-corner rounding in addition to global rounding

**Files Modified:**
- `iso-icon-generator.html` — new parameters, HTML sliders, rendering logic, preset handling

---

## 2026-04-08 - Add icon size slider, flush-left toolbar

**What Changed:**
- Added "Icon size" slider (50–200px, default 90) in Structure section to control preview grid icon size
- Grid uses CSS variable `--icon-size` in `minmax(var(--icon-size,90px),1fr)` for live resizing
- Removed `margin-left:16px` from `.toolbar` so it sits flush against the left edge

**Why:**
- User requested ability to change preview icon size
- User requested toolbar be left-aligned with no margin

**Files Modified:**
- `iso-icon-generator.html` — CSS variable for grid, new slider, toolbar margin removed

---

## 2026-04-08 - Remove body padding, rename divs, add per-element margins

**What Changed:**
- Removed `body` padding (set to 0)
- Renamed `.left` to `.preview`, `.right` to `.toolbar` in CSS and HTML
- Added `margin-left:16px` and full padding to `.toolbar`
- Added `margin-right:16px` and `padding-top:16px` to `.preview`
- Updated `sticky top` from 16px to 0 (no body padding to offset)
- Updated mobile media query for new class names and margin handling

**Why:**
- User requested body padding removal with per-element margins instead
- Class names should reflect purpose (toolbar/preview) not position (left/right)

**Files Modified:**
- `iso-icon-generator.html` — CSS and HTML class renames, spacing changes

---

## 2026-04-08 - Move control panel to left side, fix spacing

**What Changed:**
- Moved sidebar panel from right to left using `order:-1`
- Changed border from left edge to right edge (`border-right` instead of `border-left`)
- Changed padding from `padding-left:16px` to `padding:0 16px 0 0` for even spacing (right padding only, against the border)
- Updated mobile media query to reset `border-right` and `padding` instead of `border-left`/`padding-left`

**Why:**
- User requested panel on left side
- Fixed uneven spacing around the panel (had padding-left but no padding-right)

**Files Modified:**
- `iso-icon-generator.html` — CSS changes to `.right` and mobile media query

---

## 2026-04-08 - UX redesign: collapsible sections, tooltips, visual refinement

**What Changed:**
- Restructured sidebar into 5 collapsible `<details>` sections: Structure, Geometry, Spacing, Export, Presets
- Added visible page title "Iso Icon Generator"
- Added `title` tooltips to all parameter labels explaining what each control does
- Added section descriptions ("Pattern layout and complexity", etc.)
- Added Reset button to restore all parameters to defaults
- Added Download SVG button alongside Copy SVG
- Added accent color (blue) for primary actions and selected states
- Improved typography: better label contrast (#555 vs #888), monospace value readouts, uppercase section headings
- Added sidebar background/border for panel definition
- Made grid columns responsive with `auto-fill, minmax(90px, 1fr)`
- Added mobile layout (single column below 700px)
- Increased preset delete button touch target size
- Added Firefox range input styling (`-moz-range-thumb`)
- Added delete preset confirmation dialog
- Added error alert for invalid preset import files
- Show selected icon seed on initial page load

**Why:**
- Design critique scored 16/40 on Nielsen's heuristics — critical cognitive overload (6/8 checklist failures), zero discoverability (no tooltips/help), no reset/undo, prototype-level aesthetics
- Goal: elevate from developer debug panel to refined utilitarian tool (Figma-sidebar feel)

**Files Modified:**
- `iso-icon-generator.html` — full UI/UX overhaul (CSS, HTML structure, JS additions)

---

## 2026-04-08 - Two-phase rounding: corners → ellipse

**What Changed:**
- Rounding 0–0.5: proportional corner rounding (clamped at 0.5 of shortest edge, no artifacts)
- Rounding 0.5–1.0: vertices lerp toward an ellipse fitted to the piece's bounding box
- At 1.0: piece becomes a full oval/ellipse
- Fixes zero-length line segment artifacts that occurred at high rounding values
- Corner rounding amount = `min(l1,l2) * 0.5 * cornerAmt` where cornerAmt saturates at P.rn=0.5

**Why:**
- Rounding at 1.0 was creating degenerate paths (thin line artifacts) because corners consumed entire edges
- User expected 1.0 to produce circles/ovals, not semicircles

**Files Modified:**
- `iso-icon-generator.html` - Two-phase rounding with ellipse interpolation in iconToSVG rendering

---

## 2026-04-08 - Proportional rounding (fixes non-uniform corners)

**What Changed:**
- Rounding formula changed from `Math.min(P.rn, l1/2, l2/2)` (absolute pixels) to `Math.min(l1, l2) * P.rn` (fraction of shortest edge)
- Slider range changed from 0–15 to 0–0.5 (step 0.01)
- Every corner now rounds the same proportion of its edges regardless of taper
- At 0.5, each corner becomes a semicircle of its shortest adjacent edge

**Why:**
- Tapered pieces had visually non-uniform rounding — narrow ends appeared much more rounded than wide ends because the absolute radius consumed more of the short edges

**Files Modified:**
- `iso-icon-generator.html` - Changed rounding formula, slider range, readout format

---

## 2026-04-08 - Added Spacing control (polygon inset)

**What Changed:**
- Added `P.sp` (Spacing, 0–10, step 0.5, default 0) — shrinks each piece inward from all edges equally
- `insetPoly()` function pulls each vertex toward the polygon centroid by P.sp pixels
- Applied after plankPts, before rounding — works for all 6 piece shapes
- Creates uniform visible gutters between adjacent pieces
- Distinct from Gap (radial offset) — Spacing is local to each piece

**Why:**
- User wanted equal space around each piece, not just radial offset from center

**Files Modified:**
- `iso-icon-generator.html` - Added P.sp, Spacing slider, insetPoly(), updated readouts and preset sync

---

## 2026-04-08 - Preset save/load system

**What Changed:**
- Added preset section in controls: name input + Save button
- Presets store all P parameters as a JSON snapshot in localStorage
- Click a preset name to load it (restores all sliders, buttons, and regenerates)
- × button to delete individual presets
- Export button downloads all presets as `iso-icon-presets.json`
- Import button loads presets from a JSON file (merges without overwriting existing names)
- Saving with an existing name overwrites that preset

**Why:**
- User wanted to save and return to parameter combinations

**Files Modified:**
- `iso-icon-generator.html` - Added preset UI, save/load/delete/export/import functions

---

## 2026-04-08 - Performance optimizations for slider responsiveness

**What Changed:**
- Removed redundant `calcPol()` recalculation from `rerender()` — polarity is already stored on each icon at generation time
- Added `requestAnimationFrame` throttling to all slider `oninput` handlers (caps renders at ~60fps)
- Eliminated double icon generation in `regenerate()` — icons from dedup pass are now reused
- Cached DOM nodes in `renderGrid()` — updates SVG in-place instead of destroying/recreating all grid items
- Debounced `countVariations()` from 10ms to 500ms with `clearTimeout` to prevent redundant runs
- Added fingerprint caching on icon objects (`icon._fp`) to avoid re-sorting edge keys
- Converted SVG string building from `+=` concatenation to array push+join pattern

**Why:**
- Dragging sliders with 50+ icons loaded caused noticeable lag due to synchronous full-grid rebuilds on every input event

**Files Modified:**
- `iso-icon-generator.html` — all changes in `<script>` block

---

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
