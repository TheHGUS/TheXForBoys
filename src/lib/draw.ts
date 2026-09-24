import { gsap } from './gsap';

type DrawTarget = Element | Element[] | NodeListOf<Element> | null | undefined;

function toEls(t: DrawTarget): SVGGeometryElement[] {
  if (!t) return [];
  const list = Array.from((t as NodeListOf<Element>) ?? []) as Element[];
  const arr = Array.isArray(list) ? list : [t as Element];
  return arr.filter(Boolean) as SVGGeometryElement[];
}

export function lengthOf(el: SVGGeometryElement): number {
  const anyEl = el as SVGGeometryElement & { getTotalLength?: () => number };
  if (typeof anyEl.getTotalLength === 'function') {
    try {
      const l = anyEl.getTotalLength();
      if (l && Number.isFinite(l)) return l;
    } catch {
      /* fall through */
    }
  }
  // Fallback for shapes without geometry APIs: bound the box.
  const b = (el as unknown as SVGGraphicsElement).getBBox?.();
  return b ? (b.width + b.height) * 2 : 0;
}

/** Hide a stroke so it can be drawn in later. Returns the path length. */
export function prepStroke(el: SVGGeometryElement, reverse = false): number {
  const len = lengthOf(el);
  if (!len) return 0;
  gsap.set(el, { strokeDasharray: len, strokeDashoffset: reverse ? 0 : len });
  return len;
}

export function prepStrokes(targets: DrawTarget, reverse = false): SVGGeometryElement[] {
  const els = toEls(targets);
  els.forEach((el) => prepStroke(el, reverse));
  return els;
}

export type DrawOpts = {
  /** Timeline position. */
  at?: gsap.Position;
  duration?: number;
  stagger?: number;
  ease?: string;
  /** true = erase the stroke instead of drawing it. */
  reverse?: boolean;
};

/**
 * Add a stroke-dashoffset draw-on to a timeline. Every stroke on this site is
 * animated this way — nothing fades in that should be being drawn.
 */
export function drawOn(tl: gsap.core.Timeline, targets: DrawTarget, opts: DrawOpts = {}): void {
  const els = prepStrokes(targets, opts.reverse);
  if (!els.length) return;
  const { at = '+=0', duration = 0.7, stagger = 0.08, ease = 'power2.out', reverse = false } = opts;
  tl.to(
    els,
    {
      strokeDashoffset: (_i: number, el: SVGGeometryElement) => (reverse ? lengthOf(el) : 0),
      duration,
      stagger,
      ease,
    },
    at,
  );
}

/** Convenience: draw a set of paths immediately (no scroll trigger). */
export function playDraw(targets: DrawTarget, opts: DrawOpts = {}): gsap.core.Timeline {
  const els = prepStrokes(targets, opts.reverse);
  const tl = gsap.timeline({ paused: true });
  drawOn(tl, els, opts);
  return tl;
}

/** Wipe reveal: slides a cover away / an image in, transform only. */
export function wipeIn(
  tl: gsap.core.Timeline,
  target: Element,
  opts: { at?: gsap.Position; duration?: number; ease?: string; from?: number } = {},
): void {
  const { at = '+=0', duration = 0.9, ease = 'power3.inOut', from = -100 } = opts;
  tl.fromTo(
    target,
    { xPercent: from },
    { xPercent: 0, duration, ease },
    at,
  );
}
