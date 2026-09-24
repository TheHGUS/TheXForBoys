# Round 03 — Finish for the pitch (Claude Code)

Round 02 landed most of the brief. This round is precision work plus the one thing Arena couldn't do: **look at the page.** You have a browser, so you are expected to use it. Nothing counts as done until you've seen it in a screenshot.

Read `brief/STUDIO_STANDARDS.md` and `brief/PROJECT_BRIEF.md` first. The hero clamp deviation in round 02 notes is **approved** (headline at ~50% of viewport width stays).

---

## Working method (required)

1. `npm install && npm run build && npx vite preview`.
2. Write a Playwright script (`scripts/screens.mjs`) that captures, at **1440×900 and 375×812**:
   - hero at rest (after intro), intro at 0.3s / 0.9s / 1.6s
   - each Equation state: auto, home, reading, collapse, logo
   - every section below it
   - Save to `brief/screens/round-03/` (commit them — the studio reviews from these).
3. Look at every screenshot yourself. Fix, re-shoot, repeat until every frame looks like a finished poster.

---

## P0 — Must fix

### 1. Wrong photos (studio error in the original image map)
Our image mapping was wrong. Replace in `src/content/images.ts` and update alt text to match what's actually in each photo:
- `AUTO_1` → `IMG_1128.jpg` (boys in X shirts changing a tire on a red truck)
- `AUTO_2` → `IMG_1125.jpg` (boy kneeling at a tire with tools, mentor watching)
- `HOME_1` → keep `107490527_747809919368645_6947944466898993638_.jpg` (group lifting a timber beam)
- `READ_1` → `112296745_2672695399669168_4236440098798381834.jpg` (reading circle, open book in foreground)
- `READ_2` → `115941536_1928831703917630_8727889694125410655.jpg` (indoor group session, boys with papers)
Open each image and confirm it matches before shipping. The Programs objects use `AUTO_2` / `HOME_1` / `READ_2` — check each object shows the right program.

### 2. Equation — mobile shows no illustrations
At 375px the three terms appear as headings over an empty stage; the brake, wall and book never render. Fix so each term's illustration + photo plays on mobile exactly like desktop (no pinning is fine; scroll-triggered per term).

### 3. Equation — stages bleed into each other
The previous stage's photo stays visible under the next (the car photo sits under the reading book). Each stage must fully exit before the next enters. The photo clip-path reveal must reach **full frame** by the time the line art finishes (right now it's often a thin strip on the left).

### 4. Equation — the finale is too small
The logo lands at ~15% of viewport width and "Let's solve it together." drifts into the next screen with a dead band after it. This is the peak moment of the page:
- Logo height ~50vh on desktop, ~60vw wide on mobile.
- "Let's solve it together." sits directly under it, same viewport, display size.
- Remove the empty band that follows.

### 5. Nav progress line is always full
The wrapper `<span>` around the progress bar has `bg-red`, so a full-width red line shows at all times. The track must be transparent (or off-white at 8%); only the inner bar is red and scales 0 → 1 with scroll. Verify at top, middle and bottom of the page.

### 6. Logo — measure, don't estimate
The logo PNG is reachable from here. Facts: it's **612×612 with transparent padding**; the artwork's bounding box is **x 112–477, y 72–490**.
- Download it into `public/brand/`, trim the padding, and serve it locally.
- Measure the fist region from the actual pixels, update `FIST_REGION` and `LOGO_INTRINSIC`, and verify the fist pop in the intro screenshots (no ghosting, no clipped knuckles).
- Generate a favicon from it.

---

## P1

7. **Hero X.** At 1.42× cap height the X reads as an icon, not the answer. Scale the X on line 2 to ~2.2× the cap height of "SOLVING FOR", left-aligned with it. Check it doesn't collide with the subline at 375 or 1440.
8. **Help CTAs aren't aligned.** "Donate Now" sits lower than "Give via PayPal" because the helper text under each button has different line counts. Put helper text above the button (or give it a fixed height) so all three buttons share one baseline. Remove the dead space in the Donate card on desktop.
9. **Self-host every image.** Download all photos from `images.ts` into `public/images/`, output WebP at 1800w and 900w with `srcset`, keep JPEG fallback. No requests to wsimg.com remain.

## P2

10. Run Lighthouse (mobile) and fix anything under Performance 85 / Accessibility 95. Record scores in the notes.
11. Deploy a preview on Vercel (already connected to the GitHub account) and put the URL at the top of `brief/NOTES_FROM_BUILDER.md`.

---

## Finish checklist
- [ ] Screenshots for every state at 1440 and 375 committed in `brief/screens/round-03/`
- [ ] Correct photos, verified by eye
- [ ] No wsimg.com requests (check the network log)
- [ ] `npm run build` and `npm run check` pass
- [ ] Lighthouse scores recorded
- [ ] Preview URL in `brief/NOTES_FROM_BUILDER.md`
- [ ] Round 03 notes written: what changed, what didn't, what you need from us
