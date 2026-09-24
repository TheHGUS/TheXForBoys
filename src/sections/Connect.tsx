import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { connect } from '../content/copy';
import { MonoLabel } from '../components/ui';
import { SocialIcon } from '../components/svg/Social';
import { MarkerCheck } from '../components/svg/Marker';
import { XPattern } from '../components/XPattern';
import { Flag } from '../components/Flag';
import { useReducedMotion } from '../lib/motion';

/**
 * CONNECT WITH US
 * Front-end only for now: submitting stamps a red check onto the form.
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
      tl.fromTo(
        el,
        { scale: 2.6, rotate: -22, opacity: 0 },
        { scale: 1, rotate: -8, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' },
        0,
      );
      if (path) {
        const len = (path as SVGGeometryElement).getTotalLength?.() ?? 0;
        if (len) {
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(path, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 0.12);
        }
      }
    }, el);
    return () => ctx.revert();
  }, [sent, reduced]);

  return (
    <section
      ref={rootRef}
      id="connect"
      className="relative overflow-hidden border-t border-white/10 bg-ink py-12 sm:py-14 lg:py-16"
      aria-labelledby="connect-heading"
    >
      <XPattern opacity={0.04} size={160} />

      <div className="shell relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* ---------------- sign up ---------------- */}
        <div>
          <h2
            id="connect-heading"
            className="display text-off"
            style={{ fontSize: 'clamp(2rem, 5.6vw, 3.8rem)' }}
          >
            {connect.heading}
          </h2>
          <p className="mt-4 max-w-[46ch] font-medium text-grey" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
            {connect.sub}
          </p>

          <form
            className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
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
                className="h-[52px] w-full border-2 border-off/25 bg-transparent px-4 font-mono text-[0.85rem] text-off placeholder:text-grey/75 focus:border-red focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="h-[52px] shrink-0 border-2 border-red bg-red px-8 font-black uppercase tracking-tightest text-white transition-colors duration-200 hover:border-deepred hover:bg-deepred"
              style={{ fontSize: '0.85rem' }}
            >
              {connect.submit}
            </button>
          </form>

          <div className="relative mt-5 flex min-h-[44px] items-center gap-3">
            {sent ? (
              <>
                <span ref={stampRef} className="block h-9 w-10 text-red">
                  <MarkerCheck className="h-full w-full" weight={6} />
                </span>
                <p className="font-bold uppercase tracking-tightest text-off" style={{ fontSize: '0.9rem' }}>
                  {connect.success}
                </p>
              </>
            ) : null}
            <span className="absolute left-[7rem] top-0 block">
              <Flag id="q-email-signup" place="tl" />
            </span>
          </div>
        </div>

        {/* ---------------- social ---------------- */}
        <div className="lg:pt-4">
          <p className="font-black uppercase tracking-tightest text-off" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)' }}>
            {connect.follow}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {connect.socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border border-white/12 px-4 py-3 transition-colors duration-200 hover:border-red"
                >
                  <SocialIcon id={s.id as 'instagram'} className="h-5 w-5 shrink-0 text-off transition-colors group-hover:text-red" />
                  <span className="min-w-0">
                    <span className="block truncate font-bold uppercase tracking-tightest text-off" style={{ fontSize: '0.72rem' }}>
                      {s.label}
                    </span>
                    <MonoLabel className="block truncate text-grey/75">{s.handle}</MonoLabel>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="relative mt-5">
            <Flag id="q-socials" place="tl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Connect;
