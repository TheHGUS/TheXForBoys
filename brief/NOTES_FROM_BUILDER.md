# Notes from builder

**Preview (latest, round 04): https://thexforboys.vercel.app**

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

---

## Round 03 — Finish for the pitch (Claude Code)

**Preview:** https://thexforboys.vercel.app (Vercel project `thexforboys`, deployed
from the CLI with this round's build).

`npm run build` passes with zero TypeScript errors. `npm run check` passes
(44 assertions, including 7 new round-03 ones). Every state was screenshotted
at 1440×900 and 375×812, reviewed, fixed and re-shot. Final frames:
`brief/screens/round-03/` (39 PNGs, regenerate with `npm run screens` after a build).

### P0

**1. Photos.** Swapped per the corrected map, and each one checked by eye
before shipping: `AUTO_1` IMG_1128 (tire change on the red truck), `AUTO_2`
IMG_1125 (boy kneeling at the tire, brake pads on the ground), `HOME_1`
unchanged (timber beam), `READ_1` 112296745… (reading circle, open book in
the foreground), `READ_2` 115941536… (indoor session with books). The
Programs objects show brake/tire, beam and book club respectively.
While looking I found that **most of the other alt text didn't match the
photos either**, so every alt in `images.ts` was rewritten from the actual
picture. One to know about: `SECTION_ALBANY` (`_DSC8134.JPG`) is **not a view
of Albany**. It's the boys in a crowd at a fairground. It still works as the
dimmed background for the Albany statistic, but see question 2 below.

**2. Mobile Equation had no illustrations.** Cause: each mobile stage was a
plain `div` whose children are all `position:absolute`, so it collapsed to
0px tall. Each stage now has a 4:3 box, and the brake, wall and book build
over their photo per term on scroll (no pinning).

**3. Stages bleeding into each other.** Rebuilt the term sequence: stage in →
line art builds → **the photo wipe runs for exactly the build's length**, so
it reaches full frame on the same beat the drawing finishes (`BUILD_LENGTH`
in `Equation.tsx`) → hold → the stage fades fully out (`autoAlpha 0`) → only
then does the next term start. The scroll length is derived from the
timeline (`PX_PER_SECOND`) instead of a hard-coded 4200px.

**4. The finale.** The logo is now ~50vh tall on desktop (`calc(50vh × 365/418)`
wide) and ~60vw wide on mobile. "Let's solve it together." sits directly
under it at display size (`clamp(1.9rem, 5.2vw, 5.4rem)`), in the same
frame. The logo holds for a beat before the pin releases. The empty band
after it is gone: the finale centres in the visible area below the nav, and
Programs' top padding is tighter. `03-equation-6-after-1440.png` shows the
handoff. The travelling X now aims at the logo's own X (measured, with its
current transform subtracted) rather than the stage centre. On mobile the "="
leaves with the X instead of being stranded above the logo.

**5. Nav progress line.** The track is an 8% off-white hairline; only the
inner bar is red, scaling 0 → 1. Verified in `nav-top/middle/bottom-*.png`
(empty, about half, full).

**6. Logo, measured.** Downloaded the PNG (612×612, artwork at x 112–476,
y 72–489 — matches your numbers), trimmed it to 365×418 and serve it from
`public/brand/logo-white.png`. `LOGO_INTRINSIC = { w: 365, h: 418 }`.
`FIST_REGION` measured from the pixels: **x 60–100%, y 0–29%**. That's the
whole fist and its keyline, cut just below the wrist and above the shield's
right bar (checked by cropping it out and looking). The pop now grows from
the wrist. The first screenshots showed two more problems, both fixed:
- A faint hairline around the fist box where the two clip-paths meet, most
  visible while the lockup scales into the nav. After the pop lands,
  `sealLogo()` swaps to a single unclipped image, so the seam can't exist at rest.
- In the 0.9s frame the X sat without its fist for too long. The pop now
  starts as the wipe reaches the top-right corner (0.8s).
Favicons (32px, 180px apple-touch, 512px) are cut from the same PNG on an
ink square.

### P1

**7. Hero X** at 2.2× the cap height of "SOLVING FOR", left-aligned with it.
Clear of the subline at 375 and 1440. I also added a short top-down ink fade
under the transparent nav: in this photo the sky behind the nav links is
near-white and the links weren't legible.

**8. Help CTAs.** The helper note now sits *above* each button at a fixed
two-line height, so all three buttons share one baseline. The shipping-box
drawing was what stretched the row and left the Donate card half empty. It
now sits small beside its own button. The PayPal Q-flag is out of flow.

