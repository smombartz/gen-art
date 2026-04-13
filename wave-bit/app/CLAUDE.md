# Claude Instructions

## Project Overview

**Wave-Bit Icon Engine** — a combinatorial geometric icon generator. Each icon is a 2×2 grid of quadrants. Every quadrant independently combines one background shape (solid black) with one overlay symbol (white linework), producing millions of unique icons from a small vocabulary of primitives.

**Reference:** `reference.png` — a 4×4 grid of 16 example icons demonstrating the system's range.

**Key Features:**
- Deterministic icon generation from a compact seed/config
- High figure-ground contrast (black shapes + white lines) guarantees legibility at any combination
- Emergent compositions across quadrant seams (circles kiss, leaves mirror, diagonals continue)

---

## Icon Engine Specification

### Grid Structure

```
┌────┬────┐
│ TL │ TR │
├────┼────┤
│ BL │ BR │
└────┴────┘
```

Each icon is a square divided into 4 equal quadrants: **TL** (top-left), **TR** (top-right), **BL** (bottom-left), **BR** (bottom-right). Each quadrant is itself a square of size `S × S` (e.g., 64×64 px at 128×128 icon size).

### Layer Model

Each quadrant has exactly two layers, drawn in order:

1. **Layer 1 — Background Shape** (solid black fill, no stroke). Defines the dominant mass of the quadrant. Always black. Clips to quadrant bounds.
2. **Layer 2 — Overlay Symbol** (white stroke or white fill, drawn on top). Thinner, geometric detail. Provides visual texture and differentiation. Always white.

The white-on-black contrast is load-bearing — it guarantees every bg/overlay pairing is legible without per-pair tuning.

---

### Background Shapes (Layer 1)

Each background shape fills or dominates its quadrant. Defined relative to the quadrant's own coordinate system (origin at quadrant top-left corner, size `S`).

| ID | Name | Description | Geometry |
|----|------|-------------|----------|
| `full` | Full Square | Entire quadrant filled solid black | `rect(0, 0, S, S)` |
| `circle` | Circle | Large circle centered in quadrant | `circle(S/2, S/2, r)` where `r ≈ 0.45S–0.5S` |
| `half-N` | Half-Circle (North) | Semicircle anchored to top edge, bulging downward | `arc from (0, 0) to (S, 0)` bulging to `(S/2, S/2)` |
| `half-S` | Half-Circle (South) | Semicircle anchored to bottom edge, bulging upward | `arc from (0, S) to (S, S)` bulging to `(S/2, S/2)` |
| `half-E` | Half-Circle (East) | Semicircle anchored to right edge, bulging left | `arc from (S, 0) to (S, S)` bulging to `(S/2, S/2)` |
| `half-W` | Half-Circle (West) | Semicircle anchored to left edge, bulging right | `arc from (0, 0) to (0, S)` bulging to `(S/2, S/2)` |
| `quarter-TL` | Quarter-Circle (TL corner) | Quarter circle anchored to top-left corner | `arc from (0, R) to (R, 0)` filled to corner `(0,0)` |
| `quarter-TR` | Quarter-Circle (TR corner) | Quarter circle anchored to top-right corner | `arc from (S-R, 0) to (S, R)` filled to corner `(S,0)` |
| `quarter-BL` | Quarter-Circle (BL corner) | Quarter circle anchored to bottom-left corner | `arc from (0, S-R) to (R, S)` filled to corner `(0,S)` |
| `quarter-BR` | Quarter-Circle (BR corner) | Quarter circle anchored to bottom-right corner | `arc from (S-R, S) to (S, S-R)` filled to corner `(S,S)` |
| `leaf-H` | Leaf / Vesica (Horizontal) | Eye/leaf shape, pointed left and right | Intersection of two offset circles, horizontal axis |
| `leaf-V` | Leaf / Vesica (Vertical) | Eye/leaf shape, pointed top and bottom | Intersection of two offset circles, vertical axis |
| `leaf-D1` | Leaf / Vesica (Diagonal ↘) | Eye/leaf shape along TL→BR diagonal | Rotated 45° from horizontal |
| `leaf-D2` | Leaf / Vesica (Diagonal ↗) | Eye/leaf shape along BL→TR diagonal | Rotated -45° from horizontal |
| `tri-TL` | Diagonal Triangle (TL) | Right triangle filling TL half | Vertices: `(0,0), (S,0), (0,S)` |
| `tri-TR` | Diagonal Triangle (TR) | Right triangle filling TR half | Vertices: `(0,0), (S,0), (S,S)` |
| `tri-BL` | Diagonal Triangle (BL) | Right triangle filling BL half | Vertices: `(0,0), (0,S), (S,S)` |
| `tri-BR` | Diagonal Triangle (BR) | Right triangle filling BR half | Vertices: `(S,0), (0,S), (S,S)` |

