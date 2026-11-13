import type { ReactNode } from 'react';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

/**
 * An exclusive choice shown in full: a time window, a view, a filter with
 * three to five values. A radio group underneath, so arrow keys move the
 * choice the way they do in any native radio set.
 *
 *   <Segmented value={range} onChange={setRange} ariaLabel="Range"
 *     options={[{ value: '24h', label: '24 h' }, { value: '7d', label: '7 days' }]} />
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className = '',
}: {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  ariaLabel: string;
  className?: string;
}) {
  const enabled = options.filter((o) => !o.disabled);

  const move = (group: HTMLElement, step: number) => {
    const at = enabled.findIndex((o) => o.value === value);
    const next = enabled[(at + step + enabled.length) % enabled.length];
    if (!next) return;
    onChange(next.value);
    group.querySelectorAll<HTMLButtonElement>('[role="radio"]')[options.indexOf(next)]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`segmented ${className}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(e.currentTarget, 1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(e.currentTarget, -1); }
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={`segmented-item${active ? ' segmented-item--active' : ''}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
