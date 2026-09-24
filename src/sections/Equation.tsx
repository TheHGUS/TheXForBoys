import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { drawOn, prepStrokes } from '../lib/draw';
import { useIsDesktop, useReducedMotion } from '../lib/motion';
import { XPattern } from '../components/XPattern';
import { Flag } from '../components/Flag';
import { LogoMark } from '../components/svg/LogoMark';
import { Img } from '../components/ui';
import {
  BlueprintGrid,
  BookSpread,
  DiscBrake,
  HighlighterSwipe,
  PaintRoller,
  StudWall,
} from '../components/svg/Illustrations';
import { MarkerScribble } from '../components/svg/Marker';
import { AUTO_1, HOME_1, READ_1 } from '../content/images';
import { equation } from '../content/copy';

/**
 * THE EQUATION — the signature moment.
 *
 * Desktop: the section pins and one scrubbed master timeline builds
 *   AUTOMOTIVE REPAIR + HOME IMPROVEMENT + READING LITERACY = X
 * term by term. Each term arrives as a rough red marker scribble, resolves
 * into Libre Franklin 900, plays its own little build animation, then the
 * three collapse into the centre and slam into the full logo mark.
 *
 * Mobile: no pinning. The three terms stack and each animation plays when it
 * scrolls into view, with the finale at the end.
 */

const PHOTOS = [AUTO_1, HOME_1, READ_1] as const;

/* -------------------------------------------------------------------------- */
/*  Per-term build animations. Each returns a timeline added to the parent.     */
/* -------------------------------------------------------------------------- */

function automotiveBuild(tl: gsap.core.Timeline, root: HTMLElement, at: number): void {
  const rotor = root.querySelector('.brake-rotor');
  const caliper = root.querySelector('.brake-caliper');
  const pad = root.querySelector('.brake-pad');
  const holes = root.querySelectorAll('.brake-hole');
  const nuts = root.querySelectorAll('.brake-nut');
  if (!rotor || !caliper || !pad) return;

  tl.fromTo(rotor, { xPercent: -46, yPercent: -18, rotate: -22, scale: 0.86 }, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, duration: 1.1, ease: 'expo.out' }, at);
  tl.fromTo(caliper, { xPercent: 90, yPercent: 12, rotate: 16, scale: 0.9 }, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, duration: 1.05, ease: 'expo.out' }, at + 0.18);
  tl.fromTo(pad, { xPercent: -18, yPercent: 96, rotate: -8, scale: 0.9 }, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, duration: 1, ease: 'expo.out' }, at + 0.3);
  if (holes.length) tl.fromTo(holes, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.03 }, at + 0.7);
  // lug nuts spin in one by one
  tl.fromTo(
    nuts,
    { xPercent: 300, yPercent: -300, rotate: -260, scale: 0.5, opacity: 0 },
    { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, opacity: 1, duration: 0.75, stagger: 0.13, ease: 'back.out(1.7)' },
    at + 0.55,
  );
}

function homeBuild(tl: gsap.core.Timeline, root: HTMLElement, at: number): void {
  const grid = root.querySelectorAll('.bp-line');
  const plates = root.querySelectorAll('.wall-plate');
  const studs = root.querySelectorAll('.wall-stud');
  const brace = root.querySelector('.wall-brace');
  const roller = root.querySelector('.roller');
  const photo = root.querySelector('.photo');
  if (!grid.length) return;

  // blueprint grid draws in
  drawOn(tl, grid, { at, duration: 0.22, stagger: 0.012, ease: 'none' });
  // then the wall builds itself, line by line
  drawOn(tl, plates, { at: at + 0.55, duration: 0.55, stagger: 0.12, ease: 'power2.out' });
  drawOn(tl, studs, { at: at + 0.95, duration: 0.34, stagger: 0.11, ease: 'power2.out' });
  if (brace) drawOn(tl, brace, { at: at + 1.75, duration: 0.5, ease: 'power2.out' });

  // the roller sweeps, and the photograph follows right behind it
  const sweepAt = at + 1.95;
  if (roller) {
    tl.fromTo(roller, { xPercent: -105 }, { xPercent: 526, duration: 1.15, ease: 'none' }, sweepAt);
  }
  if (photo) {
    tl.fromTo(photo, { xPercent: -100 }, { xPercent: 0, duration: 1.15, ease: 'none' }, sweepAt);
  }
}

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

/* -------------------------------------------------------------------------- */
/*  One term: scribble -> type -> build -> out                                  */
/* -------------------------------------------------------------------------- */

