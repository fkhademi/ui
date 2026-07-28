import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFloatingMenu } from './FloatingMenu';

/**
 * Styled date picker that replaces the native <input type="date"> so the
 * control matches the rest of the UI. value / onChange use an ISO
 * "YYYY-MM-DD" string (empty = no date), exactly like the native input, so
 * it drops in without touching the surrounding form logic. The calendar is
 * portaled and positioned by useFloatingMenu (opens down, flips up, clamps
 * on-screen) and toggles shut on a second trigger click.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  block = false,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Fill the container width. */
  block?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { triggerRef, menuRef, menuStyle } = useFloatingMenu<HTMLButtonElement, HTMLDivElement>({
    open,
    onClose: () => setOpen(false),
    align: 'left',
  });

  const selected = parseISO(value);
  const [view, setView] = useState<Date>(() => selected ?? new Date());
  const today = new Date();

  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const startPad = first.getDay(); // 0 = Sunday
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  function pick(d: Date) {
    onChange(toISO(d));
    setOpen(false);
  }
  function shiftMonth(delta: number) {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }

  return (
    <div className={`${block ? 'block' : 'inline-block'} ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (selected) setView(selected);
          setOpen((o) => !o);
        }}
        className={`flex ${block ? 'w-full' : ''} h-11 items-center justify-between gap-2 rounded-xl border border-input bg-surface px-4 text-sm text-foreground transition hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className={selected ? '' : 'text-muted-foreground'}>
          {selected
            ? selected.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
            : placeholder}
        </span>
        <Calendar size={14} className="shrink-0 text-muted-foreground" />
      </button>
      {open && menuStyle && (
        <div
          ref={menuRef}
          role="dialog"
          style={menuStyle}
          className="z-50 rounded-xl border border-border bg-surface p-3 shadow-lg"
        >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium">
                {view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1 text-[10px] font-medium uppercase text-muted-foreground">
                  {w}
                </div>
              ))}
              {cells.map((d, i) =>
                d === null ? (
                  <div key={i} />
                ) : (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pick(d)}
                    className={`grid h-8 w-8 place-items-center rounded-lg text-sm transition hover:bg-accent ${
                      selected && sameDay(d, selected)
                        ? 'bg-primary text-primary-foreground hover:bg-primary'
                        : sameDay(d, today)
                          ? 'ring-1 ring-inset ring-border'
                          : ''
                    }`}
                  >
                    {d.getDate()}
                  </button>
                ),
              )}
            </div>
            {selected && (
              <button
                type="button"
                className="mt-2 w-full rounded-lg py-1 text-xs text-muted-foreground hover:bg-accent"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
              >
                Clear
              </button>
            )}
        </div>
      )}
    </div>
  );
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function parseISO(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}
