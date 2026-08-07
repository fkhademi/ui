/**
 * Two-state switch styled by the central .toggle / .toggle-thumb pair.
 *
 * The click handler fires synchronously - wrap it in a confirm or a
 * drawer-trigger when the action needs intent (e.g. disabling MFA).
 */
export function Toggle({
  on,
  onClick,
  ariaLabel,
  disabled,
}: {
  on: boolean;
  onClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`toggle${on ? ' toggle--on' : ''}`}
    >
      <div className="toggle-thumb" />
    </button>
  );
}
