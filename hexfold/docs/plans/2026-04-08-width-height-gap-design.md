# Width/Height/Gap Rework

## Summary

Replace Fill+Gap (size-reducing) with Width+Height (independent size) + Gap (offset spacing).

## Parameters

| Control | Param | Range | Default | Behavior |
|---------|-------|-------|---------|----------|
| Width | `P.wd` | 0.1–1.0, step 0.01 | 0.88 | Piece thickness perpendicular to edge, fraction of rhombus half-width (`H`) |
| Height | `P.ht` | 0.1–1.0, step 0.01 | 0.85 | Piece length along edge, fraction of half-edge-length (`S/2`) |
| Gap | `P.ga` | 0–12, step 0.5 | 0 | Translates piece outward from grid center along edge axis. Pushes pieces apart without resizing. |
| Taper | `P.ta` | 0–1.0, step 0.01 | 0.25 | Unchanged — width difference between ends |

## plankPts changes

- `halfW = H * P.wd` (was `H * P.fi`)
- `halfL = (S/2) * P.ht` (was `S/2 - P.ga`)
- Midpoint shifts outward from origin by `P.ga` along edge unit vector
- All 6 piece shapes use the same halfW/halfL/gap logic

## UI changes

- Replace "Fill" slider with "Width" (0.1–1.0)
- Add "Height" slider (0.1–1.0)
- Gap default changes from 3 to 0, behavior changes from size-reduction to offset
- Slider order: Width, Height, Gap, Taper, Rounding

## Approach

Approach A: direct size + offset gap. Pieces can overlap at gap=0 with high width/height — intentional for creative range.
