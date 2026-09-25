import { forwardRef, Fragment, type CSSProperties, type ReactNode } from 'react';
import { LogoX } from './LogoImage';
import type { ImageAsset } from '../content/images';

/* -------------------------------------------------------------------------- */
/*  Image                                                                      */
/* -------------------------------------------------------------------------- */

type ImgProps = {
  image: ImageAsset;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  sizes?: string;
  /** Above-the-fold images skip lazy loading. */
  priority?: boolean;
  /** Optional wrapper class (the img fills its parent). */
  wrapperClassName?: string;
};

/**
 * Every photo on the site goes through here: WebP with a JPEG fallback, real
 * intrinsic width/height, object-fit cover, and everything except the hero
 * lazy-loads. `<picture>` is display:contents so it never affects layout.
 */
export function Img({
  image,
  className,
  imgClassName,
  style,
  sizes = '(min-width: 1024px) 60vw, 100vw',
  priority = false,
  wrapperClassName,
}: ImgProps) {
  const img = (
    <picture className="contents">
      <source type="image/webp" srcSet={image.webpSet} sizes={sizes} />
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        alt={image.alt}
        width={image.w}
        height={image.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...{ fetchpriority: priority ? 'high' : 'auto' }}
        className={`h-full w-full object-cover ${imgClassName ?? ''}`}
        draggable={false}
      />
    </picture>
  );
  if (wrapperClassName || className) {
    return (
      <div className={`${wrapperClassName ?? ''} ${className ?? ''}`} style={style}>
        {img}
      </div>
    );
  }
  return img;
}

/* -------------------------------------------------------------------------- */
/*  Buttons                                                                    */
/* -------------------------------------------------------------------------- */

type Common = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const BTN_BASE =
  'group relative inline-flex items-center justify-center gap-2 rounded-lg border-2 px-6 py-3.5 font-sans font-semibold tracking-tighter transition-colors duration-200 text-[0.82rem] sm:text-[0.9rem] sm:px-8 sm:py-4';

export const Btn = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  Common & {
    href?: string;
    onClick?: () => void;
    variant?: 'red' | 'outline' | 'ghost';
    external?: boolean;
    type?: 'button' | 'submit';
    ariaLabel?: string;
  }
>(function Btn(
  { children, className, style, href, onClick, variant = 'red', external, type = 'button', ariaLabel },
  ref,
) {
  const variants = {
    red: 'border-red bg-red text-white hover:bg-deepred hover:border-deepred',
    outline: 'border-off/70 bg-transparent text-off hover:border-red hover:text-red',
    ghost: 'border-transparent bg-transparent text-off hover:text-red',
  }[variant];

  const cls = `${BTN_BASE} ${variants} ${className ?? ''}`;

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        style={style}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={cls}
      style={style}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/*  Small type helpers                                                         */
/* -------------------------------------------------------------------------- */

/** IBM Plex Mono detail line — ticket furniture, frame numbers, labels. */
export function MonoLabel({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`font-mono text-[0.62rem] uppercase tracking-[0.2em] sm:text-[0.7rem] ${className ?? ''}`}
      style={style}
    >
      {children}
    </span>
  );
}

/** Section eyebrow: mono number + rule. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <span className="h-[2px] w-8 bg-red" aria-hidden="true" />
      <MonoLabel className="text-grey">{children}</MonoLabel>
    </div>
  );
}

/** Screen-reader-only text. */
export function SrOnly({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Their words, with the logo X and an italic accent                          */
/* -------------------------------------------------------------------------- */

type Tone = 'dark' | 'light';

/**
 * Every standalone "X" in their copy (including the quoted "X" in the
 * organisation's name) is drawn as the X from their logo — the real pixels,
 * shield removed — sized to sit on the text's baseline like a capital.
 * On light backgrounds the mark is shown in negative (ink fill) so its white
 * fill doesn't disappear.
 */
export function WithLogoX({ text, tone = 'dark' }: { text: string; tone?: Tone }) {
  const parts = text.split(/("X"|\bX\b)/);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        p === 'X' || p === '"X"' ? (
          <LogoX
            key={i}
            label="X"
            className={`logo-x-inline ${tone === 'light' ? 'invert' : ''}`}
          />
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Renders the client's text exactly as written, with one or more words set
 * as the accent: the same typeface, italic, in red (or the colour passed).
 * Only the styling changes — never the words.
 */
export function Accented({
  text,
  accent,
  accentClassName,
  tone = 'dark',
}: {
  text: string;
  accent?: string | ReadonlyArray<string | { text: string; className?: string }>;
  accentClassName?: string;
  tone?: Tone;
}) {
  const list = (accent == null ? [] : typeof accent === 'string' ? [accent] : accent).map((a) =>
    typeof a === 'string' ? { text: a, className: accentClassName } : a,
  );
  // walk the text, cutting out each accent in order of appearance
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;
  const found = list
    .map((a) => ({ ...a, at: text.lastIndexOf(a.text) }))
    .filter((a) => a.at >= 0)
    .sort((a, b) => a.at - b.at);
  let cursor = 0;
  for (const a of found) {
    out.push(<WithLogoX key={key++} text={text.slice(cursor, a.at)} tone={tone} />);
    out.push(
      <span key={key++} className={`accent ${a.className ?? ''}`}>
        <WithLogoX text={a.text} tone={tone} />
      </span>,
    );
    cursor = a.at + a.text.length;
  }
  rest = text.slice(cursor);
  out.push(<WithLogoX key={key++} text={rest} tone={tone} />);
  return <>{out}</>;
}

/** Small arrow for links that leave the site. */
export function ExternalArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
