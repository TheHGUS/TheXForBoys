import { useMemo, type CSSProperties } from 'react';
import { markerStroke } from '../../lib/wobble';

/**
 * Line-art illustrations for "The Equation". Everything is stroke-only so it
 * can be drawn on with stroke-dashoffset, and every moving piece is its own
 * <g> so it can assemble with transforms only.
 */

const W = 400;
const H = 260;

function hexPath(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (-90 + i * 60) * (Math.PI / 180);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

const BRAKE = { cx: 150, cy: 132, rotor: 84, hub: 32, studR: 52, holeR: 68 } as const;

function polar(r: number, deg: number, c = BRAKE): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [+(c.cx + r * Math.cos(a)).toFixed(1), +(c.cy + r * Math.sin(a)).toFixed(1)];
}

/* -------------------------------------------------------------------------- */
/*  (a) AUTOMOTIVE — exploded disc brake                                       */
/* -------------------------------------------------------------------------- */

export function DiscBrake({ className, style }: { className?: string; style?: CSSProperties }) {
  const studs = useMemo(() => [0, 1, 2, 3, 4].map((i) => polar(BRAKE.studR, -90 + i * 72)), []);
  const holes = useMemo(() => Array.from({ length: 10 }, (_, i) => polar(BRAKE.holeR, -90 + i * 36)), []);
  const nuts = useMemo(() => studs.map(([x, y]) => hexPath(x, y, 13)), [studs]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* rotor */}
        <g className="brake-rotor" strokeWidth={2.4}>
          <circle cx={BRAKE.cx} cy={BRAKE.cy} r={BRAKE.rotor} />
          <circle cx={BRAKE.cx} cy={BRAKE.cy} r={BRAKE.hub} strokeWidth={2} />
          {holes.map(([x, y], i) => (
            <circle key={`h${i}`} cx={x} cy={y} r={4.5} strokeWidth={1.6} className="brake-hole" />
          ))}
          {studs.map(([x, y], i) => (
            <circle key={`s${i}`} cx={x} cy={y} r={7} strokeWidth={1.8} />
          ))}
        </g>

        {/* caliper */}
        <g className="brake-caliper" strokeWidth={2.6}>
          <path d="M 47.8 191 A 118 118 0 0 1 47.8 73 L 68.6 85 A 94 94 0 0 0 68.6 179 Z" />
          <circle cx={52} cy={92} r={5} strokeWidth={1.8} />
          <circle cx={52} cy={172} r={5} strokeWidth={1.8} />
        </g>

        {/* brake pad */}
        <g className="brake-pad" strokeWidth={2.4}>
          <path d="M 62 178 A 96 96 0 0 1 62 86 L 52 96 A 84 84 0 0 0 52 168 Z" />
          <path d="M 52 96 L 52 168" strokeWidth={1.6} />
        </g>

        {/* lug nuts, spun in one at a time */}
        <g className="brake-nuts" strokeWidth={2.4}>
          {nuts.map((d, i) => (
            <path key={i} d={d} className="brake-nut" />
          ))}
        </g>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  (b) HOME IMPROVEMENT — blueprint + stud wall + roller                      */
/* -------------------------------------------------------------------------- */

const WALL = { x0: 56, x1: 344, top: 52, bottom: 208, plate: 14, stud: 12 } as const;
const STUD_X = [76, 132, 188, 244, 300, 324] as const;

export function BlueprintGrid({ className, style }: { className?: string; style?: CSSProperties }) {
  const lines = useMemo(() => {
    const out: string[] = [];
    for (let x = 32; x <= W - 32; x += 32) out.push(`M ${x} 16 L ${x} 244`);
    for (let y = 16; y <= H - 16; y += 32) out.push(`M 16 ${y} L 384 ${y}`);
    return out;
  }, []);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        {lines.map((d, i) => (
          <path key={i} d={d} className="bp-line" />
        ))}
      </g>
    </svg>
  );
}

