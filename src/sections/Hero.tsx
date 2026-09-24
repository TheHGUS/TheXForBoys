import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { drawOn } from '../lib/draw';
import { useReducedMotion } from '../lib/motion';
import { HERO_MAIN } from '../content/images';
import { hero, links } from '../content/copy';
import { Img } from '../components/ui';
import { LogoMark } from '../components/svg/LogoMark';
import { MarkerUnderline } from '../components/svg/Marker';
import { Flag } from '../components/Flag';
import { scrollToId } from '../lib/scroll';

/**
 * HERO
 * Full-bleed photograph, darkened with an ink gradient from the bottom.
 * "SOLVING FOR" + the outlined varsity X as the final word, letters rising
 * out of a mask once the intro has handed over.
 */
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
      {/* ink gradient from the bottom */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />

      {/* copy */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-[8vh] pt-[68px]">
        <div className="shell">
          <h1 className="display text-off">
            <span className="mask-line">
              <span className="hero-line-inner block">{hero.headlineTop}</span>
            </span>
            <span className="mask-line">
              <span className="hero-line-inner relative block w-[min(62vw,0.78em)]">
                <LogoMark
                  parts={['x']}
                  xVariant="outline"
                  fit="x"
                  title={hero.glyphAlt}
                  className="block h-auto w-full text-off"
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
