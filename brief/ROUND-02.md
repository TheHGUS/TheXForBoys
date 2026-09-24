# Round 02 — Fix & Elevate

Round 01 got the structure right. Programs, Albany, Girls and the contact sheet are close to where we want them — **keep their concepts**. This round fixes what breaks the "wow" and raises the craft level. Work top to bottom; P0 items are non-negotiable.

---

## P0 — Must fix

### 1. Hero headline is tiny (`src/sections/Hero.tsx`)
The `<h1>` is missing its size class, so "SOLVING FOR X" renders at ~16px. The hero has no drama right now.
- Apply the fluid display size (`text-fluid-hero`, clamp ~2.8rem → 11vw → 11rem). "SOLVING FOR" on line 1, the X on line 2 at **at least 1.4× the cap height** of line 1 so it reads as the payoff.
- The X glyph is the outlined X in brand style, off-white with a red inner inline. Not the tiny icon.
- Reduce the overall photo darkening: remove the full-frame grey wash, keep only a bottom-up `#161616` gradient behind the text. The kids' faces must be bright and clear.
- **Done when:** at 1440×900 the headline occupies ~45–55% of viewport width; at 375px it fills the width edge-to-edge within the gutters.

### 2. Stop redrawing the logo (`LogoMark.tsx`, `Intro.tsx`, `Equation.tsx`)
The hand-drawn SVG fist looks like a chef's hat / cartoon glove. That will lose us the client.
- Use the real logo PNG for every full-logo moment (intro end state, equation finale, footer).
- Keep the red marker strokes in the intro. At the end, the strokes **mask-wipe into the real PNG** (clip-path reveal), then the fist area of the PNG pops with a short overshoot (scale 0.85 → 1, `back.out(2)`, clip the PNG to the fist region for that layer).
- The only allowed SVG recreation is the plain outlined X (no fist, no shield) used as a typographic glyph.
- **Done when:** no hand-drawn fist/shield exists anywhere in the codebase.

### 3. The Equation section composition (`src/sections/Equation.tsx`)
This is the signature moment and right now it looks broken:
- Illustrations overlap the equation text (blueprint line cuts through "HOME IMPROVEMENT", book outline sits on top of the words). → Split the pinned stage into two zones: **equation band** (top ~30%, always legible) and **illustration stage** (below, fixed frame). Nothing crosses the band.
- Terms that haven't arrived yet show as flat red rectangles — reads as broken UI. → Show them as faint grey outlined placeholders `[ ? ]` or empty underscores, then a **real scribble** (2–3 overlapping looping marker strokes, uneven) draws before resolving into type.
- The brake assembly reads as random arcs. → Draw a proper exploded view on one horizontal axis: vented rotor (outer ring + inner hat + 5 stud holes), 5 lug nuts, two brake pads, caliper body. Pieces start spread apart along the axis and slide together into place; lug nuts spin in last.
- Home improvement on mobile shows solid white bars. → Studs, plates and header must be outlined line work, drawn with stroke-dashoffset. Then the red roller sweep.
- Photos behind illustrations are almost invisible. → Inside the stage, photo sits full-bleed at ~55% brightness with the white line art over it; photo reveals via clip-path in sync with the drawing.
- Finale leaves a stray extra X on the right after the logo appears. → The "= X" glyph must physically travel to centre and **become** the logo (one object). No duplicates.
- **Done when:** each of the 5 states (auto, home, reading, collapse, logo) looks like a finished poster as a still screenshot, at 1440 and 375.

### 4. Nav shows two X marks (`src/sections/Nav.tsx`)
Logo + a second "progress" X side by side looks like a glitch.
- Remove the progress X. Scroll progress becomes a 2px red line along the bottom edge of the nav.

### 5. Mobile Programs cards overflow (`src/sections/Programs.tsx`)
On 375px the work order runs off-screen and clips text ("such as oil cha…"), and there's an empty dark box with "SWIPE →".
- Below 768px: stack the three objects vertically, full width within gutters, rotations max ±1°. No horizontal scroll, no empty box.

---

## P1 — Should fix

6. **Wishlist image is cropped** ("mazon wishlis"). Remove the Amazon image. Replace with a line illustration of a shipping box whose packing tape forms an **X** (off-white line work, red tape). Brand-perfect and not a third-party logo.
7. **How You Can Help cards:** "Give via PayPal" uses deep red — looks disabled. All three CTAs share one style (primary red). Align every CTA to the bottom of its card; remove dead space so cards are content-height on mobile.
8. **Dead space:** the Connect section and footer leave near-empty viewport-heights. Footer max ~70vh: large real logo, links, copyright, and the giant cropped outlined X bleeding off the bottom edge. Connect sits tight above it.
9. **Help equation** "YOU + ___ = X": the blank fills with the hovered/tapped option's word (DONATE / GIVE / SUPPLIES) in marker-then-type style, same as the Equation section. On mobile, the first option is pre-filled so it never looks empty.

## P2 — Polish

10. Programs: add a subtle paper texture + slight edge shadow variance per object so they feel physical, not like white cards.
11. Contact sheet: add grease-pencil frame numbers circled on the currently-selected frame; keep everything else.
12. Check the X for Girls section doesn't show the same photo twice while scrolling on mobile.

---

## Do not change
- Programs concepts (work order / job ticket / checkout card), Albany word-reveal, Girls section, contact sheet, the Q-flag system, content files structure.

## Finish checklist
- [ ] `npm run build` passes, zero TS errors
- [ ] No hand-drawn logo parts remain
- [ ] Tested at 375 / 768 / 1280 / 1920, no horizontal page scroll
- [ ] Reduced-motion path still works
- [ ] `brief/NOTES_FROM_BUILDER.md` updated with what changed, what didn't, and questions
