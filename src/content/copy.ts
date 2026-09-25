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
  name: 'The “X” for Boys',
  shortName: 'The X for Boys',
  tagline: 'Solving for X',
  location: 'Albany, Georgia',
  ein: '501(c)3 youth mentorship nonprofit',
  credit: 'Concept by The Harmon Group',
  copyright: 'Copyright © 2026 The “X” for Boys - All Rights Reserved.',
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

export const nav = {
  /**
   * Only sections that exist on this page. The live site's other pages
   * (About Us, Our Team, Community, Parent Portal, Contact Us) aren't part of
   * this prototype, so the menus don't link to them.
   */
  links: [
    { label: 'Our Programs', href: '#programs' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'How You Can Help', href: '#help' },
    { label: 'Connect', href: '#connect' },
  ],
  cta: 'DONATE',
  ctaHref: links.goGetFunding,
  menuLabel: 'Menu',
  skipToContent: 'Skip to main content',
} as const;

export const hero = {
  headlineTop: 'SOLVING FOR', // [VERBATIM] — main site headline
  // [NEW] the final "word" of the headline is the outlined varsity X glyph.
  glyphAlt: 'X',
  subline:
    'Our mission is to provide our sons with new outlets to explore their unique interests & talents.', // [VERBATIM]
  primaryCta: 'Donate Now', // [VERBATIM]
  secondaryCta: 'See the programs', // [VERBATIM]
} as const;

export const equation = {
  /** The three terms, in the order they build. */
  terms: [
    { id: 'automotive', label: 'AUTOMOTIVE REPAIR' },
    { id: 'home', label: 'HOME IMPROVEMENT' },
    { id: 'reading', label: 'READING LITERACY' },
  ],
  operator: '+',
  equals: '=',
  result: 'X',
  /** [NEW] */
  caption: "Let's solve it together.",
  /** Per-term captions used in the mobile stack + screen-reader outline. */
  notes: {
    automotive: 'Automotive repair',
    home: 'Home improvement',
    reading: 'Reading literacy',
  },
} as const;

export const programs = {
  heading: 'Our Programs', // [VERBATIM]
  intro: 'Three workshops. One equation.', // [NEW]
  items: [
    {
      id: 'automotive',
      /** The object this programme is rendered as. */
      object: 'WORK ORDER',
      title: 'AUTOMOTIVE REPAIR WORKSHOPS', // [VERBATIM]
      body:
        'We teach simple automotive repair such as oil change, brake pad replacement, alternator repair, tire changing etc.', // [VERBATIM]
      checklist: ['Oil change', 'Brake pad replacement', 'Alternator repair', 'Tire changing'], // [VERBATIM]
      stamp: undefined,
      highlight: undefined,
      mono: {
        no: 'WORK ORDER No. 001', // [NEW] — ticket furniture
        customer: 'CUSTOMER: THE X FOR BOYS', // [NEW]
        date: 'DATE: ____ / ____ / ______', // [NEW]
        tech: 'TECH: MENTOR', // [NEW]
      },
    },
    {
      id: 'home',
      object: 'JOB TICKET',
      title: 'HOME IMPROVEMENT WORKSHOPS', // [VERBATIM]
      body:
        'We teach simple home improvement such as replacing light fixtures, sheetrock, interior and exterior painting, popcorn ceilings, etc.', // [VERBATIM]
      checklist: [
        'Light fixtures',
        'Sheetrock',
        'Interior & exterior painting',
        'Popcorn ceilings',
      ], // [VERBATIM]
      stamp: undefined,
      highlight: undefined,
      mono: {
        no: 'JOB TICKET No. 002', // [NEW]
        customer: 'SITE: ALBANY, GA', // [NEW]
        date: 'DATE: ____ / ____ / ______', // [NEW]
        tech: 'CREW: MENTOR + SONS', // [NEW]
      },
    },
    {
      id: 'reading',
      object: 'CHECKOUT CARD',
      title: 'READING LITERACY', // [VERBATIM]
      body:
        'We host a weekly book club to improve reading comprehension and vocabulary building. This also helps with releasing stress, seeing that they are allowed to be vocal about any and everything on their minds.', // [VERBATIM]
      stamp: 'WEEKLY', // [NEW] — rubber stamp on the card
      highlight: ['comprehension', 'vocabulary'],
      checklist: undefined,
      mono: {
        no: 'CHECKOUT CARD', // [NEW]
        customer: 'BORROWER: THE X FOR BOYS', // [NEW]
        date: 'DATE DUE', // [NEW]
        tech: 'BOOK CLUB — WEEKLY', // [NEW]
      },
    },
  ],
} as const;

