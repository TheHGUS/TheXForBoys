/**
 * Round-03 review screenshots (dev only).
 *
 *   npm run build && node scripts/screens.mjs [--only=desktop|mobile]
 *
 * Starts `vite preview`, then captures at 1440×900 (mouse) and 375×812
 * (touch) into brief/screens/round-04/ (SCREENS_OUT overrides):
 *   - the hero as the page opens (no intro since round 04)
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

const OUT = process.env.SCREENS_OUT ?? 'brief/screens/round-05';
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
  ['02-programs', '#programs'],
  ['03-albany', 'main > section:nth-of-type(3)'],
  ['04-girls', 'main > section:nth-of-type(4)'],
  ['05-gallery', '#gallery'],
  ['06-help', '#help'],
  ['07-connect', '#connect'],
  ['08-footer', 'footer'],
];

const browser = await chromium.launch();
const external = new Set();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

for (const vp of VIEWPORTS) {
  const { tag, ...opts } = vp;
  const shot = (page, name, o = {}) => page.screenshot({ path: `${OUT}/${name}-${tag}.png`, ...o });

  /* ---------------- the page (there is no intro any more) ---------------- */
  const ctx = await browser.newContext({ viewport: { width: opts.width, height: opts.height }, ...opts });
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

  await shot(page, '01-hero');
  await shot(page, 'nav-top', { clip: { x: 0, y: 0, width: opts.width, height: 90 } });

  /* ---------------- sections: scroll the whole page once so every once-trigger fires ---------------- */
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += Math.round(opts.height * 0.6)) await scrollTo(y, 180);
  await scrollTo(H, 1500);
  await shot(page, 'nav-bottom', { clip: { x: 0, y: 0, width: opts.width, height: 90 } });
  await scrollTo(Math.round(H / 2), 900);
  await shot(page, 'nav-middle', { clip: { x: 0, y: 0, width: opts.width, height: 90 } });

  /* mobile menu, open */
  if (tag === '375') {
    await scrollTo(0, 300);
    await page.click('button[aria-controls="mobile-menu"]');
    await wait(500);
    await shot(page, '09-mobile-menu');
    await page.keyboard.press('Escape');
    await wait(300);
  }

  /* the gallery must move on its own */
  {
    const strip = page.locator('[aria-label^="#clubphotos"]').first();
    await strip.scrollIntoViewIfNeeded();
    await page.mouse.move(2, 2);
    await wait(600);
    const a = await strip.evaluate((e) => e.scrollLeft);
    await wait(2000);
    const b = await strip.evaluate((e) => e.scrollLeft);
    console.log(`  ${tag}: gallery auto-scroll ${a} -> ${b} ${b !== a ? 'OK' : 'NOT MOVING'}`);
  }

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
