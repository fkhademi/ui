import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Card-shaped collapsible section. Use for any "list of expandable
 * config sections" surface — user settings, platform admin, tenant
 * detail page.
 *
 * Two modes:
 *   1. Accordion (default): pass `children` + `open` + `onToggle`. The
 *      card expands on click; a chevron rotates as the state hint.
 *   2. Inline action: pass a `right` slot (e.g. a toggle switch) and
 *      omit children. The card is a one-row control with no body.
 *      Right-slot mode disables click-to-expand so the slot owns the
 *      interaction.
 *
 * Don't pass `right` and `children` together — the header would have
 * two competing interaction targets. Pick one.
 */
export function SettingsCard({
  icon,
  title,
  summary,
  open,
  onToggle,
  right,
  children,
}: {
  icon: ReactNode;
  title: string;
  summary: string;
  open?: boolean;
  onToggle?: () => void;
  right?: ReactNode;
  children?: ReactNode;
}) {
  const isAccordion = !right && !!children;
  const headerClass = isAccordion
    ? 'settings-card-header settings-card-header--clickable'
    : 'settings-card-header';

  const headerInner = (
    <>
      <div className="settings-card-icon">{icon}</div>
      <div className="settings-card-text">
        <div className="settings-card-title">{title}</div>
        <div className="settings-card-summary">{summary}</div>
      </div>
      {right ?? <ChevronDown size={16} className="settings-card-chev" />}
    </>
  );

  return (
    <div className={`settings-card${open ? ' settings-card--open' : ''}`}>
      {isAccordion ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className={headerClass}
        >
          {headerInner}
        </button>
      ) : (
        <div className={headerClass}>{headerInner}</div>
      )}
      {open && children && <div className="settings-card-body">{children}</div>}
    </div>
  );
}

/**
 * Standard container for a list of SettingsCards. Just `flex flex-col gap-2`,
 * named for clarity at the call site.
 */
export function SettingsCards({ children }: { children: ReactNode }) {
  return <div className="settings-cards">{children}</div>;
}
