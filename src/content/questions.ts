/**
 * CLIENT QUESTION FLAGS
 * ---------------------------------------------------------------------------
 * Every element we want the client to sign off on carries one of these ids.
 * Press the "Q" key on the site to toggle little yellow sticky notes next to
 * each flagged element. They are never visible unless toggled.
 *
 * The same list is written out long-form in CLIENT_QUESTIONS.md at the repo
 * root — keep the two in sync.
 */

export type QuestionFlag = {
  /** Short label printed on the sticky note. */
  label: string;
  /** The question itself. */
  question: string;
};

export const questions = {
  'q-hero-glyph': {
    label: 'NEW LINE',
    question:
      'The hero headline ends with the outlined varsity X glyph instead of the letter “X”. Approve?',
  },
  'q-equation-caption': {
    label: 'NEW LINE',
    question: '“Let’s solve it together.” — approve as the line under the equation finale?',
  },
  'q-albany-stat': {
    label: 'STAT CHECK',
    question:
      'Albany statistic: is this still current, and do you want to lead with it on the homepage? Please confirm the source and date.',
  },
  'q-albany-kicker': {
    label: 'NEW LINE',
    question: '“That’s the equation we’re here to change.” — approve?',
  },
  'q-girls-section': {
    label: 'PROGRAM?',
    question:
      'Confirm the X for Girls program — name, how active it is, and how you want it presented.',
  },
  'q-girls-sub': {
    label: 'NEW LINE',
    question: '“Same equation. Every child.” — approve?',
  },
  'q-help-equation': {
    label: 'NEW LINE',
    question: '“YOU + ___ = X” — approve as the line above the giving options?',
  },
  'q-socials': {
    label: 'HANDLES',
    question:
      'Confirm social handles: @thexforboys vs @newemergingking. Instagram and X currently point at @newemergingking.',
  },
  'q-programs-intro': {
    label: 'NEW LINE',
    question: '“Three workshops. One equation.” — approve as the sub-line under “Our Programs”?',
  },
  'q-program-tickets': {
    label: 'TREATMENT',
    question:
      'Programme copy is presented as real objects (work order, job ticket, library checkout card) instead of cards. Approve the treatment?',
  },
  'q-donate-paypal': {
    label: 'PAYPAL',
    question:
      '“Give via PayPal” currently links to /donate. Confirm the real PayPal button / link for the next stage.',
  },
  'q-logo-vector': {
    label: 'LOGO FILE',
    question:
      'We only have the white PNG. Please send the vector (SVG / EPS / AI) so the fist-pop animation can be pixel-exact, and so we can cut a proper favicon and print files.',
  },
  'q-email-signup': {
    label: 'NO BACKEND',
    question:
      'The email signup is front-end only — it shows a stamped confirmation but sends nothing. Confirm where signups should go.',
  },
  'q-alt-text': {
    label: 'ALT TEXT',
    question:
      'Alt text was written from programme context, not from the final crops. Please confirm each description matches the photo.',
  },
} as const satisfies Record<string, QuestionFlag>;

export type QuestionId = keyof typeof questions;

export const flagList: Array<QuestionId & string> = Object.keys(questions) as Array<
  QuestionId & string
>;
