import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useFloatingMenu } from './FloatingMenu';
import type { SelectOption } from './Select';

/** An option, with an optional second line (a description, a price). */
export type ComboboxOption = SelectOption & { hint?: string };

/**
 * A select you type into: the field filters the list as you type, arrows move,
 * Enter or a click picks. For lists too long to scroll (accounts, products),
 * and, with `allowFree`, for a free-text field that suggests what exists
 * (a source, a product name) while still taking something new.
 *
 * Leaving the field without picking keeps the old value, unless `allowFree`,
 * where what was typed is the value; leaving it empty clears the value. The list is positioned by
 * useFloatingMenu, so it escapes overflow containers and flips when there is
 * no room below.
 *
 *   <Combobox value={accountId} onChange={setAccountId} options={accounts} placeholder="Search accounts" />
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Search…',
  allowFree = false,
  size = 'md',
  disabled = false,
  autoFocus = false,
  onBlur,
  emptyText = 'No matches',
  onQueryChange,
  selectedLabel,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  /** Take typed text that matches no option as the value. */
  allowFree?: boolean;
  size?: 'sm' | 'md';
  disabled?: boolean;
  autoFocus?: boolean;
  /** Focus left the field, after any pick or free-text commit. */
  onBlur?: () => void;
  emptyText?: string;
  /** The list is searched elsewhere (on a server): typing reports the text
   *  here, and `options` are shown as given instead of filtered. */
  onQueryChange?: (query: string) => void;
  /** The current value's label, when `options` (a page of search results)
   *  may not include it. */
  selectedLabel?: string;
  className?: string;
}) {
  const listId = useId();
  const labelOf = (v: string) =>
    options.find((o) => o.value === v)?.label ?? (v && selectedLabel) ?? (allowFree ? v : '');
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(labelOf(value));
  const [typed, setTyped] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  // Escape (as the top layer) and an outside click close the list and put the
  // field back to the current value.
  const { triggerRef, menuRef, menuStyle } = useFloatingMenu<HTMLDivElement, HTMLDivElement>({
    open,
    onClose: () => close(),
    align: 'stretch',
  });

  useEffect(() => {
    if (!typed) setText(labelOf(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options, selectedLabel]);

  const needle = typed ? text.trim().toLowerCase() : '';
  const shown = (needle && !onQueryChange ? options.filter((o) => `${o.label} ${o.hint ?? ''}`.toLowerCase().includes(needle)) : options).slice(0, 100);
  const offerFree = allowFree && typed && text.trim() !== '' && !options.some((o) => o.label.toLowerCase() === needle);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    (menuRef.current.querySelector(`[data-index="${active}"]`) as HTMLElement | null)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, menuRef]);

  function close() {
    setOpen(false);
    setTyped(false);
    setText(labelOf(value));
  }

  function pick(next: string) {
    onChange(next);
    setOpen(false);
    setTyped(false);
    setText(labelOf(next) || next);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const count = shown.length + (offerFree ? 1 : 0);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(count - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      if (!open && !typed) return;
      e.preventDefault();
      if (active < shown.length && shown[active]) pick(shown[active].value);
      else if (offerFree || (allowFree && typed)) pick(text.trim());
    }
  }

  const sz = size === 'sm' ? 'h-9 px-3 text-xs' : 'h-11 px-4 text-sm';

  return (
    <div ref={triggerRef} className={`relative w-full ${className}`}>
      <input
        ref={input}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoFocus={autoFocus}
        disabled={disabled}
        value={text}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          onQueryChange?.(e.target.value);
          setTyped(true);
          setActive(0);
          setOpen(true);
        }}
        onFocus={(e) => e.currentTarget.select()}
        onClick={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          const exact = options.find((o) => o.label.toLowerCase() === text.trim().toLowerCase());
          // Emptying the field is how a value is cleared.
          if (typed && text.trim() === '') pick('');
          else if (allowFree && typed && text.trim() !== labelOf(value)) pick(exact ? exact.value : text.trim());
          else close();
          onBlur?.();
        }}
        className={`w-full rounded-xl border border-input bg-surface pr-9 text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 ${sz}`}
      />
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      {open && menuStyle && (typed || shown.length > 0) && (
        <div
          ref={menuRef}
          id={listId}
          role="listbox"
          style={menuStyle}
          className="z-50 min-w-[8rem] overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
          // Picking must not blur the field first, or the blur would close the
          // list before the click lands.
          onMouseDown={(e) => e.preventDefault()}
        >
          {shown.map((o, i) => (
            <button
              key={o.value}
              type="button"
              role="option"
              data-index={i}
              aria-selected={o.value === value}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(o.value)}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm ${i === active ? 'bg-accent' : ''} ${
                o.value === value ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Check size={14} className={o.value === value ? 'shrink-0 text-primary' : 'shrink-0 opacity-0'} />
              {o.hint ? (
                <span className="min-w-0">
                  <span className="block truncate text-foreground">{o.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{o.hint}</span>
                </span>
              ) : (
                <span className="truncate">{o.label}</span>
              )}
            </button>
          ))}
          {offerFree && (
            <button
              type="button"
              role="option"
              data-index={shown.length}
              aria-selected={false}
              onMouseEnter={() => setActive(shown.length)}
              onClick={() => pick(text.trim())}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-foreground ${active === shown.length ? 'bg-accent' : ''}`}
            >
              <span className="w-[14px] shrink-0" />
              <span className="truncate">Use “{text.trim()}”</span>
            </button>
          )}
          {shown.length === 0 && !offerFree && <div className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</div>}
        </div>
      )}
    </div>
  );
}
