import { programs } from '../content/copy';
import { AUTO_2, HOME_1, READ_2 } from '../content/images';
import { Accented, Img } from '../components/ui';

/**
 * OUR PROGRAMS — the only place the three programmes appear.
 *
 * Each one is printed on the real-world paper it belongs to (a work order, a
 * job ticket, a library checkout card). Paper has square corners, so these do
 * too. Every line on a sheet carries information — their own words and their
 * own photo; there are no blank date lines or empty tables.
 */

const PHOTOS = [AUTO_2, HOME_1, READ_2] as const;

export function Programs() {
  return (
    <section id="programs" className="relative bg-[#F4F4F2] py-14 sm:py-20 lg:py-28" aria-labelledby="programs-heading">
      <div className="shell">
        <h2 id="programs-heading" className="display text-ink" style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)' }}>
          <Accented text={programs.heading} accent={programs.accent} />
        </h2>

        <div className="mt-8 grid gap-6 sm:mt-12 md:grid-cols-3 md:gap-7 lg:mt-14">
          {programs.items.map((item, i) => (
            <Receipt key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Item = (typeof programs.items)[number];

function Receipt({ item, index }: { item: Item; index: number }) {
  const photo = PHOTOS[index];
  return (
    <article className="group relative flex flex-col bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06),0_14px_34px_-18px_rgba(0,0,0,0.28)] transition-transform duration-300 ease-out md:hover:-translate-y-1">
      {/* the sheet's header: what it is and its number */}
      <header className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/25 px-5 pb-3 pt-5 sm:px-6">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink/70">{item.object}</span>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-red">{item.number}</span>
      </header>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
        <h3 className="font-sans text-[1.35rem] font-semibold leading-[1.15] tracking-tighter text-ink">{item.title}</h3>
        <p className="mt-3 text-[0.95rem] leading-[1.6] text-ink/75">{item.body}</p>

        {/* line items — their own words */}
        <ul className="mt-5 border-t border-dashed border-ink/25 pt-4">
          {item.checklist.map((c) => (
            <li key={c} className="flex items-center gap-3 py-1.5 font-mono text-[0.78rem] text-ink">
              <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-red" aria-hidden="true" focusable="false">
                <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="first-letter:uppercase">{c}</span>
            </li>
          ))}
        </ul>

        {/* the photo, printed on the sheet (pushed to the bottom so the
            three sheets' photos line up) */}
        <div className="mt-auto pt-6">
          <div className="overflow-hidden">
            <Img
              image={photo}
              className="aspect-[4/3] w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(min-width: 768px) 30vw, 90vw"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default Programs;
