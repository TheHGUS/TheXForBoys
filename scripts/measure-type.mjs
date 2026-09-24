/**
 * Round-02 measurement helper (not part of the shipped bundle).
 *
 * Parses the real Libre Franklin 900 Black TTF and reports exact advance
 * widths so the hero acceptance test in brief/ROUND-02.md can be checked
 * numerically: "at 1440x900 the headline occupies ~45-55% of viewport width".
 *
 * Usage: node scripts/measure-type.mjs <path-to-ttf>
 */
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/measure-type.mjs <ttf>');
  process.exit(1);
}

const buf = readFileSync(file);
let o = 0;
const u8 = () => buf.readUInt8(o++);
const u16 = () => ((o += 2), buf.readUInt16BE(o - 2));
const i16 = () => ((o += 2), buf.readInt16BE(o - 2));
const u32 = () => ((o += 4), buf.readUInt32BE(o - 4));
const seek = (n) => (o = n);

/* ---------------- table directory ---------------- */
const sfnt = u32();
if (sfnt !== 0x00010000 && sfnt !== 0x74727565) throw new Error('not a TrueType font');
const numTables = u16();
u16();
u16();
u16();
const tables = {};
for (let i = 0; i < numTables; i++) {
  const tag = buf.toString('latin1', o, o + 4);
  o += 4;
  u32(); // checksum
  const offset = u32();
  const length = u32();
  tables[tag] = { offset, length };
}

/* ---------------- head ---------------- */
seek(tables.head.offset);
u32();
u32();
u32();
u32();
u16();
const unitsPerEm = u16();

/* ---------------- hhea ---------------- */
seek(tables.hhea.offset);
u32();
i16(); // ascender
i16(); // descender
i16();
// lineGap, advanceWidthMax, minLSB, minRSB, xMaxExtent, caretSlopeRise,
// caretSlopeRun, caretOffset, 4x reserved, metricDataFormat = 13 more i16/u16
for (let i = 0; i < 12; i++) u16();
const numberOfHMetrics = u16();

/* ---------------- OS/2 cap height ---------------- */
let sCapHeight = null;
if (tables['OS/2']) {
  seek(tables['OS/2'].offset);
  const version = u16();
  if (version >= 2) {
    // skip to sCapHeight: after version(2) there are 86 bytes before sCapHeight
    // v2 layout: xAvgCharWidth(2) usWeightClass(2) usWidthClass(2) fsType(2)
    // ySubscript*(8) ySuperscript*(8) yStrikeout*(4) sFamilyClass(2) panose(10)
    // ulUnicodeRange*(16) achVendID(4) fsSelection(2) usFirstCharIndex(2)
    // usLastCharIndex(2) sTypoAscender(2) sTypoDescender(2) sTypoLineGap(2)
    // usWinAscent(2) usWinDescent(2) [v1+: ulCodePageRange1(4) ulCodePageRange2(4)]
    // [v2+: sxHeight(2) sCapHeight(2) ...]
    const capOffset = tables['OS/2'].offset + 2 + 2 + 2 + 2 + 2 + 8 + 8 + 4 + 2 + 10 + 16 + 4 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 4 + 4 + 2;
    seek(capOffset);
    sCapHeight = i16();
  }
}

/* ---------------- maxp ---------------- */
seek(tables.maxp.offset);
u32();
const numGlyphs = u16();

/* ---------------- cmap (format 4, BMP) ---------------- */
seek(tables.cmap.offset);
u16();
const numSub = u16();
let sub4 = null;
const subs = [];
for (let i = 0; i < numSub; i++) {
  const platform = u16();
  const encoding = u16();
  const off = u32();
  subs.push({ platform, encoding, off });
}
for (const s of subs) {
  const base = tables.cmap.offset + s.off;
  const format = buf.readUInt16BE(base);
  if (format === 4) {
    sub4 = base;
    break;
  }
}
if (!sub4) throw new Error('no format-4 cmap');

const segCountX2 = buf.readUInt16BE(sub4 + 6);
const segCount = segCountX2 / 2;
const endStart = sub4 + 14;
const startStart = endStart + segCountX2 + 2;
const deltaStart = startStart + segCountX2;
const rangeStart = deltaStart + segCountX2;

