import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { connect } from '../content/copy';
import { MarkerCheck } from '../components/svg/Marker';
import { Flag } from '../components/Flag';
import { useReducedMotion } from '../lib/motion';

/**
 * CONNECT WITH US
 * A compact, light band: heading and line on the left, the sign-up on the
 * right. The social links live in the footer. Front-end only for now:
 * submitting draws a red check.
 */
export function Connect() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const stampRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!sent || reduced) return;
    const el = stampRef.current;
    if (!el) return;
    const path = el.querySelector('path');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      if (path) {
        const len = (path as SVGGeometryElement).getTotalLength?.() ?? 0;
        if (len) {
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(path, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 0);
        }
      }
    }, el);
    return () => ctx.revert();
  }, [sent, reduced]);

  return (
    <section
      ref={rootRef}
      id="connect"
      className="relative bg-off py-12 text-ink sm:py-14"
      aria-labelledby="connect-heading"
    >
      <div className="shell grid items-center gap-6 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div>
          <h2
            id="connect-heading"
            className="display text-ink"
            style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.2rem)' }}
          >
            {connect.heading}
          </h2>
          <p className="mt-3 max-w-[46ch] font-medium text-ink/75" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)' }}>
            {connect.sub}
          </p>
        </div>

        <div>
          <form
            className="flex w-full flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setSent(true);
            }}
            noValidate
          >
            <label className="flex-1">
              <span className="sr-only">{connect.emailLabel}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (sent) setSent(false);
                }}
                placeholder={connect.emailPlaceholder}
                className="h-[52px] w-full rounded-xl border-2 border-ink/20 bg-white px-4 font-mono text-[0.85rem] text-ink placeholder:text-ink/50 focus:border-red focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="h-[52px] shrink-0 rounded-xl border-2 border-red bg-red px-8 font-black uppercase tracking-tightest text-white transition-colors duration-200 hover:border-deepred hover:bg-deepred btn-gloss"
              style={{ fontSize: '0.85rem' }}
            >
              {connect.submit}
            </button>
          </form>

          <div className="relative mt-3 flex min-h-[36px] items-center gap-3">
            {sent ? (
              <>
                <span ref={stampRef} className="block h-8 w-9 text-red">
                  <MarkerCheck className="h-full w-full" weight={6} />
                </span>
                <p className="font-bold uppercase tracking-tightest text-ink" style={{ fontSize: '0.9rem' }}>
                  {connect.success}
                </p>
              </>
            ) : null}
            <span className="absolute left-[7rem] top-0 block">
              <Flag id="q-email-signup" place="tl" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Connect;
