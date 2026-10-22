import type { ReactNode } from 'react';

/** What a state means, which is all its colour says. */
export type StateTone = 'good' | 'attention' | 'bad' | 'off';

/**
 * A state shown as a coloured dot and its word: Active, Expired, At risk.
 * Good is green, needs attention amber, broken or ended red, and switched off
 * on purpose grey.
 *
 *   <State tone="bad">Expired</State>
 */
export function State({ tone, children }: { tone: StateTone; children: ReactNode }) {
  return (
    <span className="state">
      <span className={`state-dot state-dot--${tone}`} aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * A category shown quietly: a licence type, a deal stage, a source. No colour,
 * since a category is not good or bad.
 *
 *   <Tag>Enterprise</Tag>
 */
export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}
