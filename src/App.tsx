import { useCallback, useRef, useState } from 'react';
import { QuestionFlagProvider } from './components/Flag';
import { Grain } from './components/Grain';
import { Nav } from './sections/Nav';
import { Intro } from './sections/Intro';
import { Hero } from './sections/Hero';
import { Equation } from './sections/Equation';
import { Programs } from './sections/Programs';
import { Albany } from './sections/Albany';
import { Girls } from './sections/Girls';
import { ClubPhotos } from './sections/ClubPhotos';
import { Help } from './sections/Help';
import { Connect } from './sections/Connect';
import { Footer } from './sections/Footer';
import { useReducedMotion } from './lib/motion';
import { useScrollTriggerRefresh, useSmoothScroll } from './hooks/useSmoothScroll';
import { prefersReducedMotion } from './lib/motion';

const INTRO_KEY = 'txfb:intro-seen';

type Phase = 'intro' | 'reveal' | 'done';

/** First visit only (per browser tab session), and never for reduced motion. */
function initialPhase(): Phase {
  if (prefersReducedMotion()) return 'done';
  try {
    if (sessionStorage.getItem(INTRO_KEY) === '1') return 'done';
  } catch {
    /* private mode — just play it */
  }
  return 'intro';
}

export default function App() {
  const reduced = useReducedMotion();
  const logoRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>(initialPhase);

  useSmoothScroll(true);
  useScrollTriggerRefresh();

  const onReveal = useCallback(() => {
    setPhase((p) => (p === 'intro' ? 'reveal' : p));
  }, []);

  const onFinish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* ignore */
    }
    setPhase('done');
  }, []);

  return (
    <QuestionFlagProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border-2 focus:border-red focus:bg-ink focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:text-off"
      >
        Skip to main content
      </a>

      <Nav logoRef={logoRef} />

      <main id="main">
        <Hero ready={phase !== 'intro'} />
        <Equation />
        <Programs />
        <Albany />
        <Girls />
        <ClubPhotos />
        <Help />
        <Connect />
      </main>

      <Footer />
      <Grain />

      {phase !== 'done' && !reduced ? (
        <Intro targetRef={logoRef} onReveal={onReveal} onFinish={onFinish} />
      ) : null}
    </QuestionFlagProvider>
  );
}
