import { albany, help } from '../content/copy';
import { AUTO_1 } from '../content/images';
import { Accented, ExternalArrow, Img } from '../components/ui';
import { LogoX } from '../components/LogoImage';
import { Flag } from '../components/Flag';

/**
 * HOW YOU CAN HELP
 * The look from round 04 (ink warming to deep red toward the buttons, frosted
 * glass cards) with a clear order of importance:
 *
 *   DONATE   — the featured card: their boys at work, the GoGetFunding mark,
 *              their Life Prep line and the main button.
 *   GIVE / Registries & Wishlists — two secondary cards, each carrying the
 *              platform it happens on (PayPal, Amazon).
 *
 * Platform logos sit on small white chips so they keep their own colours on
 * the dark glass. Every word is theirs.
 */

const [DONATE, GIVE, SUPPLIES] = help.options;

function BrandChip({ o }: { o: (typeof help.options)[number] }) {
  return (
    <span className="inline-flex h-12 items-center rounded-xl bg-white px-4 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.55)] sm:h-14">
      <img
        src={o.brand.logo}
        alt={o.brand.name}
        width={o.brand.w}
        height={o.brand.h}
        loading="lazy"
        className={`w-auto ${o.id === 'give' ? 'h-7 sm:h-8' : o.id === 'supplies' ? 'mt-1.5 h-[22px] sm:h-6' : 'h-9 sm:h-10'}`}
      />
    </span>
  );
}

function Cta({ href, children, big = false }: { href: string; children: string; big?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg bg-red font-sans font-semibold text-white transition-colors duration-200 hover:bg-deepred ${
        big ? 'px-7 py-3.5 text-[0.95rem]' : 'px-5 py-3 text-[0.88rem]'
      }`}
    >
      {children}
      <ExternalArrow className="h-4 w-4" />
    </a>
  );
}

export function Help() {
  return (
    <section
      id="help"
      className="relative overflow-hidden py-14 text-white sm:py-20 lg:py-28"
      style={{ background: 'linear-gradient(180deg, #161616 0%, #1b1010 50%, #3a0606 100%)' }}
      aria-labelledby="help-heading"
    >
      {/* the logo's X, large and faint — the section's watermark */}
      <LogoX className="pointer-events-none absolute -right-[6%] top-[8%] h-[70%] w-auto opacity-[0.05]" />

      <div className="shell relative">
        <h2 id="help-heading" className="display text-white" style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)' }}>
          <Accented text={help.heading} accent={help.accent} />
        </h2>

        <div className="mt-8 grid gap-5 sm:mt-12 lg:mt-14 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
          {/* ---------------- featured: DONATE ---------------- */}
          <article className="glass flex flex-col overflow-hidden rounded-2xl">
            <div className="relative">
              <Img image={AUTO_1} className="aspect-[16/9] w-full" imgClassName="h-full w-full object-cover object-[50%_35%]" sizes="(min-width: 1024px) 50vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" aria-hidden="true" />
              <span className="absolute left-5 top-5 sm:left-7 sm:top-7">
                <BrandChip o={DONATE} />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <span className="font-sans text-[0.8rem] font-semibold text-red">01</span>
              <h3 className="mt-1 font-sans text-[2rem] font-bold tracking-tighter sm:text-[2.4rem]">{DONATE.title}</h3>
              <p className="mt-2 max-w-[44ch] text-[1rem] leading-[1.6] text-white/75">{albany.askBody}</p>
              <div className="mt-auto pt-7">
                <Cta href={DONATE.href} big>
                  {DONATE.cta}
                </Cta>
              </div>
            </div>
          </article>

          {/* ---------------- secondary: GIVE, Registries & Wishlists ---------------- */}
          <div className="grid gap-5 lg:gap-6">
            {[GIVE, SUPPLIES].map((o, i) => (
              <article key={o.id} className="glass relative flex flex-col rounded-2xl p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-sans text-[0.8rem] font-semibold text-red">0{i + 2}</span>
                    <h3 className="mt-1 font-sans text-[1.6rem] font-bold tracking-tighter">{o.title}</h3>
                  </div>
                  <BrandChip o={o} />
                </div>
                <div className="mt-auto pt-6">
                  <Cta href={o.href}>{o.cta}</Cta>
                </div>
                {o.id === 'give' ? (
                  <span className="absolute bottom-6 right-6">
                    <Flag id="q-donate-paypal" place="tl" />
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;
