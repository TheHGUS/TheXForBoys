import { connect, footer, links, site } from '../content/copy';
import { LogoImage, LogoX } from '../components/LogoImage';
import { SocialIcon, type SocialId } from '../components/svg/Social';
import { MonoLabel } from '../components/ui';
import { Flag, FlagHint } from '../components/Flag';

/**
 * FOOTER — max ~70vh.
 * The real logo, the link set, one compact row of social icons, the
 * copyright, and the logo's own X — large and faint — bleeding off the bottom
 * edge. Sized to its content.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-8">
      <div className="shell relative z-10">
        <div className="flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-start sm:justify-between lg:pt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
            {/* the real logo, large */}
            <span className="relative inline-block">
              <LogoImage
                label={`${site.shortName} logo`}
                className="h-16 w-auto sm:h-20 lg:h-24"
              />
              <Flag id="q-logo-vector" place="bl" />
            </span>
            <div>
              <MonoLabel className="block text-grey">
                {site.location} · {site.ein}
              </MonoLabel>
              <MonoLabel className="mt-2 block text-grey/75">{site.tagline}</MonoLabel>
            </div>
          </div>

          <div className="flex flex-col gap-6">
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 sm:flex sm:gap-8">
              {footer.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-bold uppercase tracking-tightest text-off/85 transition-colors duration-200 hover:text-red"
                    style={{ fontSize: '0.76rem' }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* socials: one compact row of icon buttons */}
          <div className="relative flex flex-wrap items-center gap-3 sm:justify-end">
            <p className="mr-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-grey">
              {connect.follow}
            </p>
            <ul className="flex items-center gap-2">
              {connect.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} — ${s.handle}`}
                    title={`${s.label} · ${s.handle}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-off transition-colors duration-200 hover:border-red hover:text-red"
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

      {/* the logo's X, large and faint, bleeding off the bottom */}
      <div className="relative mt-2 h-[16vw] select-none overflow-hidden sm:h-[12vw]" aria-hidden="true">
        <LogoX className="mx-auto h-[30vw] w-auto opacity-[0.07] sm:h-[24vw]" />
      </div>

      <div className="shell relative z-10 border-t border-white/10 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-grey">
            {site.copyright}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={links.donate}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-grey hover:text-red"
            >
              Donate
            </a>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-grey/75">
              {site.credit}
            </p>
            <FlagHint />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
