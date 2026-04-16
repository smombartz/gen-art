# Proportional Rounding

## Summary

Replace absolute pixel rounding with proportional rounding — radius expressed as a fraction of the shortest adjacent edge at each corner.

## Change

- `P.rn` range changes from 0–15 (pixels) to 0–0.5 (fraction), step 0.01, default 0
- Formula: `rr = Math.min(l1, l2) * P.rn` (was `Math.min(P.rn, l1/2, l2/2)`)
- Every corner rounds the same proportion of its edges regardless of taper
- No clamping needed — at 0.5 each corner becomes a semicircle of its shortest edge
