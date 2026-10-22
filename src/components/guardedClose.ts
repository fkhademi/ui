import { createContext, useContext, useEffect, useRef, useState } from 'react';

export type ConfirmDiscard = (opts: {
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}) => Promise<boolean>;

const browserConfirm: ConfirmDiscard = async ({ body }) => window.confirm(body);

const ConfirmDiscardCtx = createContext<ConfirmDiscard>(browserConfirm);

/**
 * The app's styled confirm, set once at the root so every Drawer and Modal
 * asks with it before throwing edits away. Without it they fall back to the
 * browser's confirm().
 */
export const ConfirmDiscardProvider = ConfirmDiscardCtx.Provider;

/**
 * Closing a Drawer or Modal: asks before discarding edits, and gives focus
 * back to whatever opened it. Dirty is detected from any input or change
 * event inside the panel unless the caller says otherwise.
 */
export function useGuardedClose({
  open,
  dirty,
  onClose,
  confirmDiscard,
  discardTitle = 'Discard unsaved changes?',
  discardBody = "You haven't saved your edits. They will be lost.",
}: {
  open: boolean;
  dirty?: boolean;
  onClose: () => void;
  confirmDiscard?: ConfirmDiscard;
  discardTitle?: string;
  discardBody?: string;
}) {
  const appConfirm = useContext(ConfirmDiscardCtx);
  const confirm = confirmDiscard ?? appConfirm;
  const [autoDirty, setAutoDirty] = useState(false);
  const effectiveDirty = dirty ?? autoDirty;

  // Keyboard users land back on the control that opened the panel rather
  // than at the top of the page.
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    setAutoDirty(false);
    opener.current = document.activeElement as HTMLElement | null;
    return () => {
      const el = opener.current;
      if (el && el.isConnected) el.focus({ preventScroll: true });
    };
  }, [open]);

  async function requestClose() {
    if (effectiveDirty) {
      const ok = await confirm({
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

  return { requestClose, markDirty: () => setAutoDirty(true) };
}
