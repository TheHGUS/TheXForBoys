import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { drawOn, prepStrokes } from '../lib/draw';
import { useMediaQuery, useReducedMotion } from '../lib/motion';
import { XPattern } from '../components/XPattern';
import { Flag } from '../components/Flag';
import { LogoLockupSplit, sealLogo } from '../components/LogoImage';
import { LOGO_INTRINSIC } from '../content/images';
import { XGlyph } from '../components/svg/XGlyph';
import { Img } from '../components/ui';
import {
  BRAKE_EXPLODE,
  BlueprintGrid,
  BookSpread,
  DiscBrake,
  HighlighterSwipe,
  PaintRoller,
  StudWall,
} from '../components/svg/Illustrations';
import { MarkerScribbleLoops } from '../components/svg/Marker';
import { AUTO_1, HOME_1, READ_1 } from '../content/images';
import { equation } from '../content/copy';

/**
 * THE EQUATION — the signature moment.
 *
 * The pinned stage is split into two zones that never overlap:
 *   - the EQUATION BAND (top ~30%): the terms, always legible.
 *   - the ILLUSTRATION STAGE (below): a fixed frame holding the photograph
 *     at 55% brightness with white line art drawn over the top.
 *
 * A term that hasn't arrived yet is a faint grey outlined `[ ? ]` the exact
 * width of its word. A real marker scrawl (2–3 uneven looping strokes) draws
 * over it, then the word resolves out of the scrawl. At the end the "= X"
 * glyph physically travels to centre and becomes the real logo — one object,
 * no duplicate left behind in the row.
 */

const PHOTOS = [AUTO_1, HOME_1, READ_1] as const;

/**
 * How much of the logo lockup's height its X occupies, measured off the
 * trimmed PNG (the X runs from ~10% to ~88% of the artwork's height). Used to
 * land the travelling glyph on the same size as the X inside the real logo.
 */
const LOGO_X_RATIO = 0.78;

/** Scroll distance per second of master-timeline time (desktop pin). */
const PX_PER_SECOND = 330;

/**
 * How long each illustration takes to finish drawing, measured from the
 * build's start (the last tween in each build function below ends here).
 * The photograph's wipe is given exactly this long, so it reaches full frame
 * on the same beat the line art completes (ROUND-03 P0 #3).
 */
const BUILD_LENGTH = [2.05, 3.1, 2.15] as const;

/* -------------------------------------------------------------------------- */
/*  Per-term build animations. Each is added to the parent timeline.            */
/* -------------------------------------------------------------------------- */

/** (a) AUTOMOTIVE — the exploded disc brake slides together along one axis. */
function automotiveBuild(tl: gsap.core.Timeline, root: HTMLElement, at: number): void {
  const rotor = root.querySelector('.brake-rotor');
  const caliper = root.querySelector('.brake-caliper');
  const padA = root.querySelector('.brake-pad-a');
  const padB = root.querySelector('.brake-pad-b');
  const holes = root.querySelectorAll('.brake-hole');
  const nuts = root.querySelectorAll('.brake-nut');
  const axis = root.querySelector('.brake-axis');
  if (!rotor || !caliper || !padA || !padB) return;

  // the axis the whole assembly is measured against, drawn first
  if (axis) drawOn(tl, axis, { at, duration: 0.3, ease: 'none' });

  // every piece starts spread along the axis and slides home
  tl.fromTo(rotor, { x: 0, scale: 0.9 }, { x: 0, scale: 1, duration: 0.7, ease: 'power3.out' }, at + 0.1);
  tl.fromTo(
    caliper,
    { x: BRAKE_EXPLODE.caliper },
    { x: 0, duration: 1.05, ease: 'expo.out' },
    at + 0.18,
  );
  tl.fromTo(padA, { x: BRAKE_EXPLODE.padA }, { x: 0, duration: 1, ease: 'expo.out' }, at + 0.3);
  tl.fromTo(padB, { x: BRAKE_EXPLODE.padB }, { x: 0, duration: 1, ease: 'expo.out' }, at + 0.4);
  if (holes.length) tl.fromTo(holes, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.04 }, at + 0.75);

  // lug nuts spin in last, one at a time, tightening as they land
  tl.fromTo(
    nuts,
    { x: BRAKE_EXPLODE.nutX, scale: 0.5, rotate: -260, opacity: 0 },
    {
      x: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.13,
      ease: 'back.out(1.7)',
    },
    at + 0.9,
  );
}

