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
  'q-socials': {
    label: 'HANDLES',
    question:
      'Confirm social handles: @thexforboys vs @newemergingking. Instagram and X currently point at @newemergingking.',
  },
  'q-donate-paypal': {
    label: 'PAYPAL',
    question: '“GIVE” currently links to their /donate page (PayPal). Confirm the real PayPal button / link for the next stage.',
  },
  'q-email-signup': {
    label: 'NO BACKEND',
    question: 'The email signup is front-end only — it confirms on screen but sends nothing. Confirm where signups should go.',
  },
} as const satisfies Record<string, QuestionFlag>;

export type QuestionId = keyof typeof questions;

export const flagList: Array<QuestionId & string> = Object.keys(questions) as Array<
  QuestionId & string
>;
