# Change Log

## 2026-04-16 - Preset tokens in recessed well with hover × delete badge

**What Changed:**
- Presets now render as `.preset-token` buttons inside a `.preset-tokens` well (same `--well-bg` / `--well-shadow` / `border-radius:7px` as `.bb`). Clicking a token loads the preset; blue hover/active matches all other buttons.
- Delete action moved from a separate × button to a `.preset-del` badge — a 14px rose circle positioned at `top:-5px;right:-5px`, hidden by default, shown on token hover. Clicking it calls `deletePreset` with `stopPropagation` to prevent the load handler from firing.
- Import/Export micro buttons moved to a flex row below the token well.
- Removed all old `.preset-item`, `.preset-name`, `.del` CSS rules.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-16 - Engraved section rules, hidden sidebar scrollbar, readout matches .bb well

**What Changed:**
- Section dividers: `border-bottom` changed from `rgba(60,60,73,.07)` to explicit `#e2dfe8` (light lavender-gray); `::after` highlight to pure `#fff`. Creates a visible engraved bevel — soft gray incision line above a bright highlight.
- Toolbar scrollbar hidden via `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`. Scroll functionality preserved (mousewheel/trackpad).
- `.readout` now matches `.bb` well: removed the `1px solid rgba(...)` border, border-radius bumped from `5px` to `7px`. Background and box-shadow were already shared (`--well-bg`, `--well-shadow`).

**Files Modified:**
- `hexfold.html`

---

## 2026-04-16 - Tile preview: 1:1 scale with growing container

**What Changed:**
- `renderShapePreview` now uses `halfL = H * P.ht`, `halfW = H * P.wd` (same formula as `plankPts`) then applies the same viewBox reduction the grid uses: `gs = (iconSize - 12) / fullDim` where `fullDim = max((S*P.gr+4)*2, ...)` and `iconSize` comes from the icon-size slider. The SVG grows to frame the scaled tile + 6px padding (min 24×20).
- `regenerate()` now calls `renderShapePreview()` so grid-size changes update the preview scale.
- Icon-size slider oninput now calls `renderShapePreview()` so the preview tracks display-size changes.

**Why:**
- The old approach auto-fit the tile into a fixed 80×80 canvas, causing cross-coupling. Using the actual grid-display scale means the preview tile is visually identical in size to the tiles in the icon grid. Changing grid-size or icon-size dynamically updates the preview scale so the match holds across all settings.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Terminology: Shape → Tiles

**What Changed:**
- Section summary "Shape" → "Tiles"; its `section-desc` from "Piece shape and deformation" → "Tile shape and deformation".
- Readout label "Total" → "Total Tiles".
- All user-facing tooltips across Structure / Tiles / Spacing sections that referred to "piece(s)" now say "tile(s)" — Arm size, Grid size, Scatter, Width, Height, Trapeze, Skew, Rotate, Gap, Spacing. Internal identifiers (`totalPieces`, `pieceVerts`, `#tpv`, etc.) left unchanged to keep the diff scoped to copy.

**Why:**
- "Tiles" better describes what's on the board — discrete shapes laid into a lattice — than the more generic "piece" or the overloaded "Shape" (which was confusing since the section also controls per-tile geometry). Renaming the section + readout + adjacent tooltips keeps the vocabulary consistent in everything the user actually reads.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Readout trio, engraved section rules, title/readout height lock

**What Changed:**
- **Readout** now has three uniform cells: **Total · Uniques · Seed** (in that order). `UNI` expanded to `Uniques`. All values unified at 12px `font-variant-numeric: tabular-nums`; hero treatment removed. Removed the auxiliary `.readout-row` widget in Structure along with the obsolete `#tpv { color: var(--blue-ac) }` override — total pieces now lives in the header readout and styles like every other cell.
- **Section rules**: dark stroke lightened `rgba(60,60,73,.1) → .07` and the bright `::after` highlight pushed to `.98` alpha with a small extra bottom-shadow glint. Reads as a soft engraved line cut into the panel rather than a drawn divider.
- **Title/readout height lock**: `.preview-header { align-items: stretch }` (was `center`); `.header-actions` overrides back to `center` so Generate/Reset stay at their natural sizes. Title switched to `display: flex; align-items: center` with horizontal-only padding, so it grows vertically to match the readout's natural 37px. Measured: both boxes now 37.094px exactly.

