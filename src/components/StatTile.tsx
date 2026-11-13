import type { ReactNode } from 'react';

/**
 * One number with what it counts and a single line of context.
 *
 * `tone` colours the value only when it needs looking at; most tiles have
 * none. Wrap a row of them in <StatTiles>.
 *
 *   <StatTile label="Failed" value={6} sub="4 from one IP" tone="attention" />
 */
export function StatTile({
  label,
  value,
  sub,
  tone,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  tone?: 'attention' | 'bad';
}) {
  return (
    <div className="stat-tile">
      <div className="stat-label">{label}</div>
      <div className={`stat-value${tone ? ` stat-tile-value--${tone}` : ''}`}>{value}</div>
      {sub != null && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export function StatTiles({ children }: { children: ReactNode }) {
  return <div className="stat-tiles">{children}</div>;
}
