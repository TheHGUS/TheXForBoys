import { HERO_MAIN } from '../content/images';
import { hero, links } from '../content/copy';
import { Accented, Img } from '../components/ui';
import { scrollToId } from '../lib/scroll';

/**
 * HERO
 * Their photograph, full bleed, with one bottom-up ink gradient behind the
 * copy. The headline is their own mission statement, set in Libre Franklin
 * at the weight they use, with one word in the red jersey script. The page
 * opens on this finished frame — no entrance animation.
 */
export function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%]"
        style={{
          background:
            'linear-gradient(to top, rgba(22,22,22,0.96) 0%, rgba(22,22,22,0.82) 34%, rgba(22,22,22,0.35) 66%, rgba(22,22,22,0) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-end pb-[9vh] pt-[68px]">
        <div className="shell">
          <p className="font-script text-red" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.6rem)', lineHeight: 1 }}>
            {hero.eyebrow}
          </p>
          <h1
            className="mt-3 max-w-[22ch] font-sans font-medium leading-[1.08] tracking-tighter text-white"
            style={{ fontSize: 'clamp(1.85rem, 4.3vw, 4.1rem)' }}
          >
            <Accented text={hero.headline} accent={hero.accent} />
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
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
