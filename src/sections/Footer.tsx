import { connect, footer, site } from '../content/copy';
import { LogoImage } from '../components/LogoImage';
import { SocialIcon, type SocialId } from '../components/svg/Social';
import { Flag } from '../components/Flag';

/**
 * FOOTER
 * Logo and name, their nav (plus Donate), their "Follow @thexforboys" with one
 * row of icons, and a bottom bar whose two lines each stay on one line, even
 * at 375px.
 */
export function Footer() {
  return (
    <footer className="relative bg-[#0E0E0E] text-white">
      <div className="shell py-12 sm:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="relative inline-flex items-center gap-4">
              <LogoImage label={`${site.shortName} logo`} className="h-14 w-auto sm:h-16" />
              <span>
                <span className="block font-sans text-[1.2rem] font-bold tracking-tighter">{site.name}</span>
              </span>
              <Flag id="q-logo-vector" place="bl" />
            </span>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-1">
                {footer.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...('external' in l && l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={`font-sans text-[0.95rem] font-medium transition-colors duration-200 ${
                        'external' in l && l.external ? 'text-red hover:text-white' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="relative">
              <p className="font-sans text-[0.95rem] font-medium text-white/80">{connect.follow}</p>
              <ul className="mt-3 flex gap-2">
                {connect.socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} — ${s.handle}`}
                      title={`${s.label} · ${s.handle}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:border-red hover:text-red"
                    >
                      <SocialIcon id={s.id as SocialId} className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
              <Flag id="q-socials" place="tl" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-1.5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="whitespace-nowrap text-[0.66rem] text-white/55 min-[400px]:text-[0.72rem] sm:text-[0.8rem]">
            {site.copyright}
          </p>
          <p className="whitespace-nowrap text-[0.66rem] text-white/55 min-[400px]:text-[0.72rem] sm:text-[0.8rem]">
            <a
              href={site.creditHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/30 underline-offset-2 transition-colors duration-200 hover:text-white hover:decoration-red"
            >
              {site.credit}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
