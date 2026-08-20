import { createContext, FormEvent, ReactNode, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
 * The discard confirmation is injectable via `confirmDiscard` so this stays
 * app-agnostic: a host app passes its styled confirm dialog; without one it
 * falls back to window.confirm. The Save path bypasses the wrapper entirely -
 * the caller invokes onClose after the mutation succeeds, so a successful submit
 * never prompts.
 */

export type ConfirmDiscard = (opts: {
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}) => Promise<boolean>;

const defaultConfirm: ConfirmDiscard = async ({ body }) => window.confirm(body);

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
  confirmDiscard = defaultConfirm,
  discardTitle = 'Discard unsaved changes?',
  discardBody = "You haven't saved your edits. They will be lost.",
}: {
  open: boolean;
  /** Optional override. If omitted, dirty is auto-detected via any input/change
   *  event bubbling up from inside the panel. */
  dirty?: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Panel width. 'lg' is for forms that also carry an inventory or a result
   *  pane, where the default column forces long text to wrap awkwardly. */
  size?: 'md' | 'lg';
  /** Styled confirm dialog; defaults to window.confirm. */
  confirmDiscard?: ConfirmDiscard;
  discardTitle?: string;
  discardBody?: string;
}) {
  const [autoDirty, setAutoDirty] = useState(false);
  const effectiveDirty = dirty ?? autoDirty;

  useEffect(() => {
    if (open) setAutoDirty(false);
  }, [open]);

  async function requestClose() {
    if (effectiveDirty) {
      const ok = await confirmDiscard({
        title: discardTitle,
        body: discardBody,
        confirmLabel: 'Discard',
        cancelLabel: 'Keep editing',
        danger: true,
      });
      if (!ok) return;
    }
    onClose();
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const target = e.target as HTMLElement | null;
        if (target && target.tagName === 'SELECT') return;
        requestClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, effectiveDirty]);

  if (!open) return null;

  return createPortal(
    <DrawerCloseCtx.Provider value={requestClose}>
      <div className="drawer-overlay" onClick={requestClose} />
      <aside
        className={`drawer-panel${size === 'lg' ? ' drawer-panel-lg' : ''}`}
        onInput={() => setAutoDirty(true)}
        onChange={() => setAutoDirty(true)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.metaKey) return;
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
          <button type="button" onClick={requestClose} className="btn-icon" title="Close" aria-label="Close drawer">
            ✕
          </button>
        </header>
        {children}
      </aside>
    </DrawerCloseCtx.Provider>,
    document.body,
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
