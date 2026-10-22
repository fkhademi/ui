import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { DismissLayerDepth, useDismissLayer } from './DismissLayer';
import { useGuardedClose, type ConfirmDiscard } from './guardedClose';

/**
 * Centred dialog for a confirmation or a short form. Closes like a Drawer:
 * the X, the backdrop and Escape (as the top layer) all ask before discarding
 * edits, and focus returns to whatever opened it. `footer` holds the actions,
 * outside the scrolling body.
 *
 *   <Modal open={open} title="Rename" onClose={close} footer={<button …>Save</button>}>
 *     …
 *   </Modal>
 */
export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
  dirty,
  confirmDiscard,
}: {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional override of the automatic dirty tracking, as on Drawer. */
  dirty?: boolean;
  confirmDiscard?: ConfirmDiscard;
}) {
  const { requestClose, markDirty } = useGuardedClose({ open, dirty, onClose, confirmDiscard });
  const depth = useDismissLayer(open, requestClose);

  if (!open) return null;

  return createPortal(
    <DismissLayerDepth value={depth}>
      <div className="modal-overlay" onClick={requestClose} />
      <div className="modal-positioner">
        <div
          role="dialog"
          aria-modal="true"
          className={`modal${size === 'md' ? '' : ` modal-${size}`}`}
          onInput={markDirty}
          onChange={markDirty}
        >
          <header className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <Tooltip content="Close">
              <button type="button" onClick={requestClose} className="btn-icon" aria-label="Close dialog">
                <X size={16} />
              </button>
            </Tooltip>
          </header>
          <div className="modal-body">{children}</div>
          {footer && <footer className="modal-footer">{footer}</footer>}
        </div>
      </div>
    </DismissLayerDepth>,
    document.body,
  );
}
