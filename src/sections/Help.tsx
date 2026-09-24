import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { help } from '../content/copy';
import { WISHLIST_IMG } from '../content/images';
import { Img, MonoLabel } from '../components/ui';
import { LogoMark } from '../components/svg/LogoMark';
import { XPattern } from '../components/XPattern';
import { Flag } from '../components/Flag';
import { hasFinePointer, useReducedMotion } from '../lib/motion';

/**
 * HOW YOU CAN HELP
 * YOU + ___ = X. The blank fills in as you hover or tap each option. Big red
 * buttons with a magnetic pull on desktop (max 8px).
 */
export function Help() {
  const [active, setActive] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const blankRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  /* the blank swaps with a little stamp */
  useEffect(() => {
    const el = blankRef.current;
    if (!el || reduced) return;
    gsap.fromTo(
      el,
      { yPercent: 40, opacity: 0, scale: 0.9 },
      { yPercent: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)', overwrite: true },
    );
  }, [active, reduced]);

  /* magnetic hover, desktop only, max 8px */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || !hasFinePointer()) return;

    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(gsap.utils.clamp(-8, 8, dx * 0.18));
        yTo(gsap.utils.clamp(-8, 8, dy * 0.18));
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    });
    return () => cleanups.forEach((c) => c());
  }, [reduced]);

  const activeOption = help.options.find((o) => o.id === active);

  return (
    <section
      ref={rootRef}
      id="help"
      className="relative overflow-hidden bg-[#141414] py-16 sm:py-20 lg:py-28"
      aria-labelledby="help-heading"
    >
      <XPattern opacity={0.04} size={160} />

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
          <span
            ref={blankRef}
            className="inline-block min-w-[6ch] border-b-[3px] border-red text-red"
            aria-live="polite"
          >
            {activeOption ? activeOption.word : help.equationBlankDefault}
          </span>
          <span className="text-grey">{help.equationEquals}</span>
          <span className="inline-block h-[1.1em] w-[1.1em] text-off">
            <LogoMark parts={['x']} xVariant="solid" fit="x" className="h-full w-full" />
          </span>
          <span className="relative ml-2">
            <Flag id="q-help-equation" place="tr" />
          </span>
        </div>

        {/* options */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {help.options.map((o, i) => (
            <div
              key={o.id}
              className="flex flex-col border border-white/10 bg-ink/60 p-5 sm:p-6"
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

              <p className="mt-3 flex-1 text-[0.95rem] leading-[1.5] text-grey">{o.body}</p>

              {o.id === 'supplies' ? (
                <Img
                  image={WISHLIST_IMG}
                  className="mt-5 aspect-[4/3] w-[58%] border border-white/10"
                  imgClassName="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 20vw, 45vw"
                />
              ) : null}

              <div className="mt-6">
                <span data-magnetic className="inline-block will-change-transform">
                  <a
                    href={o.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerDown={() => setActive(o.id)}
                    className="inline-flex items-center justify-center border-2 border-red bg-red px-6 py-3.5 font-black uppercase tracking-tightest text-white transition-colors duration-200 hover:border-deepred hover:bg-deepred sm:px-7"
                    style={{ fontSize: 'clamp(0.78rem, 1.1vw, 0.95rem)' }}
                  >
                    {o.title}
                  </a>
                </span>
              </div>

              <MonoLabel className="mt-4 text-grey/75">{o.note}</MonoLabel>

              {o.id === 'give' ? (
                <span className="relative mt-3 block h-6">
                  <Flag id="q-donate-paypal" place="bl" />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Help;
