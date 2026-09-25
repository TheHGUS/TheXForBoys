import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import { QuestionFlagProvider } from './components/Flag';
import { Grain } from './components/Grain';
import { ShieldClip } from './components/Shield';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';

/*
 * Below-the-fold sections are separate chunks: the first bundle carries only
 * the nav and hero, so the hero photo can paint as soon as possible.
 */
const Equation = lazy(() => import('./sections/Equation'));
const Programs = lazy(() => import('./sections/Programs'));
const Albany = lazy(() => import('./sections/Albany'));
const Girls = lazy(() => import('./sections/Girls'));
const ClubPhotos = lazy(() => import('./sections/ClubPhotos'));
const Help = lazy(() => import('./sections/Help'));
const Connect = lazy(() => import('./sections/Connect'));
const Footer = lazy(() => import('./sections/Footer'));
import { useScrollTriggerRefresh, useSmoothScroll } from './hooks/useSmoothScroll';
import { ScrollTrigger } from './lib/gsap';

/** Everything below the hero, in page order. */
const BELOW_FOLD: Array<[string, ComponentType]> = [
  ['equation', Equation],
  ['programs', Programs],
  ['albany', Albany],
  ['girls', Girls],
  ['clubphotos', ClubPhotos],
  ['help', Help],
  ['connect', Connect],
];

/**
 * Mount the below-the-fold sections one per idle slot instead of all in the
 * first task. Each section builds its SVG art and GSAP timelines on mount;
 * doing all of them at once was one long main-thread task on a mid-range
 * phone (Lighthouse round 03). Nothing below the hero is visible yet — the
 * hero covers the first screen — and ScrollTrigger re-measures once the
 * last one lands.
 */
function useProgressiveMount(total: number): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= total) {
      ScrollTrigger.refresh();
      return;
    }
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setCount((c) => c + 1), { timeout: 120 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setCount((c) => c + 1), 16);
    return () => window.clearTimeout(id);
  }, [count, total]);
  return count;
}

export default function App() {
  const logoRef = useRef<HTMLSpanElement>(null);
  const mounted = useProgressiveMount(BELOW_FOLD.length + 1);

  useSmoothScroll(true);
  useScrollTriggerRefresh();

  return (
    <QuestionFlagProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl border-2 focus:border-red focus:bg-ink focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:text-off"
      >
        Skip to main content
      </a>

      <Nav logoRef={logoRef} />

      <main id="main">
        <Hero />
        {/*
          One Suspense boundary per section: with a shared boundary, every new
          chunk load re-hid the sections already mounted (display:none) —
          including the Equation while ScrollTrigger was measuring its pin.
        */}
        {BELOW_FOLD.slice(0, mounted).map(([key, Section]) => (
          <Suspense key={key} fallback={null}>
            <Section />
          </Suspense>
        ))}
      </main>

      {mounted > BELOW_FOLD.length ? (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      ) : null}
      <Grain />
      <ShieldClip />

    </QuestionFlagProvider>
  );
}
