import { Fragment, useEffect, useMemo, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../lib/motion';
import { albany, equation, help, links } from '../content/copy';
import { AUTO_1, HOME_1, READ_1, SECTION_ALBANY } from '../content/images';
import { Img, MonoLabel } from '../components/ui';
import { LogoX } from '../components/LogoImage';
import { ShieldFrame } from '../components/Shield';
import { Flag } from '../components/Flag';

/**
 * ALBANY — a three-beat parallax story that ends on the ask.
 *
 *   1. THE PROBLEM   the statistic reads in, word by word, over the city
 *                    photograph, which drifts slower than the page.
 *   2. THE ANSWER    the three programmes, in the club's shield, rise past at
 *                    three different speeds — the boys doing the work.
 *   3. THE ASK       the X from their logo wipes in, the kicker lands, and
 *                    the donate button sits right under it.
 *
 * Parallax is transform-only and scrubbed to scroll; reduced motion gets the
 * same layout, still.
 */

const PROGRAMS = [
  { image: AUTO_1, label: equation.terms[0].label, speed: 70 },
  { image: HOME_1, label: equation.terms[1].label, speed: 150 },
  { image: READ_1, label: equation.terms[2].label, speed: 30 },
] as const;

const DONATE = help.options[0];

export function Albany() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = useMemo(() => albany.statement.split(' '), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const wordEls = gsap.utils.toArray<HTMLElement>('.albany-word', root);
      const kicker = root.querySelectorAll('.albany-kicker, .albany-cta');
      const mark = root.querySelector('.albany-x');

      if (reduced) {
        gsap.set(wordEls, { color: '#F7F7F7' });
        gsap.set(kicker, { opacity: 1 });
        return;
      }

      /* beat 1: the statement reads in as you scroll */
      gsap.set(wordEls, { color: '#5A5A5A' });
      gsap.to(wordEls, {
        color: '#F7F7F7',
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

      /* parallax layers: the city behind, the programmes at their own speeds */
      const layer = (el: Element | null, from: number, to: number) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: from },
          {
            y: to,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      };
      layer(root.querySelector('.albany-bg'), -90, 90);
      root.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
        const s = Number(el.dataset.speed) || 0;
        layer(el, s, -s);
      });

      /* beat 3: the X wipes in, then the kicker and the ask */
      const cutTl = gsap.timeline({
        scrollTrigger: { trigger: root.querySelector('.albany-cut'), start: 'top 75%', once: true },
      });
      if (mark) {
        cutTl.fromTo(
          mark,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.out' },
          0,
        );
      }
      cutTl.fromTo(kicker, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'expo.out' }, 0.45);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-black py-14 sm:py-24 lg:py-32"
      aria-labelledby="albany-statement"
    >
      {/* the city, drifting behind */}
      <div className="pointer-events-none absolute inset-x-0 -inset-y-[120px]" aria-hidden="true">
        <div className="albany-bg absolute inset-0 opacity-[0.28]">
          <Img image={SECTION_ALBANY} className="h-full w-full" imgClassName="h-full w-full object-cover" sizes="100vw" />
        </div>
        {/* light falls off toward the bottom, where the ask is */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 55%, #000 100%)' }}
        />
      </div>

      <div className="shell relative z-10">
        {/* ---------------- 1. the problem ---------------- */}
        <MonoLabel className="text-grey">Albany, Georgia</MonoLabel>
        <p
          id="albany-statement"
          className="albany-statement mt-5 max-w-[22ch] font-extrabold uppercase leading-[1.02] tracking-tightest sm:max-w-[26ch] lg:max-w-[30ch]"
          style={{ fontSize: 'clamp(1.5rem, 4.6vw, 3.6rem)' }}
        >
          {words.map((w, i) => (
            <Fragment key={`${w}-${i}`}>
              <span className="albany-word inline-block">{w}</span>
              {i < words.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </p>
        <div className="relative mt-4 max-w-md">
          <Flag id="q-albany-stat" place="tl" />
        </div>

        {/* ---------------- 2. the answer ---------------- */}
        <ul className="mt-12 grid grid-cols-3 gap-3 sm:mt-20 sm:gap-6 lg:ml-auto lg:mt-10 lg:max-w-[58%] lg:gap-8">
          {PROGRAMS.map((p) => (
            <li key={p.label} data-speed={p.speed} className="will-change-transform">
              <ShieldFrame tone="light">
                <Img image={p.image} className="h-full w-full" imgClassName="h-full w-full object-cover" sizes="(min-width: 1024px) 18vw, 30vw" />
              </ShieldFrame>
              <p className="mt-3 text-center font-black uppercase leading-[1] tracking-tightest text-off" style={{ fontSize: 'clamp(0.62rem, 1.3vw, 0.95rem)' }}>
                {p.label}
              </p>
            </li>
          ))}
        </ul>

        {/* ---------------- 3. the ask ---------------- */}
        <div className="albany-cut mt-14 flex flex-col items-start gap-6 sm:mt-24 lg:mt-20 lg:flex-row lg:items-center lg:gap-14">
          <LogoX className="albany-x h-[22vmin] w-auto shrink-0 lg:h-[28vmin]" />
          <div className="relative">
            <p
              className="albany-kicker max-w-[20ch] font-black uppercase leading-[0.95] tracking-tightest text-off"
              style={{ fontSize: 'clamp(1.5rem, 4.4vw, 3.4rem)' }}
            >
              {albany.kicker}
            </p>
            <Flag id="q-albany-kicker" place="br" />
            <div className="albany-cta mt-6 flex flex-col items-start gap-3">
              <a
                href={links.goGetFunding}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gloss inline-flex items-center justify-center rounded-xl border-2 border-red bg-red px-7 py-3.5 font-black uppercase tracking-tightest text-white transition-colors duration-200 hover:border-deepred hover:bg-deepred"
                style={{ fontSize: 'clamp(0.82rem, 1.1vw, 0.95rem)' }}
              >
                {DONATE.title}
              </a>
              <p className="max-w-[40ch] text-[0.9rem] leading-[1.5] text-grey">{DONATE.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Albany;
