import { Fragment, useEffect, useMemo, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/motion';
import { albany, links } from '../content/copy';
import { SECTION_ALBANY, STORY_1, STORY_2, STORY_3 } from '../content/images';
import { Accented, Img } from '../components/ui';
import { LogoX } from '../components/LogoImage';
import { ShieldFrame } from '../components/Shield';

/**
 * ALBANY — a three-beat parallax story that ends on the ask.
 *
 *   1. THE PROBLEM   their Albany statement reads in, word by word, over the
 *                    city photograph drifting slower than the page.
 *   2. THE BOYS      three of their photos, in the club's shield, rise past at
 *                    three different speeds.
 *   3. THE ASK       the X from their logo, their own "Donate to The X" block
 *                    and its button.
 *
 * Every word is theirs. Parallax is transform-only and scrubbed to scroll;
 * reduced motion gets the same layout, still.
 */

const STORY = [
  { image: STORY_1, speed: 60 },
  { image: STORY_2, speed: 140 },
  { image: STORY_3, speed: 25 },
] as const;

export function Albany() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = useMemo(() => albany.statement.split(' '), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const wordEls = gsap.utils.toArray<HTMLElement>('.albany-word', root);
      if (reduced) {
        gsap.set(wordEls, { color: '#FFFFFF' });
        return;
      }

      /* beat 1: the statement reads in as you scroll */
      gsap.set(wordEls, { color: '#5A5A5A' });
      gsap.to(wordEls, {
        color: '#FFFFFF',
        ease: 'none',
        stagger: { each: 0.6 },
        duration: 1.2,
        scrollTrigger: {
          trigger: root.querySelector('.albany-statement'),
          start: 'top 78%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
      });

      /* parallax layers */
      const layer = (el: Element | null, from: number, to: number) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: from },
          { y: to, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      };
      layer(root.querySelector('.albany-bg'), -90, 90);
      root.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
        const s = Number(el.dataset.speed) || 0;
        layer(el, s, -s);
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-black py-16 sm:py-24 lg:py-32" aria-labelledby="albany-statement">
      {/* the city, drifting behind */}
      <div className="pointer-events-none absolute inset-x-0 -inset-y-[120px]" aria-hidden="true">
        <div className="albany-bg absolute inset-0 opacity-[0.3]">
          <Img image={SECTION_ALBANY} className="h-full w-full" imgClassName="h-full w-full object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.72) 55%, #000 100%)' }} />
      </div>

      <div className="shell relative z-10">
        {/* ---------------- 1. the problem ---------------- */}
        <p
          id="albany-statement"
          className="albany-statement max-w-[24ch] font-sans font-medium leading-[1.14] tracking-tighter text-white sm:max-w-[28ch] lg:max-w-[32ch]"
          style={{ fontSize: 'clamp(1.45rem, 3.6vw, 3rem)' }}
        >
          {words.map((w, i) => (
            <Fragment key={`${w}-${i}`}>
              <span className="albany-word inline-block">{w}</span>
              {i < words.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </p>

        {/* ---------------- 2. the boys ---------------- */}
        <ul className="mt-12 grid grid-cols-3 gap-3 sm:mt-20 sm:gap-6 lg:ml-auto lg:mt-8 lg:max-w-[56%] lg:gap-8" aria-hidden="true">
          {STORY.map((p, i) => (
            <li key={i} data-speed={p.speed} className="will-change-transform">
              <ShieldFrame tone="light">
                <Img image={p.image} className="h-full w-full" imgClassName="h-full w-full object-cover" sizes="(min-width: 1024px) 18vw, 30vw" />
              </ShieldFrame>
            </li>
          ))}
        </ul>

        {/* ---------------- 3. the ask ---------------- */}
        <div className="mt-14 flex flex-col items-start gap-6 sm:mt-24 lg:mt-20 lg:flex-row lg:items-center lg:gap-12">
          <LogoX className="h-[20vmin] w-auto shrink-0 lg:h-[24vmin]" />
          <div>
            <h2 className="display text-white" style={{ fontSize: 'clamp(2rem, 4.6vw, 3.8rem)' }}>
              <Accented text={albany.askHeading} accent={albany.askAccent} />
            </h2>
            <p className="mt-3 max-w-[44ch] text-[1rem] leading-[1.6] text-white/75">{albany.askBody}</p>
            <a
              href={links.goGetFunding}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-red px-7 py-3.5 font-sans text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-deepred"
            >
              {albany.askCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Albany;
