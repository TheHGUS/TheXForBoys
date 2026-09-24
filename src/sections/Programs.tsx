import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { drawOn } from '../lib/draw';
import { useReducedMotion } from '../lib/motion';
import { programs } from '../content/copy';
import { AUTO_2, HOME_1, READ_2 } from '../content/images';
import { Img, MonoLabel } from '../components/ui';
import { XPattern } from '../components/XPattern';
import { MarkerCheck, RoughRule, Stamp } from '../components/svg/Marker';
import { BulldogClip, PushPin } from '../components/svg/Illustrations';
import { Flag } from '../components/Flag';

/**
 * OUR PROGRAMS — three real objects on a workbench, not three cards.
 *   a mechanic's work order, a job ticket pinned to a blueprint, and an old
 *   library checkout card. Each one is ticked, stamped and annotated by hand.
 */

const PHOTOS = [AUTO_2, HOME_1, READ_2] as const;

/** Resting rotation. +/-1deg on mobile so nothing hangs outside the gutter. */
const ROTATIONS = ['rotate-[-1deg] md:rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[-1deg]'] as const;

/** Hover straightens the object — desktop pointers only. */
const HOVER_ROTATIONS = ['md:hover:rotate-0', 'md:hover:rotate-0', 'md:hover:rotate-0'] as const;

/**
 * Slightly different edge shadow per object, so three sheets of paper don't
 * read as three identical white cards (ROUND-02 P2 #10).
 */
const SHADOWS = [
  'shadow-[0_18px_38px_-16px_rgba(0,0,0,0.68)]',
  'shadow-[0_22px_46px_-14px_rgba(0,0,0,0.72)]',
  'shadow-[0_16px_34px_-18px_rgba(0,0,0,0.62)]',
] as const;

export function Programs() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-ticket]', root);

      cards.forEach((card, i) => {
        const checks = card.querySelectorAll('.tick path');
        const stamps = card.querySelectorAll('.stamp');
        const head = card.querySelector('.ticket-head');

        if (reduced) {
          gsap.set(checks, { strokeDashoffset: 0 });
          gsap.set(stamps, { opacity: 0.92, scale: 1 });
          return;
        }

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
        if (head) tl.fromTo(head, { yPercent: -30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 }, 0);
        drawOn(tl, checks, { at: 0.15, duration: 0.32, stagger: 0.16, ease: 'power2.out' });
        if (stamps.length) {
          tl.fromTo(
            stamps,
            { scale: 2.4, opacity: 0, rotate: (i: number) => (i % 2 ? 18 : -22) },
            {
              scale: 1,
              opacity: 0.92,
              rotate: (i: number) => (i % 2 ? 9 : -8),
              duration: 0.5,
              stagger: 0.22,
              ease: 'back.out(2.2)',
            },
            0.7,
          );
        }

        ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          once: true,
          onEnter: () => tl.play(0),
        });
        void i;
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="programs"
      className="relative overflow-hidden border-y border-white/10 bg-[#191919] py-16 sm:py-20 lg:py-28"
      aria-labelledby="programs-heading"
    >
      <XPattern opacity={0.035} size={150} />

      <div className="shell relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="programs-heading"
            className="display text-off"
            style={{ fontSize: 'clamp(2.1rem, 7vw, 5rem)' }}
          >
            {programs.heading}
          </h2>
          <span className="relative">
            <MonoLabel className="text-grey">{programs.intro}</MonoLabel>
            <Flag id="q-programs-intro" place="tr" />
          </span>
        </div>

        {/* workbench */}
        <div className="relative mt-12 lg:mt-16">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"
            aria-hidden="true"
          />

          {/*
            Below 768px the three objects stack full width inside the gutters.
            Round 01 put them in a horizontal snap scroller, which clipped the
            body copy and left an empty box with a "SWIPE" hint. Rotations are
            capped at +/-1deg on mobile so nothing hangs outside the gutter.
          */}
          <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-8">
            {programs.items.map((item, i) => (
              <div
                key={item.id}
                data-ticket
                className={`group relative w-full ${ROTATIONS[i]} md:min-w-0 ${HOVER_ROTATIONS[i]} transition-[transform,box-shadow] duration-300 ease-out md:hover:z-20 md:hover:-translate-y-2 md:hover:rotate-0 ${SHADOWS[i]} md:hover:shadow-[0_36px_70px_-18px_rgba(0,0,0,0.75)]`}
                style={{ willChange: 'transform' }}
              >
                <Ticket item={item} index={i} />
              </div>
            ))}
          </div>

          <div className="relative mt-2 hidden md:block">
            <span>
              <Flag id="q-program-tickets" place="bl" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  The three objects                                                          */
