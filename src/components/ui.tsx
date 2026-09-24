import { forwardRef, type CSSProperties, type ReactNode } from 'react';
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
 * Every photo on the site goes through here: intrinsic width/height are always
 * set, object-fit is cover, and everything except the hero lazy-loads.
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
    <img
      src={image.src}
      srcSet={`${image.srcSmall} 900w, ${image.src} 1800w`}
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
  'group relative inline-flex items-center justify-center gap-2 border-2 px-6 py-3.5 font-black uppercase tracking-tightest transition-colors duration-200 text-[0.82rem] sm:text-[0.9rem] sm:px-8 sm:py-4';

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
