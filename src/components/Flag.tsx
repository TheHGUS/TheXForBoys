import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { questions, type QuestionId } from '../content/questions';

/**
 * CLIENT QUESTION FLAGS
 * ---------------------------------------------------------------------------
 * Press "Q" anywhere on the site to toggle small yellow sticky notes next to
 * every element we need the client to sign off on. Off by default, never
 * visible unless toggled, and it never affects layout.
 */

type FlagState = { show: boolean; toggle: () => void };

const FlagContext = createContext<FlagState>({ show: false, toggle: () => {} });

export function QuestionFlagProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  const toggle = useCallback(() => setShow((s) => !s), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'q' && e.key !== 'Q') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
      setShow((s) => !s);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ show, toggle }), [show, toggle]);
  return <FlagContext.Provider value={value}>{children}</FlagContext.Provider>;
}

export function useQuestionFlags(): FlagState {
  return useContext(FlagContext);
}

type Place = 'tr' | 'tl' | 'br' | 'bl';

const PLACE: Record<Place, string> = {
  tr: 'right-0 top-0 rotate-[-2.5deg] origin-top-right',
  tl: 'left-0 top-0 rotate-[2deg] origin-top-left',
  br: 'right-0 bottom-0 rotate-[1.5deg] origin-bottom-right',
  bl: 'left-0 bottom-0 rotate-[-1.5deg] origin-bottom-left',
};

/**
 * Drop this inside any `relative` element. It renders nothing until the flags
 * are toggled on.
 */
export function Flag({ id, place = 'tr' }: { id: QuestionId; place?: Place }) {
  const { show } = useQuestionFlags();
  if (!show) return null;
  const q = questions[id];
  return (
    <div
      className={`pointer-events-none absolute z-[65] w-[min(230px,60vw)] border-l-[3px] border-red bg-note px-2.5 py-2 text-left shadow-[6px_6px_0_rgba(0,0,0,0.45)] ${PLACE[place]}`}
    >
      <div className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-deepred">
        {q.label}
      </div>
      <div className="mt-1 font-sans text-[11px] font-medium leading-[1.25] text-ink">{q.question}</div>
    </div>
  );
}

/** A tiny hint that the Q shortcut exists — shown in the footer only. */
export function FlagHint() {
  const { show } = useQuestionFlags();
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-grey/75">
      {show ? 'Q — hide client notes' : 'Q — client notes'}
    </span>
  );
}
