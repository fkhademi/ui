import { useEffect, useState } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { useFloatingMenu } from './FloatingMenu';

/**
 * Show/hide-columns control for data tables. The presentational half of
 * "optional columns": a `.btn-secondary` trigger that opens a `.menu`
 * popover (positioned via useFloatingMenu) listing each hideable column
 * with a checkbox. The table owns the actual visibility state — this
 * component is deliberately framework-agnostic (no @tanstack/react-table
 * dependency); it just renders items and reports toggles.
 *
 * Pair it with `useColumnVisibility` below to persist the choice.
 */
export interface ColumnToggleItem {
  id: string;
  label: string;
  visible: boolean;
  /** When false the row is shown but locked on (can't be hidden). */
  canHide?: boolean;
}

export interface ColumnToggleProps {
  items: ColumnToggleItem[];
  onToggle: (id: string) => void;
  /** Trigger label + menu heading. Default "Columns". */
  label?: string;
  className?: string;
}

export function ColumnToggle({ items, onToggle, label = 'Columns', className }: ColumnToggleProps) {
  const [open, setOpen] = useState(false);
  const { triggerRef, menuRef, menuStyle } = useFloatingMenu<HTMLButtonElement, HTMLDivElement>({
    open,
    onClose: () => setOpen(false),
    align: 'right',
  });

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`btn-secondary h-9 px-3.5 text-xs${className ? ` ${className}` : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        {label}
      </button>
      {open && menuStyle && (
        // Rendered inline rather than portaled — `.menu` is position:fixed
        // (via menuStyle) so it floats over the page without a react-dom
        // dependency. The trigger sits in a table toolbar with no
        // transformed/clipping ancestor, so fixed positioning is enough.
        <div ref={menuRef} className="menu" style={menuStyle} role="menu">
          <div className="menu-heading">{label}</div>
          {items.map(item => {
            const locked = item.canHide === false;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitemcheckbox"
                aria-checked={item.visible}
                className="menu-item"
                disabled={locked}
                onClick={() => { if (!locked) onToggle(item.id); }}
              >
                <span className={`column-toggle-check${item.visible ? ' column-toggle-check--on' : ''}`}>
                  {item.visible && <Check className="w-3 h-3" />}
                </span>
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

/**
 * Persisted column-visibility state, shaped to drop straight into
 * @tanstack/react-table's `state.columnVisibility` /
 * `onColumnVisibilityChange` (a plain `id -> visible` map where a `false`
 * entry hides the column; absent means visible). Kept tanstack-shaped but
 * tanstack-free so the hook has no table-library dependency.
 *
 * Persists per `storageKey` to localStorage (`<key>-cols`), mirroring
 * `useSidebarCollapsed`. `defaultHidden` seeds columns that should start
 * hidden the first time, before the user has expressed a preference.
 */
export type ColumnVisibility = Record<string, boolean>;

export function useColumnVisibility(
  storageKey: string,
  defaultHidden: string[] = [],
): {
  columnVisibility: ColumnVisibility;
  setColumnVisibility: (
    updater: ColumnVisibility | ((prev: ColumnVisibility) => ColumnVisibility),
  ) => void;
} {
  const fullKey = `${storageKey}-cols`;
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      if (raw) return JSON.parse(raw) as ColumnVisibility;
    } catch {
      /* private mode / malformed — fall back to defaults */
    }
    const init: ColumnVisibility = {};
    for (const id of defaultHidden) init[id] = false;
    return init;
  });

  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(columnVisibility));
    } catch {
      /* preference just doesn't persist */
    }
  }, [fullKey, columnVisibility]);

  return { columnVisibility, setColumnVisibility };
}
