import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { hasFinePointer, prefersReducedMotion } from '../lib/motion';
import { setLenis } from '../lib/scroll';

/**
 * Lenis smooth scroll, wired into the GSAP ticker so ScrollTrigger stays in
 * sync. Disabled on touch devices and for reduced-motion users — they get
 * native scrolling.
 */
export function useSmoothScroll(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      autoRaf: false,
    });

    setLenis(lenis);
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links should ride the smooth scroller.
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -8 });
    };
    document.addEventListener('click', onAnchor);

    return () => {
      document.removeEventListener('click', onAnchor);
      gsap.ticker.remove(raf);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);
}

/** Recalculate ScrollTriggers once fonts + images have settled. */
export function useScrollTriggerRefresh(): void {
  useEffect(() => {
    // One refresh once fonts AND load have both settled (each refresh
    // re-measures every trigger on the page — three of them on a phone was
    // a measurable chunk of main-thread time).
    let t = 0;
    const refresh = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const loaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true }));
    void Promise.all([loaded, document.fonts?.ready ?? Promise.resolve()]).then(refresh);
    return () => window.clearTimeout(t);
  }, []);
}
