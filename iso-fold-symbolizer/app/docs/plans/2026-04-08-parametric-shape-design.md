# Parametric Shape System Design

## Context
Replace the 6 hardcoded piece shapes (bar, diamond, hex, arrow, chevron, hourglass) with a unified parametric shape generator. Users control shape via continuous sliders; old presets become shortcut buttons that set slider values.

## Section Rename
- "Geometry" section renamed to **"Shape"**
- Section description: "Piece shape and deformation"
- Label "Piece" becomes the preset button row

## Parameters

Replace `P.ps` (discrete index 0-5) with 5 continuous parameters:

| Parameter | Key | Range | Default | Description |
|-----------|-----|-------|---------|-------------|
| Sides | `pn` | 3–8 | 4 | Base polygon vertex count |
| Skew | `pk` | -1 to 1 | 0 | Shifts vertices along edge axis proportional to across position (parallelogram/rhombus). Creates asymmetry |
| Indent | `pi` | -1 to 1 | 0 | Pulls edge midpoints inward (+) or outward (-). Adds interpolated midpoint vertices |
| Pinch | `pp` | 0 to 1 | 0 | Narrows shape at perpendicular midpoint (waist/hourglass) |
| Point | `pt` | 0 to 1 | 0 | Sharpens ends by collapsing end vertices toward centerline |

## Geometry Pipeline

Inside `plankPts(q1, r1, q2, r2, pol)`:

1. **Base n-gon**: Generate `pn` vertices of a regular polygon inscribed in the piece bounding box (halfL along edge axis, w1/w2 across). For a 4-gon this is the current bar rectangle. Vertices are ordered clockwise.

2. **Apply skew**: For each vertex, shift along-axis proportional to its across-axis position:
   ```
   along += across * pk
   ```
   This turns rectangles into parallelograms. Naturally asymmetric.

3. **Apply point**: For vertices at the ends (near ±halfL), lerp across-position toward 0:
   ```
   across *= (1 - pt * end_proximity)
   ```
   where `end_proximity` = how close the vertex is to the along-axis extremes (1 at tips, 0 at midpoint).

4. **Apply pinch**: For vertices near the perpendicular midpoint (along ≈ 0), narrow the across dimension:
   ```
   across *= (1 - pp * center_proximity)
   ```
   where `center_proximity` = how close the vertex is to along=0 (1 at center, 0 at ends).

5. **Apply indent**: For each polygon edge, compute midpoint and offset it perpendicular to the edge by `pi * factor`. Insert the offset midpoint as a new vertex. This doubles the vertex count. Positive = concave, negative = convex.

6. **Convert to global coords** using existing `pt(along, across)` helper and tag with local frame for ellipse rendering.

## Preset Mappings

Buttons set all 5 sliders simultaneously:

| Preset | Sides | Skew | Indent | Pinch | Point |
|--------|-------|------|--------|-------|-------|
| bar | 4 | 0 | 0 | 0 | 0 |
| diamond | 4 | 0 | 0 | 0 | 1 |
| hex | 6 | 0 | 0 | 0 | 0 |
| arrow | 3 | 0 | 0 | 0 | 0.5 |
| chevron | 4 | 0 | -0.5 | 0 | 0.5 |
| hourglass | 4 | 0 | 0 | 1 | 0 |

Clicking a preset sets sliders and updates readouts. Users can then tweak.

## UI Layout (in Shape section)

```
[Shape] ▾
  Piece shape and deformation

  Shape:  [bar] [diamond] [hex] [arrow] [chevron] [hourglass]

  Sides       [====|====]  4
  Skew        [====|====]  0
  Indent      [====|====]  0
  Pinch       [====|====]  0
  Point       [====|====]  0

  Width       [====|====]  0.88
  Height      [====|====]  0.85
  Taper       [====|====]  0.25
```

## Interaction with Existing Parameters

- **Width/Height/Taper**: Still control `w1`, `w2`, `halfL` — the bounding box the shape is inscribed in. No change.
- **Rounding**: Still applies per-corner after shape generation. Per-corner multipliers wrap with `i % 4` on the (potentially larger) vertex count.
- **Gap/Spacing/Border**: Still apply after shape generation. No change.
- **Per-corner rounding (`P.rc`)**: Corner count may now be > 4 (indent doubles vertices). The `i % P.rc.length` wrap handles this gracefully.

## Backward Compatibility

- Old presets with `P.ps` integer: `loadPreset()` detects `ps` as integer and maps to the new slider values using the preset table above. Then deletes `P.ps`.
- `copySeed()`: Updated to output new parameter names instead of piece name.
- `resetDefaults()`: Sets `pn:4, pk:0, pi:0, pp:0, pt:0`.

## Files Modified

- `iso-icon-generator.html` — all changes in single file
