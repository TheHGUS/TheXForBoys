/**
 * Cuts the X (with its raised fist) out of the client's logo PNG — no shield.
 * Dev only; outputs are committed.
 *
 *   node scripts/cut-logo-x.mjs      (after scripts/build-assets.mjs)
 *
 * Nothing is redrawn: the X is the client's own pixels. The lockup is white
 * artwork with black keylines, and every visible piece of the home-plate
 * shield is its own connected white region (left bar, right bar, bottom
 * point, and a sliver showing in the top notch of the X). Those regions — and
 * their anti-aliased edges — are made transparent; the X's fill and its white
 * keyline ring are kept.
 *
 * Writes public/brand/logo-x.png (full size) and public/brand/logo-x-tile.png
 * (small, for the tiled brand pattern).
 */
import sharp from 'sharp';

const SRC = 'public/brand/logo-white.png';
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const C = info.channels;
const N = W * H;

/* ---- label connected white regions ---- */
const white = new Uint8Array(N);
for (let i = 0; i < N; i++) white[i] = data[i * C + 3] > 128 && data[i * C] > 128 ? 1 : 0;
const lab = new Int32Array(N).fill(-1);
const comps = [];
for (let s = 0; s < N; s++) {
  if (!white[s] || lab[s] >= 0) continue;
  const id = comps.length;
  let n = 0;
  const stack = [s];
  lab[s] = id;
  while (stack.length) {
    const p = stack.pop();
    n++;
    const x = p % W;
    for (const q of [p - 1, p + 1, p - W, p + W]) {
      if (q < 0 || q >= N || Math.abs((q % W) - x) > 1) continue;
      if (white[q] && lab[q] < 0) {
        lab[q] = id;
        stack.push(q);
      }
    }
  }
  comps.push({ n });
}

/* the two largest regions are the X's fill and its white keyline ring */
const order = comps.map((c, id) => [c.n, id]).sort((a, b) => b[0] - a[0]);
const keep = new Set([order[0][1], order[1][1]]);
const isShield = (id) => id >= 0 && !keep.has(id) && comps[id].n > 40;

const out = Buffer.from(data);
for (let i = 0; i < N; i++) if (isShield(lab[i])) out[i * C + 3] = 0;

/* soft edge pixels of the removed pieces that aren't hugging the kept X */
const within = (i, r, test) => {
  const x = i % W;
  const y = (i / W) | 0;
  for (let dy = -r; dy <= r; dy++)
    for (let dx = -r; dx <= r; dx++) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      if (test(lab[yy * W + xx])) return true;
    }
  return false;
};
for (let i = 0; i < N; i++) {
  if (out[i * C + 3] === 0 || lab[i] >= 0) continue;
  if (within(i, 2, isShield) && !within(i, 3, (id) => keep.has(id))) out[i * C + 3] = 0;
}

const x = sharp(out, { raw: { width: W, height: H, channels: C } }).trim({ threshold: 0 });
const buf = await x.png().toBuffer();
await sharp(buf).png({ compressionLevel: 9 }).toFile('public/brand/logo-x.png');
// pattern tile: the X at 56% of a square transparent cell, so tiles breathe
const small = await sharp(buf).resize({ width: 90 }).png().toBuffer();
await sharp({ create: { width: 160, height: 160, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: small, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile('public/brand/logo-x-tile.png');
// red version for accented words: the white fill becomes brand red
// (#F70303); the black keylines stay black; anti-aliased greys blend
{
  const { data: px, info: pi } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const red = Buffer.from(px);
  for (let i = 0; i < pi.width * pi.height; i++) {
    const o = i * pi.channels;
    const l = (px[o] + px[o + 1] + px[o + 2]) / 765; // 0 = black, 1 = white
    red[o] = Math.round(0xf7 * l);
    red[o + 1] = Math.round(0x03 * l);
    red[o + 2] = Math.round(0x03 * l);
  }
  await sharp(red, { raw: { width: pi.width, height: pi.height, channels: pi.channels } })
    .png({ compressionLevel: 9 })
    .toFile('public/brand/logo-x-red.png');
}
const m = await sharp('public/brand/logo-x.png').metadata();
console.log(`  logo-x.png ${m.width}×${m.height}`);
