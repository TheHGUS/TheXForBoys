# Project Brief — The "X" for Boys · "Solving for X"

Pitch prototype homepage for The "X" for Boys (thexforboys.org), a 501(c)3 youth mentorship nonprofit in Albany, Georgia. Built by The Harmon Group to win the full redesign. It has to make the client say "we didn't know a website could feel like us."

## The idea
Their name is the equation. Their three programs are the variables. The page *solves for X*:
`AUTOMOTIVE REPAIR + HOME IMPROVEMENT + READING LITERACY = X` — and X resolves into their real logo.
Everything else is drawn from their world: mechanic work orders, job tickets, library checkout cards, a photographer's contact sheet, red marker strokes.

## Stack
React + Vite + TypeScript, Tailwind CSS, GSAP 3 + ScrollTrigger, Lenis (disabled on touch). No 3D/WebGL.

## Brand (keep exactly)
- Red `#F70303` · Ink `#161616` · Off-white `#F7F7F7` · Grey `#A4A4A4` · Deep red `#930101` (hover/pressed only — never as a resting button colour).
- Girls sub-brand pink: sampled from the girls' shirts in `GIRLS_HERO` (~`#FF3E8E`). Only in the X for Girls section.
- Fonts: Libre Franklin (800/900 display, 400/500 body). IBM Plex Mono only for ticket/work-order details. No handwriting fonts — marker marks are hand-drawn SVG paths.
- Logo (white PNG, the ONLY logo source): `https://img1.wsimg.com/isteam/ip/f58551bb-d6b3-44c4-b114-6ddab0ea1f56/The%20X%20for%20boys%20logo%2004-02%20WHITE.png` — collegiate outlined X, raised fist out of the top-right arm, on a home-plate shield. Do not redraw the fist or the shield.
- Brand pattern: tiled outlined X at 3–5% opacity, slow drift on dark sections. Subtle film grain site-wide.

## Copy (verbatim from their homepage — do not add facts)
- Mission: "Our mission is to provide our sons with new outlets to explore their unique interests & talents."
- Donate block: "Donate to The X for Boys & Girls" · "Donate to The X" · "Your support and contributions will enable us to meet our goals for Life Prep" · "Donate Now" · "Registries & Wishlists"
- Albany: "Albany, GA has the highest concentrated poverty rate in Georgia. It is also ranked the 7th most dangerous city in U.S. with offenders being most likely black males as young as eleven years old."
- "How You Can Help" · "DONATE" · "GIVE" · "Our Programs"
- Automotive Repair Workshops: "We teach simple automotive repair such as oil change, brake pad replacement, alternator repair, tire changing etc."
- Home Improvement Workshops: "We teach simple home improvement such as replacing light fixtures, sheetrock, interior and exterior painting, popcorn ceilings, etc."
- Reading Literacy: "We host a weekly book club to improve reading comprehension and vocabulary building. This also helps with releasing stress, seeing that they are allowed to be vocal about any and everything on their minds."
- "Follow @thexforboys" · "Connect With Us!" · "Learn more about our upcoming events, fundraisers, and more!" · "Sign up" · "#clubphotos"
- "Copyright © 2026 The "X" for Boys - All Rights Reserved."
- [NEW] lines (studio-written, must be in CLIENT_QUESTIONS.md): "Solving for X" · "Let's solve it together." · "That's the equation we're here to change." · "Same equation. Every child." · "You + ___ = X"

## Links
- Donate (GoGetFunding): https://gogetfunding.com/the-x-for-boys-girls-2026-eoy-fundraiser/
- Donate page / PayPal: https://thexforboys.org/donate
- Amazon registry: https://a.co/b70RlQT
- Nav pages: https://thexforboys.org/about-us, /our-team, /community, /gallery, /parent-portal, /contact-us
- Instagram https://instagram.com/newemergingking · Facebook https://www.facebook.com/506180549916255 · X https://x.com/NewEmergingKing · YouTube https://www.youtube.com/channel/UC1Fq_AMbcQYYaN83MfhDWGQ

## Images
Hotlink from `https://img1.wsimg.com/isteam/ip/f58551bb-d6b3-44c4-b114-6ddab0ea1f56/` + filename, append `/:/rs=w:1800` (large) or `/:/rs=w:900` (small). Mapping lives in `src/content/images.ts` — keep it.

## Section order
0 Intro · 1 Nav · 2 Hero · 3 The Equation (signature moment) · 4 Our Programs (work order / job ticket / checkout card) · 5 Albany · 6 The X for Girls · 7 #clubphotos contact sheet · 8 How You Can Help · 9 Connect + Footer

## Client-questions system
`CLIENT_QUESTIONS.md` + press **Q** to toggle yellow sticky notes on flagged elements. Hidden by default. Already built — keep it working.