**9. Self-hosted images.** `scripts/build-assets.mjs` (`npm run assets`)
downloads each original once and writes WebP + JPEG at 1800w and 900w to
`public/images/`, plus `src/content/image-manifest.json` with real pixel sizes.
`Img` renders a `<picture>` with WebP and JPEG `srcset`s at their real
widths. The outputs are committed. **No request goes to wsimg.com:** the
screenshot script logs every off-localhost request (only Google Fonts appear),
and `npm run check` asserts no `wsimg.com` URL exists in `src/` or `index.html`.

### P2

**10. Lighthouse (mobile, v12, local production build, median of 3):**

| Performance | Accessibility | Best practices | SEO |
|---|---|---|---|
| **72** | **96** | 100 | 100 |

FCP 3.0s · LCP 4.1s · TBT 250ms · CLS 0.01. The range across runs was 48–74;
the 48 was a single TBT spike on this machine.

**Accessibility 96 meets the 95 target. Performance 72 misses 85.** What I did:
Performance started at 39–53.
- Below-the-fold sections are lazy chunks, mounted one per idle slot, each in
  its own Suspense boundary. TBT went from about 600–760ms to about 250–300ms.
- Stroke lengths are measured once and batched. Reads were interleaved with
  writes, which forced a layout per path.
- One `ScrollTrigger.refresh()` after load + fonts, instead of three.
- Google Fonts CSS no longer blocks render. Added `robots.txt` (SEO 92 → 100).

What's left: about 1.2s of LCP is "element render delay", which is **the
first-visit intro covering the hero by design**. FCP waits on the
React + GSAP bundle (about 113KB gzipped). Getting past 85 would need
either a shorter or skippable-on-mobile intro, or a static HTML first frame
of the hero. Both change the experience, so I'm asking rather than doing it
(question 1).

**Contrast:** the only failing audit is white text on the brand red
`#F70303` on buttons (about 4.2:1, AA needs 4.5 below 18.66px bold). Ink on
red fails too. It's the brand colour, so I haven't changed it (question 3).

**11. Preview** is at the top of these notes.

### Also changed
- Programs: the footer line on each object ("SITE: ALBANY, GA", "BOOK CLUB —
  WEEKLY") ran *under* the photo. It now shares a row with it. The two WEEKLY
  stamps collided at 375; the second stamp moves over on mobile.
- Connect: social handles were truncated with an ellipsis at 375. They now
  stack one per row and wrap.
- The Equation's layout switch is width-only (`min-width: 1024px`). Touch
  laptops used to get the desktop layout with the mobile timeline.
- Docs: README (images, logo seal, review tooling), `CLIENT_QUESTIONS.md` §2
  (the logo file no longer blocks anything), the `LOGO FILE` Q-note.
- New dev deps: `playwright` (screenshots). `sharp` is now also used by
  `build-assets.mjs`.

### What I need from you
1. **Performance vs. intro:** do you accept ~72 mobile with the full first-visit
   intro, or should the intro be shorter or skipped on phones to chase 85+?
2. **Albany photo:** `_DSC8134.JPG` is a fairground crowd, not the city. Is
   there a real Albany street or skyline shot, or should the section use a
   different photo?
3. **Red button contrast:** OK to leave white-on-`#F70303` as is (brand), or
   enlarge button type to 18.66px+ bold so it counts as large text?
4. **Vercel:** the project was created from the CLI and is **not Git-connected**,
   so pushes to `main` won't redeploy on their own. Say if you want it connected.
   Note that auto-deploying `main` would publish to the project's production
   alias. The deploy-specific URL is behind Vercel login; the
   `thexforboys.vercel.app` alias is public.
5. A vector logo would still help at the finale's size on large screens (the
   PNG artwork is only 365×418).

---

## Round 04 — client feedback pass (Claude Code)

**Preview:** https://thexforboys.vercel.app (redeployed with this round).
`npm run build` passes; `npm run check` passes (50 assertions, 7 new). Screens
at 1440 and 375: `brief/screens/round-04/`.

> **Studio standards overridden by the client's direction:** §6 "sharp
> corners 0–2px" (now rounded) and §3's ban on glassmorphism/gradients (now
> glass, gloss and gradients — kept to brand colours and "light", no blobs).
> Flagging so the studio knows it was deliberate.

### What changed
- **No intro.** The opening animation is gone and so is the hero's entrance
  animation — the page opens on the finished hero. `Intro.tsx` deleted.
