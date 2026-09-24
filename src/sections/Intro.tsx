import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { drawOn } from '../lib/draw';
import { LogoMark } from '../components/svg/LogoMark';
import { RoughXStrokes } from '../components/svg/Marker';
import { XPattern } from '../components/XPattern';
import { lockScroll, unlockScroll } from '../lib/scroll';

/**
 * THE INTRO (first visit only, ~2.1s, skippable)
 *
 * Black screen. Two rough red marker strokes draw an X like someone writing on
 * a board. The strokes snap into the outlined varsity X, the shield slides up
 * behind it, the fist pops in with a short overshoot bounce — then the whole
 * mark shrinks into the nav logo position (FLIP) and the hero is revealed.
 */

export function Intro({
  targetRef,
  onReveal,
  onFinish,
}: {
  targetRef: React.RefObject<HTMLElement>;
  onReveal: () => void;
  onFinish: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const mark = markRef.current;
    if (!root || !mark) return;

    lockScroll();
    let done = false;
    let flipStarted = false;

    const finish = () => {
      if (done) return;
      done = true;
      onReveal();
      onFinish();
      unlockScroll();
    };

    const ctx = gsap.context(() => {
      const strokeA = root.querySelector('.roughx-a');
      const strokeB = root.querySelector('.roughx-b');
      const strokesWrap = root.querySelector('.intro-strokes');
      const xSvg = root.querySelector('.intro-x');
      const shield = root.querySelector('.mark-shield-inner');
      const fist = root.querySelector('.intro-fist');
      const bg = root.querySelectorAll('.intro-bg');
      const tag = root.querySelector('.intro-tag');

      gsap.set(xSvg, { opacity: 0, scale: 0.86, transformOrigin: '50% 50%' });
      gsap.set(shield, { yPercent: 26, opacity: 0 });
      gsap.set(fist, { scale: 0.2, opacity: 0, transformOrigin: '50% 40%' });
      gsap.set(tag, { opacity: 0, y: 10 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. two rough marker strokes draw an X
      drawOn(tl, strokeA, { at: 0, duration: 0.34, ease: 'power1.inOut' });
      drawOn(tl, strokeB, { at: 0.2, duration: 0.34, ease: 'power1.inOut' });

      // 2. snap into the varsity X
      tl.to(strokesWrap, { opacity: 0, duration: 0.14, ease: 'power2.in' }, 0.6);
      tl.to(xSvg, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)' }, 0.58);

      // 3. shield slides up behind it
      tl.to(shield, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.76);

      // 4. fist pops in with a short overshoot bounce
      tl.to(fist, { scale: 1, opacity: 1, duration: 0.42, ease: 'back.out(2.2)' }, 0.98);
      tl.to(tag, { opacity: 1, y: 0, duration: 0.3 }, 1.12);

      // 5. the hero starts revealing while the mark flies home
      tl.add(() => onReveal(), 1.34);
      tl.add(() => runFlip(0.62), 1.44);

      function runFlip(duration: number) {
        if (flipStarted) return;
        flipStarted = true;
        const markEl = markRef.current;
        const rootEl = rootRef.current;
        if (!markEl || !rootEl) {
          finish();
          return;
        }
        const target = targetRef.current;
        const from = markEl.getBoundingClientRect();
        const to = target?.getBoundingClientRect();

        if (!to || !to.width || !to.height) {
          gsap.to(rootEl, { autoAlpha: 0, duration: 0.3, onComplete: finish });
          return;
        }

        const scale = to.height / from.height;
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);

        gsap.to(tag, { opacity: 0, duration: 0.18 });
        gsap.to(bg, { opacity: 0, duration: duration * 0.8, delay: 0.08, ease: 'power2.inOut' });
        gsap.to(markEl, {
          x: dx,
          y: dy,
          scale,
          duration,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.to(rootEl, { autoAlpha: 0, duration: 0.16, onComplete: finish });
          },
        });
      }

      skipRef.current = () => {
        if (done) return;
        if (!flipStarted) {
          tl.pause();
          gsap.set(strokesWrap, { opacity: 0 });
          gsap.set(xSvg, { opacity: 1, scale: 1 });
          gsap.set(shield, { yPercent: 0, opacity: 1 });
          gsap.set(fist, { scale: 1, opacity: 1 });
          gsap.set(tag, { opacity: 0 });
          runFlip(0.34);
        } else {
          gsap.globalTimeline.timeScale(1);
        }
      };
    }, root);

    const onSkip = () => skipRef.current();
    root.addEventListener('pointerdown', onSkip);
    root.addEventListener('wheel', onSkip, { passive: true });
    root.addEventListener('touchstart', onSkip, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onSkip();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      root.removeEventListener('pointerdown', onSkip);
      root.removeEventListener('wheel', onSkip);
      root.removeEventListener('touchstart', onSkip);
      window.removeEventListener('keydown', onKey);
      ctx.revert();
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSkipClick = useCallback(() => skipRef.current(), []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="The X for Boys"
    >
      <div className="intro-bg absolute inset-0 bg-ink" />
      <XPattern className="intro-bg" opacity={0.04} size={120} drift={false} />

      <div
        ref={markRef}
        className="relative"
        style={{ width: 'min(46vmin, 300px)', aspectRatio: '132 / 158' }}
      >
        <RoughXStrokes
          className="intro-strokes absolute inset-0 h-full w-full text-red"
          weight={7}
        />
        <LogoMark
          parts={['shield', 'x', 'fist']}
          xVariant="solid"
          fit="mark"
          className="absolute inset-0 h-full w-full text-off"
          partClassName={{ x: 'intro-x', fist: 'intro-fist' }}
        />
      </div>

      <button
        type="button"
        onClick={onSkipClick}
        className="intro-tag absolute bottom-[8vh] left-1/2 -translate-x-1/2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-grey"
      >
        Skip intro
      </button>
    </div>
  );
}

export default Intro;
