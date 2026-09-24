import { useMemo, type CSSProperties } from 'react';
import { markerStroke } from '../../lib/wobble';

/**
 * Line-art illustrations for "The Equation".
 *
 * Everything is stroke-only so it can be drawn on with stroke-dashoffset, and
 * every moving piece is its own <g> so it can assemble with transforms only.
 * Nothing here is filled solid — round 01's solid bars read as broken UI, so
 * plates, studs and headers are outlined line work.
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

/* -------------------------------------------------------------------------- */
/*  (a) AUTOMOTIVE — exploded disc brake on one horizontal axis                */
/*                                                                             */
/*  Exploded, left to right along the axle:                                    */
/*    caliper body | brake pad (outboard) | brake pad (inboard) | ROTOR | nuts */
/*  Pieces start spread apart on the axis and slide together into place; the   */
/*  five lug nuts spin in last.                                                */
/* -------------------------------------------------------------------------- */

const BW = 520;
const BH = 260;
const AXIS_Y = 130;

/** Assembled geometry. */
const ROTOR = { cx: 268, cy: AXIS_Y, outer: 86, vent: 54, hat: 46, bore: 14, studR: 31 } as const;
const STUD_ANGLES = [-90, -18, 54, 126, 198] as const;

/** Where each piece sits once assembled (its drawn position). */
const CALIPER = { x: 146, y: 58, w: 76, h: 144, winX: 174, winY: 76, winW: 56, winH: 108 } as const;
const PAD_A = { x: 180, y: 78, w: 16, h: 104 } as const; // outboard
const PAD_B = { x: 204, y: 78, w: 16, h: 104 } as const; // inboard

/**
 * How far each piece is pulled back along the axis in the exploded pose.
 * Chosen so that, spread apart, the pieces sit in strictly increasing order
 * along x with a visible gap between each — caliper | pad A | pad B | rotor |
 * nuts — and never overlap at the start of the build.
 *   caliper    6..82
 *   pad A     96..112
 *   pad B    160..176
 *   rotor    182..354
 *   nuts     389..451
 */
export const BRAKE_EXPLODE = {
  caliper: -140,
  padA: -84,
  padB: -44,
  nutX: 152,
} as const;

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [+(ROTOR.cx + r * Math.cos(a)).toFixed(1), +(ROTOR.cy + r * Math.sin(a)).toFixed(1)];
}