function termTimeline(
  tl: gsap.core.Timeline,
  row: HTMLElement,
  stages: HTMLElement,
  term: 0 | 1 | 2,
  at: number,
): number {
  const slot = row.querySelector<HTMLElement>(`[data-slot="${term}"]`);
  const word = row.querySelector<HTMLElement>(`[data-word="${term}"]`);
  const scribble = row.querySelector<SVGSVGElement>(`[data-scribble="${term}"]`);
  const stage = stages.querySelector<HTMLElement>(`[data-stage="${term}"]`);
  if (!slot || !word || !scribble || !stage) return at;

  const scribblePath = scribble.querySelector('path');
  prepStrokes(scribblePath);

  // 1. rough red scribble draws itself
  drawOn(tl, scribblePath, { at, duration: 0.55, ease: 'power1.inOut' });

  // 2. resolves into clean type
  tl.to(scribble, { opacity: 0, duration: 0.3, ease: 'power2.out' }, at + 0.5);
  tl.fromTo(
    word,
    { opacity: 0, yPercent: 55, scale: 0.94 },
    { opacity: 1, yPercent: 0, scale: 1, duration: 0.6, ease: 'expo.out' },
    at + 0.46,
  );

  // 3. the stage: illustration builds, photograph wipes in
  tl.set(stage, { autoAlpha: 1 }, at + 0.15);
  const stageAt = at + 0.55;

  if (term === 0) {
    automotiveBuild(tl, stage, stageAt);
    const photo = stage.querySelector('.photo');
    if (photo) tl.fromTo(photo, { xPercent: -100 }, { xPercent: 0, duration: 1, ease: 'power3.inOut' }, stageAt + 0.75);
  } else if (term === 1) {
    homeBuild(tl, stage, stageAt);
  } else {
    readingBuild(tl, stage, stageAt);
    const photo = stage.querySelector('.photo');
    if (photo) tl.fromTo(photo, { xPercent: -100 }, { xPercent: 0, duration: 1.1, ease: 'power3.inOut' }, stageAt + 0.75);
  }

  // 4. out
  tl.to(stage, { autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, at + 2.45);
  tl.to(slot, { color: '#F7F7F7', duration: 0.4 }, at + 0.6);
  return at + 2.6;
}

/* -------------------------------------------------------------------------- */

export function Equation() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = sectionRef.current;
    const pin = pinRef.current;
    const row = rowRef.current;
    const stages = stagesRef.current;
    const finale = finaleRef.current;
    if (!root || !pin || !row || !finale || !stages) return;

    const ctx = gsap.context(() => {
      const slots = gsap.utils.toArray<HTMLElement>('[data-slot]', row);
      const ops = gsap.utils.toArray<HTMLElement>('[data-op]', row);
      const allStages = gsap.utils.toArray<HTMLElement>('[data-stage]', root);
      const scribbles = gsap.utils.toArray<HTMLElement>('[data-scribble]', root);
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', root);
      const finaleMark = finale.querySelector('.finale-mark');
      const caption = finale.querySelector('.finale-caption');
      const equals = root.querySelector('[data-equals]');

      /* ---------- reduced motion: show the finished state, no pinning ---------- */
      if (reduced) {
        gsap.set(scribbles, { opacity: 0 });
        gsap.set(words, { opacity: 1 });
        gsap.set(allStages, { autoAlpha: 0 });
        gsap.set(finale, { autoAlpha: 1 });
        return;
      }

      if (!isDesktop) {
        /* ---------------- MOBILE: play each block when it arrives ---------------- */
        gsap.set(scribbles, { opacity: 1 });
        gsap.set(words, { opacity: 0 });
        gsap.set(allStages, { autoAlpha: 1 });
        gsap.set(finale, { autoAlpha: 1 });
        gsap.set(finale.querySelectorAll('.finale-mark, .finale-caption'), { opacity: 0 });

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

        // finale slam
        const fTl = gsap.timeline({ paused: true });
        finaleTimeline(fTl, root, finale, finaleMark, caption, null);
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
      gsap.set(allStages, { autoAlpha: 0 });
      gsap.set(slots, { color: '#4A4A4A' });
      gsap.set(ops, { opacity: 0 });
      gsap.set(finale, { autoAlpha: 0 });
      if (equals) gsap.set(equals, { opacity: 0 });

      const master = gsap.timeline({ defaults: { ease: 'power3.out' } });

      let t = 0.15;
      t = termTimeline(master, row, stages, 0, t);
      master.to(ops[0], { opacity: 1, duration: 0.3 }, t - 0.5);
      t = termTimeline(master, row, stages, 1, t);
      master.to(ops[1], { opacity: 1, duration: 0.3 }, t - 0.5);
      t = termTimeline(master, row, stages, 2, t);
      if (equals) master.to(equals, { opacity: 1, duration: 0.3 }, t - 0.4);

      // collapse -> slam -> shake -> caption
      const collapseAt = t + 0.25;
      // function-based values so a font/layout refresh can't leave the
      // collapse pointing at stale coordinates
      const centreX = () => {
        const r = row.getBoundingClientRect();
        return r.left + r.width / 2;
      };
      const centreY = () => {
        const r = row.getBoundingClientRect();
        return r.top + r.height / 2;
      };
      slots.forEach((el) => {
        master.to(
          el,
          {
            x: () => centreX() - (el.getBoundingClientRect().left + el.getBoundingClientRect().width / 2),
            y: () => centreY() - (el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2),
            scale: 0.5,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.in',
          },
          collapseAt,
        );
      });
      master.to([...ops, equals].filter(Boolean) as Element[], { opacity: 0, duration: 0.4 }, collapseAt + 0.15);

      finaleTimeline(master, root, finale, finaleMark, caption, collapseAt + 0.5);

      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: '+=3800',
        pin: pin,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5,
        animation: master,
        invalidateOnRefresh: true,
      });
    }, root);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section
      ref={sectionRef}
      id="equation"
      aria-label="Our equation: automotive repair plus home improvement plus reading literacy equals X"
      className="relative bg-ink"
    >
      <div ref={patternRef} className="absolute inset-0">
        <XPattern opacity={0.05} size={140} fillClassName="xp-fill" />
      </div>

      <div
        ref={pinRef}
        className="relative w-full overflow-hidden lg:h-[100svh] lg:min-h-[640px]"
      >
       <div className="equation-shake flex w-full flex-col items-center justify-center lg:h-full">
        {/* ---------------- desktop equation row ---------------- */}
        <div
          ref={rowRef}
          className="pointer-events-none relative z-20 hidden w-full items-center justify-center gap-[1.4vw] px-6 lg:flex lg:flex-wrap"
        >
          {equation.terms.map((term, i) => (
            <div key={term.id} className="flex items-center gap-[1.4vw]">
              <span
                data-slot={i}
                className="relative inline-block font-black uppercase leading-none tracking-tightest text-off/70"
                style={{ fontSize: 'clamp(0.95rem, 2.1vw, 2.2rem)' }}
              >
                <span data-word={i} className="inline-block">
                  {term.label}
                </span>
                <MarkerScribble
                  data-scribble={i}
                  seed={11 + i * 7}
                  className="absolute inset-0 h-full w-full text-red"
                />
              </span>
              {i < 2 ? (
                <span
                  data-op
                  className="font-black leading-none text-red"
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
            className="font-black leading-none text-grey"
            style={{ fontSize: 'clamp(0.9rem, 1.9vw, 2rem)' }}
            aria-hidden="true"
          >
            {equation.equals}
          </span>
          <span className="inline-block w-[clamp(1.4rem,3vw,3rem)] text-off" aria-hidden="true">
            <LogoMark parts={['x']} xVariant="solid" fit="x" className="h-full w-full" />
          </span>
        </div>

        {/* ---------------- stages (desktop) ---------------- */}
        <div
          ref={stagesRef}
          className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
        >
          {([0, 1, 2] as const).map((i) => (
            <Stage key={i} index={i} />
          ))}
        </div>

        {/* ---------------- mobile: stacked blocks ---------------- */}
        <div className="w-full lg:hidden">
          {([0, 1, 2] as const).map((i) => (
            <div key={i} data-block={i} className="border-b border-white/10 px-5 py-12">
              <div className="mx-auto w-full max-w-md">
                <span
                  data-slot={i}
                  className="relative block font-black uppercase leading-[0.9] tracking-tightest text-off"
                  style={{ fontSize: 'clamp(1.6rem, 8vw, 2.6rem)' }}
                >
                  <span data-word={i} className="inline-block">
                    {equation.terms[i].label}
                  </span>
                  <MarkerScribble
                    data-scribble={i}
                    seed={11 + i * 7}
                    className="absolute inset-0 h-full w-full text-red"
                  />
                </span>
                <div data-stage={i} className="mt-8">
                  <StageArt index={i} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- finale ---------------- */}
        <div
          ref={finaleRef}
          className="relative z-30 flex flex-col items-center px-6 text-center lg:absolute lg:inset-0 lg:justify-center"
        >
          <LogoMark
            parts={['shield', 'x', 'fist']}
            xVariant="solid"
            fit="mark"
            className="finale-mark h-[28vmin] w-auto text-off lg:h-[42vmin]"
            title={undefined}
          />
          <p className="finale-caption mt-6 font-black uppercase tracking-tightest text-off sm:mt-8" style={{ fontSize: 'clamp(1.1rem, 3vw, 2.2rem)' }}>
            {equation.caption}
          </p>
          <div className="relative mt-2 hidden lg:block">
            <Flag id="q-equation-caption" place="tr" />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stage = illustration + photograph, one per term                            */
/* -------------------------------------------------------------------------- */

function Stage({ index }: { index: 0 | 1 | 2 }) {
  return (
    <div
      data-stage={index}
      className="absolute inset-0 flex items-center justify-center"
      style={{ visibility: 'hidden' }}
    >
      <StageArt index={index} />
    </div>
  );
}

function StageArt({ index }: { index: 0 | 1 | 2 }) {
  const photo = PHOTOS[index];
  return (
    <div className="relative aspect-[16/10] w-[min(78vw,880px)]">
      <div className="absolute inset-0 overflow-hidden bg-ink">
        <div className="photo h-full w-full will-change-transform">
          <Img
            image={photo}
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 880px, 78vw"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-ink/45" aria-hidden="true" />

      {index === 0 ? (
        <DiscBrake className="absolute inset-0 h-full w-full text-off" />
      ) : null}

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
            className="absolute left-[11%] top-[38%] font-black uppercase leading-none tracking-tightest text-off"
            style={{ fontSize: 'clamp(0.7rem, 2vw, 1.5rem)' }}
          >
            <span className="relative z-10">comprehension</span>
            <HighlighterSwipe className="hl absolute left-[-4%] top-[-10%] h-[120%] w-[108%] text-red/45" seed={17} />
          </span>
          <span
            className="absolute left-[57%] top-[58%] font-black uppercase leading-none tracking-tightest text-off"
            style={{ fontSize: 'clamp(0.7rem, 2vw, 1.5rem)' }}
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
/*  Finale: the slam                                                           */
/* -------------------------------------------------------------------------- */

function finaleTimeline(
  tl: gsap.core.Timeline,
  root: HTMLElement,
  finale: HTMLElement,
  mark: Element | null,
  caption: Element | null,
  at: number | null,
): void {
  const pos = at ?? 0;
  const pattern = root.querySelector<SVGElement>('.xp-fill');
  const base = Number(pattern?.getAttribute('opacity') ?? 0.05);

  tl.set(finale, { autoAlpha: 1 }, pos);
  if (mark) {
    tl.fromTo(
      mark,
      { scale: 2.1, opacity: 0, rotate: -6 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.55, ease: 'back.out(2)' },
      pos,
    );
  }
  // 4px camera shake, 150ms
  tl.fromTo(
    root.querySelector('.equation-shake') ?? root,
    { x: 0 },
    { keyframes: [{ x: -4, duration: 0.04 }, { x: 3, duration: 0.04 }, { x: -2, duration: 0.04 }, { x: 0, duration: 0.03 }], ease: 'none' },
    pos + 0.42,
  );
  // the X pattern pulses once
  if (pattern) {
    tl.fromTo(
      pattern,
      { opacity: base },
      { opacity: base * 3.2, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' },
      pos + 0.42,
    );
  }
  if (caption) {
    tl.fromTo(caption, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, pos + 0.6);
  }
}

/** Mobile version of the term timeline (illustration + photo only, no slot moves). */
function termTimelineMobile(tl: gsap.core.Timeline, block: HTMLElement, term: 0 | 1 | 2): void {
  const scribblePath = block.querySelector('[data-scribble] path');
  const scribble = block.querySelector('[data-scribble]');
  const word = block.querySelector('[data-word]');
  const stage = block.querySelector('[data-stage]');
  if (!stage) return;

  prepStrokes(scribblePath);
  drawOn(tl, scribblePath, { at: 0, duration: 0.5, ease: 'power1.inOut' });
  tl.to(scribble, { opacity: 0, duration: 0.25 }, 0.45);
  tl.fromTo(word, { opacity: 0, yPercent: 45 }, { opacity: 1, yPercent: 0, duration: 0.5, ease: 'expo.out' }, 0.42);

  if (term === 0) {
    automotiveBuild(tl, stage as HTMLElement, 0.5);
    const photo = stage.querySelector('.photo');
    if (photo) tl.fromTo(photo, { xPercent: -100 }, { xPercent: 0, duration: 0.9, ease: 'power3.inOut' }, 1.25);
  } else if (term === 1) {
    homeBuild(tl, stage as HTMLElement, 0.5);
  } else {
    readingBuild(tl, stage as HTMLElement, 0.5);
    const photo = stage.querySelector('.photo');
    if (photo) tl.fromTo(photo, { xPercent: -100 }, { xPercent: 0, duration: 1, ease: 'power3.inOut' }, 1.2);
  }
}

export default Equation;
