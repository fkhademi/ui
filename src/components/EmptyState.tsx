import type { ReactNode } from 'react';

/**
 * "No data yet" screen for empty lists, filtered-to-zero tables,
 * never-used features, etc. Center-aligned, low-contrast — the empty
 * state should feel calm, not alarming.
 *
 *   <EmptyState
 *     icon={<Inbox />}
 *     title="No accounts yet"
 *     subtitle="Add your first account to start tracking deals."
 *     action={<button className="btn-primary">New account</button>}
 *   />
 */
export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <div className="empty-state-title">{title}</div>
      {subtitle && <div className="empty-state-sub">{subtitle}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
