import { Fragment, useEffect, useMemo, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { drawOn } from '../lib/draw';
import { useReducedMotion } from '../lib/motion';
import { albany } from '../content/copy';
import { SECTION_ALBANY } from '../content/images';
import { Img, MonoLabel } from '../components/ui';
import { XGlyph } from '../components/svg/XGlyph';
import { Flag } from '../components/Flag';

/**
 * ALBANY — THE REALITY
 * Full black. The statement reads in word by word, grey turning white. Then a
 * hard cut: a red outlined X draws itself across the screen and the kicker
 * lands underneath it.
 */
export function Albany() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = useMemo(() => albany.statement.split(' '), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const wordEls = gsap.utils.toArray<HTMLElement>('.albany-word', root);
      const kicker = root.querySelector('.albany-kicker');
      const mark = root.querySelectorAll('.albany-x path');

      if (reduced) {
        gsap.set(wordEls, { color: '#F7F7F7' });
        gsap.set(kicker, { opacity: 1 });
        return;
      }

      gsap.set(wordEls, { color: '#5A5A5A' });

      // the statement reads in
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

      // hard cut: the X draws, then the line
      const cutTl = gsap.timeline({
        scrollTrigger: {
          trigger: root.querySelector('.albany-cut'),
          start: 'top 72%',
          once: true,
        },
      });
      drawOn(cutTl, mark, { at: 0, duration: 0.85, ease: 'power2.inOut' });
      cutTl.fromTo(
        kicker,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
        0.6,
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-black py-20 sm:py-28 lg:py-36"
      aria-labelledby="albany-statement"
    >
      {/* duotone halftone backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="albany-duotone absolute inset-0 opacity-[0.16]">
          <Img
            image={SECTION_ALBANY}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0 opacity-[0.22] mix-blend-screen"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(247,3,3,0.55) 0.9px, transparent 1.3px)',
            backgroundSize: '7px 7px',
          }}
        />
      </div>

      <div className="shell relative z-10">
        <MonoLabel className="text-grey">Albany, Georgia</MonoLabel>

        <p
          id="albany-statement"
          className="albany-statement mt-6 max-w-[22ch] font-extrabold uppercase leading-[1.02] tracking-tightest sm:max-w-[26ch] lg:max-w-[30ch]"
          style={{ fontSize: 'clamp(1.5rem, 4.6vw, 3.6rem)' }}
        >
          {words.map((w, i) => (
            <Fragment key={`${w}-${i}`}>
              <span className="albany-word inline-block">{w}</span>
              {i < words.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </p>

        <div className="relative mt-6 max-w-md">
          <Flag id="q-albany-stat" place="tl" />
        </div>

        {/* ---------------- hard cut ---------------- */}
        <div className="albany-cut mt-20 flex flex-col items-start gap-8 sm:mt-28 lg:flex-row lg:items-center lg:gap-14">
          <XGlyph
            variant="stroke"
            className="albany-x h-[26vmin] w-auto shrink-0 text-red lg:h-[30vmin]"
          />
          <div className="relative">
            <p
              className="albany-kicker max-w-[20ch] font-black uppercase leading-[0.95] tracking-tightest text-off"
              style={{ fontSize: 'clamp(1.5rem, 4.4vw, 3.4rem)' }}
            >
              {albany.kicker}
            </p>
            <Flag id="q-albany-kicker" place="br" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Albany;
