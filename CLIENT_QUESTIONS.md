# Client questions — The “X” for Boys homepage prototype

Everything below needs a yes/no (or a rewrite) from The “X” for Boys before
the build becomes the real site.

**How to see them in context:** run the site and press the **Q** key. Small
yellow sticky notes appear next to every flagged element. Press **Q** again to
hide them. They are never visible unless you toggle them.

---

## 1. Copy — your words, exactly

Since round 05 **every word on the page is taken from your current homepage,
exactly as written** — nothing paraphrased. The design (layout, type, colour,
photos) is what changed.

The only studio-written line is **“Solving for X”**, used in two small places:
the red script line above the hero headline and the footer tagline. Keep it,
or remove it?

The sign-up form's on-screen confirmation (“You’re on the list.”) is UI
feedback only, since the form isn't connected yet (`NO BACKEND` flag).

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

- **Programme treatment:** the three workshops are printed on the real paper
  they belong to — a work order, a job ticket, a library checkout card — each
  with only your words, your photo, and the sheet's type and number. Approve?
- **PayPal:** “GIVE” currently links to `thexforboys.org/donate`. Send us the
  real PayPal button / hosted link and we’ll wire it in. (`PAYPAL` flag)
- **Email signup:** front-end only. Where should signups go (Mailchimp,
  Constant Contact, an inbox)? (`NO BACKEND` flag)
- **Menus** only link to sections of this page, using your own nav labels
  (Home, Learn More, Support Us, Gallery). Your other pages (Appointments,
  Contact Us, Parent Portal…) join the menus when they're built.
- **Photos:** if you have a stronger hero, a real Albany street/skyline shot,
  or more shop/girls photos, send them over.
- **Giving platforms:** the DONATE, GIVE and Registries & Wishlists cards
  carry the GoGetFunding, PayPal and Amazon logos so visitors know where each
  button goes.
