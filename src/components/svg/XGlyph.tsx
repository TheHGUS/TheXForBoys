import { useId, type CSSProperties } from 'react';

/**
 * THE VARSITY X — the only piece of the client's mark we are allowed to
 * recreate as SVG.
 *
 * Studio rule (brief/STUDIO_STANDARDS.md §2): never redraw the logo, mascot or
 * icon by hand. The full lockup — shield, X and raised fist — is always the
 * real PNG (`src/components/LogoImage.tsx`). What lives here is the plain
 * outlined X used purely as a *typographic glyph*: the last "letter" of
 * "SOLVING FOR X", the mark the equation resolves into, the X that bleeds off
 * the footer, and the tile behind the brand pattern. No fist. No shield.
 *
 * Geometry lives in a 140 x 156 user grid, cropped to the X's own bounding
 * box by `VIEW`, so the glyph sits on a text baseline like a letter would.
 *   two 112 x 30 bars at +/-45deg about (70, 74)
 *   -> bounding box x 19.8..120.2, y 23.8..124.2
 */

const X = { cx: 70, cy: 74, len: 112, bar: 30, inset: 7.5, inline: 2.4 } as const;

/** The bar of the X, before rotation. */
const X_BAR = { x: X.cx - X.len / 2, y: X.cy - X.bar / 2, w: X.len, h: X.bar, rx: 1.5 } as const;

/** Inner (inset) bar: (len - 2r) x (bar - 2r), centred on the same point. */
const inner = {
  w: X.len - X.inset * 2,
  h: X.bar - X.inset * 2,
  x: X.cx - (X.len - X.inset * 2) / 2,
  y: X.cy - (X.bar - X.inset * 2) / 2,
} as const;

/** The inline knockout is the ring between these two rectangles. */
const ringOuter = {
  w: inner.w + X.inline,
  h: inner.h + X.inline,
  x: inner.x - X.inline / 2,
  y: inner.y - X.inline / 2,
} as const;
const ringInner = {
  w: inner.w - X.inline,
  h: inner.h - X.inline,
  x: inner.x + X.inline / 2,
  y: inner.y + X.inline / 2,
} as const;

/** Hollow outline as a closed path (drawable), inset so the stroke straddles the contour. */
const STROKE_BAR = { x: 17.75, y: 62.75, w: 104.5, h: 22.5 } as const;
const STROKE_BAR_D = `M ${STROKE_BAR.x} ${STROKE_BAR.y} H ${STROKE_BAR.x + STROKE_BAR.w} V ${
  STROKE_BAR.y + STROKE_BAR.h
} H ${STROKE_BAR.x} Z`;

/** Tightly cropped to the X. */
const VIEW = '17 21 106 106';

/** One bar of the X; helpers draw it twice, at +45 and -45. */
function Bars({
  box,
  ...rest
}: { box: { x: number; y: number; w: number; h: number; rx?: number } } & React.SVGProps<SVGRectElement>) {
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

export type XGlyphVariant = 'solid' | 'outline' | 'stroke';

export type XGlyphProps = {
  className?: string;
  style?: CSSProperties;
  /**
   * 'solid'   = thick X with the inline knocked out (matches the PNG's X).
   * 'outline' = hollow varsity outline.
   * 'stroke'  = the same hollow outline as two closed paths, so it can be
   *             drawn on with stroke-dashoffset.
   */
  variant?: XGlyphVariant;
  /**
   * Paint the inline in a colour instead of knocking it out — the collegiate
   * treatment the hero glyph uses (off-white letter, red inner inline).
   */
  inlineColor?: string;
  /** Weight of the inline, in user units. */
  inlineWeight?: number;
  title?: string | null;
};

export function XGlyph({
  className,
  style,
  variant = 'solid',
  inlineColor,
  inlineWeight = X.inline,
  title = null,
}: XGlyphProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const maskId = `xg-${uid}`;

  return (
    <svg
      viewBox={VIEW}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      {/* -------- drawable outline (Albany's red X draws itself in) -------- */}
      {variant === 'stroke' ? (
        <g className="xglyph-stroke" fill="none" stroke="currentColor" strokeWidth={X.inset}>
          <path d={STROKE_BAR_D} transform={`rotate(45 ${X.cx} ${X.cy})`} />
          <path d={STROKE_BAR_D} transform={`rotate(-45 ${X.cx} ${X.cy})`} />
        </g>
      ) : null}

      {variant !== 'stroke' ? (
        <>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={140} height={156}>
            <rect x={0} y={0} width={140} height={156} fill="#fff" />
            {variant === 'solid' && !inlineColor ? (
              <>
                {/* knock out the thin inline ring, then put the inside back */}
                <g fill="#000">
                  <Bars box={{ ...ringOuter, rx: 1 }} />
                </g>
                <g fill="#fff">
                  <Bars box={{ ...ringInner, rx: 1 }} />
                </g>
              </>
            ) : null}
            {variant === 'outline' ? (
              <g fill="#000">
                <Bars box={{ ...inner, rx: 1 }} />
              </g>
            ) : null}
          </mask>

          <g mask={`url(#${maskId})`} fill="currentColor">
            <Bars box={X_BAR} />
          </g>

          {/* the inline, painted rather than knocked out */}
          {inlineColor ? (
            <g fill="none" stroke={inlineColor} strokeWidth={inlineWeight}>
              <Bars box={{ ...inner, rx: 1 }} />
            </g>
          ) : null}
        </>
      ) : null}
    </svg>
  );
}

export default XGlyph;

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

/**
 * Box height of the X glyph, in `em`, per unit of the headline's cap height.
 * Round 02: the hero X must stand at least 1.4x the cap height of "SOLVING
 * FOR". Libre Franklin's cap height is 0.742em (measured off the real
 * 900-weight TTF — see scripts/measure-type.mjs), and the drawn X fills
 * 100.4 of its 106-unit crop, so:
 *   box height = caps x 0.742 x (106 / 100.4) em  =  caps x 0.7834 em
 */
export const X_EM_PER_CAP = (0.742 * 106) / 100.4;
