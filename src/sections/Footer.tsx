import { footer, links, site } from '../content/copy';
import { LOGO_PNG } from '../content/images';
import { MonoLabel } from '../components/ui';
import { LogoMark } from '../components/svg/LogoMark';
import { XPattern } from '../components/XPattern';
import { FlagHint } from '../components/Flag';

/**
 * FOOTER
 * A giant cropped outlined X bleeding off the bottom edge, the drifting X
 * pattern behind it, links, copyright and our credit.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-8">
      <XPattern opacity={0.05} size={150} />

      <div className="shell relative z-10">
        <div className="flex flex-col gap-10 border-t border-white/10 pt-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <img
              src={LOGO_PNG}
              alt={`${site.shortName} logo`}
              width={132}
              height={44}
              className="h-10 w-auto"
              loading="lazy"
              decoding="async"
            />
            <MonoLabel className="mt-4 block text-grey">
              {site.location} · {site.ein}
            </MonoLabel>
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
      <div className="relative mt-6 select-none" aria-hidden="true">
        <LogoMark
          parts={['x']}
          xVariant="outline"
          fit="x"
          className="mx-auto block h-[42vw] w-auto translate-y-[22%] text-off/[0.09] sm:h-[38vw]"
        />
      </div>

      <div className="shell relative z-10 border-t border-white/10 py-6">
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