/* -------------------------------------------------------------------------- */

type Item = (typeof programs.items)[number];

function Ticket({ item, index }: { item: Item; index: number }) {
  const photo = PHOTOS[index];
  const isBlueprint = item.id === 'home';
  const isCard = item.id === 'reading';

  return (
    <div className="relative">
      {/* (b) blueprint sheet behind the job ticket */}
      {isBlueprint ? (
        <div
          className="absolute -inset-3 bg-[#101820]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(247,247,247,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(247,247,247,0.10) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
          aria-hidden="true"
        />
      ) : null}

      <article
        className={`relative flex h-full flex-col border border-black/10 bg-off text-ink ${
          isCard ? 'p-5 sm:p-6' : 'p-5 sm:p-6'
        }`}
      >
        {/* paper: a faint fibre wash so the sheet reads as stock, not a card */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(94deg, rgba(22,22,22,0.028) 0 1px, transparent 1px 3px), repeating-linear-gradient(4deg, rgba(22,22,22,0.02) 0 1px, transparent 1px 4px)',
          }}
          aria-hidden="true"
        />
        {/* pin for the blueprint ticket */}
        {isBlueprint ? (
          <PushPin className="absolute -top-3 left-1/2 h-8 w-auto -translate-x-1/2 text-red" />
        ) : null}

        {/* ---- ticket header ---- */}
        <header className="ticket-head border-b-2 border-ink/80 pb-3">
          <div className="flex items-baseline justify-between gap-3">
            <MonoLabel className="font-medium text-ink">{item.mono.no}</MonoLabel>
            <MonoLabel className="text-ink/75">{item.mono.tech}</MonoLabel>
          </div>
        </header>

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <MonoLabel className="text-ink/75">{item.mono.customer}</MonoLabel>
          <MonoLabel className="text-ink/75">{item.mono.date}</MonoLabel>
        </div>

        <h3
          className="mt-4 font-black uppercase leading-[0.92] tracking-tightest"
          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.55rem)' }}
        >
          {item.title}
        </h3>

        <RoughRule className="my-3 h-2 w-full text-ink/25" />

        <p className="text-[0.92rem] leading-[1.5] text-ink/80">{item.body}</p>

        {/* ---- checklist ---- */}
        {item.checklist ? (
          <ul className="mt-5 space-y-2.5">
            {item.checklist.map((c) => (
              <li key={c} className="flex items-center gap-3">
                <span className="relative block h-6 w-7 shrink-0">
                  <MarkerCheck className="tick absolute inset-0 h-full w-full text-red" weight={5} />
                </span>
                <span className="font-bold uppercase tracking-tightest text-ink" style={{ fontSize: '0.86rem' }}>
                  {c}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* ---- (c) checkout-card date column + stamps ---- */}
        {isCard ? (
          <div className="mt-5">
            <div className="grid grid-cols-[1fr_auto] gap-x-3 border-y border-ink/25 py-2">
              <MonoLabel className="text-ink/75">DATE DUE</MonoLabel>
              <MonoLabel className="text-ink/75">BORROWER</MonoLabel>
              {[0, 1, 2].map((r) => (
                <div key={r} className="col-span-2 grid grid-cols-[1fr_auto] gap-x-3 border-b border-dashed border-ink/20 py-1.5 last:border-0">
                  <span className="font-mono text-[0.7rem] text-ink/75">____ / ____ / ______</span>
                  <span className="font-mono text-[0.7rem] text-ink/75">____________</span>
                </div>
              ))}
            </div>
            <div className="relative mt-4 h-14">
              <Stamp label={item.stamp ?? 'WEEKLY'} className="stamp absolute left-0 top-0 h-14 w-auto text-red" rotate={-8} />
              <Stamp label={item.stamp ?? 'WEEKLY'} className="stamp absolute left-[38%] top-1 h-12 w-auto text-red/80" rotate={7} seed={44} />
            </div>
          </div>
        ) : null}

        {/* ---- paper-clipped snapshot ---- */}
        <div className="relative mt-6">
          <div className="relative ml-auto w-[62%] rotate-[2deg] border-2 border-off bg-off p-1.5 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.55)]">
            <Img image={photo} className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 22vw, 55vw" />
            <BulldogClip className="absolute -top-5 left-4 h-8 w-auto text-ink/75" />
          </div>
          <MonoLabel className="absolute bottom-1 left-0 text-ink/70">
            {isCard ? 'BOOK CLUB — WEEKLY' : item.id === 'home' ? 'SITE: ALBANY, GA' : 'SHOP BAY 01'}
          </MonoLabel>
        </div>
      </article>
    </div>
  );
}

export default Programs;