/** (b) HOME IMPROVEMENT — framing goes up in outline, then the roller sweeps. */
function homeBuild(tl: gsap.core.Timeline, root: HTMLElement, at: number): void {
  const grid = root.querySelectorAll('.bp-line');
  const plates = root.querySelectorAll('.wall-plate');
  const studs = root.querySelectorAll('.wall-stud');
  const headers = root.querySelectorAll('.wall-header');
  const brace = root.querySelector('.wall-brace');
  const roller = root.querySelector('.roller');
  if (!grid.length) return;

  // blueprint grid draws in
  drawOn(tl, grid, { at, duration: 0.22, stagger: 0.012, ease: 'none' });
  // plates, then studs, then the header over the opening — all outlined
  drawOn(tl, plates, { at: at + 0.55, duration: 0.55, stagger: 0.12, ease: 'power2.out' });
  drawOn(tl, studs, { at: at + 0.95, duration: 0.34, stagger: 0.11, ease: 'power2.out' });
  if (headers.length) drawOn(tl, headers, { at: at + 1.5, duration: 0.5, stagger: 0.14, ease: 'power2.out' });
  if (brace) drawOn(tl, brace, { at: at + 1.75, duration: 0.5, ease: 'power2.out' });

  // the roller sweeps left to right
  if (roller) {
    tl.fromTo(roller, { xPercent: -105 }, { xPercent: 526, duration: 1.15, ease: 'none' }, at + 1.95);
  }
}

/** (c) READING LITERACY — the book opens, the highlighter marks two words. */
function readingBuild(tl: gsap.core.Timeline, root: HTMLElement, at: number): void {
  const cover = root.querySelector('.book-cover');
  const edge = root.querySelector('.book-edge');
  const lines = root.querySelectorAll('.book-line');
  const swipes = root.querySelectorAll('.hl');
  if (!cover) return;

  drawOn(tl, cover, { at, duration: 1.1, ease: 'power2.inOut' });
  if (edge) drawOn(tl, edge, { at: at + 0.5, duration: 0.5, ease: 'power2.out' });
  tl.fromTo(lines, { opacity: 0 }, { opacity: 0.55, duration: 0.3, stagger: 0.04 }, at + 0.6);
  drawOn(tl, swipes, { at: at + 1.15, duration: 0.45, stagger: 0.55, ease: 'power1.inOut' });
}