export function DiscBrake({ className, style }: { className?: string; style?: CSSProperties }) {
  const studs = useMemo(() => STUD_ANGLES.map((d) => polar(ROTOR.studR, d)), []);
  const nuts = useMemo(
    () => studs.map(([x, y], i) => ({ d: hexPath(x, y, 12), cx: x, cy: y, i })),
    [studs],
  );

  return (
    <svg
      viewBox={`0 0 ${BW} ${BH}`}
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* the axis everything explodes along */}
        <path className="brake-axis" d={`M 6 ${AXIS_Y} L ${BW - 6} ${AXIS_Y}`} strokeWidth={1.2} opacity={0.45} />

        {/* ---------------- vented rotor ---------------- */}
        <g className="brake-rotor" strokeWidth={2.6}>
          <circle cx={ROTOR.cx} cy={ROTOR.cy} r={ROTOR.outer} />
          {/* vented annulus */}
          <circle cx={ROTOR.cx} cy={ROTOR.cy} r={ROTOR.vent} strokeWidth={1.4} opacity={0.8} />
          {/* hat + hub bore */}
          <circle cx={ROTOR.cx} cy={ROTOR.cy} r={ROTOR.hat} strokeWidth={2.2} />
          <circle cx={ROTOR.cx} cy={ROTOR.cy} r={ROTOR.bore} strokeWidth={1.8} />
          {/* five stud holes */}
          {studs.map(([x, y], i) => (
            <circle key={`h${i}`} className="brake-hole" cx={x} cy={y} r={6.4} strokeWidth={1.8} />
          ))}
        </g>

        {/* ---------------- caliper body ---------------- */}
        <g className="brake-caliper" strokeWidth={2.6}>
          <rect x={CALIPER.x} y={CALIPER.y} width={CALIPER.w} height={CALIPER.h} rx={10} />
          {/* the window the rotor edge runs through — open to the right */}
          <path
            d={`M ${CALIPER.winX + CALIPER.winW} ${CALIPER.winY}
                L ${CALIPER.winX + 10} ${CALIPER.winY}
                A 10 10 0 0 0 ${CALIPER.winX} ${CALIPER.winY + 10}
                L ${CALIPER.winX} ${CALIPER.winY + CALIPER.winH - 10}
                A 10 10 0 0 0 ${CALIPER.winX + 10} ${CALIPER.winY + CALIPER.winH}
                L ${CALIPER.winX + CALIPER.winW} ${CALIPER.winY + CALIPER.winH}`}
            strokeWidth={2.2}
          />
          <circle cx={CALIPER.x + 14} cy={CALIPER.y + 20} r={6} strokeWidth={1.8} />
          <circle cx={CALIPER.x + 14} cy={CALIPER.y + CALIPER.h - 20} r={6} strokeWidth={1.8} />
          {/* bleeder + hose nipple */}
          <path d={`M ${CALIPER.x + 20} ${CALIPER.y} L ${CALIPER.x + 20} ${CALIPER.y - 12}`} strokeWidth={2} />
          <path d={`M ${CALIPER.x + 44} ${CALIPER.y} L ${CALIPER.x + 44} ${CALIPER.y - 8}`} strokeWidth={2} />
        </g>

        {/* ---------------- two brake pads ---------------- */}
        <g className="brake-pad-a" strokeWidth={2.4}>
          <rect x={PAD_A.x} y={PAD_A.y} width={PAD_A.w} height={PAD_A.h} rx={4} />
          <path d={`M ${PAD_A.x + 5} ${PAD_A.y + 8} L ${PAD_A.x + 5} ${PAD_A.y + PAD_A.h - 8}`} strokeWidth={1.4} />
          <path d={`M ${PAD_A.x + PAD_A.w / 2} ${PAD_A.y} L ${PAD_A.x + PAD_A.w / 2} ${PAD_A.y - 9}`} strokeWidth={2} />
        </g>
        <g className="brake-pad-b" strokeWidth={2.4}>
          <rect x={PAD_B.x} y={PAD_B.y} width={PAD_B.w} height={PAD_B.h} rx={4} />
          <path d={`M ${PAD_B.x + 5} ${PAD_B.y + 8} L ${PAD_B.x + 5} ${PAD_B.y + PAD_B.h - 8}`} strokeWidth={1.4} />
          <path d={`M ${PAD_B.x + PAD_B.w / 2} ${PAD_B.y} L ${PAD_B.x + PAD_B.w / 2} ${PAD_B.y - 9}`} strokeWidth={2} />
        </g>

        {/* ---------------- lug nuts, spun in last ---------------- */}
        <g className="brake-nuts" strokeWidth={2.4}>
          {nuts.map((n) => (
            <g key={n.i} className="brake-nut" style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}>
              <path d={n.d} />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  (b) HOME IMPROVEMENT — blueprint + framed stud wall + roller               */
/* -------------------------------------------------------------------------- */

const WALL = { x0: 40, x1: 360, top: 48, bottom: 196, plate: 16, stud: 12 } as const;
/** Full-height studs; 168 and 280 are the trimmers either side of the opening. */
const STUD_X = [56, 112, 168, 280, 336] as const;
const OPEN = { x0: 168, x1: 280, headY: 88, headH: 14, sillY: 170, sillH: 12 } as const;

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

/**
 * A framed wall in outline: bottom plate, top plate, studs, and a header over
 * the window opening. Pure line work so it draws on instead of reading as a
 * stack of solid white bars.
 */
export function StudWall({ className, style }: { className?: string; style?: CSSProperties }) {
  const s = WALL.stud / 2;
  const innerTop = WALL.top + WALL.plate;
  const innerBottom = WALL.bottom - WALL.plate;
  const studs = useMemo(
    () =>
      STUD_X.map((x) => ({
        d: `M ${x - s} ${innerTop} L ${x - s} ${innerBottom} L ${x + s} ${innerBottom} L ${x + s} ${innerTop} Z`,
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
      <g fill="none" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2.6}>
        {/* top plate + bottom plate, outlined */}
        <rect className="wall-plate" x={WALL.x0} y={WALL.top} width={WALL.x1 - WALL.x0} height={WALL.plate} />
        <rect className="wall-plate" x={WALL.x0} y={WALL.bottom - WALL.plate} width={WALL.x1 - WALL.x0} height={WALL.plate} />

        {/* studs, outlined */}
        {studs.map((st, i) => (
          <path key={i} className="wall-stud" d={st.d} />
        ))}

        {/* header over the opening, plus sill and one cripple stud */}
        <rect
          className="wall-header"
          x={OPEN.x0}
          y={OPEN.headY}
          width={OPEN.x1 - OPEN.x0}
          height={OPEN.headH}
        />
        <rect
          className="wall-header"
          x={OPEN.x0 + 6}
          y={OPEN.sillY}
          width={OPEN.x1 - OPEN.x0 - 12}
          height={OPEN.sillH}
        />
        <path
          className="wall-stud"
          d={`M 218 ${OPEN.headY + OPEN.headH} L 218 ${OPEN.sillY} L 230 ${OPEN.sillY} L 230 ${OPEN.headY + OPEN.headH} Z`}
        />
        {/* brace in the first bay */}
        <path className="wall-brace" d={`M ${STUD_X[0]} ${innerBottom} L ${STUD_X[1]} ${innerTop}`} strokeWidth={2.2} />
      </g>
    </svg>
  );
}

/** The paint roller that sweeps the photograph in. */
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
    const out: Array<{ d: string }> = [];
    const pages = [
      { x: 40, w: 140 },
      { x: 220, w: 140 },
    ];
    pages.forEach((p) => {
      for (let i = 0; i < 6; i++) {
        const y = 82 + i * 20;
        const w = [0.86, 0.94, 0.72, 0.9, 0.62, 0.88][i] * p.w;
        out.push({ d: `M ${p.x} ${y} L ${(p.x + w).toFixed(1)} ${y}` });
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
/*  (d) SHIPPING BOX — the wishlist object                                     */
/*  Off-white line work; the packing tape crossing the front forms an X.       */
/* -------------------------------------------------------------------------- */

export function ShipBox({ className, style }: { className?: string; style?: CSSProperties }) {
  const tapeA = useMemo(
    () => markerStroke({ from: [40, 66], to: [142, 136], waves: 1.4, amp: 1.6, seed: 21, bow: 1.4 }),
    [],
  );
  const tapeB = useMemo(
    () => markerStroke({ from: [142, 66], to: [40, 136], waves: 1.4, amp: 1.6, seed: 33, bow: -1.4 }),
    [],
  );
  return (
    <svg viewBox="0 0 200 160" className={className} style={style} aria-hidden="true" focusable="false">
      {/* box, off-white line work */}
      <g fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round">
        <path d="M 30 60 L 150 60 L 150 140 L 30 140 Z" />
        <path d="M 30 60 L 60 36 L 180 36 L 150 60 Z" />
        <path d="M 150 60 L 180 36 L 180 116 L 150 140 Z" />
        {/* flap seam across the top */}
        <path d="M 90 60 L 120 36" strokeWidth={1.8} />
      </g>
      {/* packing tape, in an X */}
      <g fill="none" stroke="#F70303" strokeLinecap="round">
        <path d={tapeA} strokeWidth={15} />
        <path d={tapeB} strokeWidth={15} />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth={1} opacity={0.4} strokeLinecap="round">
        <path d={tapeA} />
        <path d={tapeB} />
      </g>
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
