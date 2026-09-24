import { useId, type CSSProperties } from 'react';
import { VarsityXShapes, X_TIGHT_BOX } from './svg/LogoMark';
import { useReducedMotion } from '../lib/motion';
import { gsap } from '../lib/gsap';
import { useEffect, useRef } from 'react';

/**
 * The brand's repeating tiled X, rebuilt as an SVG pattern. It drifts very
 * slowly behind dark sections so the texture is alive but never distracting.
 */
export function XPattern({
  className,
  style,
  /** Tile size in px. */
  size = 132,
  opacity = 0.045,
  color = '#F7F7F7',
  drift = true,
  fillClassName,
}: {
  className?: string;
  style?: CSSProperties;
  size?: number;
  opacity?: number;
  color?: string;
  drift?: boolean;
  /** Class on the tiled fill — lets a section pulse the pattern. */
  fillClassName?: string;
}) {
  const rawId = useId();
  const pid = `xp-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const k = size / X_TIGHT_BOX.size;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !drift || reduced) return;
    const tween = gsap.to(el, {
      xPercent: -4,
      yPercent: -6,
      duration: 34,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
    return () => {
      tween.kill();
    };
  }, [drift, reduced]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
      style={style}
      aria-hidden="true"
    >
      <div ref={wrapRef} className="absolute -inset-[12%] h-[124%] w-[124%] will-change-transform">
        <svg className="h-full w-full" focusable="false">
          <defs>
            <pattern id={pid} width={size} height={size} patternUnits="userSpaceOnUse">
              <g
                transform={`translate(${-X_TIGHT_BOX.x * k} ${-X_TIGHT_BOX.y * k}) scale(${k})`}
                color={color}
              >
                <VarsityXShapes />
              </g>
            </pattern>
          </defs>
          <rect
            className={fillClassName}
            width="100%"
            height="100%"
            fill={`url(#${pid})`}
            opacity={opacity}
          />
        </svg>
      </div>
    </div>
  );
}

export default XPattern;
