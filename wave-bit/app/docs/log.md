# Wave-Bit Change Log

## 2026-04-08 - Theme system with Signal theme

**What Changed:**
- Refactored shape definitions into pluggable theme objects (`THEMES.geometric`, `THEMES.signal`)
- Added **Signal** theme — angular, directional shapes: diamond, hex, chevrons (N/S/E/W), stripes, steps (L-blocks), arrows, fat cross. Overlays: pip, hash, zigzag, rays, grid, wave, asterisk, tick, arrows, notches, brackets, pulse, starburst, crosshair
- Theme switcher buttons in toolbar — switching regenerates all 50 icons with the new theme's shape vocabulary
- Selects repopulate with theme-specific shape/overlay lists on switch
- Render fallbacks (`full`/`none`) if a shape ID doesn't exist in the active theme

**Why:**
- Demonstrates the engine's extensibility — same 2x2 quadrant system, completely different visual character per theme

**Files Modified:**
- `index.html` - Theme system, Signal theme shapes, theme switcher UI
- `docs/log.md` - This entry

---

## 2026-04-08 - Initial icon engine web app

**What Changed:**
- Built complete single-file web app (`index.html`) implementing the icon engine spec
- 18 background shapes: full, circle, 4 half-circles, 4 quarter-circles, 4 leaves, 4 triangles
- 18 overlay symbols: none, dot, ring, dot+ring, concentric, bullseye, crosshair, diag lines, arcs, parallel lines, orbit, lollipop
- SVG rendering with clip paths, per-quadrant composition
- Seeded RNG for deterministic generation
- Controls: seed input, per-quadrant bg/overlay selects, symmetry modes (none/mirror/rotate/diagonal), gap slider, stroke weight slider, invert toggle
- Export to SVG (512px) and PNG (1024px)
- 10 clickable variant icons for exploration
- Teenage Engineering-inspired aesthetic: Space Mono font, tiny all-caps labels, #FF5500 orange accent, 1px hairline borders, no shadows/gradients, warm off-white background

**Why:**
- First implementation of the combinatorial icon engine specified in CLAUDE.md

**Files Modified:**
- `index.html` - Created (complete web app)
- `docs/log.md` - Created (this file)

---
