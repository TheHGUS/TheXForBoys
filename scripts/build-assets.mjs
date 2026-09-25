/**
 * Self-hosts every client image (ROUND-03 P0 #6, P1 #9). Dev only.
 *
 *   node scripts/build-assets.mjs
 *
 * - Downloads each photo from the client's Wix library once into .cache/src
 *   (the wsimg.com URLs are only ever touched here, never by the site).
 * - Writes public/images/<slug>-{1800,900}.{webp,jpg} and
 *   src/content/image-manifest.json with the real pixel sizes.
 * - Trims the transparent padding off the white logo PNG (612×612, artwork at
 *   x 112–476, y 72–489) into public/brand/logo-white.png, and cuts favicons.
 *
 * Outputs are committed, so a build never needs the network.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://img1.wsimg.com/isteam/ip/f58551bb-d6b3-44c4-b114-6ddab0ea1f56/';
const LOGO_FILE = 'The X for boys logo 04-02 WHITE.png';

const PHOTOS = [
  'DSC06682-2.jpg',
  '_DSC8134.JPG',
  'DSC01956.JPG',
  'IMG_1121.jpg',
  'IMG_1125.jpg',
  'IMG_1128.jpg',
  'IMG_1131.jpg',
  'DY7A8354.jpg',
  '107490527_747809919368645_6947944466898993638_.jpg',
  '107843755_276930733598966_2003922725532217508_.jpg',
  '109509535_3311618885729231_3091300661327912455.jpg',
  '110994707_2639230719661263_1074496696028095026.jpg',
  '111160954_290062202204579_2370814296440233629_.jpg',
  '111202590_290813609027739_5402076106700616792_.jpg',
  '112296745_2672695399669168_4236440098798381834.jpg',
  '115374703_304621120733579_3822870454740553317_.jpg',
  '115830922_282651392950498_8991273928329165756_.jpg',
  '115941536_1928831703917630_8727889694125410655.jpg',
  '115990942_1198274453863333_8796005110036790284.jpg',
];

const WIDTHS = [1800, 900];
const CACHE = '.cache/src';
const OUT = 'public/images';

export const slug = (file) => file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function fetchOnce(url, dest) {
  if (existsSync(dest)) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });
mkdirSync('public/brand', { recursive: true });

/* ---------------- photos ---------------- */
const manifest = {};
for (const file of PHOTOS) {
  const src = join(CACHE, file);
  await fetchOnce(`${BASE}${encodeURIComponent(file)}/:/rs=w:1800`, src);
  const meta = await sharp(src).metadata();
  const s = slug(file);
  const sizes = [];
  for (const w of WIDTHS) {
    const pipe = () => sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
    const info = await pipe().webp({ quality: 74 }).toFile(join(OUT, `${s}-${w}.webp`));
    await pipe().jpeg({ quality: 78, mozjpeg: true }).toFile(join(OUT, `${s}-${w}.jpg`));
    sizes.push({ name: w, w: info.width, h: info.height });
  }
  manifest[file] = { slug: s, w: meta.width, h: meta.height, sizes };
  console.log(`  ${s}  ${meta.width}×${meta.height}`);
}
writeFileSync('src/content/image-manifest.json', JSON.stringify(manifest, null, 2) + '\n');

/* ---------------- logo ---------------- */
const logoSrc = join(CACHE, 'logo.png');
await fetchOnce(BASE + encodeURIComponent(LOGO_FILE), logoSrc);

const { data, info } = await sharp(logoSrc).raw().toBuffer({ resolveWithObject: true });
let x0 = info.width, x1 = 0, y0 = info.height, y1 = 0;
for (let y = 0; y < info.height; y++)
  for (let x = 0; x < info.width; x++)
    if (data[(y * info.width + x) * info.channels + 3] > 0) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
const box = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
console.log(`  logo ${info.width}×${info.height}, artwork`, box);

await sharp(logoSrc).extract(box).png({ compressionLevel: 9 }).toFile('public/brand/logo-white.png');

/* favicons: the real logo, centred on an ink square */
async function favicon(size, file) {
  const pad = Math.round(size * 0.1);
  const inner = await sharp(logoSrc)
    .extract(box)
    .resize({ width: size - pad * 2, height: size - pad * 2, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#161616' } })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(file);
}
await favicon(32, 'public/favicon-32.png');
await favicon(180, 'public/apple-touch-icon.png');
await favicon(512, 'public/icon-512.png');
console.log('  done');
