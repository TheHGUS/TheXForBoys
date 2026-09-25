import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { drawOn } from '../lib/draw';
import { LogoLockupSplit, sealLogo } from '../components/LogoImage';
import { RoughXStrokes } from '../components/svg/Marker';
import { XPattern } from '../components/XPattern';
import { lockScroll, unlockScroll } from '../lib/scroll';

/**
 * THE INTRO (first visit only, ~2.1s, skippable)
 *
 * Black screen. Two rough marker strokes draw the X. The strokes mask-wipe
 * into the real logo PNG, and the fist region of that same PNG pops with a
 * short overshoot — the fist layer is the identical image clipped to the fist,
 * so nothing about the mark is ever redrawn by hand.
 *
 * Then the whole lockup flies into the nav logo position (FLIP) and the hero
 * is revealed underneath.
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
      const lockup = root.querySelector('.intro-lockup');
      const baseWrap = root.querySelector('.logo-base-wrap');
      const fist = root.querySelector('.logo-fist-wrap');
      const bg = root.querySelectorAll('.intro-bg');
      const tag = root.querySelector('.intro-tag');

      // The PNG starts hidden behind a clip-path that opens from the centre.
      // The base image keeps its own fist cut-out underneath, so wiping the
      // wrapper never reveals the fist early.
      gsap.set(baseWrap, { clipPath: 'inset(50% 50% 50% 50%)' });
      gsap.set(lockup, { opacity: 0 });
      gsap.set(fist, { scale: 0.85, opacity: 0 });
      gsap.set(tag, { opacity: 0, y: 10 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. two rough marker strokes draw an X
      drawOn(tl, strokeA, { at: 0, duration: 0.34, ease: 'power1.inOut' });
      drawOn(tl, strokeB, { at: 0.2, duration: 0.34, ease: 'power1.inOut' });

      /*
       * 2. the strokes mask-wipe into the real logo.
       * The PNG is revealed through an inset clip that opens from the middle
       * outwards, so the hand-drawn X is replaced by the printed one rather
       * than cross-fading into it.
       */
      tl.set(lockup, { opacity: 1 }, 0.56);
      tl.to(baseWrap, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' }, 0.56);
      tl.to(strokesWrap, { opacity: 0, duration: 0.24, ease: 'power2.in' }, 0.62);

      // 3. the fist region pops, with a short overshoot, timed to land as the
      //    wipe reaches the top-right corner — so the arm is never seen
      //    without its fist for more than a couple of frames
      tl.to(fist, { opacity: 1, duration: 0.1, ease: 'none' }, 0.8);
      tl.to(fist, { scale: 1, duration: 0.42, ease: 'back.out(2)' }, 0.8);
      sealLogo(tl, root, 1.24);
      tl.to(tag, { opacity: 1, y: 0, duration: 0.3 }, 1.12);

      // 4. the hero starts revealing while the mark flies home
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
          gsap.set(lockup, { opacity: 1 });
          gsap.set(baseWrap, { clipPath: 'inset(0% 0% 0% 0%)' });
          gsap.set(fist, { opacity: 1, scale: 1 });
          const sealed = gsap.timeline();
          sealLogo(sealed, root, 0);
          gsap.set(tag, { opacity: 0 });
          runFlip(0.34);
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
        style={{ width: 'min(46vmin, 300px)', aspectRatio: '365 / 418' }}
      >
        <RoughXStrokes
          className="intro-strokes absolute inset-0 h-full w-full text-red"
          weight={7}
        />
        <LogoLockupSplit
          className="intro-lockup absolute inset-0 h-full w-full"
          label="The X for Boys"
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
