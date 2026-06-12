import { ReactNode, useEffect, useRef } from 'react';

/**
 * Right-click menu, anchored to the cursor at the time of the
 * contextmenu event. Reuses the .menu/.menu-item primitives lifted
 * from pwsafe (see styles/components.css).
 *
 * Closes on:
 *  - escape
 *  - outside click
 *  - any item click (caller closes after action)
 *
 * Position is auto-adjusted to stay on-screen.
 */
export type ContextMenuItem =
  | {
      kind: 'action';
      label: string;
      icon?: ReactNode;
      onClick: () => void;
      danger?: boolean;
      shortcut?: string;
      disabled?: boolean;
    }
  | { kind: 'sep' };

export function ContextMenu(props: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Clamp to viewport once we know our size.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const overflowX = rect.right - window.innerWidth;
    const overflowY = rect.bottom - window.innerHeight;
    if (overflowX > 0) el.style.left = `${props.x - overflowX - 4}px`;
    if (overflowY > 0) el.style.top = `${props.y - overflowY - 4}px`;
  }, [props.x, props.y]);

  // Escape + outside click close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') props.onClose();
    }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) props.onClose();
    }
    window.addEventListener('keydown', onKey);
    // Use mousedown not click so right-clicking elsewhere immediately closes us.
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [props]);

  return (
    <div
      ref={ref}
      className="menu"
      style={{ left: props.x, top: props.y }}
      role="menu"
      onContextMenu={(e) => e.preventDefault()}
    >
      {props.items.map((it, i) =>
        it.kind === 'sep' ? (
          <div key={i} className="menu-sep" role="separator" />
        ) : (
          <button
            key={i}
            type="button"
            className={`menu-item ${it.danger ? 'menu-item--danger' : ''}`}
            disabled={it.disabled}
            onClick={() => {
              it.onClick();
              props.onClose();
            }}
          >
            {it.icon}
            {it.label}
            {it.shortcut && <kbd>{it.shortcut}</kbd>}
          </button>
        ),
      )}
    </div>
  );
}
