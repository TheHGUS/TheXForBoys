import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { drawOn } from '../lib/draw';
import { useReducedMotion } from '../lib/motion';
import { HERO_MAIN } from '../content/images';
import { hero, links } from '../content/copy';
import { Img } from '../components/ui';
import { XGlyph, X_EM_PER_CAP } from '../components/svg/XGlyph';
import { MarkerUnderline } from '../components/svg/Marker';
import { Flag } from '../components/Flag';
import { scrollToId } from '../lib/scroll';

/**
 * HERO
 * Full-bleed photograph with a single bottom-up ink gradient behind the copy —
 * no full-frame wash, so the kids' faces stay bright. "SOLVING FOR" on line 1,
 * the outlined varsity X on line 2 at 2.2x line 1's cap height, left-aligned
 * with it, so the X reads as the answer rather than an icon (ROUND-03 P1 #7).
 */

/**
 * How tall the X stands, in multiples of the headline's cap height.
 * Libre Franklin's cap height is 0.742em (measured off the real 900-weight
 * TTF). ROUND-03 asks for ~2.2x.
 */
const X_CAPS = 2.2;

export function Hero({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  /* ---------------- headline reveal + Ken Burns ---------------- */
  useEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const lines = root.querySelectorAll('.hero-line-inner');
      const sub = root.querySelector('.hero-sub');
      const cta = root.querySelectorAll('.hero-cta');
      const underlines = root.querySelectorAll('.hero-underline path');
      const photo = root.querySelector('.hero-photo');

      if (reduced) {
        gsap.set([lines, sub, cta], { opacity: 1, yPercent: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0);
      tl.fromTo(sub, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9 }, 0.55);
      tl.fromTo(
        cta,
        { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
        0.7,
      );
      drawOn(tl, underlines, { at: 1.15, duration: 0.6, ease: 'power2.out' });

      // very slow Ken Burns
      if (photo) {
        gsap.fromTo(
          photo,
          { scale: 1 },
          { scale: 1.06, duration: 26, ease: 'sine.inOut', repeat: -1, yoyo: true },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [ready, reduced]);

  /* ---------------- redraw the marker underline on hover ---------------- */
  const onCtaEnter = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    if (reduced) return;
    const path = e.currentTarget.querySelector('.hero-underline path');
    if (!path) return;
    gsap.fromTo(
      path,
      { strokeDashoffset: (path as SVGGeometryElement).getTotalLength() },
      { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out', overwrite: true },
    );
  };

  return (
    <section ref={rootRef} className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      {/* photograph */}
      <div className="hero-photo absolute inset-0 will-change-transform">
        <Img
          image={HERO_MAIN}
          priority
          className="h-full w-full"
          imgClassName="h-full w-full object-cover"
          sizes="100vw"
        />
      </div>

      {/*
        One bottom-up ink gradient behind the copy. Apart from the short fade
        under the nav, the upper two-thirds of the frame is left alone.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%]"
        style={{
          background:
            'linear-gradient(to top, #161616 0%, rgba(22,22,22,0.78) 32%, rgba(22,22,22,0.34) 62%, rgba(22,22,22,0) 100%)',
        }}
        aria-hidden="true"
      />

      {/*
        A short top-down ink fade under the transparent nav: the sky in this
        photo is near-white, and the nav links need AA contrast against it.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[150px]"
        style={{ background: 'linear-gradient(to bottom, rgba(22,22,22,0.72) 0%, rgba(22,22,22,0) 100%)' }}
        aria-hidden="true"
      />

      {/* copy */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-[8vh] pt-[68px]">
        <div className="shell">
          <h1 className="display text-fluid-hero text-off">
            <span className="mask-line">
              <span className="hero-line-inner block">{hero.headlineTop}</span>
            </span>
            <span className="mask-line">
              <span
                className="hero-line-inner relative block"
                style={{ height: `${(X_EM_PER_CAP * X_CAPS).toFixed(4)}em` }}
              >
                <XGlyph
                  variant="solid"
                  inlineColor="#F70303"
                  inlineWeight={3.4}
                  title={hero.glyphAlt}
                  className="absolute bottom-0 left-0 block h-full w-auto text-off"
                />
              </span>
            </span>
          </h1>

          <p
            className="hero-sub mt-6 max-w-[34ch] font-medium text-off/85 sm:mt-8"
            style={{ fontSize: 'clamp(1rem, 1.6vw, 1.35rem)', lineHeight: 1.45 }}
          >
            {hero.subline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
            <span className="hero-cta relative inline-block">
              <a
                href={links.goGetFunding}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={onCtaEnter}
                onFocus={onCtaEnter}
                className="relative inline-flex items-center justify-center border-2 border-red bg-red px-6 py-3.5 font-black uppercase tracking-tightest text-white transition-colors duration-200 hover:border-deepred hover:bg-deepred sm:px-8 sm:py-4"
                style={{ fontSize: 'clamp(0.78rem, 1.1vw, 0.95rem)' }}
              >
                {hero.primaryCta}
                <MarkerUnderline className="hero-underline absolute -bottom-1 left-0 h-3 w-full text-red" weight={6} />
              </a>
              <span className="pointer-events-none absolute -right-2 top-0">
                <Flag id="q-hero-glyph" place="bl" />
              </span>
            </span>

            <span className="hero-cta inline-block">
              <a
                href="#programs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId('#programs');
                }}
                className="inline-flex items-center justify-center border-2 border-off/70 px-6 py-3.5 font-black uppercase tracking-tightest text-off transition-colors duration-200 hover:border-red hover:text-red sm:px-8 sm:py-4"
                style={{ fontSize: 'clamp(0.78rem, 1.1vw, 0.95rem)' }}
              >
                {hero.secondaryCta}
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
