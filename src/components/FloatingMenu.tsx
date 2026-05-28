import { useEffect, useRef, useState, type RefObject, type CSSProperties } from 'react';

/**
 * Anchored-popover plumbing. Tracks a trigger's bounding rect so a
 * portal-rendered menu can be positioned with `position: fixed`,
 * floating over any `overflow-hidden` ancestor (settings cards, drawer
 * bodies, scroll containers).
 *
 * Typical use:
 *
 *   const [open, setOpen] = useState(false);
 *   const { triggerRef, menuRef, menuStyle } = useFloatingMenu({
 *     open,
 *     onClose: () => setOpen(false),
 *     align: 'stretch',
 *   });
 *
 *   return (
 *     <>
 *       <button ref={triggerRef} onClick={() => setOpen(v => !v)}>…</button>
 *       {open && createPortal(
 *         <div ref={menuRef} className="menu" style={menuStyle}>
 *           …items…
 *         </div>,
 *         document.body,
 *       )}
 *     </>
 *   );
 *
 * The hook handles three concerns the caller would otherwise repeat:
 *   1. Recomputing the menu position on resize and scroll (capture phase,
 *      so nested scrollers like a drawer body trigger updates too).
 *   2. Dismissing on outside-click. Both the trigger and the portaled
 *      menu are treated as "inside" — clicks within either keep the
 *      menu open.
 *   3. Dismissing on Escape.
 *
 * The returned `menuStyle` is undefined when the menu is closed or the
 * trigger hasn't measured yet — guard your render with `{open && style && …}`
 * to avoid a brief un-positioned flash.
 *
 * Alignment:
 *   - 'stretch' (default): menu matches the trigger's width. Right for
 *     full-width select-style triggers.
 *   - 'left':  menu's left edge aligns with the trigger's left edge,
 *     menu sizes to its content.
 *   - 'right': menu's right edge aligns with the trigger's right edge,
 *     menu sizes to its content. Right for icon-button triggers anchored
 *     to a header's right side.
 */
export interface UseFloatingMenuOptions {
  open: boolean;
  onClose: () => void;
  /** How the menu's horizontal position relates to the trigger. */
  align?: 'stretch' | 'left' | 'right';
  /** Vertical gap between trigger bottom and menu top, in px. Default 4. */
  gap?: number;
}

export interface UseFloatingMenuResult<TriggerEl extends HTMLElement, MenuEl extends HTMLElement> {
  triggerRef: RefObject<TriggerEl>;
  menuRef: RefObject<MenuEl>;
  /** `undefined` until the trigger has been measured. Spread onto the
   *  menu element to position it. */
  menuStyle: CSSProperties | undefined;
}

export function useFloatingMenu<
  TriggerEl extends HTMLElement = HTMLButtonElement,
  MenuEl extends HTMLElement = HTMLDivElement,
>({
  open,
  onClose,
  align = 'stretch',
  gap = 4,
}: UseFloatingMenuOptions): UseFloatingMenuResult<TriggerEl, MenuEl> {
  const triggerRef = useRef<TriggerEl>(null);
  const menuRef = useRef<MenuEl>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Track the trigger's bounding rect while the menu is open. `scroll`
  // is captured so nested scrollers (drawer body, dialog) trigger updates.
  useEffect(() => {
    if (!open || !triggerRef.current) { setRect(null); return; }
    const update = () => setRect(triggerRef.current?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open]);

  // Dismiss on click outside (both the trigger AND the portaled menu count
  // as inside) and on Escape.
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const menuStyle = rect ? computeStyle(rect, align, gap) : undefined;

  return { triggerRef, menuRef, menuStyle };
}

function computeStyle(rect: DOMRect, align: 'stretch' | 'left' | 'right', gap: number): CSSProperties {
  const top = rect.bottom + gap;
  switch (align) {
    case 'right':
      // Anchor by right edge so menu opens to the left of the trigger.
      return {
        position: 'fixed',
        top,
        right: window.innerWidth - rect.right,
      };
    case 'left':
      return {
        position: 'fixed',
        top,
        left: rect.left,
      };
    case 'stretch':
    default:
      return {
        position: 'fixed',
        top,
        left: rect.left,
        width: rect.width,
      };
  }
}
