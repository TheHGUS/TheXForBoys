# The Harmon Group — Studio Standards

These rules apply to every build in this repo. They override your defaults. If a task conflicts with these, stop and flag it in `brief/NOTES_FROM_BUILDER.md` instead of guessing.

## 1. Concept before decoration
- Every visual idea must come from the client's own truth: their name, logo, programs, photos, words. If you can't say *why* an effect exists in one sentence tied to the client, delete it.
- One big idea per page, carried all the way through. Not ten small tricks.
- Real-world artifacts beat abstract UI: work orders, tickets, stamps, contact sheets, blueprints, signage — things from the client's world.

## 2. Brand fidelity
- Use the client's real logo files. **Never redraw, trace or "approximate" a logo, mascot or icon by hand in SVG.** If a part of the logo needs to animate, animate the real image (clip-path, mask, transform), or ask for a vector file in `NOTES_FROM_BUILDER.md`.
- Use only the brand colours and fonts listed in the project brief. No extra accent colours.

## 3. Banned (AI-slop list)
Gradient blobs, glassmorphism, neon glows, purple/teal defaults, floating 3D shapes, generic "icon + title + text" card grids, emoji, stock or AI-generated images, fake testimonials, invented stats, Lorem ipsum, placeholder boxes that look like broken UI, "fade-up everything" as the only motion.

## 4. Copy truth
- Only use copy supplied in the project brief. Never add facts, numbers, names, dates or claims.
- Lines marked `[NEW]` are studio-written and must also be listed in `CLIENT_QUESTIONS.md`.

## 5. Motion
- Motion must *mean* something: drawing, building, stamping, assembling, reading, revealing.
- Easing: `power3.out` / `expo.out`; impacts use `back.out(2)`. 0.4–0.9s. Nothing floaty.
- Animate only transform, opacity, clip-path, stroke-dashoffset.
- Every animation has an end state that looks finished and intentional as a still frame. Judge each section by its screenshot at rest.
- `prefers-reduced-motion`: no pinning, no intro, no drifting; final states with simple fades.

## 6. Layout & type
- Strong grid, sharp corners (0–2px), confident whitespace — but no dead empty bands. Every viewport-height of scroll must show something worth seeing.
- Nothing may overlap text unless it is a deliberate, legible composition. Illustrations never cross headlines.
- Headline scale contrast is the #1 source of drama. Display type should be genuinely big.

## 7. Mobile is not an afterthought
- Design at 375px first. No clipped text, no cards running off-screen, no horizontal page scroll (except intentional carousels with visible affordance).
- Test at 375, 768, 1280, 1920.

## 8. Performance & accessibility
- Smooth on a mid-range Android. Lazy-load images, always set width/height.
- Lighthouse mobile: Performance 85+, Accessibility 95+.
- Semantic landmarks, visible focus rings, keyboard-usable controls, AA contrast, meaningful alt text.

## 9. Repo discipline
- Never edit anything in `/brief` except `brief/NOTES_FROM_BUILDER.md`.
- Keep content in `src/content/*` (copy, images, questions). Components stay dumb.
- Before finishing: `npm run build` must pass with zero TypeScript errors. Update `README.md` if structure changed.
- At the end of each round, write in `brief/NOTES_FROM_BUILDER.md`: what you changed, what you couldn't do, and anything you need from us.
