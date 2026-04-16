# Hexfold

A browser-based tool for generating hexagonal icons from procedural tile pieces. One HTML file, no dependencies.

## Concept

Every icon is built from a single foundation shape — a **trapezoid** on a triangular grid — repeated with rotational symmetry. The system grows a small cluster of 1–8 connected pieces ("arm") within a narrow angular wedge, then stamps it around a center point to produce a balanced, hexagonal icon. Thin gaps between pieces reveal the underlying isometric grid structure.

This mirrors how many geometric logo systems work: design one fragment, let symmetry do the rest.

## How it works

### The grid

The underlying structure is a **triangular lattice** (axial hex coordinates). Nodes sit at regular intervals; edges connect each node to its 6 neighbors at 60° increments. Each edge can hold one trapezoid piece.

### The piece

Each piece is a **trapezoid** that fills the rhombus area straddling its edge — the diamond formed by the two triangular faces on either side. Three parameters shape it:

- **Fill** (0.4–0.98) — how much of the rhombus the piece occupies. At 0.88, pieces nearly touch.
- **Taper** (0–1.0) — width difference between the two ends. At 0 it's a parallelogram, at 1 it's a triangle. Taper alternates automatically via a 2-coloring of the node graph, so adjacent pieces always have matching widths at their shared junction.
- **Gap** (0–8px) — each piece is shortened inward from both endpoints, creating the thin structural lines between pieces.

### The arm

A seed arm is grown by random walk within a constrained angular wedge:

1. Start from an edge near the origin
2. At each step, collect all neighboring edges that fall within the wedge angle
3. Pick one (weighted random, biased slightly outward)
4. Repeat for `arm_size` steps

The walk produces a small connected cluster — typically 2–6 pieces forming an L, T, Z, or blob shape.

### Symmetry stamping

The arm is duplicated around the center using one of four modes. All produce 6 copies for a hexagonal silhouette:

| Mode | Wedge | Method | Character |
|------|-------|--------|-----------|
| **6-fold** | 60° | Arm × 6 rotation | Pure rotational, each sector identical |
| **3 mirror** | 60° | Arm + mirror, pair × 3 rotation | Bilateral symmetry within each 120° sector |
| **3 flip** | 60° | Arm at 0°/120°/240°, mirrored arm at 60°/180°/300° | Pinwheel — adjacent sectors are mirror images, creates spin |
| **Dihedral** | 30° | Arm + mirror, pair × 6 rotation | Maximum symmetry, densest result |

### Reproducibility

Each icon is generated from a **32-bit integer seed** using a deterministic PRNG (mulberry32). The seed plus parameters form a complete recipe:

```
Seed: 1847293847 | Sym: 3-flip | Arm: 4 | Fill: 0.88 | Taper: 0.25 | Gap: 3
```

Same recipe always produces the same icon.

## Parameters

### Structure

| Parameter | Range | Effect |
|-----------|-------|--------|
| Symmetry | 8 modes (see below) | How the arm is stamped |
| Shape | 3 / 4 / 5 / 6 / 8 / circle | Grid boundary polygon — pieces are clipped to this outline |
| Piece | bar / diamond / hex / arrow / chevron / hourglass | Base piece geometry |
| Arm size | 1–20 | Tree-grown pieces per arm (connected random walk) |
| Scatter | 0–20 | Randomly placed pieces (unconnected, anywhere in wedge) |
| Grid size | 2–7 | Hex lattice radius. Smaller = fewer, larger pieces |

### Symmetry modes

| Mode | Wedge | Copies | Character |
|------|-------|--------|-----------|
| 6-fold (C6) | 60° | 6 | Pure rotation, chiral |
| 3 mirror (D3) | 60° | 6 | Bilateral within 120° sectors |
| 3 flip | 60° | 6 | Pinwheel, alternating chirality |
| Dihedral (D6) | 30° | 12 | Maximum symmetry, densest result |
| 2 mirror (D2) | 90° | 4 | Cross/butterfly patterns |
| 3-fold (C3) | 120° | 3 | Chiral triangular |
| 2-fold (C2) | 180° | 2 | Playing-card symmetry |
| Mirror (D1) | 180° | 2 | Rorschach bilateral |

### Appearance

| Parameter | Range | Effect |
|-----------|-------|--------|
| Width | 0.1–1.0 | Piece thickness perpendicular to edge |
| Height | 0.1–1.0 | Piece length along edge |
| Gap | −100–100 | Offsets pieces outward (positive) or inward (negative) from center |
| Taper | 0–1.0 | Width difference between ends. Auto-alternates at junctions via 2-coloring |
| Rounding | 0–15 | Corner radius via quadratic Bézier |
| Background | swatches | Preview background color |

## Output

- **SVG** — Copy SVG exports the selected icon at 512px with optional background
- **Seed** — Copy Seed exports the full parameter recipe for reproduction
- **Generate** — Produces 50 unique icons per batch
- **Load 50 more** — Appends another 50 unique icons (deduped against existing)

## Presets

Save and restore parameter combinations:

- **Save** — type a name, click Save. Stores all settings in localStorage.
- **Load** — click a preset name to restore all settings and regenerate.
- **Delete** — × button removes a preset.
- **Export** — downloads all presets as `iso-icon-presets.json`.
- **Import** — loads presets from a JSON file, merges with existing without overwriting.

## Technical notes

- Single HTML file, vanilla JS, no build step
- Triangular lattice uses axial hex coordinates with 6-direction adjacency
- Node polarity (taper alternation) computed via BFS 2-coloring of the edge graph
- Corner rounding uses quadratic Bézier curves cut inward from vertices
- Seeded PRNG: mulberry32 (32-bit state, full period) — same seed + params = same icon
- Deduplication via edge-set fingerprinting prevents duplicate icons in batches
- Shape boundary uses regular polygon math for point-in-polygon testing
- 60° rotation in axial coords: `(q, r) → (−r, q + r)`
- Mirror across vertical axis: `(q, r) → (−q − r, r)`
