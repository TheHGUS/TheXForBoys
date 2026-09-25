import type { CSSProperties } from 'react';
import { LOGO_X_TILE } from '../content/images';

/**
 * The brand pattern: the X from the client's logo (with its fist), tiled.
 *
 * It's a plain CSS background of the real cut-out PNG — no redrawn X, no
 * drift, no animation. Used sparingly (the intro, the equation stage, the
 * girls section) so it reads as a brand texture rather than the whole page.
 *
 * The tile image already carries its own spacing (scripts/cut-logo-x.mjs).
 * `color` tints the silhouette through a mask (the girls' pink); without it
 * the logo X is shown as-is.
 */
export function XPattern({
  className,
  style,
  size = 132,
  opacity = 0.045,
  color,
}: {
  className?: string;
  style?: CSSProperties;
  size?: number;
  opacity?: number;
  color?: string;
}) {
  const tile = `url("${LOGO_X_TILE}")`;
  const layer: CSSProperties = color
    ? {
        backgroundColor: color,
        WebkitMaskImage: tile,
        maskImage: tile,
        WebkitMaskSize: `${size}px ${size}px`,
        maskSize: `${size}px ${size}px`,
        WebkitMaskRepeat: 'repeat',
        maskRepeat: 'repeat',
      }
    : {
        backgroundImage: tile,
        backgroundSize: `${size}px ${size}px`,
        backgroundRepeat: 'repeat',
      };

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
      style={style}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ opacity, ...layer }} />
    </div>
  );
}

export default XPattern;
