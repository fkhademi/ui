import { ReactNode } from 'react';
import { Pencil, Power, PowerOff, Trash2, X } from 'lucide-react';

/**
 * Floating top-pill toolbar that appears whenever 1+ rows are selected
 * in a DataTable. Reuses the .selection-toolbar primitives lifted from
 * pwsafe (see styles/components.css).
 *
 * Edit is enabled iff exactly one row is selected — multi-row edit is
 * a feature, not a primitive. Bulk delete works on any count.
 *
 * Disable/Enable is shown when the caller provides both `anyActive` and
 * the corresponding handler. If any selected row is active we show
 * "Disable"; if every selected row is inactive we show "Enable". The
 * caller decides what "active" means for its entity type.
 *
 * Extra actions go in `extra` between Edit and Delete.
 */
export function SelectionToolbar(props: {
  count: number;
  onEdit?: () => void;
  onDelete: () => void;
  onClear: () => void;
  /** Optional disable/enable controls. Both can be omitted for entities
   *  that don't support being deactivated. */
  anyActive?: boolean;
  onDisable?: () => void;
  onEnable?: () => void;
  extra?: ReactNode;
}) {
  if (props.count === 0) return null;
  const canEdit = props.count === 1 && !!props.onEdit;
  const showDisable = props.onDisable && props.anyActive === true;
  const showEnable = props.onEnable && props.anyActive === false;

  return (
    <div className="selection-toolbar" role="toolbar" aria-label="Selection">
      <span className="selection-count">{props.count} selected</span>
      <div className="selection-actions">
        {canEdit && (
          <button
            type="button"
            className="toolbar-btn"
            onClick={props.onEdit}
            aria-label="Edit selected"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
        {showDisable && (
          <button
            type="button"
            className="toolbar-btn"
            onClick={props.onDisable}
            aria-label="Disable selected"
          >
            <PowerOff size={14} />
            Disable
          </button>
        )}
        {showEnable && (
          <button
            type="button"
            className="toolbar-btn"
            onClick={props.onEnable}
            aria-label="Enable selected"
          >
            <Power size={14} />
            Enable
          </button>
        )}
        {props.extra}
        <button
          type="button"
          className="toolbar-btn toolbar-btn--danger"
          onClick={props.onDelete}
          aria-label="Delete selected"
        >
          <Trash2 size={14} />
          Delete
        </button>
        <span className="selection-sep" />
        <button
          type="button"
          className="toolbar-btn"
          onClick={props.onClear}
          aria-label="Clear selection"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
