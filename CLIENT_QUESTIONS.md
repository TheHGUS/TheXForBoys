# Client questions — The “X” for Boys homepage prototype

Everything below needs a yes/no (or a rewrite) from The “X” for Boys before
the build becomes the real site.

**How to see them in context:** run the site and press the **Q** key. Small
yellow sticky notes appear next to every flagged element. Press **Q** again to
hide them. They are never visible unless you toggle them.

---

## 1. New lines we wrote (not on the current site)

| # | Where | Line | Flag |
|---|-------|------|------|
| 1 | Hero | The headline ends with the **outlined varsity X glyph** instead of the letter “X” (“SOLVING FOR _X_”) | `NEW LINE` next to Donate Now |
| 2 | The Equation | **“Let’s solve it together.”** — caption under the finale mark | `NEW LINE` |
| 3 | Albany | **“That’s the equation we’re here to change.”** — the line after the statistic | `NEW LINE` |
| 4 | The X for Girls | **“Same equation. Every child.”** — sub-line under “The X for Boys & Girls” | `NEW LINE` |
| 5 | How You Can Help | **“YOU + \_\_\_ = X”** — the blank fills in with DONATE / GIVE / SEND SUPPLIES | `NEW LINE` |
| 6 | Our Programs | **“Three workshops. One equation.”** — mono sub-line next to the heading | `NEW LINE` |
| 7 | How You Can Help | **“Give via PayPal”** as the middle option’s title | `PAYPAL` |
| 8 | Connect | **“you@email.com”** placeholder and **“You’re on the list.”** confirmation | `NO BACKEND` |

_No new studio-written lines were added in round 02. The copy above is
unchanged from round 01._

> There are no other invented claims, numbers, names or statistics on the site.
> Every other word is lifted from the current thexforboys.org homepage.

---

## 2. The logo file (no longer blocking)

The real white PNG is used for every full-logo moment (intro end state,
equation finale, nav, footer), and the raised fist “pops” by clipping **the
same PNG** to the fist region rather than drawing a hand.

Round 03 downloaded the PNG, trimmed its transparent padding (612×612 →
365×418 artwork) and measured the fist region off the real pixels, so the pop
is now exact. The favicon is cut from the same PNG.

- **A vector file (SVG, EPS or AI) would still help** for sharper renders at
  the finale’s ~50vh size on large screens, and for print/PDF assets.
- Flagged in the UI as `LOGO FILE` on the footer logo (press **Q**).

## 3. The X for Girls section — needs confirming before we keep it

- **What is the program actually called?** The donate block says “The X for
  Boys & Girls”. Is the official name *The X for Boys & Girls*, or is there a
  separate *X for Girls*?
- **How active is it?** The site currently reads as boys-first. Do you want the
  girls’ program given equal weight on the homepage, or a short section like
  this prototype?
- **How do you want it presented?** We treated it as a bright, photographic
  interruption in the rhythm, using the pink sampled from the girls’ shirts
  (`#FF3E8E`). Happy to change the tone.
- **Do you have more photos of the girls’ program?** We only had
  `DSC01956.JPG` to work with.

---

## 4. The Albany statistic

> “Albany, GA has the highest concentrated poverty rate in Georgia. It is also
> ranked the 7th most dangerous city in U.S. with offenders being most likely
> black males as young as eleven years old.”

- **Is this still current?**
- **Do you still want to lead the homepage with it?** It is the heaviest moment
  on the page. We can soften it, move it lower, or replace it with a
  mission-led statement.
- **Can you point us to the source/date** so we can cite it (or drop the
  specific rankings and keep it general)?
- Note: this section is deliberately the darkest moment on the page — full
  black, word-by-word reveal. If you’d rather it not be the emotional peak,
  tell us and we’ll re-balance.

---

## 5. Social handles

The site says **“Follow @thexforboys”**, but the links we were given point at:

| Channel | Link we used | Handle shown |
|---------|--------------|--------------|
| Instagram | `instagram.com/newemergingking` | @newemergingking |
| Facebook | `facebook.com/506180549916255` | The X for Boys |
| X | `x.com/NewEmergingKing` | @NewEmergingKing |
| YouTube | `youtube.com/channel/UC1Fq_AMbcQYYaN83MfhDWGQ` | The X for Boys |

- **Which handle should we be sending people to — @thexforboys or
  @newemergingking?** (Are they the same organisation? “New Emerging King”
  appears to be the wider org.)
- Confirm the Facebook and YouTube display names.

---

## 6. Also worth a decision (lower priority)

- **Programme treatment:** we presented the three workshops as real objects on
  a workbench — a mechanic’s work order, a job ticket pinned to a blueprint,
  and an old library checkout card — instead of three icon cards. Approve the
  treatment? (`TREATMENT` flag)
- **Ticket micro-copy** (“WORK ORDER No. 001”, “JOB TICKET No. 002”,
  “CHECKOUT CARD”, “TECH: MENTOR”, date/duedate rows) is our furniture, not
  your copy. Fine to keep?
- **The “WEEKLY” rubber stamp** on the reading card — our addition. Keep?
- **PayPal:** “Give via PayPal” currently links to `thexforboys.org/donate`.
  Send us the real PayPal button / hosted link and we’ll wire it in.
- **Email signup:** front-end only — it stamps a red check but sends nothing.
  Where should signups go (Mailchimp, Constant Contact, an inbox)?
- **Nav links** (About Us, Our Team, Community, Gallery, Parent Portal,
  Contact Us) point at the live thexforboys.org pages. Some may 404 — we left
  them as-is. They become internal routes when this becomes the real site.
- **Alt text** was written from the programme context each photo is used in,
  not from the final crops. Please skim it once the photos are final.
- **Photos:** we only had the images listed in `src/content/images.ts`. If you
  have a stronger hero, or more shop/girls photos, send them over.
- **Contact sheet:** we dropped `DSC01956.JPG` from the `#clubphotos` roll
  because it is the full-bleed photograph in The X for Girls section directly
  above it — on mobile you saw the same picture twice in a row. Tell us if you
  would rather it stayed in the roll.
- **Wishlists:** the “Registries & Wishlists” card no longer shows the Amazon
  screenshot (it cropped badly). It now uses a line illustration of a shipping
  box whose packing tape forms an X. Happy to swap it back if you have a
  cleanly-cropped version.
