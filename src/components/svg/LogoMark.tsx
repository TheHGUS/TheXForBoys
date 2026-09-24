import { useId, type CSSProperties } from 'react';

/**
 * THE MARK
 * ---------------------------------------------------------------------------
 * A rebuild of the client's logo (white PNG) as animatable SVG:
 *   - an outlined varsity "X" (thick X with an inner inline stroke)
 *   - a home-plate / shield shape behind it
 *   - a raised fist breaking out of the top-right arm
 *
 * Every part lives in the same 140 x 156 user-space grid so they can be
 * composed and animated independently, and so the whole thing can be swapped
 * for the real PNG (used for the nav + footer lockup) without any shift.
 *
 * Geometry (user units, before the viewBox crop):
 *   X      : two 112 x 30 bars at +/-45deg about (70, 74)
 *            -> bounding box x 19.8..120.2, y 23.8..124.2
 *   SHIELD : M8 40 H132 V112 L70 150 L8 112 Z
 *   FIST   : drawn in a local 0..60 x 0..68 box, placed at (70, -14)
 */

const X = { cx: 70, cy: 74, len: 112, bar: 30, inset: 7.5, inline: 2.4 } as const;

/** Inner (inset) bar: (len - 2r) x (bar - 2r), centred on the same point. */
const inner = {
  w: X.len - X.inset * 2,
  h: X.bar - X.inset * 2,
  x: X.cx - (X.len - X.inset * 2) / 2,
  y: X.cy - (X.bar - X.inset * 2) / 2,
};

/** The inline knockout is the ring between these two rectangles. */
const ringOuter = {
  w: inner.w + X.inline,
  h: inner.h + X.inline,
  x: inner.x - X.inline / 2,
  y: inner.y - X.inline / 2,
};
const ringInner = {
  w: inner.w - X.inline,
  h: inner.h - X.inline,
  x: inner.x + X.inline / 2,
  y: inner.y + X.inline / 2,
};

/** Gap between the shield outline and the X crossing over it. */
const SHIELD_GAP = 2.6;

/** One bar of the X; the component draws it twice, at +45 and -45. */
const X_BAR: Box = {
  x: X.cx - X.len / 2,
  y: X.cy - X.bar / 2,
  w: X.len,
  h: X.bar,
  rx: 1.5,
};

/** Hollow outline as a closed path (drawable), inset so the stroke straddles the contour. */
const STROKE_BAR = {
  x: 17.75,
  y: 62.75,
  w: 104.5,
  h: 22.5,
};
const STROKE_BAR_D = `M ${STROKE_BAR.x} ${STROKE_BAR.y} H ${STROKE_BAR.x + STROKE_BAR.w} V ${
  STROKE_BAR.y + STROKE_BAR.h
} H ${STROKE_BAR.x} Z`;

const VIEW = {
  /** Whole lockup: shield + X + fist. */
  mark: '4 -4 132 158',
  /** Just the X, tightly cropped — used for the hero glyph and footer. */
  x: '17 21 106 106',
} as const;

/* -------------------------------------------------------------------------- */
/*  Fist primitives — a union of simple shapes, in a local 0..60 x 0..68 box  */
/* -------------------------------------------------------------------------- */

const FIST_BODY = [
  // folded fingers / back of the hand
  { t: 'rect', x: 12, y: 20, w: 34, h: 36, rx: 9 },
  // knuckles, index (tallest) -> pinky
  { t: 'circle', cx: 15.5, cy: 22, r: 6.6 },
  { t: 'circle', cx: 26, cy: 21, r: 6.5 },
  { t: 'circle', cx: 36.5, cy: 22.5, r: 6.2 },
  { t: 'circle', cx: 46, cy: 25, r: 5.8 },
] as const;

const FIST_THUMB = { x: 4, y: 36, w: 32, h: 15, rx: 7.5, rot: -7, pivot: [20, 43.5] as const };

