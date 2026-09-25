/**
 * Static audit (dev only — not part of the shipped bundle).
 *
 * Renders the real components with renderToStaticMarkup and asserts the rules
 * the site currently lives by (round 05): the client's verbatim copy, the
 * real logo and logo X, self-hosted assets, brand logos on the giving
 * options, clean CTAs, no marker scribbles, menus that only point at this
 * page, and the accessibility basics.
 *
 * Run with: npm run check
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRef } from 'react';
import App from '../../src/App';
import { Hero } from '../../src/sections/Hero';
import { Programs } from '../../src/sections/Programs';
import { Albany } from '../../src/sections/Albany';
import { Girls } from '../../src/sections/Girls';
import { Help } from '../../src/sections/Help';
import { Connect } from '../../src/sections/Connect';
import { Footer } from '../../src/sections/Footer';
import { Nav } from '../../src/sections/Nav';
import * as copy from '../../src/content/copy';

let pass = 0;
let fail = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail = '') {
  if (ok) {
    pass += 1;
    console.log(`  ok   ${name}`);
  } else {
    fail += 1;
    failures.push(name);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}
const section = (t: string) => console.log(`\n${t}`);

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}
const exists = (...p: string[]) => {
  try {
    statSync(join(process.cwd(), ...p));
    return true;
  } catch {
    return false;
  }
};

const SRC = join(process.cwd(), 'src');
const files = walk(SRC);
const allSrc = files.map((f) => readFileSync(f, 'utf8')).join('\n');
const indexHtml = readFileSync(join(process.cwd(), 'index.html'), 'utf8');

const html = {
  nav: renderToStaticMarkup(<Nav logoRef={createRef<HTMLSpanElement>()} />),
  hero: renderToStaticMarkup(<Hero />),
  programs: renderToStaticMarkup(<Programs />),
  albany: renderToStaticMarkup(<Albany />),
  girls: renderToStaticMarkup(<Girls />),
  help: renderToStaticMarkup(<Help />),
  connect: renderToStaticMarkup(<Connect />),
  footer: renderToStaticMarkup(<Footer />),
};
const page = Object.values(html).join('\n');
const text = page.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

/* ------------------------------------------------------------------ */
section('Copy — the client\'s own words, exactly');
{
  // every line below appears on thexforboys.org, character for character
  const VERBATIM = [
    'Our mission is to provide our sons with new outlets to explore their unique interests & talents.',
    'Albany, GA has the highest concentrated poverty rate in Georgia. It is also ranked the 7th most dangerous city in U.S. with offenders being most likely black males as young as eleven years old.',
    'Donate to The X for Boys & Girls',
    'Donate to The X',
    'Your support and contributions will enable us to meet our goals for Life Prep',
    'How You Can Help',
    'Registries & Wishlists',
    'Our Programs',
    'Automotive Repair Workshops',
    'We teach simple automotive repair such as oil change, brake pad replacement, alternator repair, tire changing etc.',
    'Home Improvement Workshops',
    'We teach simple home improvement such as replacing light fixtures, sheetrock, interior and exterior painting, popcorn ceilings, etc.',
    'Reading Literacy',
    'We host a weekly book club to improve reading comprehension and vocabulary building. This also helps with releasing stress, seeing that they are allowed to be vocal about any and everything on their minds.',
    'Connect With Us!',
    'Learn more about our upcoming events, fundraisers, and more!',
    'Follow @thexforboys',
    'Copyright © 2026 The "X" for Boys - All Rights Reserved.',
  ];
  const flat = text.replace(/\s+/g, ' ');
  const missing = VERBATIM.filter((v) => !flat.includes(v));
  check('every verbatim line renders exactly (accent styling never splits words)', missing.length === 0, missing.join(' | '));

  const uses = (page.match(/Solving for X/g) ?? []).length;
  check('"Solving for X" appears in exactly two places', uses === 2, `${uses}`);
  const retired = ["Let's solve it together", 'Same equation. Every child', "That's the equation", 'You + ', 'Three workshops. One equation', 'Give via PayPal'];
  check('retired studio lines are gone', !retired.some((r) => allSrc.includes(r)), retired.filter((r) => allSrc.includes(r)).join(', '));
  check('nav uses their own labels', ['Home', 'Learn More', 'Support Us', 'Gallery'].every((l) => copy.nav.links.some((n) => n.label === l)));
}

