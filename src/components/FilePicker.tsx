import { useRef } from 'react';
import { Upload } from 'lucide-react';

/**
 * A file input that looks like the rest of the form: a button and the chosen
 * file's name, instead of the browser's own control.
 *
 *   <FilePicker accept=".csv" file={file} onChange={setFile} />
 */
export function FilePicker({
  file,
  onChange,
  accept,
  label = 'Choose file',
  placeholder = 'No file chosen',
  disabled = false,
  ariaLabel,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** What the file is for, read out for the hidden input (the visible label
   *  belongs to the surrounding Field). */
  ariaLabel?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="file-picker">
      <input
        ref={input}
        type="file"
        aria-label={ariaLabel ?? label}
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null);
          // Cleared so picking the same file again is reported again.
          e.target.value = '';
        }}
      />
      <button type="button" className="btn-secondary btn-sm shrink-0" disabled={disabled} onClick={() => input.current?.click()}>
        <Upload size={14} />
        {label}
      </button>
      <span className="file-picker-name">{file ? file.name : placeholder}</span>
    </div>
  );
}
