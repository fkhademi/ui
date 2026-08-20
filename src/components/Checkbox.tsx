import { ReactNode, useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';

/**
 * Styled checkbox that replaces the native <input type="checkbox"> so the
 * control matches the rest of the UI instead of the OS chrome. The real
 * input stays in the DOM (screen-reader friendly, keeps native focus and
 * space-to-toggle); a sibling box is styled off its checked/focus state via
 * peer- utilities. Pass a label to get the whole row clickable.
 *
 * Set `indeterminate` for a parent row whose children are partly selected. It
 * is a DOM property rather than an attribute, so it is applied through a ref,
 * and it takes visual precedence over `checked` the way the native control
 * does.
 */
export function Checkbox({
  checked,
  onChange,
  label,
  indeterminate = false,
  disabled = false,
  block = false,
  className = '',
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  /** Partly-selected state for a parent row. Shows a dash and outranks checked. */
  indeterminate?: boolean;
  disabled?: boolean;
  /** Fill the container width, for full-width form rows and list items. */
  block?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={`${block ? 'flex w-full' : 'inline-flex'} items-start gap-2 text-sm text-foreground ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        ref={ref}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition
                   peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 ${
                     indeterminate
                       ? 'border-primary bg-primary text-primary-foreground'
                       : 'border-input bg-surface text-transparent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground'
                   }`}
      >
        {indeterminate ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
      </span>
      {label != null && <span>{label}</span>}
    </label>
  );
}
