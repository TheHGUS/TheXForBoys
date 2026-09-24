import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { LogoImage } from '../components/LogoImage';
import { links, nav, site } from '../content/copy';
import { XPattern } from '../components/XPattern';
import { lockScroll, unlockScroll } from '../lib/scroll';
import { Flag } from '../components/Flag';

/**
 * NAV
 * Transparent over the hero, solid ink at 90% once you scroll. Scroll progress
 * is a 2px red line along the bottom edge of the nav — round 02 removed the
 * second X mark, which read as a glitch next to the lockup.
 */

export function Nav({ logoRef }: { logoRef: React.RefObject<HTMLElement> }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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
      const el = progressRef.current;
      // scaleX on a full-width bar: cheaper than rewriting clip-path, and it
      // composites on the GPU.
      if (el) el.style.transform = `scaleX(${p.toFixed(4)})`;
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
    const ctx = gsap.context(() => {
      const items = menuRef.current?.querySelectorAll('[data-menu-item]');
      if (items?.length) {
        gsap.fromTo(
          items,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: 'expo.out', delay: 0.05 },
        );
      }
    }, menuRef);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      ctx.revert();
      unlockScroll();
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          solid ? 'border-white/10 bg-ink/90' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-shell items-center justify-between gap-4 px-5 sm:px-8 lg:px-14">
          {/* lockup — the real logo PNG, never a redraw */}
          <a href={links.home} className="flex items-center" aria-label={`${site.name} — home`}>
            <span ref={logoRef as React.RefObject<HTMLSpanElement>} className="block">
              <LogoImage priority label="" className="h-8 w-auto sm:h-10" />
            </span>
          </a>

          {/* desktop links */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-[1.35vw]">
              {nav.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="relative py-2 font-bold uppercase tracking-tightest text-off/85 transition-colors duration-200 hover:text-red"
                    style={{ fontSize: '0.72rem', letterSpacing: '-0.02em' }}
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
              className="border-2 border-red bg-red px-4 py-2.5 font-black uppercase tracking-tightest text-white transition-colors duration-200 hover:border-deepred hover:bg-deepred sm:px-6"
              style={{ fontSize: '0.72rem' }}
            >
              {nav.cta}
            </a>
            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] border-2 border-off/40 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <span className="block h-[2px] w-4 bg-off" />
              <span className="block h-[2px] w-4 bg-off" />
            </button>
          </div>
        </div>

        {/* scroll progress: a 2px red line along the bottom edge */}
        <span
          className="absolute inset-x-0 bottom-0 block h-[2px] origin-left bg-red"
          aria-hidden="true"
        >
          <span ref={progressRef} className="block h-full w-full origin-left scale-x-0 bg-red" />
        </span>
      </header>

      {/* ---------------- mobile menu ---------------- */}
      {open ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <XPattern opacity={0.05} size={110} />
          <div className="relative z-10 flex h-[68px] items-center justify-between px-5">
            <LogoImage label="" className="h-8 w-auto" />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center border-2 border-off/40"
            >
              <span className="sr-only">Close menu</span>
              <span className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 block h-[2px] w-full rotate-45 bg-off" />
                <span className="absolute left-0 top-1/2 block h-[2px] w-full -rotate-45 bg-off" />
              </span>
            </button>
          </div>

          <nav aria-label="Mobile" className="relative z-10 flex-1 overflow-y-auto px-5 pb-10 pt-4">
            <ul>
              {nav.links.map((l) => (
                <li key={l.label} className="overflow-hidden border-b border-white/10">
                  <span data-menu-item className="block">
                    <a
                      href={l.href}
                      className="block py-4 font-black uppercase leading-[0.95] tracking-tightest text-off transition-colors hover:text-red"
                      style={{ fontSize: 'clamp(1.9rem, 11vw, 2.75rem)' }}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </a>
                  </span>
                </li>
              ))}
            </ul>
            <div data-menu-item className="mt-8">
              <a
                href={nav.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-2 border-red bg-red px-6 py-4 text-center font-black uppercase tracking-tightest text-white"
              >
                {nav.cta}
              </a>
            </div>
            <div className="relative mt-8">
              <Flag id="q-socials" place="tl" />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

export default Nav;