**Why:**
- Three equal cells read as a single instrument strip instead of one dominant value + one secondary; the `Total` pieces number is conceptually the same kind of scalar as Uniques and Seed, so it belongs in the same row styled the same way. Engraved rules feel truer to the physical-instrument metaphor (panel incision + light catching the lower lip) than a flat grey border, and they're less intrusive on a dense control surface. Locked title height stops the header from looking stepped — the left-edge wordmark and right-side readout now share one clean baseline.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Match slider thumb border/shadow weight to square buttons

**What Changed:**
- Slider thumb border: `rgba(60,60,73,.5)` → `var(--gray)` (#DADADA) — same token the square buttons use.
- Slider thumb drop shadow: replaced the heavy `0 1.5px 3px rgba(0,0,0,.38)` halo with the same subtle `0 0.5px 0 rgba(60,60,73,.18)` hairline the flat buttons use. Inset highlights kept for dome feel.
- Applied across default, hover, and active states (webkit and moz).
- Pressed state now uses `inset 0 1.5px 2px rgba(0,0,0,.25)` (mirrors the shared `--shadow-press` idea) instead of an outer drop shadow.

**Why:**
- Round thumb was reading with a heavier perimeter than flat buttons because the border alpha sat around 50% charcoal and the outer shadow was dark-halo strength. Against the same light panel the square buttons live on, that made the thumb look framed while the squares looked seamless. Unifying the border token and hairline shadow means every button — round or square — has the same edge weight in every state.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Unify button hover/active: all light buttons go blue (round + square match)

**What Changed:**
- `.btn, .gen.reset, .top>button`, `.bb button` (non-`.on`), `.micro` (non-`.on`), `.preset-item button` now share one hover/active treatment:
  - Hover: white text, `linear-gradient(180deg, #7cc6f5 0%, var(--blue) 100%)`, `--blue-ac` border, `--shadow-hairline-on`.
  - Active: pressed `translateY(1px)`, darker `linear-gradient(var(--blue) → var(--blue-hv))`, `--shadow-press`.
- `.bb button.on:hover` unchanged — still darkens to `blue-hv → blue-ac` so the currently-selected option reads distinctly from a merely-hovered sibling.
- `.micro.on:hover` added (previously missing) — darkens to `blue-hv` for the same reason.
- Kept special-purpose colors: `.gen` (orange Generate), `.commit` (green Save), `.preset-item .del` (rose ×). These don't participate in the blue-on-hover convention.

**Why:**
- The slider thumb (the only round button) was lighting up blue on hover/active, but every square button still went lavender. That's two different "interactive" signals in one UI. Picking blue as the single interactive signal — same token (`--blue`) that already means "selected" in toggle buttons — means the hover state of a toggle reads as a preview of selection, and nothing else in the UI competes for the interactive-color slot. Lavender becomes a pure neutral again.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Slider groove tuning: lighter interior + 3-stop sheen

**What Changed:**
- Track background went from a near-black 2-stop (`#121217 → #2a2a32`) to a lighter 3-stop charcoal gradient (`#262630 → #464651 at 48% → #363640`). The mid-stop gives the groove a natural vertical sheen, as if ambient light is catching the curved base.
- Top inset shadow softened: `inset 0 2px 3px rgba(0,0,0,.7)` → `inset 0 1.5px 2px rgba(0,0,0,.45)` — less oppressive lip shadow so the lighter interior reads.
- Bottom inner highlight bumped from `.06` to `.09` opacity to reinforce the base sheen.
- Border softened: `rgba(0,0,0,.55)` → `rgba(0,0,0,.45)` — the groove no longer reads as a black hole.

**Why:**
- Previous groove was too dark and too flat — it read as a black slot rather than a real recessed channel. A physical plastic groove shows the ambient light picking up the curved inner surface, producing a subtle lighter band mid-height. Three stops with a lighter middle and slightly darker top/bottom approximates that optical behavior.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Slider redesign: dark groove with chrome rim, light thumb that lights blue on hover/active

**What Changed:**
- **Track (groove)**: now a deep charcoal gradient (`#121217 → #2a2a32`) with a 1px near-black border, heavy `inset 0 2px 3px rgba(0,0,0,.7)` inner shadow, and a bright `0 1px 0 rgba(255,255,255,.78)` outer-bottom highlight that forms the silvery rim around the recessed shape. Height bumped 6→8px to give the groove more substance.
- **Thumb default**: light chrome dome — radial-gradient from `#ffffff` at the highlight, through `#ece9f2`, down to `#c4c1cf` at the lower edge, with a 1px charcoal rim, an inner top highlight, and a subtle inner bottom shadow for a domed feel. Diameter 16→18px.
- **Thumb hover**: lights blue — radial-gradient from `#b6dcf5` highlight through `--blue` down to `--blue-ac`, with a blue drop-shadow halo (rgba(43,122,184,.5)) that reads as a soft glow rather than a generic tint.
- **Thumb active**: presses in with `scale(0.94)`, deeper blue gradient (`--blue → --blue-hv → --blue-ac`), tighter shadow.
- **Firefox**: mirror track and thumb styles added on `::-moz-range-track`/`::-moz-range-thumb` + matching hover/active pseudo-classes.

**Why:**
- Reference image shows a TE-style recessed groove with a bright chrome rim and a light circular button that you'd expect to light up on touch. Previous sliders had light tracks and dark thumbs — the inversion here (dark recess, light interactive element) matches physical-instrument metaphors where the moving part catches light while the channel stays in shadow. Blue-on-hover uses the existing `--blue` accent token, so the "lit" state is semantically the same signal the app uses everywhere else for interactive/selected states.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Bolder: instrument-panel header, hero UNI counter, LED section chips, firmer selected state

**What Changed:**
- **Title plaque**: 11→13px, wider tracking (.22em→.26em), more padding (5/10→8/14), thicker orange accent bar (4→6px) with a soft inner glow. Reads like an engraved nameplate rather than a button.
- **Readout, UNI as hero**: readout cells now stack label-over-value instead of inline. The UNI cell is marked `.hero` — value jumps to 17px mono tabular-nums. SEED value stays at 12px as secondary data. Tiny caps labels (8.5px, .2em tracking) hover above each value.
- **Counting indicator**: when `countVariations()` is running, `#uvv` gets a `counting` class that runs a gentle `readoutPulse` opacity animation. The placeholder text changed from `counting…` to `···` so the visible glyphs stay numeric-feeling. Wrapped via a local `setUni(value, counting)` helper so state is always consistent.
- **Section summary LED**: the 4×10 chip grew to 5×12, gained a two-stop warm gradient when open, and picked up a layered warm glow (two soft orange shadows + tighter top highlight). Feels like a pilot light lighting up.
- **Selected grid item**: linear-gradient well (lav-pale → lav), deeper 4-way inset, slightly darker border, and a light bottom highlight for tactile rim. Corner ticks bumped 8→10px with 2px stroke and a 0.5px drop shadow so they read as physically embedded cleats rather than drawn lines.

**Why:**
- Previous header was honest but timid — small title chip, inline 11px readouts, everything visually equal. The workbench aesthetic calls for a confident nameplate and a dominant numeric readout; UNI (how many unique icons this parameter space can generate) is the most useful signal in the app and deserved hero treatment. The rest of the amplification (LED glow on open sections, firmer selected state) reinforces the tactile instrument-panel metaphor without introducing any AI-slop tropes (gradients-as-decoration, glassmorphism, neon). Every change stays within the existing three-accent palette and the light-only chassis.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Reorder Symmetry buttons; remove mirror

**What Changed:**
- Symmetry button row now reads: dihedral, 3 flip, 2-fold, 3-fold, 6-fold, 2 mirror, 3 mirror (left→right).
- The single "mirror" (D1) button is removed from the UI.
- Buttons now carry their sym index in `data-v`; `updBtns` keys the highlighted state off `data-v` rather than DOM position.

**Why:**
- Dihedral is the most structurally complete option and now leads the group; chiral rotations (3 flip → 3/2/6-fold) follow, with the two bilateral-mirror modes grouped at the end. "mirror" (single axis) rarely produced useful icons on the hex grid and added noise.
- Internal sym indices (0–7) are intentionally preserved so existing saved presets keep rendering the same pattern — only the UI order changed. The old sym=7 ("mirror") code path is still live for backward compatibility with any preset that referenced it, it just has no button.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Fix: preset drift from legacy/imported presets with missing keys

**What Changed:**
- Extracted the default P object into a single `P_DEFAULTS` constant with a `cloneDefaults()` helper (deep-copies `rc`).
- `loadPreset` now has replace semantics, not overlay. It clones defaults, strips any keys not in `P_DEFAULTS`, then applies preset params with array deep-copy. Legacy keys (`ta`, `pp`, `ps`, `pe`) and unknown keys are filtered explicitly.
- `resetDefaults` uses the same reset path.

**Why:**
- Presets saved by older versions of the code are missing keys that exist now (e.g. an older preset has no `pz`, `pn`, `pk`, `pi`, `pr`, `lk`). The old overlay loop only copied keys from the preset into `P`, so anything absent inherited the previously loaded preset's value — which is why clicking 1 → 2 → 3 → 1 made preset 1 look different. Replacing instead of overlaying guarantees every missing key snaps back to the default regardless of load order.
- Also fixes a latent reference-sharing bug: `P.rc` was being assigned the preset's array directly, so editing the Rounding sliders could silently mutate the in-memory preset until the next `renderPresets()`. Deep-copy on load prevents that.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Fix: trapeze=1 rounding crash & preset seed-pool erosion

**What Changed:**
- `pieceVerts` now merges coincident consecutive vertices at the end of the transform chain (before returning). Uses an EPS²=1e-4 tolerance in local piece coords; also checks the wrap-around pair and guards against dropping below 3 vertices.
- `regenerate()` no longer mutates `allSeeds`. It still dedups identical icon fingerprints for display (writes to `allIcons` only), but the authoritative seed pool stays intact so switching presets can't permanently shrink it.

**Why:**
- **Bug 1 — trapeze rounding.** At `P.pz=1`, the y-scale multiplier `(1 − pz·t)` goes to 0 on one side. For even-sided polygons whose orientation puts two vertices at the same max-x (notably `pn=4` and `pn=8`), both vertices collapse to one point. The rounding code then divides by the zero-length edge (`l2=0` → `d2x/l2=NaN`), which produces an invalid SVG path — hence pieces disappeared. The corner at the collapsed tip also had no rounding because its two adjacent "edges" had non-corresponding lengths. Merging duplicates reduces the polygon to a clean triangle (or similar), and every remaining corner — including the tip — rounds identically to the others.
- **Bug 2 — preset regression.** `regenerate()` was replacing `allSeeds` with the current dedup pass: `allSeeds = validSeeds`. When a preset's params caused many seeds to collapse to identical fingerprints, the pool shrank; the original seeds were gone. Clicking back to an earlier, more varied preset then rebuilt from the reduced pool, so the grid no longer matched what the preset first produced. The fix preserves `allSeeds` across regenerations — the pool only changes on explicit Generate / Load more.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Arrange pass: subgroup rhythm, Total-pieces readout, inline link toggle

**What Changed:**
- **Spacing scale tokens**: added `--space-xs/sm/md/lg/xl` (4/8/12/20/28px) to `:root` so spacing is pulled from a consistent scale instead of magic numbers
- **Subgroup rhythm**: introduced `.s.s-end` (margin-bottom `--space-lg`) to separate semantic clusters. Structure is now read as three groups — topology (Symmetry + Outline), generation (Arm / Grid / Scatter), view (Icon size) — then a readout. Shape reads as base (Sides / Width / Height-with-link), deformation (Trapeze / Skew / Indent / Rotate), then corner treatment (Rounding + per-corner)
- **Total pieces redesigned**: no longer mimics a slider row with an empty track. Now a distinct `.readout-row` with a recessed well, small-caps label, and a monospaced blue-ink value — clearly a computed readout
- **Link toggle inlined**: `link` micro-button moved from a floating right-aligned row into the Height `.r` row's new `.r-aux` cluster, mirroring the existing `corners` ↔ Rounding pattern. Removes the odd asymmetric gap that used to sit between Width and Height
- **Section breathing**: asymmetric section padding (more top/bottom than before), tighter `section-desc → first-control` gap, first section starts tighter to the toolbar top edge, last section has reduced bottom padding
- **Preview header**: `margin-bottom` bumped 14 → 20px to let the icon grid breathe below the title/readout row
- **Export & Presets**: added `section-desc` to both for parity with Structure/Shape/Spacing, replaced Export's inline hairline divider with pure whitespace spacing (`--space-lg` between Selected and Bulk groups) and added symmetric `Selected` / `Bulk` sub-labels. Rows like label and the `.r`'s right-side cluster are now consistently grouped via a new `.r-aux` utility

**Why:**
- Every `.s` row previously had a uniform 11px bottom margin — no visible grouping, no rhythm, monotonous to scan in a dense controls-heavy panel. Swiss-rhythm brief calls for hierarchy through space, not dividers. This pass introduces variety without boxes. Total pieces kept reading as a broken slider (labeled row with no input); making it a true readout restores honesty to the workbench. The floating link button and the inline divider in Export were both lazy separators — replaced with spacing and inline-composition.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - Option A: wells + hairline buttons + softer grooves

**What Changed:**
- **New tokens**: `--shadow-hairline` / `--shadow-hairline-hv` / `--shadow-hairline-on` (no more double drop-shadow stack); `--well-bg` + `--well-shadow` for recessed pockets; legacy `--shadow-drop*` aliases map to the new tokens
- **Wells**: `.bb` (Symmetry, Outline button groups) and `.top` (Export row) are now recessed pockets — darker lavender gradient with inset shadow + a bright highlight rim. Buttons sit nearly flush inside
- **Buttons**: stripped double drop-shadow to a single hairline (`0.5px 0 rgba(60,60,73,.12)`) + top highlight. Depth now comes from the well around them, not from the button casting shadow on the chassis
- **Sliders**: track shadow opacity halved (`.28 → .13`), track base lightened (`#c7c5d1 → #d9d7e3`), border softened. Reads as molded plastic groove, not a drawn rectangle
- **Inputs**: matching softer inset values, lighter base, less aggressive border
- **Readout** (header status strip): now reuses the shared well tokens for consistency

**Why:**
- Previous version: button shadows competed with the chassis; slider grooves read as drawn rather than physical. Original TE calculator creates depth via recessed wells around controls, not heavy shadows on the controls themselves — this is more honest to the reference.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - TE-style restyle pass (sliders, inputs, chassis, header, grid, polish)

**What Changed:**
- **Sliders**: inset-channel track (dark groove with inner shadow + top highlight); dark radial-gradient thumb with grab cursor, press displacement, and blue focus halo
- **Text / number inputs**: matching inset-channel chassis, monospace uppercase placeholders, blue focus ring; hid number spinners
- **Toolbar chassis**: subtle gradient, inset bevel edges, tightened section dividers with white highlight underline
- **Section summaries**: small blue vertical chip that flips to orange when expanded (replaced the chevron); mono uppercase with tighter tracking
- **Title**: mono uppercase wordmark with orange accent bar, tactile button-style chassis
- **Header readout**: new `.readout` component — two cells (UNI / SEED) with inset-channel depth and vertical dividers; stripped the "Seed: " prefix from JS assignments since the label is now a separate chip
- **Grid items**: replaced 2px colored border with lavender inset well + blue corner ticks on selected; seed chip moved to bottom-left and stays visible when selected
- **Polish**: global focus-visible ring in blue accent; disabled button state; `.sub-label` style for inline section sub-headers (Bulk export, Per corner); `#bulkStatus` upgraded to mono uppercase micro-text; Total-pieces value tinted blue to read as an aux readout

**Why:**
- Worked through the 6-item restyle todo list established after the initial button pass (see `.impeccable.md` for design context)

**Files Modified:**
- `hexfold.html`

---

## 2026-04-15 - TE-style button system

**What Changed:**
- Introduced design tokens in `:root` (blue/orange/green accents, cream/lavender neutrals, shadow vars, monospace stack)
- New button roles with tactile physics (layered drop shadow + inset highlight + press displacement):
  - `.gen` — primary orange CTA (Generate)
  - `.gen.reset` / `.btn` / `.top > button` — secondary cream-lavender neutral
  - `.commit` — green modifier (Save preset)
  - `.bb button` — button group with blue `.on` state (Symmetry, Outline)
  - `.micro` — tiny uppercase mono toggles (link, corners, reset, Export/Import)
  - `.preset-item button` / `.del` — preset-row buttons with rose-tinted delete
- All buttons now monospace, uppercase-tracked, with consistent press physics (`translateY(1px)` + inset shadow)
- Stripped inline styles from Load-more, link, corners, reset-corners, bulk-export, Save-preset, and dynamic Export/Import buttons
- Toolbar background shifted to lavender (`--lav-pale`), section summaries tightened to mono uppercase at 10px/.1em

**Why:**
- Project adopted Teenage Engineering calculator aesthetic (see `.impeccable.md`); buttons are the highest-impact surface to establish the tactile, Swiss-precision feel

**Files Modified:**
- `hexfold.html`

---

## 2026-04-13 - Removed side-count buttons, moved Sides slider to top of Shape section

**What Changed:**
- Removed the `3 4 5 6 7 8` button row, its container (`#psb`), the `SIDE_OPTIONS` builder, and its highlight branch in `updBtns`
- Moved the Sides slider (`#pn`) above Width as the first control in the Shape section

**Why:**
- The slider already covers side-count selection; the buttons were redundant. Promoting Sides to the top reflects that it's the primary shape decision.

**Files Modified:**
- `hexfold.html`

---

## 2026-04-13 - Replaced shape preset buttons with side-count buttons

**What Changed:**
- Removed `SHAPE_PRESETS` (bar/diamond/hex/arrow/chevron/hourglass) and the legacy `P.ps` migration in `loadRecipe`
- Replaced with numeric buttons `3 4 5 6 7 8` that set only `P.pn` (polygon side count), leaving other shape params (skew/indent/trapeze/rotate) untouched
- Active-button highlight now matches `P.pn` directly via `dataset.sides`

**Why:**
- Named presets bundled multiple parameters and overlapped with what the existing sliders already control; pure side-count buttons give a clearer mental model

**Files Modified:**
- `hexfold.html`

---

## 2026-04-13 - Trapeze now collapses to a true point at 1.0

**What Changed:**
- `pieceVerts()` trapeze step normalizes `t` against the actual vertex x-range (`minX`/`maxX`) instead of `±halfL`

**Why:**
- Polygons with the `+π/n` angle offset don't reach `x=±halfL` (e.g. a square's vertices sit at `x≈±0.707*halfL`), so the old formula left a flat edge at `pz=1.0` instead of converging to a point

