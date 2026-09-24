---
name: "arena-build-loop"
description: "Use for DREY's website/app builds: set up the GitHub repo and brief files, type each round into his Arena tab, check the repo for completion, review with screenshots, and write the next round or the Claude Code handoff."
---

# Arena Build Loop

DREY's build pipeline: spec in chat, then Arena (cheap builds), then Claude Code (precision and finish). The studio controls what the builder sees through files in the repo. DREY doesn't relay messages. You drive Arena in his Chrome tab and check the repo yourself.

## 1. Repo setup (new project)
- Create the repo under the TheHGUS GitHub account. Use the git connection if this session has the repo attached; otherwise use Chrome at `github.com/new` (public unless DREY says private). For an existing project, use its existing repo.
- Add these files. If there's no git push access, use GitHub's web editor: open `/new/<branch>?filename=<path>`, paste via a ClipboardEvent into `.cm-content`, then Commit changes > Commit changes.
  - `ARENA.md` (root): the entry point. It lists the files to read in order and the current round file.
  - `brief/STUDIO_STANDARDS.md`: copy from `TheHGUS/TheXForBoys/brief/STUDIO_STANDARDS.md` and adjust only if the project needs it.
  - `brief/PROJECT_BRIEF.md`: the concept, stack, brand (exact colours, fonts, logo URL), verbatim copy with `[NEW]` studio lines flagged, links, image map, section order.
  - `brief/ROUND-01.md`: the task.
  - `brief/NOTES_FROM_BUILDER.md`: the builder writes here each round.
- Verify every file after committing: pull the repo and diff it against what you wrote.

## 2. Writing a round file
- Priorities: P0 (must), P1 (should), P2 (polish). Each item names the file, the problem as seen, the fix, and a "Done when" test.
- Include a "Do not change" list (what's already good) and a finish checklist (build passes, notes written).
- Copy truth: only client-supplied copy. Studio lines are marked `[NEW]` and go into CLIENT_QUESTIONS.md.
- Double-check your own inputs (e.g. photo-to-section mapping) by looking at the images before writing them into a brief.

## 3. Sessions and branches (important)
- **Default: keep using the same Arena session for every round of a project.** Don't scatter new sessions.
- Arena works on its own branch (`arena/<id>-<repo>`). **Don't merge that branch into main while the session is still in use.** Merging closes its pull request, and Arena then loses GitHub access for that session.
- So, between Arena rounds:
  - Commit the next round file (`brief/ROUND-XX.md`, plus any `ARENA.md` update) **to Arena's branch**, not main, so Arena can pull it.
  - Review from Arena's branch.
- Merge Arena's branch into main only when Arena is done with the project (handoff to Claude Code, or final).
- Start a new Arena session only if the current one is broken: it can't reach the repo, errors repeatedly, loops, or its branch was already merged. Tell DREY why before switching.

## 4. Driving Arena
- `tabs_context_mcp` to find the Arena tab (arena.ai). If it's not in your tab group, open it and go to the project's existing session.
- First round in a session:
  ```
  Use the GitHub repo TheHGUS/<repo>, branch main.
  Open ARENA.md in the repo root and follow it exactly. Read the files it lists in order, then do the task in brief/ROUND-01.md.
  When you're done, write your notes in brief/NOTES_FROM_BUILDER.md, make sure npm run build passes, and push your work.
  ```
- Later rounds in the same session:
  ```
  New round. Pull the latest from your branch; I've added brief/ROUND-XX.md. Read it (and re-read brief/STUDIO_STANDARDS.md if unsure), do everything in it top to bottom, update brief/NOTES_FROM_BUILDER.md, make sure npm run build passes, and push.
  ```
- If Arena asks a question you can answer from the brief, answer it. If it needs DREY's decision, ask him.

## 5. Waiting smart (no fixed long waits)
- Estimate the duration from the round's size: small fix round about 10–20 min, medium about 20–35 min, full build about 35–60 min. Tell DREY the estimate.
- Schedule a check at the estimate plus ~25% (use `send_later` to come back to this session).
- At each check: first look for new commits on Arena's branch (`git ls-remote` or the repo's branches page), then glance at the Arena tab.
  - Pushed: go to review.
  - Still working and visibly progressing (new files and steps in its log): extend by about 30–50% of the original estimate.
  - Stalled (no change since the last check), erroring, stuck in a loop or waiting on a question: report it to DREY straight away with what you saw and your suggested fix. Don't keep waiting.
- Early warning: if Arena says it can't access the repo or files, stop and fix access instead of letting it guess.

## 6. Review
- Fetch Arena's branch, `npm install && npm run build` (plus `npm run check` if it exists), run `vite preview`.
- Playwright screenshots at 1440×900 and 375×812: intro, hero at rest, every scroll state of signature sections, every section. Look at every frame. Also check the console for errors.
- Read `NOTES_FROM_BUILDER.md`. Accept reasoned deviations and say so in the next round.
- Judge against STUDIO_STANDARDS: concept carried through, real logo only, no slop, no overlaps, no dead bands, mobile clean.

## 7. Next step decision
- If the remaining issues are layout or design, cheap and broad: write `ROUND-XX.md` onto Arena's branch and send the "new round" message in the same session.
- If the remaining issues need precision, visual verification (Arena has no browser), asset handling, deployment or integrations: merge Arena's branch into main (open a PR and merge it; on heavy compare pages, submit with JS `requestSubmit` if clicks time out), then write the Claude Code round on main. It must require screenshots committed to `brief/screens/round-XX/`, self-hosted assets, Lighthouse scores and a Vercel preview URL. Give DREY the short Claude Code prompt that points to the round file. Don't include account/dashboard setup steps.
- Report to DREY: what improved, what's still wrong (with screenshots), and the next action.

## Image generation
If a round needs generated images, use the flow-image-director skill before writing the round, and reference the approved image files in the brief.
