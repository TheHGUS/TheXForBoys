# The Harmon Group — build rules for Claude Code

Read before doing anything in this repo:
1. `brief/STUDIO_STANDARDS.md`: how we work. It overrides your defaults.
2. `brief/PROJECT_BRIEF.md`: client, brand, copy, links, images.
3. The latest `brief/ROUND-XX.md`: your current task.

## Skills to use (they're in `.claude/skills/`)
- **flow-image-director**: use whenever the task needs a generated image (backgrounds, textures, objects, mockups, concept frames). Write the prompts and run them in DREY's Google Flow tab in Chrome. If a logo, product or other exact element is needed, stop and tell DREY exactly what to upload into Flow. Never generate images that pass as real photos of the client's people or events. Their real photos come first.
- **arena-build-loop**: use when a round of work should go to Arena instead of being done here (broad, cheap layout/design work), or when setting up a new project repo and its brief files. It covers driving DREY's Arena tab, timing the checks, reviewing with screenshots, and writing the next round.

## Always
- Look at your work: Playwright screenshots at 1440×900 and 375×812, and review them before calling anything done.
- `npm run build` must pass. Write round notes in `brief/NOTES_FROM_BUILDER.md`.
- Only edit `/brief` files that the round tells you to.
