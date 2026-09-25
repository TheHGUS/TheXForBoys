import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { drawOn, prepStrokes } from '../lib/draw';
import { help } from '../content/copy';
import { MonoLabel } from '../components/ui';
import { LogoX } from '../components/LogoImage';
import { MarkerScrawl } from '../components/svg/Marker';
import { ShipBox as ShipBoxArt } from '../components/svg/Illustrations';
import { Flag } from '../components/Flag';
import { hasFinePointer, useReducedMotion } from '../lib/motion';

/**
 * HOW YOU CAN HELP
 * YOU + ___ = X. The blank fills in with the hovered or tapped option's word,
 * in the same marker-then-type language as the Equation section: the scrawl
 * draws, then the word resolves out of it.
 *
 * On mobile the first option is pre-filled so the line is never empty.
 */

export function Help() {
  const [active, setActive] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const blankRef = useRef<HTMLSpanElement>(null);
  const scrawlRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  /*
   * Mobile has no hover, so the blank would sit empty until someone taps.
   * Pre-fill it with the first option and let taps change it from there.
   */
  useEffect(() => {
    if (hasFinePointer()) return;
    setActive(help.options[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeOption = help.options.find((o) => o.id === active);
  const filled = activeOption?.word ?? '';

  /* the blank: marker scrawl draws, then the word resolves out of it */
  useEffect(() => {
    const el = blankRef.current;
    if (!el) return;

    const word = el.querySelector('.help-blank-word');
    const scrawl = scrawlRef.current;
    const paths = scrawl?.querySelectorAll('path');

    if (reduced) {
      if (scrawl) gsap.set(scrawl, { opacity: 0 });
      if (word) gsap.set(word, { opacity: 1, yPercent: 0 });
      return;
    }

    if (paths?.length) prepStrokes(paths);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      if (scrawl) {
        tl.set(scrawl, { opacity: 1 }, 0);
        drawOn(tl, paths, { at: 0, duration: 0.34, stagger: 0.1, ease: 'power1.inOut' });
        tl.to(scrawl, { opacity: 0, duration: 0.22, ease: 'power2.out' }, 0.42);
      }
      if (word) {
        tl.fromTo(
          word,
          { opacity: 0, yPercent: 45 },
          { opacity: 1, yPercent: 0, duration: 0.4, ease: 'expo.out' },
          0.38,
        );
      }
    }, el);
    return () => ctx.revert();
  }, [filled, reduced]);

  return (
    <section
      ref={rootRef}
      id="help"
      className="relative overflow-hidden py-12 sm:py-20 lg:py-28"
      style={{
        // the light warms toward red as you get closer to the buttons
        background: 'linear-gradient(180deg, #161616 0%, #1b1010 55%, #3a0606 100%)',
      }}
      aria-labelledby="help-heading"
    >

      <div className="shell relative z-10">
        <h2
          id="help-heading"
          className="display text-off"
          style={{ fontSize: 'clamp(2rem, 6.4vw, 4.6rem)' }}
        >
          {help.heading}
        </h2>

        {/* YOU + ___ = X */}
        <div
          className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-black uppercase leading-none tracking-tightest text-off"
          style={{ fontSize: 'clamp(1.4rem, 4.2vw, 3rem)' }}
        >
          <span>{help.equationPrefix}</span>
          <span className="text-red">{help.equationOperator}</span>
          <span ref={blankRef} className="relative inline-block min-w-[6ch]" aria-live="polite">
            {/* the word holds the width so the line never reflows */}
            <span className="help-blank-word inline-block border-b-[3px] border-red text-red">
              {filled || help.equationBlankDefault}
            </span>
            <MarkerScrawl ref={scrawlRef} className="absolute inset-0 h-full w-full text-red" seed={7} />
          </span>
          <span className="text-grey">{help.equationEquals}</span>
          <LogoX label="X" className="inline-block h-[1.3em] w-auto" />
          <span className="relative ml-2">
            <Flag id="q-help-equation" place="tr" />
          </span>
        </div>

        {/* options — every CTA shares one style and sits on the bottom edge */}
        <div className="mt-8 grid gap-4 sm:gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {help.options.map((o, i) => (
            <div
              key={o.id}
              /* flex-col + mt-auto on the footer pins it to the bottom; the
                 footer itself is the same height in every card. */
              className="glass flex flex-col rounded-2xl p-5 sm:p-6"
              onMouseEnter={() => setActive(o.id)}
              onFocus={() => setActive(o.id)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              <MonoLabel className="text-grey">
                {String(i + 1).padStart(2, '0')} — {o.word}
              </MonoLabel>

              <h3
                className="mt-4 font-black uppercase leading-[0.95] tracking-tightest text-off"
                style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)' }}
              >
                {o.title}
              </h3>

              <p className="mt-3 text-[0.95rem] leading-[1.5] text-grey">{o.body}</p>

              {/*
                Footer: helper note ABOVE the button at a fixed two-line
                height, so all three buttons share one baseline whatever the
                note says (ROUND-03 P1 #8). The shipping box sits beside its
                own button instead of stretching the whole row.
              */}
              <div className="relative mt-auto pt-6">
                <MonoLabel className="block min-h-[3.4em] leading-[1.7] text-grey/75">{o.note}</MonoLabel>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <span className="inline-block">
                    <a
                      href={o.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onPointerDown={() => setActive(o.id)}
                      className="inline-flex items-center justify-center rounded-xl border-2 border-red bg-red px-6 py-3.5 font-black uppercase tracking-tightest text-white transition-colors duration-200 hover:border-deepred hover:bg-deepred sm:px-7 btn-gloss"
                      style={{ fontSize: 'clamp(0.78rem, 1.1vw, 0.95rem)' }}
                    >
                      {o.title}
                    </a>
                  </span>
                  {o.id === 'supplies' ? (
                    <ShipBoxArt className="h-auto w-20 shrink-0 text-off sm:w-24" />
                  ) : null}
                </div>
                {o.id === 'give' ? (
                  <span className="absolute right-0 top-0">
                    <Flag id="q-donate-paypal" place="bl" />
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Help;
