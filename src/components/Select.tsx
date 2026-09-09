import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useFloatingMenu } from './FloatingMenu';

export type SelectOption = { value: string; label: string };

/**
 * Styled dropdown select - a trigger button plus a popover list, to replace the
 * native <select> for visual consistency across the product. The list is
 * PORTALED and positioned by useFloatingMenu, so it is location-aware: it opens
 * downward, flips above the trigger when there is not enough room below, escapes
 * any overflow-hidden ancestor (drawers, settings cards, scroll boxes), and caps
 * its height to the available space. Closes on outside-click and Escape.
 * Keyboard: Enter/Space/ArrowDown opens, arrows move, Enter selects, Escape
 * closes. Typing jumps to the first option starting with what you typed, the
 * way a native select does; repeating one letter cycles through the options
 * beginning with it. Visual identity uses the consuming app's CSS vars.
 *
 *   <Select value={region} onChange={setRegion} options={[{value:'eu',label:'EU'}]} />
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  size = 'md',
  block = false,
  disabled = false,
  className = '',
  autoFocus = false,
  onBlur,
  onEscape,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md';
  /** Fill the container width (and left-align like a form field). */
  block?: boolean;
  disabled?: boolean;
  className?: string;
  /** Focus the trigger on mount. For a control that replaces a cell the
   *  moment editing starts, where the user should not have to click twice. */
  autoFocus?: boolean;
  /** Focus left the control without a choice being made. Only fires while the
   *  menu is CLOSED: reaching into the menu moves focus into a portal, which
   *  looks like leaving and is not. */
  onBlur?: () => void;
  /** Escape pressed while the menu is closed. Escape with the menu open closes
   *  it first, so a caller using this to abandon an edit does not lose the
   *  edit on the keystroke that was meant to dismiss the list. */
  onEscape?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const typed = useRef({ buffer: '', at: 0 });
  const { triggerRef, menuRef, menuStyle } = useFloatingMenu<HTMLButtonElement, HTMLDivElement>({
    open,
    onClose: () => setOpen(false),
    align: 'stretch',
  });
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (open) setActive(Math.max(0, options.findIndex((o) => o.value === value)));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Follow the value when it changes from outside, so the keyboard picks up
  // where the list actually is.
  useEffect(() => {
    const i = options.findIndex((o) => o.value === value);
    if (i >= 0) setActive(i);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the highlighted option visible. The list scrolls, so arrowing or
  // jumping past the fold otherwise moves a highlight nobody can see.
  useEffect(() => {
    if (!open || !menuRef.current) return;
    const el = menuRef.current.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open, menuRef]);

  const TYPEAHEAD_RESET_MS = 700;

  function jumpTo(char: string) {
    const now = Date.now();
    const fresh = now - typed.current.at > TYPEAHEAD_RESET_MS;
    const buffer = fresh ? char : typed.current.buffer + char;
    typed.current = { buffer, at: now };

    // One letter typed repeatedly cycles through the options starting with it,
    // matching a native select. A longer buffer is a prefix search instead.
    const repeated = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);
    const needle = repeated ? buffer[0] : buffer;
    // Cycling starts after wherever the list is now. `active` tracks that
    // whether the menu is open or shut, so repeat presses keep moving even if
    // the consumer has not re-rendered with the new value yet.
    const from = repeated || buffer.length === 1 ? active + 1 : 0;

    const matches = (o: SelectOption) => o.label.toLowerCase().startsWith(needle);
    const order = options.map((_, i) => (from + i) % options.length);
    const found = order.find((i) => matches(options[i]));
    if (found === undefined) return;

    setActive(found);
    if (!open) onChange(options[found].value);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    // A single printable character is a jump, never a shortcut. Modifier
    // combinations are left alone so browser and OS shortcuts still work.
    if (e.key.length === 1 && e.key !== ' ' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      jumpTo(e.key.toLowerCase());
      return;
    }
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape') {
        onEscape?.();
      }
      return;
    }
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const o = options[active];
      if (o) {
        onChange(o.value);
        setOpen(false);
      }
    }
  }

  // Fixed heights so the trigger lines up with the rest of the control system:
  // md matches a .field input / default button (h-11), sm matches a compact
  // toolbar button like ColumnToggle (h-9). Height, not padding, drives the box
  // so it never disagrees with a sibling input or button.
  const sz = size === 'sm' ? 'h-9 px-3 text-xs' : 'h-11 px-4 text-sm';

  return (
    <div className={`${block ? 'block' : 'inline-block'} ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        autoFocus={autoFocus}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (!open) onBlur?.();
        }}
        className={`flex ${block ? 'w-full' : ''} items-center justify-between gap-2 rounded-xl border border-input bg-surface text-foreground transition hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 ${sz}`}
      >
        <span className={`truncate ${selected ? '' : 'text-muted-foreground'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
      </button>
      {open && menuStyle && (
        <div
          ref={menuRef}
          role="listbox"
          style={menuStyle}
          className="z-50 min-w-[8rem] overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {options.map((o, i) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onMouseEnter={() => setActive(i)}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm ${
                i === active ? 'bg-accent' : ''
              } ${o.value === value ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              <Check size={14} className={o.value === value ? 'text-primary' : 'opacity-0'} />
              <span className="whitespace-nowrap">{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
