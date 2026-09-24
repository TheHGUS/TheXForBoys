import type { CSSProperties } from 'react';

/** Simple line icons — outline shape, solid glyph. No icon library, no emoji. */

export type SocialId = 'instagram' | 'facebook' | 'x' | 'youtube';

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function SocialIcon({
  id,
  className,
  style,
}: {
  id: SocialId;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      {id === 'instagram' ? (
        <g {...base}>
          <rect x={3} y={3} width={18} height={18} rx={5} />
          <circle cx={12} cy={12} r={4.1} />
          <circle cx={17.2} cy={6.8} r={1.15} fill="currentColor" stroke="none" />
        </g>
      ) : null}

      {id === 'facebook' ? (
        <g {...base}>
          <circle cx={12} cy={12} r={9.2} />
          <path
            d="M15.1 7.3c-.8-.4-1.6-.6-2.4-.6-2 0-3.3 1.3-3.3 3.5v2.1H7.7v2.6h1.7V21h2.7v-6.1h2.2l.3-2.6h-2.5v-1.9c0-.8.4-1.2 1.1-1.2.6 0 1.2.1 1.6.3z"
            fill="currentColor"
            stroke="none"
          />
        </g>
      ) : null}

      {id === 'x' ? (
        <g fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round">
          <path d="M4.4 4.2 L19.6 19.8" />
          <path d="M19.6 4.2 L4.4 19.8" />
        </g>
      ) : null}

      {id === 'youtube' ? (
        <g {...base}>
          <rect x={2.6} y={5.6} width={18.8} height={12.8} rx={4} />
          <path d="M10.3 9.4 L15.2 12 L10.3 14.6 Z" fill="currentColor" stroke="none" />
        </g>
      ) : null}
    </svg>
  );
}

export default SocialIcon;
