import { HERO_MAIN } from '../content/images';
import { hero, links } from '../content/copy';
import { Accented, Img, WithLogoX } from '../components/ui';
import { scrollToId } from '../lib/scroll';

/**
 * HERO
 * Their photograph, full bleed, with one bottom-up ink gradient behind the
 * copy. The headline is their own mission statement, set in Libre Franklin
 * bold, with one word in red italic. The page
 * opens on this finished frame — no entrance animation.
 */
export function Hero() {
  return (
    <section id="top" className="relative h-[76svh] min-h-[500px] w-full overflow-hidden bg-ink sm:h-[80svh] lg:h-[88vh] lg:max-h-[860px] lg:min-h-[620px]">
      <div className="absolute inset-0">
        <Img image={HERO_MAIN} priority className="h-full w-full" imgClassName="h-full w-full object-cover" sizes="100vw" />
      </div>

      {/* nav legibility at the top; copy legibility at the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[150px]"
        style={{ background: 'linear-gradient(to bottom, rgba(22,22,22,0.7) 0%, rgba(22,22,22,0) 100%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%]"
        style={{
          background:
            'linear-gradient(to top, rgba(22,22,22,0.98) 0%, rgba(22,22,22,0.9) 38%, rgba(22,22,22,0.6) 62%, rgba(22,22,22,0.15) 88%, rgba(22,22,22,0) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-end pb-8 pt-[68px] sm:pb-12 lg:pb-16">
        <div className="shell">
          <p className="accent font-sans drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', lineHeight: 1.1 }}>
            <WithLogoX text={hero.eyebrow} red />
          </p>
          <h1
            className="mt-3 max-w-[22ch] font-sans font-bold leading-[1.08] tracking-tighter text-white"
            style={{ fontSize: 'clamp(1.7rem, 4vw, 3.8rem)' }}
          >
            <Accented text={hero.headline} accent={hero.accent} />
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
            <a
              href={links.goGetFunding}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-red px-7 py-3.5 font-sans text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-deepred"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#programs"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('#programs');
              }}
              className="glass inline-flex items-center justify-center rounded-lg px-7 py-3.5 font-sans text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-white/20"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
