import type Lenis from 'lenis';

/**
 * One place to control scrolling. Lenis registers itself here when it spins
 * up (touch devices and reduced-motion users never get a Lenis instance, so
 * plain overflow locking is enough for them).
 */

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

export function getLenis(): Lenis | null {
  return lenis;
}

let locks = 0;

export function lockScroll(): void {
  locks += 1;
  if (locks === 1) {
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
  }
}

export function unlockScroll(): void {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    lenis?.start();
    document.documentElement.style.overflow = '';
  }
}

/** Smooth-scroll to an element (or fall back to a native jump). */
export function scrollToId(id: string): void {
  const el = document.querySelector(id);
  if (!el) return;
  const l = getLenis();
  // scroll-margin-top (index.css) keeps native jumps below the fixed nav;
  // Lenis needs the same offset passed explicitly
  if (l) l.scrollTo(el as HTMLElement, { offset: -68 });
  else (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
}
