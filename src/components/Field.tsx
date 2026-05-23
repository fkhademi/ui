import type { ReactNode } from 'react';
import { FieldHelp } from './FieldHelp';

/**
 * Form-field wrapper. Pairs a label with its input (passed as
 * children), plus optional hint, error, and help-popover slots.
 *
 *   <Field label="Email" hint="Sign-in identity.">
 *     <input type="email" className="field" {...} />
 *   </Field>
 *
 * The `help` prop renders an (i) popover next to the label for terse
 * inline explanations. The `error` prop renders red text below the input.
 *
 * Layout-only. Visual identity is in the `.field*` classes — the input
 * itself gets the `.field` or `.field-mono` class at the call site.
 */
export function Field({
  label,
  hint,
  error,
  help,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  help?: { title: string; body: ReactNode };
  children: ReactNode;
}) {
  return (
    <div>
      <label className="field-label">
        <span>{label}</span>
        {help && <FieldHelp title={help.title} body={help.body} />}
      </label>
      {children}
      {error ? (
        <div className="field-error">{error}</div>
      ) : hint ? (
        <div className="field-hint">{hint}</div>
      ) : null}
    </div>
  );
}
