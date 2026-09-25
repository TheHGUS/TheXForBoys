/**
 * ALL SITE COPY LIVES HERE.
 * ---------------------------------------------------------------------------
 * Rules for editing:
 *  - Text marked [VERBATIM] is lifted word-for-word from thexforboys.org and
 *    must not be paraphrased without client sign-off.
 *  - Text marked [NEW] is a creative line written by The Harmon Group. Every
 *    [NEW] line is also listed in CLIENT_QUESTIONS.md and flagged in the UI
 *    with a yellow sticky note (press "Q" on the site to toggle them).
 *  - Do not add facts, numbers, names, programmes or claims here that are not
 *    already below.
 */

export const site = {
  name: 'The "X" for Boys', // [VERBATIM] as in their copyright line
  shortName: 'The X for Boys',
  tagline: 'Solving for X', // [NEW] — studio line, use #2 of 2
  credit: 'Designed by The Harmon Group',
  copyright: 'Copyright © 2026 The "X" for Boys - All Rights Reserved.', // [VERBATIM]
} as const;

/** Link targets. Change these in one place. */
export const links = {
  // Existing site pages
  home: 'https://thexforboys.org/',
  aboutUs: 'https://thexforboys.org/about-us',
  ourTeam: 'https://thexforboys.org/our-team',
  community: 'https://thexforboys.org/community',
  gallery: 'https://thexforboys.org/gallery',
  parentPortal: 'https://thexforboys.org/parent-portal',
  contactUs: 'https://thexforboys.org/contact-us',
  appointments: 'https://thexforboys.org/appointments',
  // Giving
  donate: 'https://thexforboys.org/donate',
  goGetFunding: 'https://gogetfunding.com/the-x-for-boys-girls-2026-eoy-fundraiser/',
  amazonWishlist: 'https://a.co/b70RlQT',
  // Social
  instagram: 'https://instagram.com/newemergingking',
  facebook: 'https://www.facebook.com/506180549916255',
  x: 'https://x.com/NewEmergingKing',
  youtube: 'https://www.youtube.com/channel/UC1Fq_AMbcQYYaN83MfhDWGQ',
} as const;

/*
 * ROUND 05 RULE: every visible line below is the client's own wording, exactly
 * as it appears on thexforboys.org (checked against the live homepage). The
 * only studio line left is "Solving for X", used in exactly two places (hero
 * eyebrow, footer tagline). Nothing is paraphrased; the design does the work.
 */

export const nav = {
  /**
   * Their own nav labels (Home · Learn More · Support Us · Gallery), each
   * pointing at the matching section on this page. Pages that aren't part of
   * this prototype aren't linked from any menu.
   */
  links: [
    { label: 'Home', href: '#top' },
    { label: 'Learn More', href: '#programs' },
    { label: 'Support Us', href: '#help' },
    { label: 'Gallery', href: '#gallery' },
  ],
  cta: 'DONATE', // [VERBATIM]
  ctaHref: links.goGetFunding,
  menuLabel: 'Menu',
  skipToContent: 'Skip to main content',
} as const;

export const hero = {
  eyebrow: 'Solving for X', // [NEW] — studio line, use #1 of 2
  /** [VERBATIM] their mission — the hero headline. `accent` is styled in script. */
  headline: 'Our mission is to provide our sons with new outlets to explore their unique interests & talents.',
  accent: 'sons',
  primaryCta: 'DONATE NOW', // [VERBATIM]
  secondaryCta: 'Our Programs', // [VERBATIM]
} as const;