- **The logo's X everywhere.** `scripts/cut-logo-x.mjs` removes the shield
  from the client PNG (each visible shield piece is its own pixel region) →
  `public/brand/logo-x.png`. It replaces the hand-drawn X in the hero, the
  equation's answer (it now lands *exactly* on the logo's X before the shield
  wipes in around it), the help line, Albany and the footer, and it is the
  brand-pattern tile. `XGlyph.tsx` deleted.
- **Rounded** buttons, inputs, cards, programme sheets, photos and frames.
- **Glass / gloss / gradients:** glossy red buttons (lacquer highlight),
  frosted-glass nav when scrolled, glass Help cards, glass art tiles in the
  Equation; section light: Programs has an overhead "workbench lamp", Help warms
  from ink to deep red toward the buttons, Albany falls off to black toward
  the ask.
- **Pattern is no longer the whole page:** removed from Programs, Help,
  Connect, footer and the menu; kept (quieter) behind the Equation and in the
  X for Girls section. Gallery and Connect are now light sections.
- **Less animation:** removed hero Ken Burns, pattern drift, camera shake,
  pattern pulse, magnetic buttons, the reading card's WEEKLY stamps, the
  gallery's grease-pencil circles and the stamp-slam on the sign-up check.
- **Equation photos are the picture:** full brightness; the brake / framing /
  book line art is a small glass tile in the corner instead of drawn over the
  people.
- **Gallery:** photos framed in the logo's home-plate shield with its double
  keyline, on a light band, scrolling on its own (slowly, endlessly). Pauses
  on hover, drag, swipe or keyboard focus; tap opens the lightbox. Verified it
  moves at both widths (the screens script measures it).
- **Parallax story (Albany):** problem → answer → ask. The statistic reads in
  over the city photo drifting behind; the three programmes rise past in
  shield frames at three speeds; then the logo X wipes in with "That's the
  equation we're here to change." and a **Donate Now** button with the
  verbatim Life Prep line under it.
- **Socials** moved from Connect into the footer as one row of icon buttons;
  Connect is now a compact light band with just the sign-up.
- **Menus:** the top nav, mobile menu and footer now only link to sections on
  this page (Our Programs, Gallery, How You Can Help, Connect). The live
  site's other pages aren't linked from any menu. Buttons in the page body are
  unchanged.
- **Mobile spacing** tightened (section padding and gaps); the empty band
  under the X for Girls subline is gone.

### Lighthouse (mobile, local build, median of 3)
Performance **70** · Accessibility **100** · Best practices 100 · SEO 100
(FCP 3.0s · LCP 4.5s · TBT ~250ms · CLS 0.01). One run spiked to 53 (TBT).

### What I need from you
1. Nav labels: "Connect" is short for the verbatim "Connect With Us!" — OK?
2. The Albany background photo is still the fairground shot (round 03 Q2).
3. ~~Vercel is not Git-connected~~ — done: the project is now connected to
   TheHGUS/TheXForBoys, and every push to `main` deploys to
   https://thexforboys.vercel.app (other branches get preview URLs).

---

## Round 05 — "their words, cleaner design" (Claude Code)

**Preview:** https://thexforboys.vercel.app (deploys on every push to `main`).
`npm run build` passes; `npm run check` rewritten for the current rules and
passes (35 assertions). Screens: `brief/screens/round-05/`.

### Copy
- **Every word is theirs, exactly** — checked line by line against the live
  thexforboys.org homepage (the audit asserts each verbatim line renders).
  Retired studio lines: "Let's solve it together.", "Same equation. Every
  child.", "You + ___ = X", "Three workshops. One equation.", "Give via
  PayPal", ticket furniture, and the rest.
- **"Solving for X" appears exactly twice:** the red script line above the
  hero headline, and the footer tagline.
- The hero headline is now their mission statement. Nav uses their labels:
  Home · Learn More · Support Us · Gallery.

### Design
- **Type:** Libre Franklin at their weight (500/600, sentence case, like
  their site) for headings; Open Sans for body (as on their site). One word
  per title in **Yellowtail**, a baseball-jersey script in red (pink for
  "Girls"), matching the collegiate X and home-plate shield. The words never
  change, only the styling.
- **Clean, lighter page:** white and warm-grey sections (Programs, Girls,
  Help) alternating with ink (Albany, gallery, Connect, footer). Film grain
  removed.
- **Plain CTAs:** no gloss or emboss. The marker line under the hero's
  donate button is gone.
- **No scribble lines anywhere:** marker scrawls, underlines, highlighter
  swipes, rough rules and marker checks are all deleted (`Marker.tsx`).
