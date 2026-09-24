import { useId, useMemo, type SVGProps } from 'react';
import { greaseCircle, markerCheck, markerStroke, scribbleLoops, stampFrame } from '../../lib/wobble';

/**
 * Every "marker" mark on the site. All generated SVG paths with wobbly,
 * slightly uneven strokes — no handwriting fonts, ever. `weight` sets the
 * stroke width; extra props (data-*, aria-*) are spread onto the <svg>.
 */

type MarkerProps = Omit<SVGProps<SVGSVGElement>, 'strokeWidth'> & { weight?: number };

/**
 * The scrawl an equation term hides behind before it resolves into type:
 * 2–3 overlapping looping marker strokes, uneven, drawn on one after the
 * other. No `vector-effect: non-scaling-stroke` here on purpose — the paths
 * are drawn with stroke-dashoffset, and the dash length has to be measured in
 * the same user units `getTotalLength()` reports.
 */
export function MarkerScribbleLoops({
  className,
  style,
  seed = 11,
  strokes = 3,
  weight = 13,
  ...rest
}: MarkerProps & { seed?: number; strokes?: number }) {
  const ds = useMemo(
    () => scribbleLoops({ x: 10, y: 22, w: 580, h: 76, strokes, seed }),
    [seed, strokes],
  );
  return (
    <svg
      {...rest}
      viewBox="0 0 600 120"
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round">
        {ds.map((d, i) => (
          <path key={i} className="scribble-path" d={d} />
        ))}
      </g>
    </svg>
  );
}

import { forwardRef } from 'react';

/**
 * A short, tight scrawl for the "YOU + ___ = X" blank: two looping strokes
 * that fill whatever box they're given. Forwarded so the caller can reach the
 * paths and draw them on.
 */
export const MarkerScrawl = forwardRef<
  SVGSVGElement,
  MarkerProps & { seed?: number; strokes?: number }
>(function MarkerScrawl({ className, style, seed = 7, strokes = 2, weight = 26, ...rest }, ref) {
  const ds = useMemo(
    () => scribbleLoops({ x: 12, y: 26, w: 576, h: 68, strokes, seed }),
    [seed, strokes],
  );
  return (
    <svg
      {...rest}
      ref={ref}
      viewBox="0 0 600 120"
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round">
        {ds.map((d, i) => (
          <path key={i} className="scribble-path" d={d} />
        ))}
      </g>
    </svg>
  );
});

/** A marker underline that draws itself — used under "Donate Now". */
export function MarkerUnderline({
  className,
  style,
  seed = 13,
  weight = 7,
  ...rest
}: MarkerProps & { seed?: number }) {
  const d = useMemo(
    () => markerStroke({ from: [3, 12], to: [237, 8], waves: 2.6, amp: 2.6, seed, bow: 2.4 }),
    [seed],
  );
  return (
    <svg
      {...rest}
      viewBox="0 0 240 22"
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        className="wobble-path"
        fill="none"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Hand-drawn check, drawn in as each workshop item is ticked off. */
export function MarkerCheck({
  className,
  style,
  seed = 5,
  weight = 5,
  ...rest
}: MarkerProps & { seed?: number }) {
  const d = useMemo(() => markerCheck(seed), [seed]);
  return (
    <svg
      {...rest}
      viewBox="0 0 48 44"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        className="wobble-path"
        fill="none"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The two rough marker strokes the intro draws, before they snap into the
 * varsity X. Deliberately not quite straight and not quite centred — like
 * someone marking up a whiteboard.
 */
export function RoughXStrokes({ className, style, weight = 9, ...rest }: MarkerProps) {
  const a = useMemo(
    () => markerStroke({ from: [16, 18], to: [86, 84], waves: 2, amp: 2.6, seed: 4, bow: -2 }),
    [],
  );
  const b = useMemo(
    () => markerStroke({ from: [88, 16], to: [14, 82], waves: 2.4, amp: 2.2, seed: 9, bow: 2 }),
    [],
  );
  return (
    <svg
      {...rest}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d={a} className="roughx-a wobble-path" fill="none" stroke="currentColor" strokeWidth={weight} strokeLinecap="round" />
      <path d={b} className="roughx-b wobble-path" fill="none" stroke="currentColor" strokeWidth={weight} strokeLinecap="round" />
    </svg>
  );
}

/** Grease-pencil circle drawn around a contact-sheet frame. */
export function GreaseCircle({
  className,
  style,
  seed = 3,
  weight = 4,
  ...rest
}: MarkerProps & { seed?: number }) {
  const d = useMemo(
    () => greaseCircle({ cx: 100, cy: 100, r: 88, points: 60, amp: 2.6, seed, turns: 1.06, start: -0.18 }),
    [seed],
  );
  return (
    <svg
      {...rest}
      viewBox="0 0 200 200"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        className="wobble-path"
        fill="none"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Red rubber stamp, uneven ink and all. */
export function Stamp({
  label,
  className,
  style,
  rotate = -8,
  seed = 21,
  ...rest
}: MarkerProps & { label: string; rotate?: number; seed?: number }) {
  const rawId = useId();
  void rawId;
  const frame = useMemo(() => stampFrame(132, 54, seed), [seed]);
  return (
    <svg
      {...rest}
      viewBox="0 0 140 62"
      className={className}
      style={{ ...style, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={frame}
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.92}
      />
      <text
        x={70}
        y={40}
        textAnchor="middle"
        fill="currentColor"
        fontSize={26}
        className="font-black uppercase"
        style={{ letterSpacing: '0.12em' }}
        opacity={0.92}
      >
        {label}
      </text>
    </svg>
  );
}

/** Thin rough rule used to divide ticket sections. */
export function RoughRule({ className, style, seed = 31, weight = 2, ...rest }: MarkerProps & { seed?: number }) {
  const d = useMemo(
    () => markerStroke({ from: [2, 6], to: [298, 5], waves: 3, amp: 1.4, seed, bow: 0.6 }),
    [seed],
  );
  return (
    <svg
      {...rest}
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        className="wobble-path"
        fill="none"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
