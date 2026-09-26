import { useEffect, useRef, useState } from 'react';
import { LogoImage } from '../components/LogoImage';
import { SocialIcon, type SocialId } from '../components/svg/Social';
import { Img } from '../components/ui';
import { connect, nav } from '../content/copy';
import { HERO_MAIN } from '../content/images';
import { lockScroll, scrollToId, unlockScroll } from '../lib/scroll';

/**
 * NAV
 * The real logo with the organisation's name beside it, their own four nav
 * labels (each pointing at its section on this page) and the Donate button.
 * Transparent over the hero; dark frosted glass once you scroll. Scroll
 * progress is a 2px red line on the bottom edge.
 *
 * The mobile menu is a full-screen sheet over one of their photos, kept
 * subtle (dimmed and blurred) so the links stay the focus.
 */

export function Nav({ logoRef }: { logoRef: React.RefObject<HTMLElement> }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* ---------------- background + scroll progress ---------------- */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY || document.documentElement.scrollTop;
      setSolid(y > 48);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------------- mobile menu ---------------- */
  useEffect(() => {
    if (!open) return;
    lockScroll();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // wait for the menu to close (which unlocks scrolling), then go
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(href)));
  };

  // "The <logo> for Boys": the full logo, at full header size, is the X
  const brand = (
    <span className="flex items-center gap-2 whitespace-nowrap font-sans text-[1.02rem] font-bold tracking-tighter text-white sm:text-[1.12rem]">
      <span>The</span>
      <span ref={logoRef as React.RefObject<HTMLSpanElement>} className="block">
        <LogoImage priority label="X" className="h-9 w-auto sm:h-10" />
      </span>
      <span>for Boys</span>
    </span>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? 'glass-ink !border-x-0 !border-t-0' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-shell items-center justify-between gap-4 px-5 sm:px-8 lg:px-14">
          {/* accessible name comes from the visible words: "The X for Boys" */}
          <a href="#top" onClick={go('#top')}>
            {brand}
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-sans text-[0.92rem] font-medium text-white/85 transition-colors duration-200 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={nav.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg bg-red px-5 py-2.5 font-sans text-[0.82rem] font-semibold text-white transition-colors duration-200 hover:bg-deepred sm:inline-block"
            >
              {nav.cta}
            </a>
            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg border border-white/30 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <span className="block h-[2px] w-4 rounded bg-white" />
              <span className="block h-[2px] w-4 rounded bg-white" />
            </button>
          </div>
        </div>

        {/* scroll progress: transparent track, red bar */}
        <span className="absolute inset-x-0 bottom-0 block h-[2px] bg-off/[0.08]" aria-hidden="true">
          <span ref={progressRef} className="block h-full w-full origin-left scale-x-0 bg-red" />
        </span>
      </header>

      {/* ---------------- mobile menu ---------------- */}
      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-ink text-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          {/* one of their photos, subtle */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Img image={HERO_MAIN} className="h-full w-full scale-105 opacity-60" imgClassName="h-full w-full object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/60 to-ink/95" />
          </div>

          <div className="relative z-10 flex h-[68px] items-center justify-between px-5">
            {brand}
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30"
            >
              <span className="sr-only">Close menu</span>
              <span className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 block h-[2px] w-full rotate-45 rounded bg-white" />
                <span className="absolute left-0 top-1/2 block h-[2px] w-full -rotate-45 rounded bg-white" />
              </span>
            </button>
          </div>

          <nav aria-label="Mobile" className="relative z-10 flex flex-1 flex-col overflow-y-auto px-5 pb-8 pt-4">
            <ul>
              {nav.links.map((l) => (
                <li key={l.label} className="border-b border-white/12">
                  <a
                    href={l.href}
                    onClick={go(l.href)}
                    className="flex items-center justify-between py-3.5 font-sans text-[1.1rem] font-semibold tracking-tighter text-white"
                  >
                    {l.label}
                    <span className="text-[0.9rem] text-white/40" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <a
                href={nav.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-red px-6 py-3 font-sans text-[0.88rem] font-semibold text-white"
              >
                {nav.cta}
              </a>
              <p className="mt-8 font-sans text-[0.82rem] font-medium text-white/70">{connect.follow}</p>
              <ul className="mt-3 flex gap-2">
                {connect.socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} — ${s.handle}`}
                      className="glass flex h-9 w-9 items-center justify-center rounded-full"
                    >
                      <SocialIcon id={s.id as SocialId} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

export default Nav;