**Total: ~18 background shapes** (6 base types × orientations).

#### Background Shape Construction Notes

- **Circle** radius can be exactly `S/2` (touching all edges) or slightly smaller (`0.45S`) for a visible white margin. The reference uses both — some circles bleed to edges, others have a slim gap. This could be a parameter (`bleed: boolean`).
- **Half-circles** are true semicircles. The flat edge aligns flush with one side of the quadrant. The curved edge extends to fill approximately half the quadrant area.
- **Quarter-circles** have radius `R ≈ S` (spanning the full quadrant edge). The filled region is the pie slice from the corner, not just the arc.
- **Leaf/vesica** is constructed from two overlapping circles. The overlap (vesica piscis) forms the pointed eye shape. Width-to-height ratio ≈ 1:2. The leaf should fill most of the quadrant along its long axis.
- **Diagonal triangles** are right triangles formed by one diagonal of the quadrant square. Exactly half the quadrant is filled.

---

### Overlay Symbols (Layer 2)

Overlay symbols are drawn in white on top of the background shape. They are positioned relative to the quadrant center unless noted. Stroke weight is thin relative to quadrant size (≈ 1.5–2.5% of `S`).

| ID | Name | Description | Geometry |
|----|------|-------------|----------|
| `dot` | Dot | Small filled white circle | `circle(cx, cy, r)` where `r ≈ 0.06S–0.08S` |
| `ring` | Ring | Small stroked white circle (unfilled) | `circle(cx, cy, r)` stroke only, `r ≈ 0.08S–0.12S` |
| `dot-ring` | Dot + Ring | Dot inside a concentric ring | Combines `dot` and `ring` at same center |
| `concentric` | Concentric Rings | 2-3 concentric circle outlines | Multiple `circle` strokes at increasing radii |
| `bullseye` | Bullseye | Filled dot + one or more concentric rings | `dot` at center + `concentric` rings around it |
| `crosshair` | Crosshair | Perpendicular lines through a point (+ shape) | Horizontal + vertical lines through center |
| `diagonal-1` | Diagonal Line (↘) | Single line from TL area to BR area | `line(x1, y1, x2, y2)` along ~45° |
| `diagonal-2` | Diagonal Line (↗) | Single line from BL area to TR area | `line(x1, y1, x2, y2)` along ~-45° |
| `diagonal-x` | Diagonal Cross (×) | Two crossing diagonal lines | Combines `diagonal-1` + `diagonal-2` |
| `arc-N` | Arc (opens North) | Curved arc opening upward | Partial circle arc, ~90-120° sweep |
| `arc-S` | Arc (opens South) | Curved arc opening downward | Partial circle arc, ~90-120° sweep |
| `arc-E` | Arc (opens East) | Curved arc opening right | Partial circle arc, ~90-120° sweep |
| `arc-W` | Arc (opens West) | Curved arc opening left | Partial circle arc, ~90-120° sweep |
| `parallel-H` | Parallel Lines (H) | 2-3 horizontal parallel lines | Evenly spaced horizontal strokes |
| `parallel-D` | Parallel Lines (Diagonal) | 2-3 diagonal parallel lines | Evenly spaced lines at ~45° |
| `orbit` | Elliptical Orbit | Tilted ellipse ring | Ellipse rotated ~30-60°, centered in quadrant |
| `lollipop` | Lollipop | Dot connected to a line extending to edge | `dot` + `line` radiating outward |
| `none` | None | No overlay | Empty — just the background shape |

