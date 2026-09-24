# Notes from builder

_Builder (Arena / Claude Code) writes here at the end of each round: what changed, what couldn't be done, questions for the studio._

## Round 01
Initial build: "Solving for X" homepage, all sections 0–9, CLIENT_QUESTIONS.md and Q-flag system.

---

## Round 02 — Fix & Elevate

`npm run build` passes with zero TypeScript errors. `npm run check` passes
(37 markup/brand assertions + 14 geometry assertions).

### P0

**1. Hero headline.** The `<h1>` now carries `text-fluid-hero`. "SOLVING FOR"
on line 1; the X on line 2 is the outlined varsity glyph, off-white with a red
inner inline, standing at **1.42× the cap height** of line 1. The full-frame
grey wash is gone — the only darkening left is one bottom-up `#161616`
gradient behind the copy, so the top two-thirds of the photo is untouched.

> **One deviation, please sanity-check.** The brief floats
> `clamp(2.8rem, 11vw, 11rem)`, but that puts "SOLVING FOR" at **~74% of the
> viewport at 1440** — well outside the brief's own "done when" of 45–55%, and
> close enough to the gutters to feel accidental. I measured the real
> Libre Franklin 900 TTF (`scripts/measure-type.mjs`): the line is 6.767em
> wide at -0.03em tracking, so **7.4vw lands it on ~50% at every desktop
> width** and ~90% of the content width at 375px (edge-to-edge within the
> gutters). That's what shipped: `clamp(2.8rem, 7.4vw, 11rem)`, with a
> `12.4vw` fallback below 360px so it can never wrap or overflow. If you
> wanted the bigger 11vw look, say so and I'll resize the acceptance test
> instead of the type.

**2. No hand-drawn logo parts remain.** `src/components/svg/LogoMark.tsx` is
deleted. Every full-logo moment (nav, intro end state, equation finale,
footer) renders the real white PNG via `src/components/LogoImage.tsx`.
The intro keeps its red marker strokes, then **mask-wipes into the real PNG**
(centre-out `clip-path`), and the fist pops by clipping *the same PNG* to the
fist region — `scale 0.85 → 1`, `back.out(2)`. The only SVG recreation left is
the plain outlined X (no fist, no shield), used purely as a typographic glyph.

**3. The Equation.** Rebuilt as two zones that never overlap: an **equation
band** (top 30%) and an **illustration stage** below it. Terms that haven't
arrived are faint grey dashed `[ ? ]` boxes the exact width of their word (the
word sits in the flow holding the width, so nothing reflows). A real scrawl —
three uneven looping marker strokes — draws over the placeholder and resolves
into type. The brake is a proper exploded view on one horizontal axis
(caliper | pad A | pad B | vented rotor | 5 lug nuts), pieces spread along the
axis with no overlap, sliding together with the nuts spinning in last. The
stud wall is outlined line work drawn with `stroke-dashoffset` (studs, plates
and header), then the red roller sweeps. The photo sits full-bleed at 55%
brightness with the white line art over it, revealed by `clip-path` in sync
with the drawing. The "= X" glyph travels to centre and **becomes** the logo
via a mask-wipe handoff — one object, nothing left behind in the row.

**4. Nav.** The second X is gone. Scroll progress is now a 2px red line on the
bottom edge of the nav (animated with `scaleX`, not `clip-path`, so it
composites on the GPU).

**5. Mobile Programs.** Below 768px the three objects stack full width inside
the gutters, rotations capped at ±1°. The snap scroller, the clipped body copy
and the empty "SWIPE →" box are all gone.

### P1

**6. Wishlist.** The Amazon screenshot is removed (it cropped to "mazon
wishlis"). Replaced with a line illustration of a shipping box whose packing
tape forms an **X** — off-white line work, red tape. `WISHLIST_IMG` is deleted
from `src/content/images.ts`.

**7. Help CTAs.** All three share one primary red style — the "Give via
PayPal" card no longer uses deep red as a resting colour. Every CTA is pinned
to the bottom of its card with `mt-auto`, so they line up however long the
copy above them is.

**8. Dead space.** Connect is tighter (`py-12/14/16`, down from `py-16/20/28`)
and now carries the X pattern so it isn't a flat band. The footer is
content-height with the real logo at `h-16/20/24`, the link set, the
copyright, and the giant cropped outlined X bleeding off the bottom edge.

**9. Help equation.** The blank fills in marker-then-type style — the scrawl
draws, then the word resolves out of it — in the same language as the
Equation section. On touch devices (no hover) the first option is pre-filled
so the line is never empty. The word holds the width, so the line never
reflows as you move between options.

### P2

**10.** Paper texture (two faint cross-hatched gradients) plus a different
edge shadow per object, so three sheets of paper don't read as three identical
white cards.

**11.** Contact-sheet frame numbers are now circled in grease pencil on the
current frame, drawn and erased with the same stroke as the photo circle.

**12.** `DSC01956.JPG` is removed from the `#clubphotos` roll — it is the
full-bleed photo in The X for Girls section directly above it, so on mobile
you saw the same picture twice in a row. The roll is now 18 photos with no
internal duplicates. Flagged in `CLIENT_QUESTIONS.md` in case you'd rather it
stayed.

### Also changed (not in the brief)

- **Reduced motion** re-checked end to end: no pinning, no intro, final states
  with simple fades. The Equation shows the resolved equation and the finished
  logo.
- **`XPattern`'s `<svg>`** now carries `aria-hidden="true"` as well as its
  wrapper, so no decorative SVG is exposed to screen readers.
- **New: `npm run check`.** A static audit that renders the real components
  server-side and asserts the brand rules and the round's acceptance criteria
  that are checkable without a browser (no hand-drawn logo parts, palette,
  one-X finale, mobile stacking, CTA consistency, alt text and dimensions).
  `scripts/measure-type.mjs` reads the real Libre Franklin TTF and is how the
  hero clamp was derived. `npm run preview:art` rasterises the line art for
  review. All three are dev-only and outside `/src`, so they never reach the
  bundle.

---

### What I need from you

1. **The vector logo file (SVG/EPS/AI) — the one real blocker.** The fist-pop
   clips *the real PNG* to the fist region, and those percentages
   (`top 3% / right 12% / bottom 62% / left 50%`) are an **estimate** read off
   the proportions described in the project brief, because I could not fetch
   the PNG from this environment (the Wix CDN is blocked here). With a vector
   I can place it exactly, and also cut a proper favicon. Flagged in the UI as
   `LOGO FILE` on the footer logo (press **Q**).
2. **Related:** `LOGO_INTRINSIC` in `src/content/images.ts` is a
   `{ w: 132, h: 158 }` hint. Everything renders `object-contain`, so a wrong
   hint can't stretch the artwork — but please confirm the real pixel
   dimensions.
3. **Sanity-check the hero clamp** (see P0 #1 above) — I optimised for the
   brief's "45–55% at 1440" over its "11vw".

### Couldn't do / worth knowing

- **No browser in this environment.** Chromium/Playwright/Puppeteer downloads
  and the Wix CDN are both blocked, so I could not screenshot the page or
  fetch the logo/photos. Everything above was verified by measuring the real
  font and rendering the real components server-side, not by looking at it.
  **The five Equation states have not been eyeballed as still frames** —
  please check those first, along with the fist-pop framing.
- Photos are hot-linked and unreachable from here, so photo-dependent notes
  (the 55% brightness under white line art, the hero gradient strength) are
  set from the brief's description and may want a nudge once you can see them.
- `sharp` is a new devDependency, used only by `npm run preview:art`. It is
  not part of the site bundle; drop it and that one script if you'd rather
  keep install light.
