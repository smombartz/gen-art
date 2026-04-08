# Spacing (Polygon Inset) Control

## Summary

Add a "Spacing" slider that uniformly shrinks each piece inward from all edges, creating equal visible gutters between neighboring pieces.

## Parameter

| Control | Param | Range | Default | Behavior |
|---------|-------|-------|---------|----------|
| Spacing | `P.sp` | 0–10, step 0.5 | 0 | Each vertex moves toward the polygon centroid by P.sp pixels |

## Implementation

After `plankPts` returns the polygon, apply centroid-pull inset:

1. Compute centroid: average of all vertex coordinates
2. For each vertex, lerp toward centroid: `v' = v + (centroid - v) * (sp / dist(v, centroid))`
3. This happens before rounding — rounding applies to the inset points

## Why centroid-pull

- One line of math per vertex
- Works for all 6 piece shapes (all convex)
- Composes cleanly with Bezier rounding
- True edge-normal inset is overkill for convex polygons at this scale

## UI

Slider labeled "Spacing" placed after Gap, before Taper.
