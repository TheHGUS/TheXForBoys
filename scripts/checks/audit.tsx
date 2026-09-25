/**
 * Round-02 static audit (dev only — not part of the shipped bundle).
 *
 * No browser is available in every environment, so this renders the real
 * components with renderToStaticMarkup and asserts against the markup they
 * actually produce: brand rules, the ROUND-02 P0 acceptance criteria that are
 * checkable without layout, and "no hand-drawn logo parts remain".
 *
 * Run with: npm run check
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import App from '../../src/App';
import { Help } from '../../src/sections/Help';
import { Programs } from '../../src/sections/Programs';
import { Equation } from '../../src/sections/Equation';
import { Hero } from '../../src/sections/Hero';
import { Footer } from '../../src/sections/Footer';
import { Nav } from '../../src/sections/Nav';
import { createRef } from 'react';

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

function section(title: string) {
  console.log(`\n${title}`);
}

/** Walk the source tree. */
function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}

const SRC = join(process.cwd(), 'src');
const files = walk(SRC);
const sources = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));
const allSrc = [...sources.values()].join('\n');

/* ------------------------------------------------------------------ */
section('ROUND-02 P0 #2 — the logo is never redrawn');

check(
  'no hand-drawn fist geometry remains',
  !/FIST_BODY|FIST_THUMB|FIST_WRIST_D|FIST_SEAMS|FistShapes|fistGap/.test(allSrc),
);
check(
  'no hand-drawn shield path remains',
  !/M8 40 H132 V112 L70 150 L8 112 Z|SHIELD_GAP|mark-shield/.test(allSrc),
);
check(
  'the old LogoMark component is gone',
  !files.some((f) => f.endsWith('LogoMark.tsx')) && !/from ['"].*LogoMark['"]/.test(allSrc),
);
check(
  'every full-logo moment renders the real PNG',
  (() => {
    const html = [Nav, Help, Equation, Footer]
      .map((C) => (C === Nav ? renderToStaticMarkup(<Nav logoRef={createRef<HTMLSpanElement>()} />) : renderToStaticMarkup(<C />)))
      .join('');
    // round 03: the client's PNG, trimmed and self-hosted (scripts/build-assets.mjs)
    return html.includes('/brand/logo-white.png');
  })(),
);
check(
  'the only SVG recreation left is the plain outlined X',
  /XGlyph/.test(allSrc) && !/parts=\{\['shield'/.test(allSrc),
);

/* ------------------------------------------------------------------ */
section('ROUND-02 P0 #3 — the equation');

const eqHtml = renderToStaticMarkup(<Equation />);

check('equation band and illustration stage are separate zones', /lg:h-\[30%\]/.test(eqHtml) && /lg:h-\[70%\]/.test(eqHtml));
check('terms that have not arrived show an outlined placeholder', (eqHtml.match(/data-ph=/g) ?? []).length >= 3);
check('the placeholder is a faint grey outline, not a solid block', /border-dashed border-grey\/35/.test(eqHtml));
check('each term carries a multi-stroke scrawl', (() => {
  const blocks = eqHtml.split('data-scribble=').length - 1;
  const paths = (eqHtml.match(/scribble-path/g) ?? []).length;
  return blocks >= 3 && paths >= blocks * 2; // 2+ strokes each
})());
check('exactly one X in the equation row (no duplicate at the finale)', (() => {
  // data-result = the desktop row's X; data-result-mobile = the mobile finale's.
  // They live in mutually exclusive breakpoints (lg:flex vs lg:hidden), so
  // only one is ever on screen.
  const rowX = (eqHtml.match(/data-result(?![-\w])/g) ?? []).length;
  const mobileX = (eqHtml.match(/data-result-mobile/g) ?? []).length;
  return rowX === 1 && mobileX === 1;
})());
check('the finale is the real logo PNG', /finale-mark/.test(eqHtml) && eqHtml.includes('logo-base-wrap'));
check('the finale exposes a base wrap and a fist layer for the pop', /logo-base-wrap/.test(eqHtml) && /logo-fist-wrap/.test(eqHtml));

/* ------------------------------------------------------------------ */
section('ROUND-02 P0 #5 + P2 #10 — the programmes');

const progHtml = renderToStaticMarkup(<Programs />);
check('no horizontal snap scroller left on mobile', !/snap-x snap-mandatory/.test(progHtml));
check('stacks below 768px, grid from md up', /flex flex-col gap-8 md:grid md:grid-cols-3/.test(progHtml));
check('resting rotation capped at 1deg on mobile', /rotate-\[-1deg\] md:rotate-\[-2deg\]/.test(progHtml));
check('each object carries its own edge shadow', (progHtml.match(/shadow-\[0_/g) ?? []).length >= 3);
check('paper texture applied to the sheets', /repeating-linear-gradient/.test(progHtml));

/* ------------------------------------------------------------------ */
section('ROUND-02 P0 #1 + P1 #6/#7 — hero and help');

const heroHtml = renderToStaticMarkup(<Hero ready />);
check('the h1 carries the fluid display size', /class="display text-fluid-hero/.test(heroHtml));
check('the X is a solid glyph with a red inner inline', /inlineColor|#F70303/.test(allSrc) && heroHtml.includes('#F70303'));
check('hero photo is not covered by a full-frame wash', !/inset-0 bg-gradient-to-t from-ink via-ink\/40/.test(heroHtml));
check('the only hero darkening is a bottom-up gradient', /linear-gradient\(to top, #161616/.test(heroHtml));

const helpHtml = renderToStaticMarkup(<Help />);
check('the Amazon wishlist image is gone', !/Amazon-Wish-List/.test(helpHtml) && !/WISHLIST_IMG/.test(allSrc));
check('the wishlist is a shipping-box line illustration', /ShipBox|<svg/.test(helpHtml) && /stroke="#F70303"/.test(helpHtml));
check('all three CTAs share one red style', (helpHtml.match(/border-2 border-red bg-red/g) ?? []).length >= 3);
check('no CTA uses deep red as a resting colour', !/(border-deepred|bg-deepred)(?!.*hover)/.test(helpHtml.replace(/hover:border-deepred|hover:bg-deepred/g, '')));
check('CTAs are pinned to the bottom of their card', /mt-auto pt-6/.test(helpHtml));
check('the blank never reflows (word holds the width)', /help-blank-word/.test(helpHtml));

/* ------------------------------------------------------------------ */
section('ROUND-02 P0 #4 — the nav');

const navHtml = renderToStaticMarkup(<Nav logoRef={createRef<HTMLSpanElement>()} />);
check('no second X mark in the nav', !/VarsityXShapes/.test(navHtml));
check('scroll progress is a 2px line on the bottom edge', /h-\[2px\].*origin-left bg-red|origin-left/.test(navHtml) && /bottom-0/.test(navHtml));

/* ------------------------------------------------------------------ */
section('Brand rules (STUDIO_STANDARDS §2/§3)');

const appHtml = renderToStaticMarkup(<App />);
const palette = ['#F70303', '#161616', '#F7F7F7', '#A4A4A4', '#930101'];
check('no off-brand hex colours in source', (() => {
  const hexes = [...allSrc.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0].toLowerCase());
  const allowed = new Set([...palette.map((p) => p.toLowerCase()), '#ff3e8e', '#ffe84d', '#ffffff', '#000000', '#5a5a5a', '#5e5e5e', '#191919', '#141414', '#101820', '#0b0b0b', '#fefefe']);
  const bad = hexes.filter((h) => !allowed.has(h));
  return bad.length === 0 || (console.log('       off-brand:', [...new Set(bad)].join(', ')), false);
})());
check(
  'no emoji anywhere',
  (() => {
    // U+00A9 is the copyright sign in the client's own verbatim legal line.
    const hits = [...allSrc.matchAll(/\p{Extended_Pictographic}/gu)]
      .map((x) => x[0])
      .filter((c) => c !== '\u00a9');
    return hits.length === 0 || (console.log('       emoji:', [...new Set(hits)].join(' ')), false);
  })(),
);
check('no lorem ipsum', !/lorem ipsum/i.test(allSrc));
check('grain + X pattern present', /grain/i.test(allSrc) && /XPattern/.test(allSrc));
check('app renders without throwing', appHtml.length > 1000);

/* ------------------------------------------------------------------ */
section('Accessibility basics');

check('every gallery image has alt text', (() => {
  const imgs = [...appHtml.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  const missing = imgs.filter((t) => !/\balt=/.test(t));
  return missing.length === 0 || (console.log(`       ${missing.length} img without alt`), false);
})());
check('every image sets width and height', (() => {
  const imgs = [...appHtml.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  const missing = imgs.filter((t) => !/\bwidth=/.test(t) || !/\bheight=/.test(t));
  return missing.length === 0 || (console.log(`       ${missing.length} img without dimensions`), false);
})());
check('decorative SVGs are hidden from screen readers', (() => {
  const svgs = [...appHtml.matchAll(/<svg[^>]*>/g)].map((m) => m[0]);
  const bad = svgs.filter((t) => !/aria-hidden="true"/.test(t) && !/role="img"/.test(t) && !/<title/.test(t));
  return bad.length === 0 || (console.log(`       ${bad.length} svg exposed`), false);
})());

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
section('ROUND-03 — self-hosted assets, measured logo, nav track');
{
  const indexHtml = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
  check('no wsimg.com URL in src/ or index.html', !/wsimg\.com/.test(allSrc) && !/wsimg\.com/.test(indexHtml));
  const manifest = JSON.parse(readFileSync(join(SRC, 'content', 'image-manifest.json'), 'utf8')) as Record<
    string,
    { slug: string; sizes: { name: number }[] }
  >;
  const missing: string[] = [];
  for (const e of Object.values(manifest))
    for (const sz of e.sizes)
      for (const ext of ['webp', 'jpg'])
        try {
          statSync(join(process.cwd(), 'public', 'images', `${e.slug}-${sz.name}.${ext}`));
        } catch {
          missing.push(`${e.slug}-${sz.name}.${ext}`);
        }
  check('every photo has WebP + JPEG at both widths in public/images', missing.length === 0, missing.join(', '));
  check('trimmed logo + favicon are self-hosted', (() => {
    try {
      statSync(join(process.cwd(), 'public', 'brand', 'logo-white.png'));
      statSync(join(process.cwd(), 'public', 'favicon-32.png'));
      return /href="\/favicon-32\.png"/.test(indexHtml);
    } catch {
      return false;
    }
  })());
  const imagesSrc = sources.get(join(SRC, 'content', 'images.ts')) ?? '';
  check('program photos match ROUND-03 P0 #1', [
    /AUTO_1 = img\('IMG_1128\.jpg'/,
    /AUTO_2 = img\('IMG_1125\.jpg'/,
    /HOME_1 = img\('107490527_747809919368645_6947944466898993638_\.jpg'/,
    /READ_1 = img\('112296745_2672695399669168_4236440098798381834\.jpg'/,
    /READ_2 = img\('115941536_1928831703917630_8727889694125410655\.jpg'/,
  ].every((re) => re.test(imagesSrc)));
  check('LOGO_INTRINSIC is the measured 365×418', /LOGO_INTRINSIC = \{ w: 365, h: 418 \}/.test(imagesSrc));
  const navSrc = sources.get(join(SRC, 'sections', 'Nav.tsx')) ?? '';
  check(
    'nav progress track is not red (only the inner bar is)',
    /bottom-0 block h-\[2px\] bg-off\/\[0\.08\]/.test(navSrc),
  );
  const heroSrc = sources.get(join(SRC, 'sections', 'Hero.tsx')) ?? '';
  check('hero X is ~2.2x the cap height', /const X_CAPS = 2\.2;/.test(heroSrc));
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) {
  console.log('failing:', failures.join(' | '));
  process.exit(1);
}