const FIST_WRIST_D =
  'M19 44 L19 54 C19 62 24 68 30 68 C36 68 41 62 41 54 L41 44 Z';

/**
 * Seams knocked out of the fist so it reads as a hand, not a blob: three
 * finger seams (stopping where the thumb crosses) and the thumb's own edge.
 */
const FIST_SEAMS = [
  'M20.4 28.5 C19.7 30.5 19.5 32.6 20 34.6',
  'M30.6 27.5 C29.9 29.8 29.7 32.2 30.2 34.4',
  'M40.2 28 C39.7 33 39.4 41 39.8 48',
  'M2 32.5 C11 29.5 24 29.5 36 35.5',
] as const;

/** The fist silhouette, as a union of primitives (rendered in one fill). */
function FistShapes() {
  return (
    <>
      {FIST_BODY.map((s, i) =>
        s.t === 'rect' ? (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} />
        ) : (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} />
        ),
      )}
      <path d={FIST_WRIST_D} />
      <rect
        x={FIST_THUMB.x}
        y={FIST_THUMB.y}
        width={FIST_THUMB.w}
        height={FIST_THUMB.h}
        rx={FIST_THUMB.rx}
        transform={`rotate(${FIST_THUMB.rot} ${FIST_THUMB.pivot[0]} ${FIST_THUMB.pivot[1]})`}
      />
    </>
  );
}

type Box = { x: number; y: number; w: number; h: number; rx?: number; rot?: 45 | -45 };

function Bars({ box, ...rest }: { box: Box } & React.SVGProps<SVGRectElement>) {
  return (
    <>
      <rect
        {...rest}
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={box.rx}
        transform={`rotate(45 ${X.cx} ${X.cy})`}
      />
      <rect
        {...rest}
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={box.rx}
        transform={`rotate(-45 ${X.cx} ${X.cy})`}
      />
    </>
  );
}

export type MarkPart = 'shield' | 'x' | 'fist';

export type LogoMarkProps = {
  className?: string;
  style?: CSSProperties;
  parts?: MarkPart[];
  /**
   * 'solid'   = thick X with the inline knockout (matches the PNG).
   * 'outline' = hollow varsity outline.
   * 'stroke'  = the same hollow outline as two closed paths, so it can be
   *             drawn on with stroke-dashoffset.
   */
  xVariant?: 'solid' | 'outline' | 'stroke';
  /** Crop: the whole lockup or just the X. */
  fit?: keyof typeof VIEW;
  /** Gap (user units) knocked out of the X around the fist. */
  fistGap?: number;
  title?: string | null;
  /** Extra classes per part (for animation scoping). */
  partClassName?: Partial<Record<MarkPart, string>>;
};

