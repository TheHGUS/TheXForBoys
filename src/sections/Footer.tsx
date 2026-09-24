import { footer, links, site } from '../content/copy';
import { LogoImage } from '../components/LogoImage';
import { MonoLabel } from '../components/ui';
import { XGlyph } from '../components/svg/XGlyph';
import { XPattern } from '../components/XPattern';
import { Flag, FlagHint } from '../components/Flag';

/**
 * FOOTER — max ~70vh.
 * A large real logo, the link set, the copyright, and a giant cropped outlined
 * X bleeding off the bottom edge. Round 01's version left most of a viewport
 * empty; this one is sized to its content instead.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-8">
      <XPattern opacity={0.05} size={150} />

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
        </div>
      </div>

      {/* giant cropped X bleeding off the bottom */}
      <div className="relative mt-2 select-none" aria-hidden="true">
        <XGlyph
          variant="outline"
          className="mx-auto block h-[30vw] w-auto translate-y-[26%] text-off/[0.09] sm:h-[26vw]"
        />
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
