import { useEffect, useLayoutEffect, useRef, useState, type RefObject, type CSSProperties } from 'react';

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

  // Measure the menu's height so we can flip it above the trigger when there is
  // not enough room below (location-aware). useLayoutEffect runs before paint,
  // so the flip happens without a visible jump.
  const [menuH, setMenuH] = useState(0);
  useLayoutEffect(() => {
    setMenuH(open && menuRef.current ? menuRef.current.offsetHeight : 0);
  }, [open, rect]);

  const menuStyle = rect ? computeStyle(rect, align, gap, menuH) : undefined;

  return { triggerRef, menuRef, menuStyle };
}

// Position a fixed, portaled menu relative to its trigger. Location-aware: it
// opens downward by default, but flips ABOVE the trigger when the menu would
// not fit below and there is more room above, and always caps its height to the
// available space so it never spills off-screen or clips inside a scroll box.
function computeStyle(
  rect: DOMRect,
  align: 'stretch' | 'left' | 'right',
  gap: number,
  menuH: number,
): CSSProperties {
  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  const openUp = menuH > 0 && menuH > spaceBelow && spaceAbove > spaceBelow;

  const vertical: CSSProperties = openUp
    ? { bottom: window.innerHeight - rect.top + gap, maxHeight: Math.max(0, spaceAbove) }
    : { top: rect.bottom + gap, maxHeight: Math.max(0, spaceBelow) };

  const horizontal: CSSProperties =
    align === 'right'
      ? { right: window.innerWidth - rect.right }
      : align === 'left'
        ? { left: rect.left }
        : { left: rect.left, width: rect.width };

  return { position: 'fixed', overflowY: 'auto', ...vertical, ...horizontal };
}