- **Programs appear once.** The Equation section, which repeated the three
  programmes and put icons on top of their photos, is removed. The Albany
  story's middle beat now uses three other club photos instead of the
  programmes.
- **Program sheets:** square corners again (it's paper). Only parts that
  carry information remain: the sheet type and number, their title, their
  description, line items lifted from their own sentence, and their photo.
  No date lines, empty tables, stamps, clips or pins. The photos line up
  across the three sheets.
- **How You Can Help:** three clean cards, each with the platform's own logo
  (GoGetFunding, PayPal, Amazon, in `public/brands/`), their heading and one
  button. The crossed-out box drawing is gone.
- **Gallery:** about 2.5× faster (95px/s), dark band, shield frames, no
  captions.
- **Header:** logo plus the name "The "X" for Boys".
- **Mobile menu:** full-screen sheet over one of their photos (dimmed), large
  links with dividers, a Donate button, and social icons.
- **Footer:** Donate added to the nav. Bottom bar is two lines, each forced
  to one line at 375px: the copyright (verbatim) and "Designed by The Harmon
  Group". The "Q — client notes" hint is removed; the Q key still toggles the
  notes for the studio.

### Removed files
`Equation.tsx`, `Intro.tsx` (r04), `Grain.tsx`, `svg/Marker.tsx`,
`svg/Illustrations.tsx`, `lib/wobble.ts`, and the dev scripts that drew the
old line art (`preview-art`, `checks/geometry`).

### What I need from you
1. Keep "Solving for X" in those two places, or drop it entirely?
2. Still open: the real PayPal link, the email destination, and an actual
   Albany street or skyline photo.

---

## Round 06 — logo X in the words, italic accents, Help rebuilt (Claude Code)

**Preview:** https://thexforboys.vercel.app · `npm run check` 38/38 ·
screens in `brief/screens/round-06/`.

- **The logo X replaces the letter X in text:** the header's "The X for Boys"
  (quotes dropped around the mark), "Solving for X" (hero and footer),
  "Donate to The X", "Donate to The X for Boys & Girls". `WithLogoX` in
  `ui.tsx` does this: it sits on the baseline at cap height, with the fist
  rising above, and shows in negative on white backgrounds. The copyright line
  stays plain text (legal line, 11px).
- **No script font.** Accent words are the same Libre Franklin, **bold
  italic, in red** (pink for "Girls"). "Boys" and "Girls" are both
  accented.
- **Headings are bold (700)**, never black (900). The hero headline is bold too.
- **Program sheets tilted again** (±1–2°, ±1° on phones, straighten on
  hover), each with a small red icon at the top: wrench, house, open book.
- **How You Can Help rebuilt** on the round-04 look (ink warming to deep red,
  glass cards) with hierarchy: a featured DONATE card (their boys at the
  truck, the GoGetFunding mark, their Life Prep line, the main button), and
  GIVE and Registries & Wishlists as secondary cards with the PayPal and
  Amazon marks on white chips. The logo X is a faint watermark.
- **Mobile menu** scaled down to normal sizes (18px links, a standard Donate
  button, 36px social icons).
- **Hero height:** 76% of the screen on phones (the next section peeks in);
  88vh capped at 860px on desktop.
- Backgrounds rebalanced so no more than one dark band appears in a row: the
  gallery is light again, and Connect is white.

### Round 06 follow-ups
- Header reads **"The <logo> for Boys"**: the full logo at full header size
  (36–40px) stands in for the X, with the words either side.
- Hero: a stronger bottom gradient, and "Solving for X" is larger with a soft
  shadow, so it reads clearly.
- Program icons now sit beside each title.
- The Albany statement is bold.
- Gallery heading reads **#ClubPhotos** (client's request; their site has
  "#clubphotos").
- Thin red outline around each program photo; thin pink outline (their
  shirts' pink) around the girls' photo in "Donate to The X for Boys & Girls".
  None of the program photos show the girls, so the pink went there.
- **Red carries through the logo X:** an X inside a red accent now uses
  `logo-x-red.png`, the same pixels with the white fill turned brand red and
  the keylines kept (generated by `scripts/cut-logo-x.mjs`). Used in "Donate to
  *The X*" and the hero's "Solving for X".
- **Footer:** the name beside the logo uses a plain X, and "Solving for X" is
  removed. That studio line now appears once, in the hero.
- Removed the large logo X in front of "Donate to The X" (redundant). The
  Girls button reads **DONATE** (their "DONATE!" without the exclamation mark,
  at the client's request).
