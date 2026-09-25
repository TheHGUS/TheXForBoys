import { girls, links } from '../content/copy';
import { GIRLS_HERO } from '../content/images';
import { Accented, Img } from '../components/ui';

/**
 * THE X FOR BOYS & GIRLS
 * Their own donate headline, on white, with the pink sampled from the girls'
 * shirts as the one accent — the only place the pink appears.
 */
export function Girls() {
  return (
    <section className="relative bg-white py-14 sm:py-20 lg:py-28" aria-labelledby="girls-title">
      <div className="shell grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="overflow-hidden rounded-2xl">
          <Img image={GIRLS_HERO} className="aspect-[4/3] w-full" imgClassName="h-full w-full object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>

        <div>
          <h2 id="girls-title" className="display text-ink" style={{ fontSize: 'clamp(2rem, 4.6vw, 3.8rem)' }}>
            <Accented text={girls.title} accent={['Boys', { text: 'Girls', className: '!text-girls' }]} tone="light" />
          </h2>
          <a
            href={links.goGetFunding}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-red px-7 py-3.5 font-sans text-[0.92rem] font-semibold text-white transition-colors duration-200 hover:bg-deepred"
          >
            {girls.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

export default Girls;
