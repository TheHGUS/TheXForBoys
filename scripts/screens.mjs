/**
 * Round-03 review screenshots (dev only).
 *
 *   npm run build && node scripts/screens.mjs [--only=desktop|mobile]
 *
 * Starts `vite preview`, then captures at 1440×900 (mouse) and 375×812
 * (touch) into brief/screens/round-03/:
 *   - intro at 0.3s / 0.9s / 1.6s and the hero at rest after it
 *   - every Equation state: auto, home, reading, collapse, logo
 *   - every section below it (full element), and the nav progress line at the
 *     top, middle and bottom of the page
 * It also logs every request that leaves localhost (fonts excepted), so
 * "no wsimg.com requests" can be checked from the output.
 *
 * The intro is shot on Playwright's fake clock, so 0.3s means 0.3s of
 * animation time, not "roughly 0.3s after the page happened to load".
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = 'brief/screens/round-03';
const PORT = 4179;
const SITE = `http://localhost:${PORT}/`;
const only = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];

mkdirSync(OUT, { recursive: true });

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'pipe',
});
await new Promise((res, rej) => {
  server.stdout.on('data', (d) => String(d).includes(String(PORT)) && res());
  server.on('exit', (c) => rej(new Error(`vite preview exited ${c}`)));
});

const VIEWPORTS = [
  { tag: '1440', width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
  { tag: '375', width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
].filter((v) => !only || (only === 'desktop' ? v.tag === '1440' : v.tag === '375'));

const SECTIONS = [
  ['04-programs', 'main > section:nth-of-type(3)'],
  ['05-albany', 'main > section:nth-of-type(4)'],
  ['06-girls', 'main > section:nth-of-type(5)'],
  ['07-clubphotos', 'main > section:nth-of-type(6)'],
  ['08-help', 'main > section:nth-of-type(7)'],
  ['09-connect', 'main > section:nth-of-type(8)'],
  ['10-footer', 'footer'],
];

const browser = await chromium.launch();
const external = new Set();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

for (const vp of VIEWPORTS) {
  const { tag, ...opts } = vp;
  const shot = (page, name, o = {}) => page.screenshot({ path: `${OUT}/${name}-${tag}.png`, ...o });

  /* ---------------- intro on a fake clock ---------------- */
  {
    const ctx = await browser.newContext({ viewport: { width: opts.width, height: opts.height }, ...opts });
    const page = await ctx.newPage();
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.hostname !== 'localhost' && !u.hostname.endsWith('googleapis.com') && !u.hostname.endsWith('gstatic.com'))
        external.add(u.hostname);
    });
    await page.clock.install({ time: new Date('2026-09-25T10:00:00') });
    await page.clock.pauseAt(new Date('2026-09-25T10:00:01'));
    await page.goto(SITE, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.clock.runFor(300);
    await shot(page, '00-intro-0.3s');
    await page.clock.runFor(600);
    await shot(page, '00-intro-0.9s');
    await page.clock.runFor(700);
    await shot(page, '00-intro-1.6s');
    await page.clock.runFor(4000);
    await page.clock.resume();
    await wait(400);
    await shot(page, '01-hero');
    await ctx.close();
  }

  /* ---------------- everything else, real time, intro already seen ---------------- */
  const ctx = await browser.newContext({ viewport: { width: opts.width, height: opts.height }, ...opts });
  await ctx.addInitScript(() => sessionStorage.setItem('txfb:intro-seen', '1'));
  const page = await ctx.newPage();
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.hostname !== 'localhost' && !u.hostname.endsWith('googleapis.com') && !u.hostname.endsWith('gstatic.com'))
      external.add(u.hostname);
  });
  await page.goto(SITE, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await wait(1500);

  const scrollTo = async (y, settle = 1400) => {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await wait(settle);
  };

  await shot(page, 'nav-top', { clip: { x: 0, y: 0, width: opts.width, height: 90 } });

  /* ---------------- equation ---------------- */
  if (tag === '1440') {
    // the section publishes the scroll position of each named state
    const states = await page.evaluate(() => JSON.parse(document.querySelector('#equation')?.dataset.states ?? '{}'));
    const names = ['auto', 'home', 'reading', 'collapse', 'logo'];
    for (const [i, n] of names.entries()) {
      if (states[n] == null) {
        console.warn(`  no scroll position for equation state "${n}"`);
        continue;
      }
      await scrollTo(states[n], 1800);
      await shot(page, `03-equation-${i + 1}-${n}`);
    }
    // the screen right after the finale — no dead band allowed
    if (states.end != null) {
      await scrollTo(states.end + opts.height * 0.5, 1200);
      await shot(page, '03-equation-6-after');
    }
  } else {
    const blocks = ['auto', 'home', 'reading'];
    for (const [i, n] of blocks.entries()) {
      const y = await page.evaluate(
        (i) => document.querySelector(`[data-block="${i}"]`).getBoundingClientRect().top + window.scrollY - 80,
        i,
      );
      await scrollTo(y, 4200);
      await shot(page, `03-equation-${i + 1}-${n}`);
    }
    // The finale plays once, as soon as it enters — and it has already
    // entered while the reading block was on screen. Shoot it on a fresh page
    // that jumps straight there.
    const fresh = await ctx.newPage();
    await fresh.goto(SITE, { waitUntil: 'load' });
    await fresh.evaluate(() => document.fonts.ready);
    await wait(800);
    const fy = await fresh.evaluate(
      () => document.querySelector('.equation-finale').getBoundingClientRect().top + window.scrollY - 60,
    );
    await fresh.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), fy);
    await wait(380);
    await shot(fresh, '03-equation-4-collapse');
    await wait(2200);
    await shot(fresh, '03-equation-5-logo');
    await fresh.close();
  }

  /* ---------------- sections: scroll the whole page once so every once-trigger fires ---------------- */
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += Math.round(opts.height * 0.6)) await scrollTo(y, 180);
  await scrollTo(H, 1500);
  await shot(page, 'nav-bottom', { clip: { x: 0, y: 0, width: opts.width, height: 90 } });
  await scrollTo(Math.round(H / 2), 900);
  await shot(page, 'nav-middle', { clip: { x: 0, y: 0, width: opts.width, height: 90 } });

  for (const [name, sel] of SECTIONS) {
    const el = page.locator(sel).first();
    const y = await el.evaluate((e) => e.getBoundingClientRect().top + window.scrollY);
    await scrollTo(y, 1600);
    // hide the fixed nav so it doesn't stamp itself over element screenshots
    await page.addStyleTag({ content: 'header.fixed{visibility:hidden!important}' }).then((h) => h);
    await el.screenshot({ path: `${OUT}/${name}-${tag}.png`, animations: 'allow' });
    await page.evaluate(() => document.querySelectorAll('style').forEach((s) => s.textContent?.includes('header.fixed{visibility:hidden') && s.remove()));
  }

  await ctx.close();
  console.log(`  ${tag}: done`);
}

console.log(external.size ? `  EXTERNAL REQUESTS: ${[...external].join(', ')}` : '  no external requests (fonts excepted)');
await browser.close();
server.kill();
