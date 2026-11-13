import type { ReactNode } from 'react';

export interface PageTab<T extends string> {
  key: T;
  label: ReactNode;
}

/**
 * The sections of one page, under its header. Controlled: the page owns
 * which tab is open, so it can also be driven from the URL.
 *
 *   <PageTabs tabs={tabs} value={tab} onChange={setTab} ariaLabel="Registry" />
 */
export function PageTabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
}: {
  tabs: PageTab<T>[];
  value: T;
  onChange: (key: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="page-tabs">
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            className={`page-tab${active ? ' page-tab--active' : ''}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
