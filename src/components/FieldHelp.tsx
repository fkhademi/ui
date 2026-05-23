import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Small (i) icon you place beside a form label. Click pops a card with
 * one or two sentences. Use sparingly — every (i) you add is a thing
 * the user has to scan past.
 *
 * Smart positioning: on open, measures the trigger and the viewport,
 * then anchors the popover so it never clips off-screen. Drawer-friendly:
 * if the trigger is close to the right edge, the popover opens to the
 * LEFT (and vice versa).
 *
 * Keep `body` to one or two sentences. Longer explanations belong in
 * docs, not in a popover.
 */
export function FieldHelp({
  title,
  body,
}: {
  title: string;
  body: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<CSSProperties>({});
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // Reposition every open: measure trigger + viewport, choose corner.
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = wrapRef.current?.getBoundingClientRect();
    if (!trigger) return;
    const POP_W = 256;
    const MARGIN = 8;
    let left: number;
    if (trigger.right - POP_W < MARGIN) {
      // Not enough space to the left → open to the right of the trigger.
      left = trigger.left;
    } else {
      // Default: right-edge of pop aligns with right-edge of trigger.
      left = trigger.right - POP_W;
    }
    let top = trigger.bottom + 6;
    const ESTIMATED_H = 180;
    if (top + ESTIMATED_H > window.innerHeight - MARGIN) {
      top = trigger.top - ESTIMATED_H - 6;
    }
    setPos({ top, left, width: POP_W });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (
        wrapRef.current?.contains(e.target as Node) ||
        popRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="field-help">
      <button
        type="button"
        className="field-help-trigger"
        aria-label={`Explain ${title}`}
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <HelpCircle size={13} />
      </button>
      {open && (
        <div ref={popRef} className="field-help-pop" role="tooltip" style={pos}>
          <div className="field-help-title">{title}</div>
          <div className="field-help-body">{body}</div>
        </div>
      )}
    </span>
  );
}