export const albany = {
  /** [VERBATIM] — statement, revealed word by word. */
  statement:
    'Albany, GA has the highest concentrated poverty rate in Georgia. It is also ranked the 7th most dangerous city in U.S. with offenders being most likely black males as young as eleven years old.',
  /** [NEW] */
  kicker: "That's the equation we're here to change.",
} as const;

export const girls = {
  title: 'The X for Boys & Girls', // [VERBATIM] — from their donate block
  /** [NEW] */
  sub: 'Same equation. Every child.',
} as const;

export const club = {
  heading: '#clubphotos', // [VERBATIM]
  hint: 'Tap a photo to open', // [NEW]
  frameLabel: 'FRAME', // [NEW]
  rollLabel: 'ROLL 01', // [NEW]
  lightboxClose: 'Close',
  lightboxPrev: 'Previous photo',
  lightboxNext: 'Next photo',
} as const;

export const help = {
  heading: 'How You Can Help', // [VERBATIM]
  /** [NEW] — the blank fills in as each option is hovered/tapped. */
  equationPrefix: 'YOU',
  equationOperator: '+',
  equationBlankDefault: '___',
  equationEquals: '=',
  equationResult: 'X',
  options: [
    {
      id: 'donate',
      word: 'DONATE',
      title: 'Donate Now', // [VERBATIM]
      body:
        'Your support and contributions will enable us to meet our goals for Life Prep', // [VERBATIM]
      href: links.goGetFunding,
      note: 'Opens our 2026 end-of-year fundraiser in a new tab', // [NEW]
    },
    {
      id: 'give',
      word: 'GIVE',
      title: 'Give via PayPal', // [NEW]
      body: 'Give through PayPal on our donate page.', // [NEW]
      href: links.donate,
      note: 'Real PayPal button to be wired in the next stage', // [NEW]
    },
    {
      id: 'supplies',
      word: 'SEND SUPPLIES',
      title: 'Registries & Wishlists', // [VERBATIM]
      body: 'Send what the workshops need, straight from our Amazon wish list.', // [NEW]
      href: links.amazonWishlist,
      note: 'Opens the Amazon wish list in a new tab', // [NEW]
    },
  ],
} as const;

export const connect = {
  heading: 'Connect With Us!', // [VERBATIM]
  sub: 'Learn more about our upcoming events, fundraisers, and more!', // [VERBATIM]
  emailLabel: 'Email address',
  emailPlaceholder: 'you@email.com', // [NEW]
  submit: 'Sign up', // [VERBATIM]
  success: "You're on the list.", // [NEW]
  follow: 'Follow @thexforboys', // [VERBATIM]
  socials: [
    { id: 'instagram', label: 'Instagram', href: links.instagram, handle: '@newemergingking' },
    { id: 'facebook', label: 'Facebook', href: links.facebook, handle: 'The X for Boys' },
    { id: 'x', label: 'X', href: links.x, handle: '@NewEmergingKing' },
    { id: 'youtube', label: 'YouTube', href: links.youtube, handle: 'The X for Boys' },
  ],
} as const;

export const footer = {
  /** Same in-page sections as the top nav — no links to pages we don't have. */
  links: [
    { label: 'Our Programs', href: '#programs' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'How You Can Help', href: '#help' },
    { label: 'Connect', href: '#connect' },
  ],
} as const;