/* ------------------------------------------------------------------ */
section('Brand — real logo, logo X, type');
{
  check('the logo is the self-hosted client PNG', page.includes('/brand/logo-white.png') && exists('public', 'brand', 'logo-white.png'));
  check('the X is the logo\'s own X (shield removed)', page.includes('/brand/logo-x.png') && exists('public', 'brand', 'logo-x.png'));
  check('no X is recreated in SVG', !exists('src', 'components', 'svg', 'XGlyph.tsx') && !/VarsityXShapes|XGlyph/.test(allSrc));
  check('the brand name is in the header', html.nav.includes('The &quot;X&quot; for Boys'));
  check('headings are medium weight, not black caps', /@apply font-sans font-medium/.test(readFileSync(join(SRC, 'index.css'), 'utf8')));
  check('one script accent font is loaded', /family=Yellowtail/.test(indexHtml) && /class="accent/.test(page));
  check('favicon is self-hosted', /href="\/favicon-32\.png"/.test(indexHtml));
}

/* ------------------------------------------------------------------ */
section('Clean design — no scribbles, no gloss, less motion');
{
  check('no marker scribble / underline / highlighter components remain', !exists('src', 'components', 'svg', 'Marker.tsx') && !/Marker(Scribble|Underline|Scrawl|Check)|HighlighterSwipe|GreaseCircle|RoughRule/.test(allSrc));
  check('no glossy/embossed CTA style', !/btn-gloss/.test(allSrc));
  check('no intro, no film grain', !exists('src', 'sections', 'Intro.tsx') && !exists('src', 'components', 'Grain.tsx'));
  check('the programmes appear once (no Equation section)', !exists('src', 'sections', 'Equation.tsx') && (page.match(/Automotive Repair Workshops/g) ?? []).length === 1);
  check('program sheets have square corners', !/<article[^>]*rounded/.test(html.programs));
  check('program sheets carry no blank lines', !/____/.test(html.programs) && !/DATE DUE|DATE:/.test(html.programs));
  check('no reading-card stamps', !/<Stamp\b|WEEKLY/.test(html.programs));
}

/* ------------------------------------------------------------------ */
section('Giving options carry their platform\'s logo');
{
  check('GoGetFunding logo on DONATE', /\/brands\/gogetfunding\.svg/.test(html.help) && exists('public', 'brands', 'gogetfunding.svg'));
  check('PayPal logo on GIVE', /\/brands\/paypal\.svg/.test(html.help) && exists('public', 'brands', 'paypal.svg'));
  check('Amazon logo on Registries & Wishlists', /\/brands\/amazon\.svg/.test(html.help) && exists('public', 'brands', 'amazon.svg'));
  check('the old crossed-out box drawing is gone', !/ShipBox/.test(allSrc));
}

/* ------------------------------------------------------------------ */
section('Menus and footer');
{
  const menuHrefs = [...(html.nav + html.footer).matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)].flatMap((m) =>
    [...m[1].matchAll(/href="([^"]+)"/g)].map((h) => h[1]),
  );
  check(
    'menus only link to this page (plus the Donate platform)',
    menuHrefs.length > 0 && menuHrefs.every((h) => h.startsWith('#') || h === copy.links.goGetFunding),
    menuHrefs.join(' '),
  );
  check('footer nav includes Donate', /<nav[^>]*>[\s\S]*?>Donate<[\s\S]*?<\/nav>/.test(html.footer));
  check('footer credit reads "Designed by The Harmon Group"', html.footer.includes('Designed by The Harmon Group'));
  check('no "Q — client notes" hint in the footer', !/client notes/i.test(html.footer));
  check('copyright and credit never wrap', (html.footer.match(/whitespace-nowrap/g) ?? []).length >= 2);
  check('socials live in the footer', /aria-label="Instagram/.test(html.footer));
}

/* ------------------------------------------------------------------ */
section('Assets and accessibility');
{
  check('no wsimg.com URL anywhere', !/wsimg\.com/.test(allSrc) && !/wsimg\.com/.test(indexHtml));
  const manifest = JSON.parse(readFileSync(join(SRC, 'content', 'image-manifest.json'), 'utf8')) as Record<string, { slug: string; sizes: { name: number }[] }>;
  const missing = Object.values(manifest).flatMap((e) =>
    e.sizes.flatMap((s) => ['webp', 'jpg'].filter((x) => !exists('public', 'images', `${e.slug}-${s.name}.${x}`)).map((x) => `${e.slug}-${s.name}.${x}`)),
  );
  check('every photo is self-hosted as WebP + JPEG', missing.length === 0, missing.join(', '));
  const imgs = [...page.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  check('every <img> has width and height', imgs.every((i) => /width="/.test(i) && /height="/.test(i)));
  check('every content <img> has alt text', imgs.every((i) => /alt="/.test(i)));
  check('decorative SVGs are hidden from screen readers', [...page.matchAll(/<svg\b[^>]*>/g)].every((m) => /aria-hidden="true"|role="img"|width="0"/.test(m[0])));
  check('a skip link exists', renderToStaticMarkup(<App />).includes('href="#main"'));
  check('no emoji', ![...allSrc.matchAll(/\p{Extended_Pictographic}/gu)].some((m) => m[0] !== '©'));
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) {
  console.log('failing:', failures.join(' | '));
  process.exit(1);
}
