import type { CSSProperties } from 'react';
import { LOGO_PNG, LOGO_INTRINSIC } from '../content/images';

/**
 * THE REAL LOGO.
 *
 * Studio rule (brief/STUDIO_STANDARDS.md §2): use the client's real logo file,
 * never redraw it. Every full-logo moment on the site — the nav, the intro's
 * end state, the equation finale, the footer — renders this PNG.
 *
 * If a part of the logo has to move, we animate the real image: clip it, mask
 * it, transform it. `LogoLockupSplit` is exactly that — the same PNG twice,
 * clipped into two mutually exclusive pieces so the fist region can pop
 * without ever drawing a hand-made hand.
 */

/**
 * The fist region, as percentages of the trimmed lockup (365×418 px).
 *
 * Measured from the real pixels in round 03 (scripts/build-assets.mjs trims
 * the PNG; the region was checked by cropping it out and looking at it):
 *   x 219–365 px (60–100%), y 0–121 px (0–29%).
 * That box holds the whole fist including its black-and-white keyline and
 * cuts across the forearm just below the wrist, above the top of the shield's
 * right-hand bar — so no knuckle is clipped and no shield is dragged along.
 */
export const FIST_REGION = { top: 0, right: 0, bottom: 71, left: 60 } as const;

/**
 * Everything except the fist, as one concave polygon. Clip-path polygons can
 * be concave, so the base layer and the fist layer never overlap — which is
 * what lets the fist scale down to 0.85 without ghosting against the base.
 */
export const BASE_CLIP = (() => {
  const { top, right, bottom, left } = FIST_REGION;
  const r = 100 - right;
  const b = 100 - bottom;
  return `polygon(0% 0%, ${left}% 0%, ${left}% ${b}%, ${r}% ${b}%, ${r}% ${top}%, 100% ${top}%, 100% 100%, 0% 100%)`;
})();

/** Just the fist. */
export const FIST_CLIP = `polygon(${FIST_REGION.left}% ${FIST_REGION.top}%, ${
  100 - FIST_REGION.right
}% ${FIST_REGION.top}%, ${100 - FIST_REGION.right}% ${100 - FIST_REGION.bottom}%, ${
  FIST_REGION.left
}% ${100 - FIST_REGION.bottom}%)`;

/**
 * Transform-origin for the pop: the wrist, on the cut line (≈68% x, 29% y) —
 * so the fist punches up out of the arm instead of shrinking to a point.
 */
export const FIST_ORIGIN = '68% 29%';

type LogoProps = {
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  /** Above-the-fold logos skip lazy loading. */
  priority?: boolean;
  /** Screen-reader name. Pass an empty string for a decorative logo. */
  label?: string;
};

/**
 * The lockup, whole. This is a bare <img> rather than a wrapper + fill, so
 * `w-auto` sizing works the way the caller expects: give it a height and the
 * width follows the intrinsic ratio. `object-contain` means the artwork can
 * never be stretched even if the intrinsic hint below is slightly off.
 */
export function LogoImage({ className, imgClassName, style, priority = false, label }: LogoProps) {
  return (
    <img
      src={LOGO_PNG}
      alt={label ?? ''}
      width={LOGO_INTRINSIC.w}
      height={LOGO_INTRINSIC.h}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      className={`block object-contain ${className ?? ''} ${imgClassName ?? ''}`}
      style={style}
      draggable={false}
    />
  );
}

/**
 * The lockup split in two — base + fist — for the intro's fist pop.
 *
 * Both layers are the same PNG at the same size; only their clip-paths differ.
 * The base layer is nested on purpose:
 *
 *   .logo-base-wrap   inset clip  — this is what the intro's mask-wipe animates
 *     img.logo-base   polygon clip — this keeps the fist cut out at all times
 *
 * Two nested clips are needed because a single element can only have one
 * clip-path. If the wipe overwrote the polygon, the fist would reappear inside
 * the base and the pop would have nothing to pop.
 */
export function LogoLockupSplit({ className, style, label = '' }: LogoProps) {
  return (
    <span
      className={`relative block ${className ?? ''}`}
      style={style}
      aria-hidden={label ? undefined : true}
    >
      <span className="logo-base-wrap absolute inset-0 block">
        <img
          src={LOGO_PNG}
          alt={label}
          width={LOGO_INTRINSIC.w}
          height={LOGO_INTRINSIC.h}
          className="logo-base absolute inset-0 h-full w-full object-contain"
          style={{ clipPath: BASE_CLIP }}
          decoding="async"
          draggable={false}
        />
      </span>
      <span
        className="logo-fist-wrap absolute inset-0 block"
        style={{ transformOrigin: FIST_ORIGIN }}
        aria-hidden="true"
      >
        <img
          src={LOGO_PNG}
          alt=""
          width={LOGO_INTRINSIC.w}
          height={LOGO_INTRINSIC.h}
          className="absolute inset-0 h-full w-full object-contain"
          style={{ clipPath: FIST_CLIP }}
          decoding="async"
          draggable={false}
        />
      </span>
    </span>
  );
}

/**
 * Once the fist has popped, hand over to ONE unclipped image: the base layer
 * drops its cut-out and the fist layer hides. Two clip-paths meeting on a
 * sub-pixel edge leave a faint hairline around the fist box (visible in the
 * round-03 screenshots, especially while the lockup is being scaled), so the
 * split only exists for as long as the pop itself. Timeline `set`s, so a
 * scrubbed timeline un-seals itself on the way back.
 */
export function sealLogo(tl: gsap.core.Timeline, root: Element, at: number): void {
  const base = root.querySelector('.logo-base');
  const fist = root.querySelector('.logo-fist-wrap');
  if (!base || !fist) return;
  tl.set(base, { clipPath: 'none' }, at);
  tl.set(fist, { autoAlpha: 0 }, at);
}

export default LogoImage;
