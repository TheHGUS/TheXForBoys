import type { ReactNode } from 'react';

/**
 * The home-plate shield from the client's logo, used as a photo frame.
 *
 * `ShieldClip` renders the clip path once (App mounts it); `ShieldFrame`
 * wraps anything in the shield with the logo's double keyline — a thick
 * outer line and a thin inner one in the opposite colour, just like the
 * outlines around the X in the lockup.
 */

export function ShieldClip() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {/* bounding-box units, so it scales to any frame: straight sides,
            softly rounded top corners, the point at the bottom */}
        <clipPath id="shield-clip" clipPathUnits="objectBoundingBox">
          <path d="M0.07,0 H0.93 Q1,0 1,0.06 V0.74 L0.5,1 L0,0.74 V0.06 Q0,0 0.07,0 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

const SHIELD = { clipPath: 'url(#shield-clip)' } as const;

export function ShieldFrame({
  children,
  tone = 'dark',
  className,
}: {
  children: ReactNode;
  /** 'dark' = ink outer line (for light sections); 'light' = off-white outer line. */
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const outer = tone === 'dark' ? 'bg-ink' : 'bg-off';
  const inner = tone === 'dark' ? 'bg-off' : 'bg-ink';
  return (
    <span className={`block aspect-[4/5] w-full p-[5px] ${outer} ${className ?? ''}`} style={SHIELD}>
      <span className={`block h-full w-full p-[4px] ${inner}`} style={SHIELD}>
        <span className="block h-full w-full overflow-hidden" style={SHIELD}>
          {children}
        </span>
      </span>
    </span>
  );
}
