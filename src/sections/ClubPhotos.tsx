import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { GALLERY } from '../content/images';
import { club } from '../content/copy';
import { Img, MonoLabel } from '../components/ui';
import { GreaseCircle } from '../components/svg/Marker';
import { hasFinePointer, useReducedMotion } from '../lib/motion';
import { prepStrokes } from '../lib/draw';
import { lockScroll, unlockScroll } from '../lib/scroll';

/**
 * #CLUBPHOTOS — a photographer's contact sheet.
 * Dark film strip, sprocket holes, frame numbers in Plex Mono, and a red
 * grease-pencil circle that hand-draws around the frame you're on. Drag with
 * momentum on desktop, native swipe on mobile. Click opens a lightbox.
 */

export function ClubPhotos() {
  const stripRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const fine = useRef(hasFinePointer());
  const prevActive = useRef(-1);

  const drawCircle = useCallback(
    (index: number, on: boolean) => {
      if (reduced) return;
      const el = trackRef.current?.querySelector<HTMLElement>(
        `[data-frame="${index}"] .grease path, [data-frame="${index}"] .frameno path`,
      );
      if (!el) return;
      const len = (el as unknown as SVGGeometryElement).getTotalLength?.() ?? 0;
      if (!len) return;
      gsap.to(el, {
        strokeDashoffset: on ? 0 : len,
        duration: on ? 0.55 : 0.25,
        ease: on ? 'power2.out' : 'power2.in',
        overwrite: true,
      });
    },
    [reduced],
  );

  /* ---------------- hide every grease circle until it's drawn ---------------- */
  useEffect(() => {
    if (reduced) return;
    const paths = trackRef.current?.querySelectorAll('.grease path, .frameno path');
    prepStrokes(paths);
  }, [reduced]);

  /* ---------------- drag with momentum (desktop) ---------------- */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !fine.current || reduced) return;

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let raf = 0;

    const maxScroll = () => Math.max(0, strip.scrollWidth - strip.clientWidth);

    const momentum = () => {
      velocity *= 0.94;
      strip.scrollLeft -= velocity * 16;
      const max = maxScroll();
      if (strip.scrollLeft <= 0 || strip.scrollLeft >= max) velocity = 0;
      if (Math.abs(velocity) > 0.02) {
        raf = requestAnimationFrame(momentum);
      } else {
        raf = 0;
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      dragging = true;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      strip.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      strip.scrollLeft = startScroll - dx;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId);
      if (Math.abs(velocity) > 0.15) raf = requestAnimationFrame(momentum);
    };

    const onWheel = (e: WheelEvent) => {
      // let horizontal trackpad gestures run the strip
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      strip.scrollLeft += e.deltaX;
    };

    strip.addEventListener('pointerdown', onDown);
    strip.addEventListener('pointermove', onMove);
    strip.addEventListener('pointerup', onUp);
    strip.addEventListener('pointercancel', onUp);
    strip.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      strip.removeEventListener('pointerdown', onDown);
      strip.removeEventListener('pointermove', onMove);
      strip.removeEventListener('pointerup', onUp);
      strip.removeEventListener('pointercancel', onUp);
      strip.removeEventListener('wheel', onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  /* ---------------- which frame is centred (mobile) ---------------- */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || fine.current) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const frames = trackRef.current?.querySelectorAll<HTMLElement>('[data-frame]');
        if (!frames) return;
        const mid = strip.scrollLeft + strip.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        frames.forEach((f, i) => {
          const c = f.offsetLeft + f.offsetWidth / 2;
          const d = Math.abs(c - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (best !== prevActive.current) {
          if (prevActive.current >= 0) drawCircle(prevActive.current, false);
          drawCircle(best, true);
          prevActive.current = best;
          setActive(best);
        }
      });
    };
    strip.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      strip.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [drawCircle]);

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
    <section
      className="relative overflow-hidden border-y border-white/10 bg-ink py-16 sm:py-20 lg:py-24"
      aria-labelledby="club-heading"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="club-heading"
            className="display text-off"
            style={{ fontSize: 'clamp(1.9rem, 6vw, 4.2rem)' }}
          >
            {club.heading}
          </h2>
          <MonoLabel className="text-grey">
            {GALLERY.length} photos · {club.hint}
          </MonoLabel>
        </div>
      </div>

      {/* ---------------- film strip ---------------- */}
      <div
        ref={stripRef}
        tabIndex={0}
        role="region"
        aria-label={`${club.heading} contact sheet — scroll or use the arrow keys`}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          e.preventDefault();
          const strip = stripRef.current;
          if (strip) strip.scrollLeft += e.key === 'ArrowRight' ? 320 : -320;
        }}
        className="no-scrollbar relative mt-10 w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:cursor-grab md:snap-none md:overflow-hidden md:active:cursor-grabbing"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div ref={trackRef} className="flex w-max gap-3 px-5 sm:px-8 lg:px-14">
          {GALLERY.map((img, i) => (
            <Frame
              key={`${img.src}-${i}`}
              index={i}
              image={img}
              isActive={active === i}
              onEnter={() => fine.current && drawCircle(i, true)}
              onLeave={() => fine.current && drawCircle(i, false)}
              onOpen={() => setLightbox(i)}
            />
          ))}
        </div>
      </div>

      <div className="shell mt-6 flex items-center justify-between">
        <MonoLabel className="text-grey/75">
          {club.rollLabel} · {String(active + 1).padStart(2, '0')} / {GALLERY.length}
        </MonoLabel>
        <MonoLabel className="text-grey/75">Albany, GA</MonoLabel>
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
  isActive,
  onEnter,
  onLeave,
  onOpen,
}: {
  index: number;
  image: (typeof GALLERY)[number];
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onOpen: () => void;
}) {
  return (
    <figure
      data-frame={index}
      className="relative w-[74vw] shrink-0 snap-center sm:w-[46vw] lg:w-[30vw] xl:w-[24vw]"
    >
      <div className="relative border-y-[10px] border-[#0b0b0b] bg-[#0b0b0b] py-3">
        {/* sprocket holes */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[10px]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(247,247,247,0.22) 0 8px, transparent 8px 22px)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[10px]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(247,247,247,0.22) 0 8px, transparent 8px 22px)',
          }}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={onOpen}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onFocus={onEnter}
          onBlur={onLeave}
          className="group relative block w-full overflow-hidden"
          aria-label={`Open photo ${index + 1}: ${image.alt}`}
        >
          <Img
            image={image}
            className="aspect-[4/3] w-full bg-black"
            imgClassName="h-full w-full object-cover transition-[filter] duration-300 group-hover:brightness-[1.08]"
            sizes="(min-width: 1280px) 24vw, (min-width: 640px) 46vw, 74vw"
          />
          <GreaseCircle
            className="grease pointer-events-none absolute -inset-[6%] h-[112%] w-[112%] text-red"
            weight={4}
            seed={3 + index * 5}
          />
        </button>
      </div>
      <figcaption className="mt-2 flex items-baseline justify-between gap-3">
        {/*
          The frame number, circled in grease pencil when this frame is the
          current one — the way a photographer marks up a contact sheet.
        */}
        <span className="relative inline-block px-2 py-1">
          <MonoLabel
            className={
              isActive
                ? 'relative z-10 text-off transition-colors duration-200'
                : 'relative z-10 text-grey/75 transition-colors duration-200'
            }
          >
            {club.frameLabel} {String(index + 1).padStart(3, '0')}
          </MonoLabel>
          <GreaseCircle
            className="frameno pointer-events-none absolute -inset-[14%] h-[128%] w-[128%] text-red"
            weight={3}
            seed={3 + index * 5}
          />
        </span>
        <MonoLabel className="text-grey/75">35MM</MonoLabel>
      </figcaption>
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
        <MonoLabel className="text-grey">
          {club.frameLabel} {String(index + 1).padStart(3, '0')} / {String(GALLERY.length).padStart(3, '0')}
        </MonoLabel>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="border-2 border-off/40 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-off hover:border-red hover:text-red"
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
          className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-off/30 bg-ink/60 text-off hover:border-red hover:text-red sm:left-6"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => onIndex((index + 1) % GALLERY.length)}
          aria-label={club.lightboxNext}
          className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-off/30 bg-ink/60 text-off hover:border-red hover:text-red sm:right-6"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

export default ClubPhotos;