export function LogoMark({
  className,
  style,
  parts = ['shield', 'x', 'fist'],
  xVariant = 'solid',
  fit = 'mark',
  fistGap = 3,
  title = null,
  partClassName,
}: LogoMarkProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const inlineMask = `xinline-${uid}`;
  const shieldMask = `shieldx-${uid}`;
  const seamMask = `fistseam-${uid}`;
  const has = (p: MarkPart) => parts.includes(p);

  return (
    <svg
      viewBox={VIEW[fit]}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      {/* The shield sits *behind* the X: knock the X out of it with a gap. */}
      {has('shield') ? (
        <mask id={shieldMask} maskUnits="userSpaceOnUse" x={0} y={-20} width={140} height={180}>
          <rect x={0} y={-20} width={140} height={180} fill="#fff" />
          <g fill="#000" stroke="#000" strokeWidth={SHIELD_GAP * 2} strokeLinejoin="miter">
            <Bars box={X_BAR} />
          </g>
        </mask>
      ) : null}

      {/* ---------------- SHIELD ---------------- */}
      {has('shield') ? (
        <g className={partClassName?.shield ?? 'mark-shield'} mask={`url(#${shieldMask})`}>
          {/* inner group is what the intro animation moves — the mask stays put */}
          <g className="mark-shield-inner">
            <path
              d="M8 40 H132 V112 L70 150 L8 112 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth={5}
              strokeLinejoin="miter"
            />
            <path
              d="M17.5 49 H122.5 V108.5 L70 139 L17.5 108.5 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinejoin="miter"
            />
          </g>
        </g>
      ) : null}

      {/* ---------------- VARSITY X ---------------- */}
      {has('x') && xVariant === 'stroke' ? (
        <g className={partClassName?.x ?? 'mark-x'} fill="none" stroke="currentColor" strokeWidth={X.inset}>
          <path d={STROKE_BAR_D} transform={`rotate(45 ${X.cx} ${X.cy})`} />
          <path d={STROKE_BAR_D} transform={`rotate(-45 ${X.cx} ${X.cy})`} />
        </g>
      ) : null}

      {has('x') && xVariant !== 'stroke' ? (
        <>
          <mask
            id={inlineMask}
            maskUnits="userSpaceOnUse"
            x={0}
            y={-20}
            width={140}
            height={180}
          >
            <rect x={0} y={-20} width={140} height={180} fill="#fff" />

            {xVariant === 'solid' ? (
              <>
                {/* knock out the thin inline ring, then put the inside back */}
                <g fill="#000">
                  <Bars
                    box={{ x: ringOuter.x, y: ringOuter.y, w: ringOuter.w, h: ringOuter.h, rx: 1 }}
                  />
                </g>
                <g fill="#fff">
                  <Bars
                    box={{ x: ringInner.x, y: ringInner.y, w: ringInner.w, h: ringInner.h, rx: 1 }}
                  />
                </g>
              </>
            ) : (
              /* outline variant: hollow the bars out completely */
              <g fill="#000">
                <Bars box={{ x: inner.x, y: inner.y, w: inner.w, h: inner.h, rx: 1 }} />
              </g>
            )}

            {/* gap around the fist so it reads as breaking out of the arm */}
            {has('fist') && fistGap > 0 ? (
              <g
                transform="translate(70 -14)"
                fill="#000"
                stroke="#000"
                strokeWidth={fistGap * 2}
                strokeLinejoin="round"
              >
                <FistShapes />
              </g>
            ) : null}
          </mask>

          <g className={partClassName?.x ?? 'mark-x'} mask={`url(#${inlineMask})`}>
            <g fill="currentColor">
              <Bars box={X_BAR} />
            </g>
          </g>
        </>
      ) : null}

      {/* ---------------- FIST ---------------- */}
      {has('fist') ? (
        <g className={partClassName?.fist ?? 'mark-fist'} transform="translate(70 -14)">
          <mask id={seamMask} maskUnits="userSpaceOnUse" x={-6} y={8} width={72} height={72}>
            <rect x={-6} y={8} width={72} height={72} fill="#fff" />
            <g fill="none" stroke="#000" strokeLinecap="round">
              {FIST_SEAMS.map((d, i) => (
                <path key={i} d={d} strokeWidth={i === 3 ? 2.6 : 2} />
              ))}
            </g>
          </mask>
          <g mask={`url(#${seamMask})`} fill="currentColor">
            <FistShapes />
          </g>
        </g>
      ) : null}
    </svg>
  );
}

export default LogoMark;

/* -------------------------------------------------------------------------- */
/*  Reusable pieces                                                            */
/* -------------------------------------------------------------------------- */

/** The X silhouette as bare shapes — used inside the tiled background pattern. */
export function VarsityXShapes({ fill }: { fill?: string }) {
  return (
    <g fill={fill ?? 'currentColor'}>
      <Bars box={X_BAR} />
    </g>
  );
}

/** Tight bounding box of the X, in the 140 x 156 user space. */
export const X_TIGHT_BOX = { x: 19.8, y: 23.8, size: 100.4 } as const;
