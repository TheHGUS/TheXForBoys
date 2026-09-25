import { help } from '../content/copy';
import { Accented, ExternalArrow } from '../components/ui';
import { Flag } from '../components/Flag';

/**
 * HOW YOU CAN HELP
 * Their three ways to give, each carried by the platform it happens on — the
 * GoGetFunding, PayPal and Amazon marks — so a visitor knows where a button
 * will take them before they press it. Their own headings and button words;
 * every button sits on the same baseline.
 */
export function Help() {
  return (
    <section id="help" className="relative bg-[#F4F4F2] py-14 sm:py-20 lg:py-28" aria-labelledby="help-heading">
      <div className="shell">
        <h2 id="help-heading" className="display text-ink" style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)' }}>
          <Accented text={help.heading} accent={help.accent} />
        </h2>

        <ul className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3 lg:mt-14">
          {help.options.map((o) => (
            <li key={o.id} className="relative">
              <a
                href={o.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-20px_rgba(0,0,0,0.3)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_22px_44px_-22px_rgba(0,0,0,0.35)] sm:p-7"
              >
                {/* the platform's own mark */}
                <span className="flex h-11 items-center">
                  <img
                    src={o.brand.logo}
                    alt={o.brand.name}
                    width={o.brand.w}
                    height={o.brand.h}
                    loading="lazy"
                    className={`w-auto ${o.id === 'give' ? 'h-9' : o.id === 'supplies' ? 'mt-2 h-7' : 'h-11'}`}
                  />
                </span>

                <h3 className="mt-6 font-sans text-[1.5rem] font-semibold tracking-tighter text-ink">{o.title}</h3>

                <span className="mt-auto pt-8">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-red px-6 py-3 font-sans text-[0.9rem] font-semibold text-white transition-colors duration-200 group-hover:bg-deepred">
                    {o.cta}
                    <ExternalArrow className="h-4 w-4" />
                  </span>
                </span>
              </a>
              {o.id === 'give' ? (
                <span className="absolute right-4 top-4">
                  <Flag id="q-donate-paypal" place="bl" />
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Help;
