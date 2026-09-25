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

/** Resting tilt, like paper dropped on a bench. Gentler on phones. */
const TILT = ['-rotate-1 md:-rotate-2', 'rotate-1 md:rotate-[1.5deg]', '-rotate-1 md:-rotate-1'] as const;

/** A small red mark for what each sheet is about. */
function ProgramIcon({ id }: { id: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-red" aria-hidden="true" focusable="false">
      {id === 'automotive' ? (
        // wrench
        <path {...common} d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3.8 17.2a1.9 1.9 0 0 0 2.7 2.7l5.7-5.7a4 4 0 0 0 5.2-5.2l-2.6 2.6-2.4-.3-.3-2.4 2.6-2.6Z" />
      ) : id === 'home' ? (
        // house with a hammer-straight roofline
        <>
          <path {...common} d="M3.5 11.2 12 4l8.5 7.2" />
          <path {...common} d="M5.8 9.6V20h12.4V9.6" />
          <path {...common} d="M10 20v-5.2h4V20" />
        </>
      ) : (
        // open book
        <>
          <path {...common} d="M12 6.5c-1.8-1.3-4.3-1.8-8-1.5v13c3.7-.3 6.2.2 8 1.5 1.8-1.3 4.3-1.8 8-1.5V5c-3.7-.3-6.2.2-8 1.5Z" />
          <path {...common} d="M12 6.5v13" />
        </>
      )}
    </svg>
  );
}

export function Programs() {
  return (
    <section id="programs" className="relative bg-[#F4F4F2] py-14 sm:py-20 lg:py-28" aria-labelledby="programs-heading">
      <div className="shell">
        <h2 id="programs-heading" className="display text-ink" style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)' }}>
          <Accented text={programs.heading} accent={programs.accent} />
        </h2>

        <div className="mt-8 grid gap-7 px-1 sm:mt-12 md:grid-cols-3 md:gap-8 lg:mt-14">
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
    <article
      className={`group relative flex flex-col bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06),0_16px_36px_-18px_rgba(0,0,0,0.32)] transition-transform duration-300 ease-out md:hover:rotate-0 md:hover:-translate-y-1 ${TILT[index]}`}
    >
      {/* the sheet's header: what it is and its number */}
      <header className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/25 px-5 pb-3 pt-5 sm:px-6">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink/70">{item.object}</span>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-red">{item.number}</span>
      </header>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red/[0.08]">
            <ProgramIcon id={item.id} />
          </span>
          <h3 className="font-sans text-[1.35rem] font-bold leading-[1.15] tracking-tighter text-ink">{item.title}</h3>
        </div>
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
          {/* thin red outline around the photo */}
          <div className="overflow-hidden ring-1 ring-red ring-offset-2 ring-offset-white">
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
