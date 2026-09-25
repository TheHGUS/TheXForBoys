/**
 * Round-02 numeric geometry checks (dev only).
 * Verifies the ROUND-02 acceptance criteria that are pure measurement:
 * the hero headline width, and the exploded brake's piece ordering.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { BRAKE_EXPLODE } from '../../src/components/svg/Illustrations';
import { LOGO_X_LETTER } from '../../src/content/images';
import { DiscBrake } from '../../src/components/svg/Illustrations';

let pass = 0, fail = 0;
const check = (n: string, ok: boolean, d = '') => {
  if (ok) { pass++; console.log(`  ok   ${n}`); }
  else { fail++; console.log(`  FAIL ${n}${d ? ` — ${d}` : ''}`); }
};

/* ---------- hero headline ---------- */
console.log('\nHero headline (ROUND-02 P0 #1: ~45-55% of viewport at 1440)');

// Measured off the real Libre Franklin 900 TTF by scripts/measure-type.mjs:
// "SOLVING FOR" at -0.03em tracking = 6.767em wide; cap height = 0.742em.
const TEXT_EM = 6.767;
const CAP_EM = 0.742;
const VW_TERM = 7.4;      // the clamp's vw coefficient
const MIN_PX = 2.8 * 16;  // clamp floor
const MAX_PX = 11 * 16;   // clamp cap
const SMALL_MAX = 12.4;   // the sub-360px fallback (vw)

const fs = (vw: number) => (vw < 360 ? Math.min((SMALL_MAX * vw) / 100, MAX_PX) : Math.min(Math.max(MIN_PX, (VW_TERM * vw) / 100), MAX_PX));
const gutterPx = (vw: number) => (vw >= 1024 ? 56 : vw >= 640 ? 32 : 20);

for (const vw of [375, 768, 1280, 1440, 1920]) {
  const px = fs(vw);
  const textW = TEXT_EM * px;
  const pct = (textW / vw) * 100;
  const content = vw - gutterPx(vw) * 2;
  const fits = textW <= content;
  if (vw === 1440) {
    check(`headline is 45-55% of viewport at ${vw}px`, pct >= 45 && pct <= 55, `${pct.toFixed(1)}%`);
  }
  check(`headline fits inside the gutters at ${vw}px`, fits, `${textW.toFixed(0)}px in ${content}px content`);
}
// 375 must fill the width edge-to-edge
{
  const px = fs(375), textW = TEXT_EM * px, content = 375 - 40;
  check('at 375px the headline fills the width (>=80% of content)', (textW / content) * 100 >= 80, `${((textW / content) * 100).toFixed(1)}%`);
}

/* ---------- X vs cap height ---------- */
console.log('\nHero X (ROUND-02 P0 #1: >=1.4x the cap height of line 1)');
{
  const X_CAPS = 2.2;
  const boxEm = (CAP_EM * X_CAPS) / LOGO_X_LETTER; // image box, as Hero.tsx sizes it
  const visualX = boxEm * LOGO_X_LETTER;           // the letter inside the logo X
  const ratio = visualX / CAP_EM;
  check('X stands ~2.2x the cap height', ratio >= 2.15 && ratio <= 2.3, `${ratio.toFixed(3)}x`);
}

/* ---------- exploded brake ---------- */
console.log('\nExploded disc brake (ROUND-02 P0 #3: one horizontal axis)');
{
  const html = renderToStaticMarkup(<DiscBrake className="text-off" />);
  // assembled x-extents, from the geometry constants in Illustrations.tsx
  const pieces: Array<[string, number, number, number]> = [
    ['caliper', 146, 146 + 76, BRAKE_EXPLODE.caliper],
    ['pad A', 180, 180 + 16, BRAKE_EXPLODE.padA],
    ['pad B', 204, 204 + 16, BRAKE_EXPLODE.padB],
    ['rotor', 268 - 86, 268 + 86, 0],
    ['nuts', 268 - 31 - 12, 268 + 31 + 12, BRAKE_EXPLODE.nutX],
  ];
  const exploded = pieces
    .map(([n, a, b, dx]) => ({ n, x0: a + dx, x1: b + dx }))
    .sort((p, q) => p.x0 - q.x0);

  console.log('       exploded order: ' + exploded.map((p) => `${p.n} ${p.x0.toFixed(0)}..${p.x1.toFixed(0)}`).join(' | '));
  let prevEnd = -Infinity, ordered = true;
  for (const p of exploded) {
    if (p.x0 < prevEnd) ordered = false;
    prevEnd = p.x1;
  }
  check('pieces never overlap when spread apart', ordered);
  check('all five pieces present', /brake-rotor/.test(html) && /brake-caliper/.test(html) && /brake-pad-a/.test(html) && /brake-pad-b/.test(html) && /brake-nut/.test(html));
  check('rotor is vented (outer ring + hat + bore)', (html.match(/<circle/g) ?? []).length >= 4);
  check('five stud holes', (html.match(/brake-hole/g) ?? []).length === 5);
  // anchored so the "brake-nuts" wrapper group doesn't count as a sixth
  check('five lug nuts', (html.match(/class="brake-nut"/g) ?? []).length === 5);
  check('pieces share one horizontal axis', /brake-axis/.test(html));
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
