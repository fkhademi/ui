import { createContext, useContext, useEffect, useRef } from 'react';

/**
 * Escape closes the top layer, and only that one.
 *
 * Menus, pickers, drawers and dialogs stack: a select inside a drawer, a
 * confirm over a drawer. When each listened for Escape on its own, one key
 * press closed all of them at once and threw away whatever was being edited
 * underneath. Every layer registers here instead; a single window listener
 * dismisses the top one.
 *
 * The top layer is the most deeply nested, then the most recently opened. A
 * layer that holds others (a drawer, a dialog) passes its depth down with
 * `DismissLayerDepth`; nesting cannot come from opening order alone, because
 * React registers a child that opens on mount before its parent.
 *
 * A control that handles Escape itself (cancelling an inline edit, say) calls
 * `preventDefault()` on the event, and no layer is dismissed for it.
 *
 *   const depth = useDismissLayer(open, () => setOpen(false));
 *   <DismissLayerDepth value={depth}>{children}</DismissLayerDepth>
 */
type Layer = { depth: number; order: number; dismiss: () => void };

const Depth = createContext(0);
export const DismissLayerDepth = Depth.Provider;

const layers: Layer[] = [];
let opened = 0;

function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.defaultPrevented || layers.length === 0) return;
  // A native select closes its own list on Escape.
  if ((e.target as HTMLElement | null)?.tagName === 'SELECT') return;
  const top = layers.reduce((a, b) => (b.depth > a.depth || (b.depth === a.depth && b.order > a.order) ? b : a));
  e.preventDefault();
  top.dismiss();
}

export function useDismissLayer(open: boolean, onDismiss: () => void): number {
  const depth = useContext(Depth) + 1;
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  useEffect(() => {
    if (!open) return;
    const layer: Layer = { depth, order: ++opened, dismiss: () => dismiss.current() };
    if (layers.length === 0) window.addEventListener('keydown', onKeyDown);
    layers.push(layer);
    return () => {
      const i = layers.indexOf(layer);
      if (i >= 0) layers.splice(i, 1);
      if (layers.length === 0) window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, depth]);

  return depth;
}