/** Wipe the photograph in behind the line art, in sync with the drawing. */
function photoReveal(tl: gsap.core.Timeline, root: HTMLElement, at: number, duration: number): void {
  const photo = root.querySelector('.photo');
  if (!photo) return;
  tl.fromTo(
    photo,
    { clipPath: 'inset(0% 100% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration, ease: 'power2.inOut' },
    at,
  );
}

/** Build one term's illustration and wipe its photo in over the same span. */
function buildStage(tl: gsap.core.Timeline, stage: HTMLElement, term: 0 | 1 | 2, at: number): number {
  if (term === 0) automotiveBuild(tl, stage, at);
  else if (term === 1) homeBuild(tl, stage, at);
  else readingBuild(tl, stage, at);
  photoReveal(tl, stage, at, BUILD_LENGTH[term]);
  return at + BUILD_LENGTH[term];
}

/* -------------------------------------------------------------------------- */
/*  One term: [ ? ] -> scrawl -> type -> build -> hold -> out                  */
/* -------------------------------------------------------------------------- */

type TermTimes = { settled: number; next: number };

/**
 * Stages never overlap: each one is fully built, held, and fully faded out
 * (autoAlpha 0) before the next term's scrawl starts. `settled` is the
 * moment its illustration and photo are complete — the still frame the
 * studio reviews.
 */
function termTimeline(
  tl: gsap.core.Timeline,
  row: HTMLElement,
  stages: HTMLElement | null,
  term: 0 | 1 | 2,
  at: number,
): TermTimes {
  const slot = row.querySelector<HTMLElement>(`[data-slot="${term}"]`);
  const word = row.querySelector<HTMLElement>(`[data-word="${term}"]`);
  const ph = row.querySelector<HTMLElement>(`[data-ph="${term}"]`);
  const scribble = row.querySelector<SVGSVGElement>(`[data-scribble="${term}"]`);
  const stage = stages?.querySelector<HTMLElement>(`[data-stage="${term}"]`) ?? null;
  if (!slot || !word || !scribble) return { settled: at, next: at };

  const paths = scribble.querySelectorAll('path');
  prepStrokes(paths);

  // 1. the scrawl draws itself over the placeholder
  drawOn(tl, paths, { at, duration: 0.65, stagger: 0.18, ease: 'power1.inOut' });

  // 2. resolves into clean type
  tl.to(ph, { opacity: 0, duration: 0.28, ease: 'power2.out' }, at + 0.6);
  tl.to(scribble, { opacity: 0, duration: 0.3, ease: 'power2.out' }, at + 0.72);
  tl.fromTo(
    word,
    { opacity: 0, yPercent: 55 },
    { opacity: 1, yPercent: 0, duration: 0.6, ease: 'expo.out' },
    at + 0.66,
  );

  if (!stage) return { settled: at + 1.3, next: at + 1.3 };

  // 3. stage in, illustration builds, photograph wipes in over the same span
  const inAt = at + 0.35;
  tl.fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power2.out', immediateRender: false }, inAt);
  const settled = buildStage(tl, stage, term, inAt + 0.1);

  // 4. hold the finished frame, then fully out before anything else enters
  const outAt = settled + 0.9;
  tl.to(stage, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, outAt);
  return { settled, next: outAt + 0.45 };
}

/* -------------------------------------------------------------------------- */

export function Equation() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  // Width alone decides the layout: the pinned stage is a desktop-width
  // composition, whatever the pointer. (Gating on `pointer: fine` left touch
  // laptops with the desktop layout but the mobile timeline.)
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = sectionRef.current;
    const pin = pinRef.current;
    const row = rowRef.current;
    const stages = stagesRef.current;
    const finale = finaleRef.current;
    if (!root || !pin || !row || !finale) return;

    const ctx = gsap.context(() => {
      const slots = gsap.utils.toArray<HTMLElement>('[data-slot]', row);
      const ops = gsap.utils.toArray<HTMLElement>('[data-op]', row);
      const equals = root.querySelector('[data-equals]');
      const result = root.querySelector<HTMLElement>('[data-result]');
      const allStages = gsap.utils.toArray<HTMLElement>('[data-stage]', root);
      const scribbles = gsap.utils.toArray<HTMLElement>('[data-scribble]', root);
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', root);
      const phs = gsap.utils.toArray<HTMLElement>('[data-ph]', root);
      const finaleMark = finale.querySelector<HTMLElement>('.finale-mark');
      const caption = finale.querySelector('.finale-caption');

      /* ---------- reduced motion: finished state, no pinning ---------- */
      if (reduced) {
        gsap.set(scribbles, { opacity: 0 });
        gsap.set(phs, { opacity: 0 });
        gsap.set(words, { opacity: 1 });
        gsap.set(ops, { opacity: 1 });
        if (equals) gsap.set(equals, { opacity: 1 });
        // desktop hides the stages (the finale follows the row in flow);
        // mobile shows each finished illustration under its term
        gsap.set(allStages, { autoAlpha: isDesktop ? 0 : 1 });
        gsap.set(finale, { autoAlpha: 1 });
        return;
      }

      if (!isDesktop) {
        /* ---------------- MOBILE: play each block when it arrives ---------------- */
        gsap.set(scribbles, { opacity: 1 });
        gsap.set(words, { opacity: 0 });
        gsap.set(finale, { autoAlpha: 1 });

        [0, 1, 2].forEach((i) => {
          const block = root.querySelector<HTMLElement>(`[data-block="${i}"]`);
          if (!block) return;
          const tl = gsap.timeline({ paused: true });
          termTimelineMobile(tl, block, i as 0 | 1 | 2);
          ScrollTrigger.create({
            trigger: block,
            start: 'top 72%',
            once: true,
            onEnter: () => tl.play(0),
          });
        });

        const fTl = gsap.timeline({ paused: true });
        mobileFinale(fTl, finale);
        ScrollTrigger.create({
          trigger: finale,
          start: 'top 70%',
          once: true,
          onEnter: () => fTl.play(0),
        });
        return;
      }

      /* ---------------- DESKTOP: one pinned, scrubbed master timeline ---------------- */
      gsap.set(scribbles, { opacity: 1 });
      gsap.set(words, { opacity: 0 });
      gsap.set(phs, { opacity: 1 });
      gsap.set(allStages, { autoAlpha: 0 });
      gsap.set(finale, { autoAlpha: 0 });

      const master = gsap.timeline({ defaults: { ease: 'power3.out' } });
      /** Named still frames, in timeline seconds — published for scripts/screens.mjs. */
      const marks: Record<string, number> = {};

      const a = termTimeline(master, row, stages, 0, 0.15);
      marks.auto = a.settled + 0.3;
      master.to(ops[0], { opacity: 1, duration: 0.3 }, a.next - 0.3);
      const h = termTimeline(master, row, stages, 1, a.next);
      marks.home = h.settled + 0.3;
      master.to(ops[1], { opacity: 1, duration: 0.3 }, h.next - 0.3);
      const r = termTimeline(master, row, stages, 2, h.next);
      marks.reading = r.settled + 0.3;
      if (equals) master.to(equals, { opacity: 1, duration: 0.3 }, r.next - 0.3);

      /*
       * COLLAPSE -> the "= X" glyph travels to the logo's X and BECOMES the
       * logo. Positions are measured against the finale mark itself, with the
       * glyph's own current transform taken out, so a refresh mid-scrub can
       * never aim the move at stale coordinates.
       */
      const collapseAt = r.next + 0.25;

      // the operators and the "=" drop away; the terms fade where they stand
      master.to([...ops, equals].filter(Boolean) as Element[], { opacity: 0, duration: 0.4 }, collapseAt);
      master.to(phs, { opacity: 0, duration: 0.3 }, collapseAt);
      slots.forEach((el) => {
        master.to(el, { opacity: 0, duration: 0.5, ease: 'power2.in' }, collapseAt + 0.05);
      });

      if (result && finaleMark) {
        const measure = () => {
          const g = result.getBoundingClientRect();
          const gx = Number(gsap.getProperty(result, 'x')) || 0;
          const gy = Number(gsap.getProperty(result, 'y')) || 0;
          const gs = Number(gsap.getProperty(result, 'scale')) || 1;
          const m = finaleMark.getBoundingClientRect();
          // the logo's X is centred horizontally; vertically it spans ~10–88%
          const tx = m.left + m.width / 2;
          const ty = m.top + m.height * 0.49;
          return {
            x: tx - (g.left + g.width / 2 - gx),
            y: ty - (g.top + g.height / 2 - gy),
            scale: (m.height * LOGO_X_RATIO) / (g.height / gs || 1),
          };
        };
        master.to(
          result,
          {
            x: () => measure().x,
            y: () => measure().y,
            scale: () => measure().scale,
            duration: 0.95,
            ease: 'power3.inOut',
          },
          collapseAt + 0.15,
        );
        marks.collapse = collapseAt + 0.4;
      }

      // hand over: the real PNG mask-wipes in over the travelling glyph, then
      // the fist region pops. The glyph goes with it — nothing is left behind
      // in the equation row.
      const landAt = collapseAt + 1.05;
      master.set(finale, { autoAlpha: 1 }, landAt);
      master.fromTo(
        finale.querySelector('.logo-base-wrap') ?? finaleMark,
        { clipPath: 'inset(50% 50% 50% 50%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' },
        landAt,
      );
      master.fromTo(
        finale.querySelector('.logo-fist-wrap') ?? finaleMark,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' },
        landAt + 0.42,
      );
      sealLogo(master, finale, landAt + 0.9);
      if (result) master.to(result, { opacity: 0, duration: 0.25, ease: 'power2.in' }, landAt + 0.05);

      // 4px camera shake at the moment of impact
      master.fromTo(
        root.querySelector('.equation-shake') ?? root,
        { x: 0 },
        {
          keyframes: [
            { x: -4, duration: 0.04 },
            { x: 3, duration: 0.04 },
            { x: -2, duration: 0.04 },
            { x: 0, duration: 0.03 },
          ],
          ease: 'none',
        },
        landAt + 0.35,
      );

      // the X pattern pulses once
      const pattern = root.querySelector<SVGElement>('.xp-fill');
      if (pattern) {
        const base = Number(pattern.getAttribute('opacity') ?? 0.05);
        master.fromTo(
          pattern,
          { opacity: base },
          { opacity: base * 3.2, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' },
          landAt + 0.35,
        );
      }

      if (caption) {
        master.fromTo(
          caption,
          { opacity: 0, yPercent: 40 },
          { opacity: 1, yPercent: 0, duration: 0.5, ease: 'expo.out' },
          landAt + 0.6,
        );
      }

      // hold the finished logo on screen for a beat before the pin lets go
      marks.logo = landAt + 1.4;
      master.to({}, { duration: 1 }, landAt + 1.1);

      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${Math.round(master.duration() * PX_PER_SECOND)}`,
        pin: pin,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5,
        animation: master,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          const d = master.duration();
          const out: Record<string, number> = { end: Math.round(self.end) };
          for (const [k, v] of Object.entries(marks)) {
            out[k] = Math.round(self.start + (v / d) * (self.end - self.start));
          }
          root.dataset.states = JSON.stringify(out);
        },
      });
    }, root);

    return () => {
      delete root.dataset.states;
      ctx.revert();
    };
  }, [isDesktop, reduced]);

  /** Desktop pins the stage; reduced motion lays everything out in flow. */
  const pinned = !reduced;

  return (
    <section
      ref={sectionRef}
      id="equation"
      aria-label="Our equation: automotive repair plus home improvement plus reading literacy equals X"
      className="relative bg-ink"
    >
      <div className="absolute inset-0">
        <XPattern opacity={0.05} size={140} fillClassName="xp-fill" />
      </div>

      <div
        ref={pinRef}
        className={`equation-shake relative w-full overflow-hidden ${
          pinned ? 'lg:h-[100svh] lg:min-h-[640px]' : ''
        }`}
      >
        {/* ---------------- EQUATION BAND (top ~30%, always legible) ---------------- */}
        <div className="relative z-20 flex w-full justify-center px-5 pt-16 sm:px-8 lg:h-[30%] lg:min-h-[190px] lg:items-center lg:px-14 lg:pt-0">
          <div
            ref={rowRef}
            className="hidden w-full flex-wrap items-center justify-center gap-x-[1.2vw] gap-y-2 lg:flex"
          >
            {equation.terms.map((term, i) => (
              <div key={term.id} className="flex items-center gap-[1.2vw]">
                <TermSlot index={i} label={term.label} />
                {i < 2 ? (
                  <span
                    data-op
                    className="font-black leading-none text-red opacity-0"
                    style={{ fontSize: 'clamp(0.9rem, 1.9vw, 2rem)' }}
                    aria-hidden="true"
                  >
                    {equation.operator}
                  </span>
                ) : null}
              </div>
            ))}
            <span
              data-equals
              className="font-black leading-none text-grey opacity-0"
              style={{ fontSize: 'clamp(0.9rem, 1.9vw, 2rem)' }}
              aria-hidden="true"
            >
              {equation.equals}
            </span>
            {/* the one and only X — it travels to the logo and becomes it */}
            <span
              data-result
              className="inline-block shrink-0"
              style={{ height: 'clamp(1.4rem, 3vw, 3rem)' }}
            >
              <XGlyph variant="solid" className="block h-full w-auto text-off" />
            </span>
          </div>
        </div>

        {/* ---------------- ILLUSTRATION STAGE (below the band) ---------------- */}
        <div
          ref={stagesRef}
          className={`relative z-10 hidden lg:h-[70%] lg:min-h-[380px] ${pinned ? 'lg:block' : ''}`}
        >
          {/*
            The inner wrapper is in normal flow so it fills the *content* box —
            absolutely positioned children resolve `inset-0` against the
            padding box, which would have ignored this padding entirely.
          */}
          <div className="relative mx-auto h-full w-full max-w-[1100px] px-14 pb-12">
            <div className="relative h-full w-full">
              {([0, 1, 2] as const).map((i) => (
                <Stage key={i} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ---------------- MOBILE: stacked blocks ---------------- */}
        <div className="w-full pt-4 lg:hidden">
          {([0, 1, 2] as const).map((i) => (
            <div key={i} data-block={i} className="border-b border-white/10 px-5 py-12">
              <div className="mx-auto w-full max-w-md">
                <TermSlot index={i} label={equation.terms[i].label} block />
                {/*
                  The stage needs a real box: its photo and line art are all
                  absolutely positioned, so without an aspect ratio it
                  collapsed to 0px tall and nothing rendered (ROUND-03 P0 #2).
                */}
                <div data-stage={i} className="relative mt-8 aspect-[4/3] w-full">
                  <StageArt index={i} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- FINALE ---------------- */}
        <div
          ref={finaleRef}
          className={`equation-finale relative z-30 flex flex-col items-center px-6 pb-16 pt-12 text-center ${
            // pt = nav height, so the lockup centres in the visible frame
            pinned ? 'lg:absolute lg:inset-0 lg:justify-center lg:pb-0 lg:pt-[68px]' : 'lg:py-20'
          }`}
        >
          {/* mobile: the "= X" the travelling glyph starts from */}
          <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
            <span
              data-equals-mobile
              className="font-black leading-none text-grey"
              style={{ fontSize: 'clamp(1.2rem, 5vw, 2rem)' }}
              aria-hidden="true"
            >
              {equation.equals}
            </span>
            <span
              data-result-mobile
              className="inline-block shrink-0"
              style={{ height: 'clamp(1.6rem, 7vw, 2.8rem)' }}
            >
              <XGlyph variant="solid" className="block h-full w-auto text-off" />
            </span>
          </div>

          {/* the peak of the page: ~50vh tall on desktop, ~60vw wide on mobile */}
          <LogoLockupSplit
            className="finale-mark"
            style={{ width: 'var(--finale-w)', aspectRatio: `${LOGO_INTRINSIC.w} / ${LOGO_INTRINSIC.h}` }}
            label="The “X” for Boys"
          />
          <div className="relative">
            <p
              className="finale-caption display mt-5 text-off lg:mt-7"
              style={{ fontSize: 'clamp(1.9rem, 5.2vw, 5.4rem)' }}
            >
              {equation.caption}
            </p>
            <Flag id="q-equation-caption" place="tr" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  One term of the equation                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The word is always in the flow (so the slot is the word's width and the
 * layout never jumps); the placeholder and the scrawl are layered on top.
 */
function TermSlot({ index, label, block = false }: { index: number; label: string; block?: boolean }) {
  return (
    <span
      data-slot={index}
      className={`relative inline-block font-black uppercase leading-none tracking-tightest text-off ${
        block ? 'block' : ''
      }`}
      style={{ fontSize: block ? 'clamp(1.5rem, 7vw, 2.4rem)' : 'clamp(0.95rem, 2.1vw, 2.2rem)' }}
    >
      <span data-word={index} className="inline-block">
        {label}
      </span>
      <span
        data-ph={index}
        className="pointer-events-none absolute inset-0 flex items-center justify-center border border-dashed border-grey/35 font-mono text-grey/50"
        style={{ fontSize: '0.44em', letterSpacing: '0.1em' }}
        aria-hidden="true"
      >
        ?
      </span>
      <MarkerScribbleLoops
        data-scribble={index}
        seed={11 + index * 7}
        className="pointer-events-none absolute inset-0 h-full w-full text-red"
      />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stage = photograph + line art, one per term                                */
/* -------------------------------------------------------------------------- */

function Stage({ index }: { index: 0 | 1 | 2 }) {
  return (
    <div data-stage={index} className="absolute inset-0" style={{ visibility: 'hidden' }}>
      <StageArt index={index} />
    </div>
  );
}

function StageArt({ index }: { index: 0 | 1 | 2 }) {
  const photo = PHOTOS[index];
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* photograph, full-bleed at 55% brightness, wiped in behind the art */}
      <div className="photo absolute inset-0 will-change-[clip-path]">
        <Img
          image={photo}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover brightness-[0.55]"
          sizes="(min-width: 1024px) 1000px, 88vw"
        />
      </div>

      {index === 0 ? <DiscBrake className="absolute inset-0 h-full w-full text-off" /> : null}

      {index === 1 ? (
        <>
          <BlueprintGrid className="absolute inset-0 h-full w-full text-off/45" />
          <StudWall className="absolute inset-0 h-full w-full text-off" />
          <PaintRoller className="roller absolute bottom-[6%] left-0 h-auto w-[19%] text-red will-change-transform" />
        </>
      ) : null}

      {index === 2 ? (
        <>
          <BookSpread className="absolute inset-0 h-full w-full text-off" />
          <span
            className="absolute left-[13%] top-[40%] font-black uppercase leading-none tracking-tightest text-off"
            style={{ fontSize: 'clamp(0.7rem, 1.8vw, 1.5rem)' }}
          >
            <span className="relative z-10">comprehension</span>
            <HighlighterSwipe className="hl absolute left-[-4%] top-[-10%] h-[120%] w-[108%] text-red/45" seed={17} />
          </span>
          <span
            className="absolute left-[57%] top-[60%] font-black uppercase leading-none tracking-tightest text-off"
            style={{ fontSize: 'clamp(0.7rem, 1.8vw, 1.5rem)' }}
          >
            <span className="relative z-10">vocabulary</span>
            <HighlighterSwipe className="hl absolute left-[-4%] top-[-10%] h-[120%] w-[108%] text-red/45" seed={29} />
          </span>
        </>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile timelines                                                           */
/* -------------------------------------------------------------------------- */

/** Mobile version of the term timeline (illustration + photo, no slot moves). */
function termTimelineMobile(tl: gsap.core.Timeline, block: HTMLElement, term: 0 | 1 | 2): void {
  const scribble = block.querySelector<SVGSVGElement>('[data-scribble]');
  const word = block.querySelector('[data-word]');
  const ph = block.querySelector('[data-ph]');
  const stage = block.querySelector<HTMLElement>('[data-stage]');

  if (scribble) {
    const paths = scribble.querySelectorAll('path');
    prepStrokes(paths);
    drawOn(tl, paths, { at: 0, duration: 0.6, stagger: 0.16, ease: 'power1.inOut' });
    tl.to(scribble, { opacity: 0, duration: 0.25 }, 0.72);
  }
  if (ph) tl.to(ph, { opacity: 0, duration: 0.28 }, 0.6);
  if (word) tl.fromTo(word, { opacity: 0, yPercent: 45 }, { opacity: 1, yPercent: 0, duration: 0.5, ease: 'expo.out' }, 0.66);

  if (stage) buildStage(tl, stage, term, 0.5);
}

/**
 * Mobile finale: the same travelling-glyph-into-logo handoff, just played
 * inside the finale block instead of a pinned stage.
 */
function mobileFinale(tl: gsap.core.Timeline, finale: HTMLElement): void {
  const mark = finale.querySelector('.finale-mark');
  const caption = finale.querySelector('.finale-caption');
  const glyph = finale.querySelector('[data-result-mobile]');
  const baseWrap = finale.querySelector('.logo-base-wrap');
  const fist = finale.querySelector('.logo-fist-wrap');

  tl.set(mark, { opacity: 0 }, 0);

  if (glyph) {
    tl.to(
      glyph,
      {
        y: () => {
          const g = glyph.getBoundingClientRect();
          const m = mark?.getBoundingClientRect();
          if (!m) return 0;
          return m.top + m.height * 0.49 - (g.top + g.height / 2);
        },
        scale: () => {
          const g = glyph.getBoundingClientRect();
          const m = mark?.getBoundingClientRect();
          return m && g.height ? (m.height * LOGO_X_RATIO) / g.height : 1;
        },
        duration: 0.8,
        ease: 'power3.inOut',
      },
      0,
    );
  }

  tl.set(mark, { opacity: 1 }, 0.55);
  tl.fromTo(
    baseWrap ?? mark,
    { clipPath: 'inset(50% 50% 50% 50%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' },
    0.55,
  );
  tl.fromTo(fist ?? mark, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }, 0.97);
  sealLogo(tl, finale, 1.45);
  if (glyph) tl.to(glyph, { opacity: 0, duration: 0.22, ease: 'power2.in' }, 0.55);
  // the "=" goes with the X — nothing is left stranded above the logo
  const eq = finale.querySelector('[data-equals-mobile]');
  if (eq) tl.to(eq, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.3);
  if (caption) tl.fromTo(caption, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 1.15);
}

export default Equation;
