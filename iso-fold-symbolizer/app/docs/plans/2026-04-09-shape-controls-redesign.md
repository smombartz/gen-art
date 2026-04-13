# Shape Controls Redesign

## Context
The current parametric shape system orients the base polygon as a diamond (vertex at top) rather than a flat-based rectangle. Controls like taper and pinch are confusingly similar. The control order doesn't flow well. This redesign fixes orientation, consolidates controls, and adds rotate + width/height linking.

## Changes Summary
- Base shape: flat edge at bottom (not vertex at top)
- Remove: taper (`ta`), pinch (`pp`)
- Add: trapeze (`pz`, polarity-aware, replaces taper), rotate (`pr`), link toggle (`lk`)
- Reorder controls: width, height, link, sides, trapeze, skew, indent, point, rotate

## Base Shape Orientation

Currently the n-gon starts at angle `-PI/2` (vertex at top). Change to `-PI/2 + PI/n` so the first edge is flat at the bottom. For n=4 this produces a square with flat base, not a diamond.

```
Current (n=4):          New (n=4):
    *                   *-----*
   / \                  |     |
  /   \                 |     |
 *     *                *-----*
  \   /
   \ /
    *
```

## Parameters

### Removed
- `ta` (taper) — replaced by `pz` (trapeze)
- `pp` (pinch) — removed, redundant with indent

### New
| Param | Key | Range | Default | Description |
|-------|-----|-------|---------|-------------|
| Trapeze | `pz` | 0–1 | 0.25 | Polarity-aware taper. Narrows one end of each piece; alternating direction at adjacent nodes. Default 0.25 matches old taper default. |
| Rotate | `pr` | 0–360 | 0 | Rotates shape around centroid in degrees, applied after all deformations. |
| Link | `lk` | 0/1 | 0 | Toggle. When on, width and height sliders move together. Ratio locked at activation time. |

### Kept (unchanged behavior)
- `wd` (width), `ht` (height), `pn` (sides), `pk` (skew), `pi` (indent), `pe` (point)

## Control Order in UI

```
[Shape] section:
  [shape preview SVG]

  Shape: [bar] [diamond] [hex] [arrow] [chevron] [hourglass]

  Width       [====|====]  0.88   [link icon]
  Height      [====|====]  0.85
  Sides       [====|====]  4
  Trapeze     [====|====]  0.25
  Skew        [====|====]  0
  Indent      [====|====]  0
  Point       [====|====]  0
  Rotate      [====|====]  0
```

## Trapeze Implementation

The old taper system computed:
```js
var halfW = H * P.wd;
var narrowW = halfW * (1 - P.ta);
var w1 = (pol[node1] === 1) ? narrowW : halfW;
var w2 = (pol[node2] === 1) ? narrowW : halfW;
```

New trapeze applies the same polarity logic but inside the shape pipeline. After generating the base n-gon, scale each vertex's `across` coordinate based on its `along` position:

```
For each vertex:
  t = (along + halfL) / (2 * halfL)   // 0 at left end, 1 at right end
  taperFactor = 1 - pz * t            // 1 at left, (1-pz) at right
  across *= taperFactor
```

Polarity flips which end is narrow: if node polarity is 1, use `(1 - pz * (1 - t))` instead.

Since `w1`/`w2` are no longer needed for taper, both become `halfW` (width is uniform before trapeze is applied). The polarity is passed into the shape pipeline instead.

## Rotate Implementation

After all deformation passes (trapeze, skew, point, indent), rotate all vertices around their centroid:

```
centroid = average of all vertices
for each vertex:
  dx = v[0] - cx, dy = v[1] - cy
  v[0] = cx + dx*cos(angle) - dy*sin(angle)
  v[1] = cy + dx*sin(angle) + dy*cos(angle)
```

## Link Toggle Implementation

A small button (chain link icon or "L") between/beside the width and height sliders. Clicking toggles `P.lk`. When activated, store the current ratio `P.wd / P.ht`. While linked, dragging either slider computes the other from the ratio:
- Drag width: `height = width / ratio`
- Drag height: `width = height * ratio`

## Preset Updates

| Preset | pn | pk | pi | pe | pz | pr |
|--------|----|----|----|----|----|----|
| bar | 4 | 0 | 0 | 0 | 0 | 0 |
| diamond | 4 | 0 | 0 | 1 | 0 | 0 |
| hex | 6 | 0 | 0 | 0 | 0 | 0 |
| arrow | 3 | 0 | 0 | 0.5 | 0 | 0 |
| chevron | 4 | 0 | -0.5 | 0.5 | 0 | 0 |
| hourglass | 4 | 0 | 0 | 0 | 0 | 0 |

Note: hourglass preset no longer has pinch. It becomes a plain bar. Users can recreate the old hourglass via indent.

## Backward Compatibility

- Old presets with `ta` → map to `pz` with same value
- Old presets with `pp` → drop (no equivalent)
- `P.ps` integer migration still works via SHAPE_PRESETS

## Shape Preview

The existing 80x80 SVG preview in the Shape section continues to work — it just uses the updated pipeline.

## Files Modified
- `iso-icon-generator.html` — all changes