**Total: ~17 overlay types** (including orientation variants and `none`).

#### Overlay Symbol Construction Notes

- **Dots and rings** can be positioned at quadrant center or offset (e.g., centered on the background shape's visual mass). The reference shows both centered and edge-biased placements.
- **Crosshairs** often extend to quadrant edges but may be clipped shorter for aesthetic balance.
- **Arcs** are segments of circles larger than the quadrant — they sweep through and create a sense of motion.
- **Orbit** is a full ellipse (closed loop) drawn at a tilt. Creates a planetary/atomic feel.
- **Lollipop** is distinctive: a small dot with a single thin line connecting it to a quadrant edge. Seen multiple times in the reference (e.g., top-left icon TL quadrant).
- **`none`** is valid — some quadrants in the reference have only the background shape with no overlay.

---

### Combinatorics

```
Quadrant states  = bg_shapes × overlay_symbols
                 ≈ 18 × 17 = 306 per quadrant

Unique icons     = 306^4 = ~8.7 billion
```

Even with a curated subset (e.g., 8 bg × 10 overlays = 80 per quadrant), that's `80^4 = 40,960,000` unique icons.

---

### Generation Parameters

An icon is fully described by a config object:

```typescript
interface QuadrantConfig {
  bg: BackgroundShape;     // e.g., "circle", "half-N", "leaf-H", "tri-TL"
  overlay: OverlaySymbol;  // e.g., "dot-ring", "crosshair", "none"
  overlayPos?: Position;   // optional offset: "center" | "top" | "bottom" | "left" | "right"
  overlayScale?: number;   // optional scale factor (default 1.0)
}

interface IconConfig {
  tl: QuadrantConfig;
  tr: QuadrantConfig;
  bl: QuadrantConfig;
  br: QuadrantConfig;
  size: number;            // icon size in px (quadrant = size/2)
  gap?: number;            // optional gap between quadrants (default 0)
  cornerRadius?: number;   // optional rounding on outer icon corners
  invert?: boolean;        // swap black/white globally
}
```

#### Seed-Based Generation

For deterministic randomness, an icon can be generated from a numeric or string seed:

```typescript
function generateIcon(seed: string | number): IconConfig {
  const rng = seededRandom(seed);
  return {
    tl: randomQuadrant(rng),
    tr: randomQuadrant(rng),
    bl: randomQuadrant(rng),
    br: randomQuadrant(rng),
    size: 128,
  };
}
```

---

### Rendering Approach

**SVG** is the ideal output format:
- Crisp at any resolution
- Each shape is a simple path or primitive
- Easy to animate, recolor, or post-process
- Embed inline or export as `.svg` / `.png`

Rendering order per quadrant:
1. Clip region to quadrant bounds
2. Draw background shape (black fill, no stroke)
3. Draw overlay symbol (white fill/stroke, appropriate weight)

---

### Composition Heuristics (Optional)

For generating icons that look especially cohesive (not just random):

1. **Mirror symmetry** — TL mirrors TR (horizontal flip), BL mirrors BR. Creates butterfly effect.
2. **Rotational symmetry** — each quadrant is a 90° rotation of its neighbor. Creates pinwheel.
3. **Diagonal symmetry** — TL = BR, TR = BL.
4. **Shape continuity** — adjacent quadrants use shapes whose edges align at the seam:
   - `half-E` in TL + `half-W` in TR → full circle across the top row
   - `quarter-BR` in TL + `quarter-BL` in TR + `quarter-TR` in BL + `quarter-TL` in BR → full circle at center
   - `leaf-H` in TL + `leaf-H` in TR → continuous eye across top
5. **Overlay consistency** — use the same overlay across all 4 quadrants (or 2 symmetric pairs) for visual unity.
6. **Density balance** — avoid all-`full` (too heavy) or all-`tri` (too fragmented). Mix heavy and light bg shapes.

---

### Modification Options

| Parameter | Effect |
|-----------|--------|
| `size` | Output resolution (64, 128, 256, 512…) |
| `gap` | White gap between quadrants (0 = seamless, 2-4px = distinct tiles) |
| `cornerRadius` | Round outer corners of the icon |
| `invert` | White shapes on black background |
| `palette` | Replace black/white with custom two-color palette |
| `strokeWeight` | Adjust overlay line thickness |
| `rotation` | Rotate entire icon by 0°/90°/180°/270° |
| `shuffle` | Re-roll one or more quadrants |
| `symmetry` | Enforce mirror/rotational/diagonal symmetry mode |
| `bgOnly` | Render without overlays (bold silhouette mode) |
| `overlayOnly` | Render only overlays on transparent/white bg (line art mode) |
| `animate` | Add subtle CSS/SVG animation to overlays (spin, pulse, orbit) |

---

## Frontend Aesthetics

**Typography:** Teenage Engineering uses a custom sans-serif that's tightly tracked, all-caps, and extremely small — almost comically undersized relative to the device. It reads like technical labeling on aerospace components. The weight is medium-light, never bold. Numerals are monospaced. The overall feeling is "instruction manual as lifestyle object." A good digital proxy would be something like GT America Mono or Söhne Mono at tiny sizes, or PP Mori / Suisse Intl in all-caps with wide letter-spacing.

**Color & Theme:** Ruthlessly restrained. Devices default to warm off-whites, industrial oranges (#FF5500-ish), and matte blacks. Accent colors are singular and saturated — one orange knob on an otherwise monochrome field. There's no gradient, no purple, no blue. The palette feels closer to Dieter Rams–era Braun than to consumer electronics. When color appears it's functional (this knob does this thing), never decorative.

**Motion & Interaction:** Physical devices have satisfying tactile clicks and detents. Digitally, this translates to snappy, zero-easing transitions — things appear or don't, they don't fade in gently. Micro-interactions should feel mechanical, not organic. Think stepped animations, not bezier curves. Discrete states rather than fluid interpolation.

**Backgrounds & Surface:** Matte textures, visible tooling marks, exposed screws, and deliberate seams. Digitally: flat solid backgrounds with no gradients, subtle 1px borders or hairlines for structure, generous whitespace. The aesthetic is "beautiful engineering drawing" — where negative space, alignment, and precision *are* the decoration. No frosted glass, no shadows, no blur.

**Overall ethos:** Teenage Engineering treats consumer products like they're scientific instruments that happen to be fun. The design language is playful-industrial — serious craft with a wink. If you're building a UI inspired by TE, commit to: tiny type, one accent color, mechanical interactions, exposed structure, and the confidence to leave most of the canvas empty.

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
- New features
- Bug fixes
- File modifications
- New file creation
- Schema/structure changes (e.g., adding columns to Google Sheet)

Don't log:
- Reading files to understand context
- Running tests/verification
- Responding to questions without code changes



### Workflow

1. **Make the code change(s)**
2. **Write the log entry** in the format above
3. **Append to `docs/log.md`**
4. **Inform the user** of what was done in your response

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

- `reference.png` — 16 example icons demonstrating the combinatorial system
- `CLAUDE.md` — this file (icon engine specification + project instructions)
- `index.html` — icon engine web app (single-file, vanilla HTML/CSS/JS)
- `docs/log.md` — change log

### Active Features

- Icon engine specification (documented in CLAUDE.md)
- Web app with SVG rendering, seed-based generation, quadrant controls, symmetry modes, export