**Files Modified:**
- `hexfold.html`

---

## 2026-04-13 - Removed Point feature

**What Changed:**
- Removed the "Point" piece-shape control (parameter `P.pe`) from UI, state, transform pipeline, info string, presets, and persistence
- Migration: `loadRecipe` now drops any incoming `pe` field via `delete P.pe`
- Shape presets `diamond`, `arrow`, `chevron` had `pe` stripped (their stored `pe` values are no longer applied — these presets will look different until reauthored)

**Why:**
- Point and Trapeze produced visually equivalent results on opposite sides; the redundancy added control surface without distinct utility

**Files Modified:**
- `hexfold.html`

---

## 2026-04-10 - Bulk export feature

**What Changed:**
- Added bulk export section to the Export panel with a count input (1-500, default 20)
- "Grid SVG" button: generates N unique variations and downloads as a single SVG with all icons in a grid layout
- "Individual SVGs" button: generates N unique variations and downloads as an HTML file containing all SVGs at 256px (easy to view/save individually)
- Status text shows generation progress and result count

**Why:**
- Users need to export many variations at once for design exploration and asset generation

**Files Modified:**
- `hexfold.html` — HTML for bulk export UI, bulkExportGrid() and bulkExportIndividual() functions

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
- `hexfold.html` — HTML restructure, new CSS for preview-header

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
- `hexfold.html` — BATCH reduction, plankPts cache, shared shapeVerts(), async countVariations(), border removal

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
- `hexfold.html` — HTML restructure, renderShapePreview rewrite, border removal

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
- `hexfold.html` — plankPts rewrite, HTML restructure, new functions, preset/compat updates
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
- `hexfold.html` — added shapePreview div, renderShapePreview() function, hooked into rerender and init

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
- `hexfold.html` — new params, plankPts rewrite, HTML sliders, preset buttons, compat updates
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
- `hexfold.html` — new parameters, HTML sliders, rendering logic, preset handling

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
- `hexfold.html` — CSS variable for grid, new slider, toolbar margin removed

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
- `hexfold.html` — CSS and HTML class renames, spacing changes

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
- `hexfold.html` — CSS changes to `.right` and mobile media query

