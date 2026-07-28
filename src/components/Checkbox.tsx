import { ReactNode } from 'react';
import { Check } from 'lucide-react';

/**
 * Styled checkbox that replaces the native <input type="checkbox"> so the
 * control matches the rest of the UI instead of the OS chrome. The real
 * input stays in the DOM (screen-reader friendly, keeps native focus and
 * space-to-toggle); a sibling box is styled off its checked/focus state via
 * peer- utilities. Pass a label to get the whole row clickable.
 */
export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label
      className={`inline-flex items-start gap-2 text-sm text-foreground ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-input bg-surface text-transparent transition
                   peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground
                   peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40"
      >
        <Check size={12} strokeWidth={3} />
      </span>
      {label != null && <span>{label}</span>}
    </label>
  );
}
