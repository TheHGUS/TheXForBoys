/**
 * Round-02 art preview harness (dev only — not part of the shipped bundle).
 *
 * Renders the *real* components from src/components/svg/* with
 * renderToStaticMarkup and rasterises them to PNG so the line art can be
 * eyeballed in this sandbox (no browser is available here).
 *
 * Run with: npm run preview:art
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { DiscBrake, StudWall, BlueprintGrid, BookSpread, ShipBox, HighlighterSwipe } from '../src/components/svg/Illustrations';
import { MarkerScribbleLoops } from '../src/components/svg/Marker';

const OUT = process.argv[2] ?? '.arena/art';
mkdirSync(OUT, { recursive: true });

const INK = '#161616';
const OFF = '#F7F7F7';

/** Wrap raw inner markup in a poster-sized dark frame. */
function poster(w: number, h: number, inner: string, color = OFF, pad = 0): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${INK}"/>
  <g transform="translate(${pad} ${pad})" color="${color}">${inner}</g>
</svg>`;
}

/** Scale a component's own markup into a w x h box. */
function frame(markup: string, w: number, h: number): string {
  return `<g>${markup.replace(/<svg/, `<svg x="0" y="0" width="${w}" height="${h}"`)}</g>`;
}

const jobs: Array<[string, string]> = [];

/* ---- exploded disc brake, mid-assembly pose and assembled pose ---- */
jobs.push(['brake', poster(1040, 520, frame(renderToStaticMarkup(<DiscBrake className="text-off" />), 1040, 520))]);

/* ---- stud wall over blueprint ---- */
jobs.push([
  'wall',
  poster(
    800,
    520,
    `${frame(renderToStaticMarkup(<BlueprintGrid className="text-off" />), 800, 520).replace(
      /currentColor/g,
      'rgba(247,247,247,0.22)',
    )}${frame(renderToStaticMarkup(<StudWall className="text-off" />), 800, 520)}`,
  ),
]);

/* ---- book spread + highlighter words ---- */
jobs.push([
  'book',
  poster(
    800,
    520,
    `${frame(renderToStaticMarkup(<BookSpread className="text-off" />), 800, 520)}
     <g transform="translate(120 250)">${frame(
       renderToStaticMarkup(<HighlighterSwipe className="text-red" seed={17} />),
       240,
       40,
     )}</g>`,
  ),
]);

/* ---- shipping box (wishlist) ---- */
jobs.push(['shipbox', poster(560, 448, frame(renderToStaticMarkup(<ShipBox className="text-off" />), 560, 448))]);

/* The X and the brand pattern are the client's own PNG since round 04
   (public/brand/logo-x.png) — nothing to rasterise here. */

/* ---- the scribble that hides a term before it resolves ---- */
jobs.push([
  'scribble',
  poster(
    900,
    180,
    frame(renderToStaticMarkup(<MarkerScribbleLoops className="text-red" seed={11} />), 900, 180),
  ),
]);

let i = 0;
for (const [name, svg] of jobs) {
  i += 1;
  const file = `${OUT}/${String(i).padStart(2, '0')}-${name}.png`;
  // eslint-disable-next-line no-await-in-loop
  await sharp(Buffer.from(svg)).png().toFile(file);
  writeFileSync(`${OUT}/${String(i).padStart(2, '0')}-${name}.svg`, svg);
  console.log('wrote', file);
}
