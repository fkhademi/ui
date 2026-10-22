import { useRef, useState, type ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { ContextMenu, type ContextMenuItem } from './ContextMenu';
import { Tooltip } from './Tooltip';

/**
 * A "…" button that opens a menu of the less frequent actions, so a page
 * header keeps one primary action in view and nothing destructive sits beside
 * it.
 *
 *   <MenuButton label="More actions" items={[{ kind: 'action', label: 'Delete', danger: true, onClick }]} />
 */
export function MenuButton({
  items,
  label = 'More actions',
  icon,
}: {
  items: ContextMenuItem[];
  label?: string;
  icon?: ReactNode;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);

  return (
    <>
      <Tooltip content={label}>
        <button
          ref={button}
          type="button"
          className="btn-icon-outline"
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={at !== null}
          // The open menu closes on any mousedown outside it; this button
          // toggles it instead.
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            if (at) return setAt(null);
            const r = button.current!.getBoundingClientRect();
            setAt({ x: r.left, y: r.bottom + 4 });
          }}
        >
          {icon ?? <MoreHorizontal size={16} />}
        </button>
      </Tooltip>
      {at && <ContextMenu x={at.x} y={at.y} items={items} onClose={() => setAt(null)} />}
    </>
  );
}