---

## 2026-04-08 - UX redesign: collapsible sections, tooltips, visual refinement

**What Changed:**
- Restructured sidebar into 5 collapsible `<details>` sections: Structure, Geometry, Spacing, Export, Presets
- Added visible page title "Hexfold"
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
- `hexfold.html` — full UI/UX overhaul (CSS, HTML structure, JS additions)

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
- `hexfold.html` - Two-phase rounding with ellipse interpolation in iconToSVG rendering

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
- `hexfold.html` - Changed rounding formula, slider range, readout format

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
- `hexfold.html` - Added P.sp, Spacing slider, insetPoly(), updated readouts and preset sync

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
- `hexfold.html` - Added preset UI, save/load/delete/export/import functions

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
- `hexfold.html` — all changes in `<script>` block

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
- `hexfold.html` - Replaced P.fi with P.wd/P.ht, changed gap to offset, updated UI and readouts

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
- `hexfold.html` - Added P.ps, piece shape buttons, rewrote plankPts with 6 shape modes

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
- `hexfold.html` - Removed P.cn, added BATCH, loadMore(), appendGrid(), sticky panel, fixed grid columns

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
- `hexfold.html` - Added countVariations(), unique variations display

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
- `hexfold.html` - Added dedup logic, increased count max

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
- `hexfold.html` - Added 4 symmetry modes, refactored stamping, updated button labels

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
- `hexfold.html` - Added P.sh, shape buttons, shapeVerts(), insideShape(), updated gridSVG and generateIcon

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
- `hexfold.html` - Rewrote `gridSVG()` to render ghost plank shapes instead of lines

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
- `hexfold.html` - Added grid size param, slider, parameterized all radius references

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
- `hexfold.html` - Added allSeeds, regenerate(), updated all structural param handlers

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
