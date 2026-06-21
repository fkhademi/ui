import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export type SelectOption = { value: string; label: string };

/**
 * Styled dropdown select - a trigger button plus a popover list, to replace the
 * native <select> for visual consistency across the product. Closes on
 * outside-click and Escape. Keyboard: Enter/Space toggles, arrows move, Escape
 * closes. Visual identity uses the consuming app's CSS vars (border, surface,
 * accent, foreground, primary).
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
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
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

  const pad = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-2 text-sm';

  return (
    <div ref={ref} className={`relative ${block ? 'block' : 'inline-block'} ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={`flex ${block ? 'w-full' : ''} items-center justify-between gap-2 rounded-lg border border-border bg-surface text-foreground transition hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 ${pad}`}
      >
        <span className={`truncate ${selected ? '' : 'text-muted-foreground'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 min-w-full overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
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
