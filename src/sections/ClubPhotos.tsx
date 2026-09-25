import { useEffect, useRef, useState } from 'react';
import { GALLERY } from '../content/images';
import { club } from '../content/copy';
import { Accented, Img } from '../components/ui';
import { useReducedMotion } from '../lib/motion';
import { ShieldFrame } from '../components/Shield';
import { lockScroll, unlockScroll } from '../lib/scroll';

/**
 * #CLUBPHOTOS — the photos in the shape of the club's own shield.
 *
 * Every frame is the home-plate shield from their logo, with the logo's
 * double keyline (ink, then off-white) around the photo. The row scrolls on
 * its own, slowly and endlessly; it pauses while you hover, drag, swipe or
 * tab through it, and picks up again a moment later. Reduced motion: no
 * auto-scroll, just a normal swipeable row. Tap a frame to open it large.
 */

/** Auto-scroll speed, px per second. */
const SPEED = 95;
/** How long the row waits after an interaction before moving again. */
const RESUME_MS = 2200;

export function ClubPhotos() {
  const stripRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduced = useReducedMotion();

  /* ---------------- endless auto-scroll + drag ---------------- */
  useEffect(() => {
    const strip = stripRef.current;
    const set = setRef.current;
    if (!strip || !set) return;

    let pausedUntil = 0;
    let hovering = false;
    let visible = false;
    let raf = 0;
    let last = 0;
    let carry = 0;

    const pause = (ms = RESUME_MS) => {
      pausedUntil = performance.now() + ms;
    };

    // the row is rendered twice; once we've scrolled a whole set, jump back
    const wrap = () => {
      const w = set.offsetWidth;
      if (w && strip.scrollLeft >= w) strip.scrollLeft -= w;
      if (w && strip.scrollLeft < 0) strip.scrollLeft += w;
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      if (reduced || !visible || hovering || t < pausedUntil || lightboxOpen.current) return;
      // scrollLeft is integer on some browsers — accumulate sub-pixel steps
      carry += (SPEED * dt) / 1000;
      const step = Math.floor(carry);
      if (step) {
        carry -= step;
        strip.scrollLeft += step;
        wrap();
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(strip);

    /* mouse drag */
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        pause();
        return;
      }
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4 && !strip.hasPointerCapture(e.pointerId)) strip.setPointerCapture(e.pointerId);
      strip.scrollLeft = startScroll - dx;
      wrap();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId);
      pause();
    };
    // a drag shouldn't also open the lightbox
    const onClickCapture = (e: MouseEvent) => {
      if (moved > 4) {
        e.stopPropagation();
        e.preventDefault();
        moved = 0;
      }
    };
    const onEnter = () => (hovering = true);
    const onLeave = () => {
      hovering = false;
      pause(600);
    };
    const onScrollUser = () => wrap();
    const onTouch = () => pause();
    const onFocusIn = () => pause(8000);

    strip.addEventListener('pointerdown', onDown);
    strip.addEventListener('pointermove', onMove);
    strip.addEventListener('pointerup', onUp);
    strip.addEventListener('pointercancel', onUp);
    strip.addEventListener('click', onClickCapture, true);
    strip.addEventListener('mouseenter', onEnter);
    strip.addEventListener('mouseleave', onLeave);
    strip.addEventListener('scroll', onScrollUser, { passive: true });
    strip.addEventListener('touchstart', onTouch, { passive: true });
    strip.addEventListener('wheel', onTouch, { passive: true });
    strip.addEventListener('focusin', onFocusIn);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      strip.removeEventListener('pointerdown', onDown);
      strip.removeEventListener('pointermove', onMove);
      strip.removeEventListener('pointerup', onUp);
      strip.removeEventListener('pointercancel', onUp);
      strip.removeEventListener('click', onClickCapture, true);
      strip.removeEventListener('mouseenter', onEnter);
      strip.removeEventListener('mouseleave', onLeave);
      strip.removeEventListener('scroll', onScrollUser);
      strip.removeEventListener('touchstart', onTouch);
      strip.removeEventListener('wheel', onTouch);
      strip.removeEventListener('focusin', onFocusIn);
    };
  }, [reduced]);

  const lightboxOpen = useRef(false);
  lightboxOpen.current = lightbox !== null;

  /* ---------------- lightbox ---------------- */
  useEffect(() => {
    if (lightbox === null) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % GALLERY.length));
      if (e.key === 'ArrowLeft')
        setLightbox((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [lightbox]);

  return (
    <section id="gallery" className="relative overflow-hidden bg-[#F4F4F2] py-14 text-ink sm:py-20 lg:py-24" aria-labelledby="club-heading">
      <div className="shell">
        <h2 id="club-heading" className="display text-ink" style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)' }}>
          <Accented text={club.heading} accent="photos" />
        </h2>
      </div>

      {/* ---------------- the row (rendered twice for an endless loop) ---------------- */}
      <div
        ref={stripRef}
        tabIndex={0}
        role="region"
        aria-label={`${club.heading} — scrolling photo row. Hover or focus to pause; use the arrow keys to move.`}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          e.preventDefault();
          const strip = stripRef.current;
          if (strip) strip.scrollBy({ left: e.key === 'ArrowRight' ? 260 : -260, behavior: 'smooth' });
        }}
        className="no-scrollbar relative mt-8 w-full overflow-x-auto overscroll-x-contain md:cursor-grab md:active:cursor-grabbing"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex w-max">
          <div ref={setRef} className="flex gap-5 pl-5 sm:gap-6 sm:pl-6">
            {GALLERY.map((img, i) => (
              <Frame key={`a-${i}`} index={i} image={img} onOpen={() => setLightbox(i)} />
            ))}
          </div>
          {/* the loop's second pass — hidden from assistive tech and the tab order */}
          <div className="flex gap-5 pl-5 sm:gap-6 sm:pl-6" aria-hidden="true">
            {GALLERY.map((img, i) => (
              <Frame key={`b-${i}`} index={i} image={img} onOpen={() => setLightbox(i)} inert />
            ))}
          </div>
        </div>
      </div>

      {lightbox !== null ? (
        <Lightbox index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
      ) : null}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Frame({
  index,
  image,
  onOpen,
  inert = false,
}: {
  index: number;
  image: (typeof GALLERY)[number];
  onOpen: () => void;
  inert?: boolean;
}) {
  return (
    <figure data-frame={inert ? undefined : index} className="w-[58vw] shrink-0 sm:w-[34vw] lg:w-[21vw] xl:w-[17vw]">
      <button
        type="button"
        onClick={onOpen}
        tabIndex={inert ? -1 : 0}
        className="group block w-full rounded-lg"
        aria-label={`Open photo ${index + 1}: ${image.alt}`}
      >
        {/* the logo's keylines: ink, then off-white, then the photo */}
        <ShieldFrame tone="dark" className="transition-transform duration-300 ease-out group-hover:-translate-y-1">
          <Img
            image={image}
            className="h-full w-full bg-ink/10"
            imgClassName="h-full w-full object-cover"
            sizes="(min-width: 1280px) 17vw, (min-width: 1024px) 21vw, (min-width: 640px) 34vw, 58vw"
          />
        </ShieldFrame>
      </button>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */

function Lightbox({
  index,
  onClose,
  onIndex,
}: {
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openedAt = useRef(index);
  const image = GALLERY[index];

  useEffect(() => {
    closeRef.current?.focus();
    return () => {
      // send focus back where it came from
      const opener = document.querySelector<HTMLElement>(`[data-frame="${openedAt.current}"] button`);
      opener?.focus();
    };
  }, []);

  const onTrap = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const nodes = dialogRef.current?.querySelectorAll<HTMLElement>('button');
    if (!nodes || !nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={dialogRef}
      onKeyDown={onTrap}
      className="fixed inset-0 z-[90] flex flex-col bg-ink/97 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${GALLERY.length}`}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <span className="text-[0.85rem] text-white/60">
          {index + 1} / {GALLERY.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="rounded-xl border-2 border-off/40 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-off hover:border-red hover:text-red"
        >
          {club.lightboxClose}
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-5 pb-4 sm:px-8">
        <picture className="contents">
          <source type="image/webp" srcSet={image.webpSet} sizes="100vw" />
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes="100vw"
            alt={image.alt}
            width={image.w}
            height={image.h}
            className="max-h-full max-w-full object-contain"
            decoding="async"
          />
        </picture>

        <button
          type="button"
          onClick={() => onIndex((index - 1 + GALLERY.length) % GALLERY.length)}
          aria-label={club.lightboxPrev}
          className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-off/30 bg-ink/60 text-off hover:border-red hover:text-red sm:left-6"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => onIndex((index + 1) % GALLERY.length)}
          aria-label={club.lightboxNext}
          className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl border-2 border-off/30 bg-ink/60 text-off hover:border-red hover:text-red sm:right-6"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

export default ClubPhotos;
