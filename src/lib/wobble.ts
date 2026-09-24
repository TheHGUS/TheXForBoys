/**
 * Deterministic "hand-drawn" path generation.
 * ---------------------------------------------------------------------------
 * No handwriting fonts anywhere on this site — every marker stroke, check
 * mark, grease-pencil circle and rubber stamp is a generated SVG path with a
 * slightly uneven, wobbly outline. Same seed = same path, every render.
 */

export type Pt = [number, number];

/** Tiny seeded PRNG so shapes are stable between renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Catmull-Rom through the points, emitted as cubic beziers. */
export function smoothPath(pts: Pt[], closed = false, tension = 1): string {
  if (pts.length < 2) return '';
  const p = closed ? [...pts, pts[0]] : pts;
  const at = (i: number): Pt => {
    if (closed) return p[(i + p.length) % p.length];
    return p[Math.max(0, Math.min(p.length - 1, i))];
  };
  let d = `M ${r(p[0][0])} ${r(p[0][1])}`;
  const last = closed ? p.length - 1 : p.length - 2;
  for (let i = 0; i <= last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += ` C ${r(c1[0])} ${r(c1[1])}, ${r(c2[0])} ${r(c2[1])}, ${r(p2[0])} ${r(p2[1])}`;
  }
  if (closed) d += ' Z';
  return d;
}

function r(n: number): number {
  return Math.round(n * 100) / 100;
}

type LineOpts = {
  from: Pt;
  to: Pt;
  /** Number of wobbles across the stroke. */
  waves?: number;
  /** Wobble amplitude in user units. */
  amp?: number;
  seed?: number;
  /** Bow the stroke (perpendicular offset at the middle). */
  bow?: number;
  points?: number;
};

/** A single marker stroke: slightly bowed, slightly wobbly, tapered by stroke-width. */
export function markerStroke({
  from,
  to,
  waves = 3,
  amp = 1.6,
  seed = 7,
  bow = 0,
  points = 22,
}: LineOpts): string {
  const rand = mulberry32(seed);
  const ph1 = rand() * Math.PI * 2;
  const ph2 = rand() * Math.PI * 2;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const pts: Pt[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const envelope = Math.sin(Math.PI * t); // no wobble at the tips
    const wob =
      (Math.sin(t * Math.PI * 2 * waves + ph1) * 0.62 + Math.sin(t * Math.PI * 2 * waves * 1.7 + ph2) * 0.38) *
      amp *
      envelope;
    const b = Math.sin(Math.PI * t) * bow;
    pts.push([from[0] + dx * t + nx * (wob + b), from[1] + dy * t + ny * (wob + b)]);
  }
  return smoothPath(pts);
}

type CircleOpts = {
  cx: number;
  cy: number;
  /** Radii — pass two values for an ellipse. */
  r: number | [number, number];
  /** Number of control points around the loop. */
  points?: number;
  amp?: number;
  seed?: number;
  /** > 1 overshoots the loop (how people actually draw circles). */
  turns?: number;
  start?: number;
};

/** Grease-pencil circle: wobbly, slightly open, overshoots where it closes. */
export function greaseCircle({
  cx,
  cy,
  r,
  points = 56,
  amp = 2.2,
  seed = 3,
  turns = 1.045,
  start = -0.12,
}: CircleOpts): string {
  const rand = mulberry32(seed);
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;
  const [rx, ry] = typeof r === 'number' ? [r, r] : r;
  const pts: Pt[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const a = (start + t * turns) * Math.PI * 2;
    const wob =
      Math.sin(t * Math.PI * 2 * 3 + p1) * 0.6 * amp + Math.sin(t * Math.PI * 2 * 7 + p2) * 0.4 * amp;
    pts.push([cx + Math.cos(a) * (rx + wob), cy + Math.sin(a) * (ry + wob * 0.85)]);
  }
  return smoothPath(pts);
}

type ScribbleOpts = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** How many back-and-forth passes. */
  passes?: number;
  amp?: number;
  seed?: number;
};

/**
 * A rough marker scribble that fills a box — used for the equation terms
 * before they resolve into type.
 */
export function markerScribble({ x, y, w, h, passes = 4, amp = 3.4, seed = 11 }: ScribbleOpts): string {
  const rand = mulberry32(seed);
  const pts: Pt[] = [];
  const steps = 16;
  for (let pass = 0; pass < passes; pass++) {
    const dir = pass % 2 === 0 ? 1 : -1;
    const yy = y + h * (pass / Math.max(1, passes - 1)) + (rand() - 0.5) * 2;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x + (dir === 1 ? t * w : (1 - t) * w);
      const py = yy + Math.sin(t * Math.PI * (2 + pass)) * amp + (rand() - 0.5) * amp * 0.9;
      pts.push([px, py]);
    }
  }
  return smoothPath(pts);
}

/** Hand-drawn check mark: short down-stroke, long kick up. */
export function markerCheck(seed = 5, box: [number, number] = [48, 44]): string {
  const rand = mulberry32(seed);
  const [w, h] = box;
  const pts: Pt[] = [
    [w * 0.08, h * 0.52],
    [w * 0.24, h * 0.7],
    [w * 0.4, h * 0.86],
    [w * 0.62, h * 0.42],
    [w * 0.82, h * 0.16],
    [w * 0.96, h * 0.04 + rand() * 2],
  ];
  return smoothPath(pts);
}

/**
 * Rubber-stamp frame — a deliberately imperfect rectangle with a bite out of
 * the corner, like a stamp that didn't take evenly.
 */
export function stampFrame(w: number, h: number, seed = 21): string {
  const rand = mulberry32(seed);
  const j = (n: number) => n + (rand() - 0.5) * 2.2;
  return smoothPath(
    [
      [j(2), j(3)],
      [j(w - 2), j(1)],
      [j(w - 1), j(h - 4)],
      [j(3), j(h - 2)],
    ],
    true,
    0.6,
  );
}

/** Rough line used for the "crossed out / rewritten" marks on tickets. */
export function roughUnderline(w: number, seed = 13, amp = 2.2): string {
  return markerStroke({ from: [1, 6], to: [w - 1, 4], waves: 2.4, amp, seed, bow: 1.6 });
}