export function StudWall({ className, style }: { className?: string; style?: CSSProperties }) {
  const studs = useMemo(
    () =>
      STUD_X.map((x) => ({
        x: x - WALL.stud / 2,
        d: `M ${x} ${WALL.top + WALL.plate} L ${x} ${WALL.bottom - WALL.plate}`,
      })),
    [],
  );
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth={2.6}>
        <path
          className="wall-plate"
          d={`M ${WALL.x0} ${WALL.bottom - WALL.plate / 2} L ${WALL.x1} ${WALL.bottom - WALL.plate / 2}`}
          strokeWidth={WALL.plate}
        />
        <path
          className="wall-plate"
          d={`M ${WALL.x0} ${WALL.top + WALL.plate / 2} L ${WALL.x1} ${WALL.top + WALL.plate / 2}`}
          strokeWidth={WALL.plate}
        />
        {studs.map((s, i) => (
          <path key={i} className="wall-stud" d={s.d} strokeWidth={WALL.stud} />
        ))}
        {/* diagonal brace, drawn last */}
        <path
          className="wall-brace"
          d={`M ${STUD_X[0]} ${WALL.bottom - WALL.plate} L ${STUD_X[5]} ${WALL.top + WALL.plate}`}
          strokeWidth={2.6}
        />
      </g>
    </svg>
  );
}

/** The paint roller that sweeps the photo in. */
export function PaintRoller({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 132 96" className={className} style={style} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <rect x={6} y={8} width={62} height={26} rx={3} />
        <path d="M 68 21 L 104 21" />
        <path d="M 104 21 L 104 62" />
        <path d="M 96 62 L 112 62" />
        <path d="M 104 62 L 104 88" strokeWidth={7} />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  (c) READING LITERACY — open book + highlighter                             */
/* -------------------------------------------------------------------------- */

export function BookSpread({ className, style }: { className?: string; style?: CSSProperties }) {
  const textLines = useMemo(() => {
    const out: Array<{ d: string; w: number }> = [];
    const pages = [
      { x: 34, w: 148 },
      { x: 214, w: 148 },
    ];
    pages.forEach((p, pi) => {
      for (let i = 0; i < 7; i++) {
        const y = 74 + i * 20;
        const w = [0.86, 0.94, 0.72, 0.9, 0.62, 0.88, 0.5][i] * p.w;
        out.push({ d: `M ${p.x} ${y} L ${(p.x + w).toFixed(1)} ${y}`, w: pi });
      }
    });
    return out;
  }, []);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        {/* cover + pages */}
        <path
          className="book-cover"
          d="M 200 66 L 200 216 M 200 66 C 168 44 96 40 46 48 L 46 214 C 96 206 168 210 200 232 M 200 66 C 232 44 304 40 354 48 L 354 214 C 304 206 232 210 200 232 M 200 232 L 200 216"
        />
        <path className="book-edge" d="M 56 60 L 56 202 M 344 60 L 344 202" strokeWidth={1.4} />
        {textLines.map((l, i) => (
          <path key={i} className="book-line" d={l.d} strokeWidth={1.8} opacity={0.55} />
        ))}
      </g>
    </svg>
  );
}

/** Thick red marker stroke used to highlight a word. */
export function HighlighterSwipe({
  className,
  style,
  seed = 17,
  strokeWidth = 26,
}: {
  className?: string;
  style?: CSSProperties;
  seed?: number;
  strokeWidth?: number;
}) {
  const d = useMemo(
    () => markerStroke({ from: [4, 16], to: [296, 12], waves: 1.6, amp: 3, seed, bow: 1.2, points: 18 }),
    [seed],
  );
  return (
    <svg
      viewBox="0 0 300 32"
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small furniture used by the programme "objects"                            */
/* -------------------------------------------------------------------------- */

/** Bulldog clip holding the paper-clipped snapshot. */
export function BulldogClip({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 48" className={className} style={style} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 10 30 L 54 30 L 48 12 L 16 12 Z" />
        <path d="M 20 30 C 22 40 42 40 44 30" />
        <path d="M 16 12 L 22 30 M 48 12 L 42 30" strokeWidth={2} />
      </g>
    </svg>
  );
}

/** Push pin. */
export function PushPin({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 32 40" className={className} style={style} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M 16 30 L 16 8" />
        <path d="M 16 6 C 22 6 24 12 16 16 C 8 12 10 6 16 6 Z" />
      </g>
    </svg>
  );
}