function glyphFor(code) {
  for (let i = 0; i < segCount; i++) {
    const end = buf.readUInt16BE(endStart + i * 2);
    const start = buf.readUInt16BE(startStart + i * 2);
    if (code < start || code > end) continue;
    const delta = buf.readInt16BE(deltaStart + i * 2);
    const ro = buf.readUInt16BE(rangeStart + i * 2);
    if (ro === 0) return (code + delta) & 0xffff;
    const gi = rangeStart + i * 2 + ro + (code - start) * 2;
    if (gi >= buf.length) return 0;
    const g = buf.readUInt16BE(gi);
    return g === 0 ? 0 : (g + delta) & 0xffff;
  }
  return 0;
}

/* ---------------- hmtx ---------------- */
function advance(g) {
  const idx = g < numberOfHMetrics ? g : numberOfHMetrics - 1;
  return buf.readUInt16BE(tables.hmtx.offset + idx * 4);
}

/* ---------------- glyf bbox (for cap height cross-check) ---------------- */
const locaFmt = (() => {
  seek(tables.head.offset + 50);
  return buf.readInt16BE(o);
})();
function glyphBox(g) {
  if (!tables.glyf || !tables.loca) return null;
  const loca = tables.loca.offset;
  const a =
    locaFmt === 0
      ? buf.readUInt16BE(loca + g * 2) * 2
      : buf.readUInt32BE(loca + g * 4);
  const b =
    locaFmt === 0
      ? buf.readUInt16BE(loca + (g + 1) * 2) * 2
      : buf.readUInt32BE(loca + (g + 1) * 4);
  if (a === b) return null;
  const p = tables.glyf.offset + a;
  const numContours = buf.readInt16BE(p);
  if (numContours === 0) return null;
  return {
    xMin: buf.readInt16BE(p + 2),
    yMin: buf.readInt16BE(p + 4),
    xMax: buf.readInt16BE(p + 6),
    yMax: buf.readInt16BE(p + 8),
  };
}

/* ---------------- report ---------------- */
const TEXT = 'SOLVING FOR';
const trackEm = -0.03; // .display -> tracking-tightest

const perGlyph = [...TEXT].map((ch) => {
  const g = glyphFor(ch.codePointAt(0));
  return { ch, g, adv: advance(g), box: glyphBox(g) };
});
const sumAdv = perGlyph.reduce((s, p) => s + p.adv, 0);
const trackUnits = trackEm * unitsPerEm * TEXT.length;
const totalUnits = sumAdv + trackUnits;

const capFromOS2 = sCapHeight;
const hBox = glyphBox(glyphFor('H'.codePointAt(0)));
const capFromH = hBox ? hBox.yMax : null;
const xBox = glyphBox(glyphFor('X'.codePointAt(0)));

console.log(JSON.stringify({ unitsPerEm, numGlyphs, numberOfHMetrics }, null, 0));
console.log('capHeight OS/2:', capFromOS2, ' capHeight H.yMax:', capFromH);
console.log('X glyph box:', JSON.stringify(xBox));
console.log('\nper-glyph advances (font units):');
for (const p of perGlyph) console.log(`  ${JSON.stringify(p.ch)} g${p.g} adv=${p.adv}`);
console.log('\nsum advances   :', sumAdv, 'units =', (sumAdv / unitsPerEm).toFixed(4), 'em');
console.log('tracking total :', trackUnits, 'units =', (trackEm * TEXT.length).toFixed(4), 'em');
console.log('TOTAL          :', totalUnits, 'units =', (totalUnits / unitsPerEm).toFixed(4), 'em');

const emPerText = totalUnits / unitsPerEm;
console.log('\n--- acceptance test: "SOLVING FOR" width as % of viewport ---');
for (const vw of [375, 768, 1280, 1440, 1920]) {
  for (const css of [
    ['clamp(2.8rem,11vw,11rem)', clampPx(vw, 2.8 * 16, 11 * vw / 100, 11 * 16)],
    ['clamp(2.8rem,8vw,11rem)', clampPx(vw, 2.8 * 16, 8 * vw / 100, 11 * 16)],
    ['clamp(2.8rem,7.2vw,11rem)', clampPx(vw, 2.8 * 16, 7.2 * vw / 100, 11 * 16)],
    ['clamp(2.8rem,6.6vw,11rem)', clampPx(vw, 2.8 * 16, 6.6 * vw / 100, 11 * 16)],
  ]) {
    const [label, px] = css;
    const w = emPerText * px;
    console.log(
      `  ${String(vw).padStart(4)}px  ${label.padEnd(26)} fs=${px.toFixed(1).padStart(6)}px  text=${w.toFixed(0).padStart(5)}px  ${((w / vw) * 100).toFixed(1)}%`,
    );
  }
}

function clampPx(vw, min, preferred, max) {
  return Math.min(Math.max(min, preferred), max);
}
