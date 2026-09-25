import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { drawOn } from '../lib/draw';
import { useReducedMotion } from '../lib/motion';
import { girls } from '../content/copy';
import { GIRLS_HERO } from '../content/images';
import { Img } from '../components/ui';
import { XPattern } from '../components/XPattern';
import { MarkerUnderline } from '../components/svg/Marker';
import { Flag } from '../components/Flag';

/**
 * THE X FOR GIRLS
 * A short, bright interruption in the rhythm: the photograph at full
 * strength, the X pattern tinted with the pink sampled from the girls' shirts.
 */
export function Girls() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      const title = root.querySelector('.girls-title');
      const sub = root.querySelector('.girls-sub');
      const rule = root.querySelectorAll('.girls-rule path');
      const photo = root.querySelector('.girls-photo');

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        scrollTrigger: { trigger: root, start: 'top 68%', once: true },
      });
      tl.fromTo(title, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9 }, 0);
      drawOn(tl, rule, { at: 0.35, duration: 0.7, ease: 'power2.out' });
      tl.fromTo(sub, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.5);
      if (photo) {
        gsap.fromTo(photo, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 80%', once: true } });
      }
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-ink py-12 sm:py-20 lg:py-28"
      aria-labelledby="girls-title"
    >
      <XPattern opacity={0.05} size={140} color="#FF3E8E" />

      <div className="shell relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <h2
            id="girls-title"
            className="girls-title display text-off"
            style={{ fontSize: 'clamp(2rem, 6.2vw, 4.4rem)' }}
          >
            {girls.title}
          </h2>
          <div className="relative mt-5 inline-block">
            <p
              className="girls-sub font-black uppercase tracking-tightest text-girls"
              style={{ fontSize: 'clamp(1.05rem, 2.6vw, 1.9rem)' }}
            >
              {girls.sub}
            </p>
            <MarkerUnderline
              className="girls-rule absolute -bottom-1 left-0 h-3 w-full text-girls"
              weight={6}
            />
          </div>
          {/* anchors for the Q-notes only — no height on mobile */}
          <div className="relative mt-2 h-0 lg:mt-8 lg:h-6">
            <Flag id="q-girls-section" place="tl" />
          </div>
          <div className="relative h-0 lg:mt-20 lg:h-6">
            <Flag id="q-girls-sub" place="bl" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="girls-photo relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[3/2] lg:aspect-[4/5]">
            <Img
              image={GIRLS_HERO}
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <span className="absolute bottom-0 left-0 h-1 w-1/3 bg-girls" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Girls;
