/**
 * Hover and focus tooltip, replacing the browser's `title` attribute.
 *
 * The native one cannot be styled, ignores the theme, appears after a delay
 * the page does not control, never appears on keyboard focus at all, and is
 * simply absent on touch.
 *
 * Accessibility is the part worth care. On an icon-only button `title` does
 * two jobs: it shows a hint AND supplies the accessible name. Replacing it
 * needs both - this sets `aria-describedby` and renders the bubble with
 * `role="tooltip"`, and the trigger still needs its own `aria-label`. The two
 * are not interchangeable.
 *
 * Positioned by measuring the trigger and portaling to the body, so it escapes
 * `overflow: hidden` ancestors - drawers, scroll boxes, table cells - rather
 * than being clipped by them. Opens above, flips below when there is no room,
 * and clamps to the viewport horizontally.
 *
 * Distinct from FieldHelp, which answers a different question: FieldHelp is a
 * click-to-open card explaining a form field, this is a hint about a control
 * the pointer is already on.
 */
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

/** Long enough not to flicker while the pointer crosses a toolbar. */
const OPEN_DELAY_MS = 350;

export function Tooltip({
  content,
  children,
  disabled,
}: {
  content: ReactNode;
  /** A single element that can take a ref and event handlers. */
  children: ReactElement;
  disabled?: boolean;
}) {
  const id = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [style, setStyle] = useState<CSSProperties | null>(null);

  const close = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setStyle(null);
  }, []);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 8;
    // Above by default; below when the trigger sits near the top of the
    // viewport and the bubble would be cut off.
    const above = r.top > 64;
    setStyle({
      position: 'fixed',
      top: above ? r.top - margin : r.bottom + margin,
      left: Math.min(Math.max(r.left + r.width / 2, 80), window.innerWidth - 80),
      transform: `translate(-50%, ${above ? '-100%' : '0'})`,
      zIndex: 60,
    });
  }, []);

  const open = useCallback(
    (immediate: boolean) => {
      if (disabled || !content) return;
      if (timer.current) clearTimeout(timer.current);
      // Focus means deliberate: a keyboard user asking for the hint should not
      // wait out a delay meant to stop pointer flicker.
      if (immediate) place();
      else timer.current = setTimeout(place, OPEN_DELAY_MS);
    },
    [content, disabled, place],
  );

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    if (!style) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    // Any scroll invalidates the measured position, and re-measuring on every
    // frame is not worth it for a hint.
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [style, close]);

  if (!isValidElement(children)) return children;

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      // Preserve whatever ref the caller already had; taking it over silently
      // would break focus management on the wrapped control.
      const own = (children as unknown as { ref?: unknown }).ref;
      if (typeof own === 'function') own(node);
      else if (own && typeof own === 'object') (own as { current: unknown }).current = node;
    },
    'aria-describedby': style ? id : undefined,
    onMouseEnter: (e: MouseEvent) => {
      open(false);
      (children.props as Record<string, ((e: MouseEvent) => void) | undefined>).onMouseEnter?.(e);
    },
    onMouseLeave: (e: MouseEvent) => {
      close();
      (children.props as Record<string, ((e: MouseEvent) => void) | undefined>).onMouseLeave?.(e);
    },
    onFocus: (e: FocusEvent) => {
      open(true);
      (children.props as Record<string, ((e: FocusEvent) => void) | undefined>).onFocus?.(e);
    },
    onBlur: (e: FocusEvent) => {
      close();
      (children.props as Record<string, ((e: FocusEvent) => void) | undefined>).onBlur?.(e);
    },
  });

  return (
    <>
      {trigger}
      {style &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            style={style}
            className="pointer-events-none max-w-xs rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground shadow-lg"
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