export const programs = {
  heading: 'Our Programs', // [VERBATIM]
  accent: 'Programs',
  items: [
    {
      id: 'automotive',
      /** The real-world object this programme is printed on (a design label). */
      object: 'Work order',
      number: 'No. 001',
      title: 'Automotive Repair Workshops', // [VERBATIM]
      body:
        'We teach simple automotive repair such as oil change, brake pad replacement, alternator repair, tire changing etc.', // [VERBATIM]
      /** Line items — their own words, lifted from the sentence above. */
      checklist: ['oil change', 'brake pad replacement', 'alternator repair', 'tire changing'],
    },
    {
      id: 'home',
      object: 'Job ticket',
      number: 'No. 002',
      title: 'Home Improvement Workshops', // [VERBATIM]
      body:
        'We teach simple home improvement such as replacing light fixtures, sheetrock, interior and exterior painting, popcorn ceilings, etc.', // [VERBATIM]
      checklist: ['replacing light fixtures', 'sheetrock', 'interior and exterior painting', 'popcorn ceilings'],
    },
    {
      id: 'reading',
      object: 'Checkout card',
      number: 'No. 003',
      title: 'Reading Literacy', // [VERBATIM]
      body:
        'We host a weekly book club to improve reading comprehension and vocabulary building. This also helps with releasing stress, seeing that they are allowed to be vocal about any and everything on their minds.', // [VERBATIM]
      checklist: ['reading comprehension', 'vocabulary building'],
    },
  ],
} as const;

export const albany = {
  /** [VERBATIM] */
  statement:
    'Albany, GA has the highest concentrated poverty rate in Georgia. It is also ranked the 7th most dangerous city in U.S. with offenders being most likely black males as young as eleven years old.',
  /** [VERBATIM] — their donate block, used as the story's ask */
  askHeading: 'Donate to The X',
  askAccent: 'The X',
  askBody: 'Your support and contributions will enable us to meet our goals for Life Prep',
  askCta: 'DONATE NOW',
} as const;

export const girls = {
  title: 'Donate to The X for Boys & Girls', // [VERBATIM]
  cta: 'DONATE!', // [VERBATIM]
} as const;

export const club = {
  heading: '#clubphotos', // [VERBATIM]
  lightboxClose: 'Close',
  lightboxPrev: 'Previous photo',
  lightboxNext: 'Next photo',
} as const;

export const help = {
  heading: 'How You Can Help', // [VERBATIM]
  accent: 'Help',
  options: [
    {
      id: 'donate',
      title: 'DONATE', // [VERBATIM]
      cta: 'DONATE NOW', // [VERBATIM]
      href: links.goGetFunding,
      brand: { name: 'GoGetFunding', logo: '/brands/gogetfunding.svg', w: 112, h: 46 },
    },
    {
      id: 'give',
      title: 'GIVE', // [VERBATIM]
      cta: 'GIVE', // [VERBATIM]
      href: links.donate,
      brand: { name: 'PayPal', logo: '/brands/paypal.svg', w: 24, h: 24 },
    },
    {
      id: 'supplies',
      title: 'Registries & Wishlists', // [VERBATIM]
      cta: 'Registries & Wishlists', // [VERBATIM]
      href: links.amazonWishlist,
      brand: { name: 'Amazon', logo: '/brands/amazon.svg', w: 603, h: 182 },
    },
  ],
} as const;

export const connect = {
  heading: 'Connect With Us!', // [VERBATIM]
  accent: 'Us!',
  sub: 'Learn more about our upcoming events, fundraisers, and more!', // [VERBATIM]
  emailLabel: 'Email Address', // [VERBATIM]
  emailPlaceholder: 'Email Address', // [VERBATIM]
  submit: 'SIGN UP', // [VERBATIM]
  success: "You're on the list.", // UI feedback only (form is front-end only)
  follow: 'Follow @thexforboys', // [VERBATIM]
  socials: [
    { id: 'instagram', label: 'Instagram', href: links.instagram, handle: '@newemergingking' },
    { id: 'facebook', label: 'Facebook', href: links.facebook, handle: 'The X for Boys' },
    { id: 'x', label: 'X', href: links.x, handle: '@NewEmergingKing' },
    { id: 'youtube', label: 'YouTube', href: links.youtube, handle: 'The X for Boys' },
  ],
} as const;

export const footer = {
  /** The top nav's sections, plus Donate. */
  links: [
    { label: 'Home', href: '#top' },
    { label: 'Learn More', href: '#programs' },
    { label: 'Support Us', href: '#help' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Donate', href: links.goGetFunding, external: true },
  ],
} as const;
