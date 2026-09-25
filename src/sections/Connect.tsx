import { useState } from 'react';
import { connect } from '../content/copy';
import { Accented } from '../components/ui';
import { Flag } from '../components/Flag';

/**
 * CONNECT WITH US!
 * Their heading and line on the left, their sign-up on the right, on ink.
 * Front-end only for now; the social links live in the footer.
 */
export function Connect() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <section id="connect" className="relative bg-white py-14 text-ink sm:py-16" aria-labelledby="connect-heading">
      <div className="shell grid items-center gap-7 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 id="connect-heading" className="display text-ink" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)' }}>
            <Accented text={connect.heading} accent={connect.accent} />
          </h2>
          <p className="mt-3 max-w-[46ch] text-[1.02rem] leading-[1.6] text-ink/70">{connect.sub}</p>
        </div>

        <div className="relative">
          <form
            className="flex w-full flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setSent(true);
            }}
            noValidate
          >
            <label className="flex-1">
              <span className="sr-only">{connect.emailLabel}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (sent) setSent(false);
                }}
                placeholder={connect.emailPlaceholder}
                className="h-[52px] w-full rounded-lg border border-ink/15 bg-[#F4F4F2] px-4 text-[0.95rem] text-ink placeholder:text-ink/50 focus:border-red focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="h-[52px] shrink-0 rounded-lg bg-red px-8 font-sans text-[0.9rem] font-semibold text-white transition-colors duration-200 hover:bg-deepred"
            >
              {connect.submit}
            </button>
          </form>
          <p className="mt-3 min-h-[1.5em] text-[0.9rem] font-semibold text-ink" aria-live="polite">
            {sent ? connect.success : null}
          </p>
          <span className="absolute -top-2 right-0">
            <Flag id="q-email-signup" place="tl" />
          </span>
        </div>
      </div>
    </section>
  );
}

export default Connect;
