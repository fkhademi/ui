import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import { useFloatingMenu } from './FloatingMenu';

export type MultiSelectOption = { value: string; label: string };

/**
 * Searchable multi-select combobox with chips. The popover is portaled and
 * positioned with useFloatingMenu, so it floats cleanly over an overflow
 * ancestor (a drawer body, a scroll container) instead of being clipped.
 *
 * allowFree lets the caller type a value that isn't in `options` (a glob, or a
 * runtime-only value like an IdP group / JWT subject) - so suggestion-backed
 * fields still accept free entry.
 */
export function MultiSelect({
  value,
  onChange,
  options = [],
  allowFree = false,
  placeholder = 'Any',
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options?: MultiSelectOption[];
  allowFree?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const { triggerRef, menuRef, menuStyle } = useFloatingMenu<HTMLButtonElement, HTMLDivElement>({
    open,
    onClose: () => { setOpen(false); setQ(''); },
    align: 'stretch',
  });

  const labelFor = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const add = (v: string) => {
    const t = v.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setQ('');
  };
  const remove = (v: string) => onChange(value.filter((x) => x !== v));

  const filtered = options.filter(
    (o) => !value.includes(o.value) && (o.label.toLowerCase().includes(q.toLowerCase()) || o.value.toLowerCase().includes(q.toLowerCase())),
  );
  const showAdd = allowFree && q.trim().length > 0 && !value.includes(q.trim()) && !options.some((o) => o.value === q.trim());

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1 flex-wrap rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-foreground hover:bg-accent transition min-h-[2.25rem]"
      >
        {value.length === 0 && <span className="text-muted-foreground flex-1 text-left">{placeholder}</span>}
        {value.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-xs">
            {labelFor(v)}
            <X size={11} className="cursor-pointer hover:text-foreground" onClick={(e) => { e.stopPropagation(); remove(v); }} />
          </span>
        ))}
        <ChevronDown size={14} className="text-muted-foreground shrink-0 ml-auto" />
      </button>

      {open && menuStyle && createPortal(
        <div ref={menuRef} style={{ ...menuStyle, overflowY: 'hidden' }} className="z-[1000] flex flex-col rounded-xl border border-border bg-surface shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
            <Search size={14} className="text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (showAdd) add(q);
                  else if (filtered[0]) add(filtered[0].value);
                }
              }}
              placeholder={allowFree ? 'Search or type a value…' : 'Search…'}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div className="overflow-y-auto py-1">
            {showAdd && (
              <button type="button" onClick={() => add(q)} className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition">
                Add “{q.trim()}”
              </button>
            )}
            {filtered.map((o) => (
              <button key={o.value} type="button" onClick={() => add(o.value)} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent transition">
                {o.label}
                {o.label !== o.value && <span className="text-muted-foreground text-xs ml-1">{o.value}</span>}
              </button>
            ))}
            {filtered.length === 0 && !showAdd && (
              <div className="px-3 py-3 text-sm text-muted-foreground text-center">{options.length ? 'No matches' : 'Nothing to pick'}</div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
