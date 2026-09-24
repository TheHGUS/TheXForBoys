# “Solving for X” — The “X” for Boys

Pitch prototype homepage for **The “X” for Boys** (thexforboys.org), a 501(c)3
youth mentorship nonprofit in Albany, Georgia.
Concept by **The Harmon Group**.

React + Vite + TypeScript · Tailwind · GSAP 3 (ScrollTrigger) · Lenis.
No 3D, no WebGL, no stock imagery, no AI-generated imagery.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # type-check + production build to /dist
npm run preview      # serve the production build
npm run typecheck    # types only
npm run check        # static audit: brand rules + round acceptance criteria
```

`npm run check` renders the real components with `renderToStaticMarkup` and
asserts against the markup they produce — no browser needed. It covers the
“no hand-drawn logo parts” rule, the brand palette, the equation’s two-zone
split and single-X finale, the programmes’ mobile stacking, CTA consistency,
and image alt text / dimensions. Geometry that is pure measurement (hero
headline width, exploded-brake piece ordering) is checked the same way.

`scripts/measure-type.mjs` reads the real Libre Franklin 900 TTF and reports
exact advance widths, which is how the hero’s fluid clamp was derived:

```bash
node scripts/measure-type.mjs path/to/LibreFranklin_900Black.ttf
```

`npm run preview:art` writes PNGs of every piece of line art to a folder, for
reviewing the drawings without running the site. It needs `sharp`
(a devDependency — it is not part of the site bundle).

Node 18+ (built and tested on Node 22).

---

## Where to edit things

| What | File |
|------|------|
| **All copy** | `src/content/copy.ts` |
| **All image URLs + alt text** | `src/content/images.ts` |
| **Client question flags (the Q-key sticky notes)** | `src/content/questions.ts` + `CLIENT_QUESTIONS.md` |
| Brand colours, fonts | `tailwind.config.js` |
| One file per section | `src/sections/*.tsx` |
| Reusable artwork (the mark, marker strokes, line illustrations) | `src/components/svg/*.tsx` |
| Site-wide chrome (grain, X pattern, buttons, images) | `src/components/*.tsx` |
| Scroll / motion helpers | `src/lib/*`, `src/hooks/*` |

### Copy

`src/content/copy.ts` is the single source of truth. Nothing else on the site
contains a sentence. Comments mark provenance:

- `[VERBATIM]` — lifted word-for-word from the current site. Don’t paraphrase
  without client sign-off.
- `[NEW]` — a line we wrote. Every `[NEW]` line is listed in
  `CLIENT_QUESTIONS.md` and flagged in the UI with a sticky note.

### Images

`src/content/images.ts` holds every URL. Photos are hot-linked from the
client’s Wix media library, with the `/:/rs=w:1800` (large) and `/:/rs=w:900`
(small) transforms applied by a small `img()` helper:

```ts
export const HERO_MAIN = img('DSC06682-2.jpg', {
  alt: 'Boys and mentors of The “X” for Boys lined up together at the Delta hangar.',
  ratio: [16, 9],
});
```

Everything except the hero lazy-loads and carries `width`/`height` +
`object-fit: cover`. Swap a filename there and it updates everywhere.

---

## The Q-key client questions

Press **Q** anywhere on the site to toggle small yellow sticky notes next to
every element we want signed off on (new lines, the girls’ program, the Albany
statistic, the social handles, the PayPal link, the no-backend form). Press
**Q** again to hide them. They are absolutely positioned, never affect layout,
and are never visible unless toggled.

To flag something new:

1. Add an entry to `src/content/questions.ts`.
2. Drop `<Flag id="q-your-id" place="tr" />` inside any `relative` element.
3. Add it to `CLIENT_QUESTIONS.md`.

---

## Structure

```
src/
  App.tsx              composition + intro/phase state
  main.tsx
  index.css            Tailwind + display-type + grain utilities
  content/
    copy.ts            ALL copy
    images.ts          ALL image URLs + alt text
    questions.ts       sticky-note registry
  lib/
    gsap.ts            GSAP + ScrollTrigger registration
    draw.ts            stroke-dashoffset draw-on helpers
    wobble.ts          deterministic hand-drawn path generation
    motion.ts          reduced-motion + pointer media queries
    scroll.ts          Lenis singleton + scroll lock
  hooks/
    useSmoothScroll.ts Lenis ⇄ GSAP ticker wiring
  components/
    ui.tsx             Img, Btn, MonoLabel
    Grain.tsx          site-wide film grain (feTurbulence)
    XPattern.tsx       tiled brand X pattern
    Flag.tsx           Q-key sticky notes
    LogoImage.tsx      the REAL logo (PNG) + the base/fist split for the pop
    svg/
      XGlyph.tsx       the plain outlined X — typographic glyph only
      Marker.tsx       marker scribbles, underlines, checks, stamps
      Illustrations.tsx exploded disc brake, stud wall, book, shipping box
      Social.tsx       line social icons
  sections/
    Intro.tsx  Nav.tsx  Hero.tsx  Equation.tsx  Programs.tsx
    Albany.tsx  Girls.tsx  ClubPhotos.tsx  Help.tsx  Connect.tsx  Footer.tsx
```

---

## The mark

**The logo is never redrawn.** The white PNG is the only source for every
full-logo moment — nav, intro end state, equation finale, footer (see
`src/components/LogoImage.tsx`).

The one thing we do recreate as SVG is the **plain outlined X**, used purely as
a *typographic glyph* — the last letter of `SOLVING FOR X`, the mark the
equation resolves into, the X bleeding off the footer, and the tile in the
brand pattern. No fist, no shield. It lives in `src/components/svg/XGlyph.tsx`:

- `variant="solid"` — thick X with the inner inline knocked out (matches the
  PNG’s X); pass `inlineColor` to paint that inline instead (the hero uses red)
- `variant="outline"` — hollow varsity outline (footer)
- `variant="stroke"` — the same outline as two closed paths, so it can draw
  itself with `stroke-dashoffset` (the Albany hard cut)

### Animating a part of the logo

`LogoLockupSplit` renders **the same PNG twice**, clipped into two
non-overlapping pieces, so the raised fist can pop without ever drawing a hand:

```
.logo-base-wrap   inset clip    <-- the intro's mask-wipe animates this
  img.logo-base   polygon clip  <-- keeps the fist cut out at all times
.logo-fist-wrap   scale 0.85 -> 1, back.out(2)
```

Two nested clips, because one element can only carry one `clip-path`. If the
wipe overwrote the polygon, the fist would reappear inside the base and the pop
would have nothing to pop.

---

## Motion notes

- **GSAP ScrollTrigger** drives everything scroll-based; **Lenis** smooths the
  wheel (disabled on touch devices and for reduced motion).
- Easing is `power3.out` / `expo.out`; stamps and slams use `back.out(2)`.
  Durations are 0.4–0.9s.
- Only `transform`, `opacity` and `stroke-dashoffset` are animated.
- **Reduced motion** (`prefers-reduced-motion: reduce`): the intro is skipped,
  pinning and Ken Burns are off, and every section renders its finished state
  with a plain fade.
- The intro plays **once per browser-tab session** (`sessionStorage:
  "txfb:intro-seen"`) and is skippable by click, scroll or keypress.

---

## Not wired up yet (on purpose)

- **PayPal** — “Give via PayPal” links to `thexforboys.org/donate`. The real
  button lands in the next stage.
- **Email signup** — front-end only. It stamps a red check and sends nothing.
- **Programme detail pages** — the nav links point at the live
  thexforboys.org pages; some may 404. They become internal routes when this
  becomes the real site.

---

## Known constraints

- Photos are hot-linked from the client’s Wix CDN. If they ever move, replace
  the URLs in `src/content/images.ts` (or drop the files into `public/`).
- Alt text was written from programme context rather than the final crops —
  see `CLIENT_QUESTIONS.md`.
