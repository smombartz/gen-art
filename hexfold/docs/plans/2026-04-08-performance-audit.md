# Performance Audit: Iso Icon Generator

## Context
The app renders 50+ procedurally-generated SVG icons in a grid. Slider interactions (fill, taper, gap, rounding) trigger full re-renders of the entire grid on every `oninput` event. With 50+ icons, this creates noticeable lag during slider dragging.

## Findings & Suggestions (by impact)

---

### 1. No debouncing on slider inputs (HIGH)
**Lines 76-86** — Every pixel of slider drag fires `rerender()` or `regenerate()`, each rebuilding the entire grid synchronously.

**Fix:** Add a `requestAnimationFrame` throttle to all slider `oninput` handlers. This caps re-renders at ~60fps instead of firing hundreds of times per drag.

```js
var rafId = 0;
function throttledRerender() {
  if (rafId) return;
  rafId = requestAnimationFrame(function(){ rafId = 0; rerender(); });
}
```

Apply same pattern for `regenerate()` calls from arm-size/scatter sliders.

---

### 2. Full DOM wipe on every parameter change (HIGH)
**Lines 546-551** — `renderGrid()` sets `innerHTML=''` then recreates all grid items from scratch. Every slider tick destroys and rebuilds 50+ DOM elements with inline SVGs.

**Fix:** Cache grid item DOM nodes. On re-render, update only the SVG `innerHTML` of each existing item instead of destroying/recreating the wrapper divs and event listeners. For visual-only params (fill/taper/gap/rounding), the icon data hasn't changed — only the SVG output differs.

---

### 3. Unnecessary polarity recalc in `rerender()` (HIGH)
**Line 560** — `rerender()` calls `calcPol()` (BFS traversal) on every icon, but polarity only depends on `icon.edges`, which doesn't change when visual params (fill/taper/gap/rounding) change. Polarity is already computed and stored in `icon.pol` during `generateIcon()` at line 334.

**Fix:** Remove the `calcPol()` loop from `rerender()`. Just call `renderGrid()` directly.

---

### 4. `countVariations()` generates 5000 icons on every param change (MEDIUM)
**Lines 459-476** — Called at the end of `regenerate()` (line 528). Generates up to 5000 full icons with a 10ms setTimeout, blocking the main thread.

**Fix options (pick one):**
- **Debounce** with a longer delay (500ms+) so it only runs after the user stops adjusting
- **Web Worker** — move the counting loop off the main thread entirely
- **Chunk** the work into batches of ~100 using `requestIdleCallback`

---

### 5. `regenerate()` generates every icon twice (MEDIUM)
**Lines 513-525** — First loop generates all icons for fingerprinting/dedup (line 518), then line 525 generates them all *again* via `allSeeds.map(generateIcon)`.

**Fix:** Store icons from the dedup loop and reuse them:

```js
var validSeeds = [], validIcons = [];
for (var i = 0; i < allSeeds.length; i++) {
  var icon = generateIcon(allSeeds[i]);
  var fp = iconFingerprint(icon);
  if (seen[fp]) continue;
  seen[fp] = 1;
  validSeeds.push(allSeeds[i]);
  validIcons.push(icon);
}
allSeeds = validSeeds;
allIcons = validIcons;  // no second generation pass
```

---

### 6. `iconFingerprint()` sorts edge keys every call (LOW)
**Lines 455-457** — `Object.keys().sort().join(';')` runs on every fingerprint check. In `countVariations()` this happens up to 5000 times.

**Fix:** Cache the fingerprint on the icon object at generation time.

---

### 7. String concatenation in SVG building (LOW)
**Lines 390-406** — SVG path strings built via `+=` in a loop with many `.toFixed(1)` calls.

**Fix:** Use array push + join pattern. Minor improvement but adds up across 50+ icons with rounded corners.

---

## Implementation Order
1. Remove unnecessary `calcPol()` from `rerender()` — simplest, biggest win
2. Add RAF throttle to slider handlers — simple, big perceived improvement
3. Fix double-generation in `regenerate()` — easy refactor
4. Cache DOM nodes in `renderGrid()` — moderate refactor
5. Debounce `countVariations()` — simple
6. Cache fingerprints on icon objects — simple
7. Array-based SVG string building — optional polish

## Files Modified
- `iso-icon-generator.html` — all changes in the single `<script>` block

## Verification
- Drag each slider rapidly with 50+ icons loaded — should feel smooth, no frame drops
- Generate batch, load more, change symmetry/shape — all still produce correct icons
- SVG export still works correctly
- Variation count still appears (after debounce delay)
