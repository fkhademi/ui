import { createContext, FormEvent, ReactNode, useContext } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Tooltip } from './Tooltip';
import { DismissLayerDepth, useDismissLayer } from './DismissLayer';
import { useGuardedClose, type ConfirmDiscard } from './guardedClose';

export type { ConfirmDiscard };

/**
 * Universal right-side drawer used by every create/edit form.
 *
 * Renders the overlay + panel + header (title + X) and centralizes the
 * three ways to dismiss without saving:
 *
 *   • X button      → requestClose()
 *   • Overlay click → requestClose()
 *   • Escape key    → requestClose()
 *
 * Dirty tracking is automatic - any input/change event bubbling up from inside
 * the panel marks the drawer dirty, and requestClose() then confirms before
 * closing. Callers can override with the explicit `dirty` prop.
 *
 * The discard confirmation comes from ConfirmDiscardProvider (or the
 * `confirmDiscard` prop) so this stays app-agnostic: a host app sets its styled
 * confirm dialog once; without one it falls back to window.confirm. The Save path bypasses the wrapper entirely -
 * the caller invokes onClose after the mutation succeeds, so a successful submit
 * never prompts.
 */

type CloseFn = () => void;
const DrawerCloseCtx = createContext<CloseFn | null>(null);

export function useDrawerClose(): CloseFn {
  const fn = useContext(DrawerCloseCtx);
  if (!fn) throw new Error('useDrawerClose must be called inside a <Drawer>');
  return fn;
}

export function Drawer({
  open,
  dirty,
  title,
  onClose,
  children,
  size = 'md',
  confirmDiscard,
  discardTitle,
  discardBody,
}: {
  open: boolean;
  /** Optional override. If omitted, dirty is auto-detected via any input/change
   *  event bubbling up from inside the panel. */
  dirty?: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Panel width. 'lg' is for forms that also carry an inventory or a result
   *  pane, where the default column forces long text to wrap awkwardly; 'xl'
   *  for a document-sized form. */
  size?: 'md' | 'lg' | 'xl';
  /** Styled confirm for this drawer; usually set once with ConfirmDiscardProvider. */
  confirmDiscard?: ConfirmDiscard;
  discardTitle?: string;
  discardBody?: string;
}) {
  const { requestClose, markDirty } = useGuardedClose({ open, dirty, onClose, confirmDiscard, discardTitle, discardBody });

  const depth = useDismissLayer(open, requestClose);

  if (!open) return null;

  return createPortal(
    <DismissLayerDepth value={depth}>
    <DrawerCloseCtx.Provider value={requestClose}>
      <div className="drawer-overlay" onClick={requestClose} />
      <aside
        className={`drawer-panel${size === 'md' ? '' : ` drawer-panel-${size}`}`}
        onInput={markDirty}
        onChange={markDirty}
        onKeyDown={(e) => {
          // A control that used the Enter itself (picking from a list) has
          // already called preventDefault.
          if (e.key !== 'Enter' || e.defaultPrevented || e.shiftKey || e.ctrlKey || e.metaKey) return;
          const target = e.target as HTMLElement;
          const tag = target.tagName;
          if (tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return;
          if (tag !== 'INPUT') return;
          const form = target.closest('form');
          if (!form) return;
          e.preventDefault();
          form.requestSubmit();
        }}
      >
        <header className="drawer-header">
          <div className="drawer-title">{title}</div>
          <Tooltip content="Close">
            <button type="button" onClick={requestClose} className="btn-icon" aria-label="Close drawer">
              <X size={16} />
            </button>
          </Tooltip>
        </header>
        {children}
      </aside>
    </DrawerCloseCtx.Provider>
    </DismissLayerDepth>,
    document.body,
  );
}

/**
 * Cancel for a custom drawer footer: closes through the drawer, so edits are
 * confirmed before they are thrown away, as with the X and Escape.
 */
export function DrawerCancel({ label = 'Cancel' }: { label?: string }) {
  const close = useDrawerClose();
  return (
    <button type="button" onClick={close} className="btn-ghost ml-auto">
      {label}
    </button>
  );
}

/**
 * Standard drawer footer with Cancel (routes through requestClose so
 * dirty-confirm fires) + Save. The Save button submits the form living inside
 * the same drawer panel, so HTML constraints run before the form's onSubmit.
 */
export function DrawerFooter({
  pending = false,
  label = 'Save',
  disabled = false,
  children,
}: {
  pending?: boolean;
  onSubmit?: (e: FormEvent) => void;
  label?: string;
  disabled?: boolean;
  children?: ReactNode;
}) {
  const close = useDrawerClose();
  function save(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    const panel = (e.currentTarget as HTMLElement).closest('.drawer-panel');
    const form = panel?.querySelector('form') as HTMLFormElement | null;
    if (form) form.requestSubmit();
  }
  if (children) {
    return <footer className="drawer-footer">{children}</footer>;
  }
  return (
    <footer className="drawer-footer">
      <button type="button" onClick={close} className="btn-ghost ml-auto">
        Cancel
      </button>
      <button type="button" disabled={pending || disabled} onClick={save} className="btn-primary">
        {pending ? 'Saving…' : label}
      </button>
    </footer>
  );
}
