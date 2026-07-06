import { KeyboardEvent, MouseEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

/**
 * Universal list primitive for the app.
 *
 * Selection model (Finder/Linear/Gmail-style):
 *   click          → replace selection with just this row
 *   Cmd/Ctrl+click → toggle this row in the current selection
 *   Shift+click    → range-extend from the last clicked row
 *   double-click   → activate (open edit drawer, navigate, …)
 *   right-click    → context menu (caller renders), switches selection
 *                    to the right-clicked row if it wasn't already in
 *                    the selection
 *
 * Keyboard nav (when the table has focus — click any row first):
 *   ↑ / ↓        move selection
 *   Enter        activate single-selected row
 *   Delete /
 *   Backspace    fire onSelectionDelete
 *   Esc          clear selection
 *   Cmd/Ctrl+A   select all visible
 */

export type Column<T> = {
  /** Stable key used for sort + react keying. */
  key: string;
  /** Header label. */
  label: string;
  /** Whether the header is clickable to sort. */
  sortable?: boolean;
  /** Right-align (numeric/timestamp columns). */
  align?: 'left' | 'right';
  /** Custom cell renderer. If absent, renders String(row[key]). */
  render?: (row: T) => ReactNode;
  /** Returns a value to sort by. If absent, uses row[key]. */
  sortValue?: (row: T) => string | number | null | undefined;
  /** Returns text used for substring search on this column. If absent
   *  but the column is listed in searchKeys, we fall back to row[key]. */
  searchValue?: (row: T) => string | null | undefined;
  /** Truncate the cell to one line with ellipsis and put the full text in
   *  the native tooltip (title attribute). Uses searchValue when set,
   *  otherwise falls back to the raw row[key]. Keeps long comments and
   *  GSLB data summaries from blowing the row height up. */
  truncate?: boolean;
  /** Extra td className. */
  className?: string;
  /** Fixed column width (CSS, e.g. "60px" or "8rem"). Applied to both
   *  th and td via inline style. Use for tight glyph-only columns
   *  (gauge, icon) so they don't share the table's flex budget. */
  width?: string;
};

type SortState = { key: string; dir: 'asc' | 'desc' } | null;

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  isLoading?: boolean;
  error?: Error | null;

  /** Column keys that participate in substring search. Uses Column.searchValue
   *  when defined, otherwise the raw row[key]. */
  searchKeys?: string[];

  defaultSort?: SortState;
  defaultPageSize?: number;
  pageSizes?: number[];

  /** Owned by the parent so SelectionToolbar can render against it. */
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;

  /** Double-click + Enter handler. Use for "open detail" / "open edit". */
  onRowActivate?: (row: T) => void;

  /** Plain single-click handler. Use when the table is read-only and
   *  the row IS the detail target (e.g. audit log). Modifier-click
   *  (Cmd/Ctrl/Shift) still goes through the selection path so users
   *  can multi-select if the table also wires selection. */
  onRowClick?: (row: T) => void;

  /** Right-click. We give you cursor coords; you render the menu. */
  onRowContext?: (row: T, x: number, y: number) => void;

  /** Delete/Backspace key fires this with the current selection (or
   *  with just the focused row if nothing's selected yet). The caller
   *  is responsible for confirm + the actual delete. */
  onSelectionDelete?: () => void;

  /** Rendered when the dataset is empty (zero rows total, ignoring filter). */
  emptyState?: ReactNode;

  /** Slot rendered to the right of the toolbar (after the row count).
   *  Use for low-frequency table-scoped actions (Import, Export, …) so
   *  they don't compete with the primary page-header action. */
  extraActions?: ReactNode;

  /** Controlled / server-side pagination. When set, the parent owns paging:
   *  `rows` is the current page as-is (no client slicing), the footer is
   *  driven by these values, and page/size controls call back. Omit for the
   *  default client-side pagination. */
  serverPagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
};

// Back-compat alias — some pages still pass `searchableKeys`.
type LegacyProps<T> = DataTableProps<T> & { searchableKeys?: string[] };

export function DataTable<T>(p: LegacyProps<T>) {
  const {
    columns,
    // Destructure-default only applies for undefined, not null. The
    // server now coerces empty pages to [], but stay defensive so an
    // older API or a bad fetch doesn't blow up the table.
    rows: rawRows,
    getRowId,
    isLoading,
    error,
    searchKeys,
    searchableKeys,
    defaultSort = null,
    defaultPageSize = 25,
    pageSizes = [10, 25, 50, 100],
    selectedIds,
    onSelectionChange,
    onRowActivate,
    onRowClick,
    onRowContext,
    onSelectionDelete,
    emptyState,
    extraActions,
    serverPagination,
  } = p;
  const rows = rawRows ?? [];
  const sp = serverPagination;
  const server = !!sp;
  const searchCols = searchKeys ?? searchableKeys ?? [];
  const selected = selectedIds ?? new Set<string>();

  const [sort, setSort] = useState<SortState>(defaultSort);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  // Reset to page 0 whenever the dataset or filter changes (client mode only;
  // in server mode the parent owns the page).
  useEffect(() => {
    if (!server) setPage(0);
  }, [search, pageSize, rows, server]);

  const filtered = useMemo(() => {
    if (!search.trim() || searchCols.length === 0) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) =>
      searchCols.some((k) => {
        const col = columns.find((c) => c.key === k);
        let v: unknown;
        if (col?.searchValue) v = col.searchValue(r);
        else v = (r as Record<string, unknown>)[k];
        return v != null && String(v).toLowerCase().includes(q);
      }),
    );
  }, [rows, search, searchCols, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const getter = col.sortValue ?? ((r: T) => (r as Record<string, unknown>)[col.key]);
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = getter(a) ?? '';
      const bv = getter(b) ?? '';
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sort, columns]);

  // Server mode: the parent owns page/size/total; `sorted` is already just the
  // current page (search/sort act on the visible page only). Client mode: slice.
  const effPageSize = server ? sp!.pageSize : pageSize;
  const totalRows = server ? sp!.total : sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / effPageSize));
  const safePage = server ? sp!.page : Math.min(page, totalPages - 1);
  const paged = server ? sorted : sorted.slice(safePage * effPageSize, safePage * effPageSize + effPageSize);
  const goToPage = (p2: number) => (server ? sp!.onPageChange(Math.max(0, Math.min(p2, totalPages - 1))) : setPage(p2));
  const changePageSize = (n: number) => (server ? sp!.onPageSizeChange?.(n) : setPageSize(n));
  const showSizeSelect = !server || !!sp!.onPageSizeChange;

  const showingFrom = totalRows === 0 ? 0 : safePage * effPageSize + 1;
  const showingTo = Math.min(totalRows, (safePage + 1) * effPageSize);

  function toggleSort(key: string) {
    setSort((s) =>
      !s || s.key !== key
        ? { key, dir: 'asc' }
        : s.dir === 'asc'
          ? { key, dir: 'desc' }
          : null,
    );
  }

  // Anchor for shift-click ranges. Resets on any non-shift click.
  const [anchorIdx, setAnchorIdx] = useState<number | null>(null);

  function commit(next: Set<string>) {
    onSelectionChange?.(next);
  }
  function selectOnly(id: string, idx: number) {
    commit(new Set([id]));
    setAnchorIdx(idx);
  }
  function toggleOne(id: string, idx: number) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    commit(next);
    setAnchorIdx(idx);
  }
  function selectRange(toIdx: number) {
    const from = anchorIdx ?? toIdx;
    const [lo, hi] = from < toIdx ? [from, toIdx] : [toIdx, from];
    const next = new Set<string>();
    for (let i = lo; i <= hi; i++) next.add(getRowId(sorted[i]));
    commit(next);
  }
  function clearSelection() {
    if (selected.size === 0) return;
    commit(new Set());
  }

  function onRowMouseDown(row: T, idx: number, e: MouseEvent) {
    const id = getRowId(row);
    if (e.button === 2) return; // right-click handled by onContextMenu
    // Suppress the browser's native text-select on double-click. With
    // user-select:none on .dt-tr this is belt-and-suspenders, but cheap.
    if (e.detail >= 2) e.preventDefault();
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      toggleOne(id, idx);
      return;
    }
    if (e.shiftKey) {
      e.preventDefault();
      selectRange(idx);
      return;
    }
    // Plain click: fire onRowClick when set. Skip the selection path so
    // there's no flash of "selected then immediately opened" state.
    if (onRowClick) {
      onRowClick(row);
      return;
    }
    if (selected.size === 1 && selected.has(id)) {
      // Toggle: clicking the only-selected row again deselects it. With
      // multi-selection, the plain click snaps the selection to just
      // this row instead (matches Finder/Linear).
      clearSelection();
    } else {
      selectOnly(id, idx);
    }
  }

  function onRowDoubleClick(row: T) {
    onRowActivate?.(row);
  }

  // Click outside any row inside the table → clear selection. The
  // wrapper div catches clicks that didn't bubble up from a <tr>.
  function onSurfaceClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('tr.dt-tr')) return;
    if (target.closest('.dt-toolbar')) return;
    if (target.closest('.dt-pagination')) return;
    clearSelection();
  }

  function onKey(e: KeyboardEvent) {
    if (sorted.length === 0) return;
    const lastSelectedId = [...selected].pop();
    const currentIdx = lastSelectedId
      ? sorted.findIndex((r) => getRowId(r) === lastSelectedId)
      : -1;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = Math.min(sorted.length - 1, currentIdx < 0 ? 0 : currentIdx + 1);
        selectOnly(getRowId(sorted[next]), next);
        scrollRowIntoView(next);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const next = Math.max(0, currentIdx < 0 ? 0 : currentIdx - 1);
        selectOnly(getRowId(sorted[next]), next);
        scrollRowIntoView(next);
        break;
      }
      case 'Enter': {
        if (selected.size === 1 && onRowActivate && currentIdx >= 0) {
          e.preventDefault();
          onRowActivate(sorted[currentIdx]);
        }
        break;
      }
      case 'Delete':
      case 'Backspace': {
        if (selected.size > 0 && onSelectionDelete) {
          e.preventDefault();
          onSelectionDelete();
        }
        break;
      }
      case 'Escape': {
        clearSelection();
        break;
      }
      case 'a':
      case 'A': {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          const next = new Set<string>();
          sorted.forEach((r) => next.add(getRowId(r)));
          commit(next);
        }
        break;
      }
    }
  }

  function scrollRowIntoView(sortedIdx: number) {
    // Make sure the row is on the current page; if not, jump (client mode only -
    // in server mode all current-page rows are already rendered).
    if (!server) {
      const targetPage = Math.floor(sortedIdx / effPageSize);
      if (targetPage !== safePage) setPage(targetPage);
    }
    requestAnimationFrame(() => {
      const el = tableRef.current?.querySelector<HTMLTableRowElement>(
        `tr.dt-tr[data-row-idx="${sortedIdx % effPageSize}"]`,
      );
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  const isEmpty = !isLoading && !error && rows.length === 0;
  const isFilteredEmpty = !isEmpty && !isLoading && !error && sorted.length === 0;

  return (
    <div
      ref={tableRef}
      className="data-table"
      tabIndex={0}
      onKeyDown={onKey}
      onClick={onSurfaceClick}
    >
      <div className="dt-toolbar">
        {searchCols.length > 0 && (
          <div className="dt-search-wrap">
            <Search size={14} className="dt-search-icon" />
            <input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dt-search"
              autoComplete="off"
            />
          </div>
        )}
        <div className="dt-count">
          {isLoading
            ? 'loading…'
            : sp
              ? `${sp.total.toLocaleString()} ${sp.total === 1 ? 'row' : 'rows'}`
              : `${sorted.length} ${sorted.length === 1 ? 'row' : 'rows'}`}
          {!sp && search && rows.length !== sorted.length && (
            <> · filtered from {rows.length}</>
          )}
        </div>
        {extraActions && <div className="ml-auto">{extraActions}</div>}
      </div>

      <div className="dt-card">
        <table className="dt-table">
          <thead className="dt-thead">
            <tr>
              {columns.map((c) => {
                const isSorted = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    onClick={c.sortable ? () => toggleSort(c.key) : undefined}
                    style={c.width ? { width: c.width } : undefined}
                    className={
                      `dt-th${c.align === 'right' ? ' dt-th--right' : ''}` +
                      (c.sortable ? ' dt-th--sortable' : '') +
                      (isSorted ? ' dt-th--sorted' : '')
                    }
                  >
                    <span className="dt-th-inner">
                      {c.label}
                      {isSorted &&
                        (sort.dir === 'asc' ? (
                          <ChevronUp size={11} />
                        ) : (
                          <ChevronDown size={11} />
                        ))}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="dt-empty">
                  Loading…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={columns.length} className="dt-empty text-destructive">
                  {error.message}
                </td>
              </tr>
            )}
            {isEmpty && (
              <tr>
                <td colSpan={columns.length}>
                  {emptyState ?? <div className="dt-empty">No rows.</div>}
                </td>
              </tr>
            )}
            {isFilteredEmpty && (
              <tr>
                <td colSpan={columns.length}>
                  <div className="dt-empty">
                    <div>No matches for "{search}".</div>
                    <button
                      type="button"
                      className="btn-ghost mt-2"
                      onClick={() => setSearch('')}
                    >
                      <X size={12} />
                      Clear search
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading &&
              !error &&
              paged.map((row, idx) => {
                const id = getRowId(row);
                const isSelected = selected.has(id);
                // sortedIdx so range-extend works across the whole filtered list.
                const sortedIdx = safePage * effPageSize + idx;
                return (
                  <tr
                    key={id}
                    data-row-idx={idx}
                    className={
                      'dt-tr' +
                      (onRowActivate || onRowClick ? ' dt-tr--clickable' : '') +
                      (isSelected ? ' dt-tr--selected' : '')
                    }
                    onMouseDown={(e) => onRowMouseDown(row, sortedIdx, e)}
                    onDoubleClick={() => onRowDoubleClick(row)}
                    onContextMenu={
                      onRowContext
                        ? (e) => {
                            e.preventDefault();
                            if (!selected.has(id)) selectOnly(id, sortedIdx);
                            onRowContext(row, e.clientX, e.clientY);
                          }
                        : undefined
                    }
                  >
                    {columns.map((c) => {
                      const content = c.render
                        ? c.render(row)
                        : String((row as Record<string, unknown>)[c.key] ?? '');
                      if (c.truncate) {
                        const fullText = c.searchValue
                          ? (c.searchValue(row) ?? '')
                          : String((row as Record<string, unknown>)[c.key] ?? '');
                        return (
                          <td
                            key={c.key}
                            style={c.width ? { width: c.width } : undefined}
                            className={
                              `dt-td dt-td--truncate${c.align === 'right' ? ' dt-td--right' : ''}` +
                              (c.className ? ` ${c.className}` : '')
                            }
                          >
                            <span className="dt-cell-truncate" title={fullText || undefined}>
                              {content}
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td
                          key={c.key}
                          style={c.width ? { width: c.width } : undefined}
                          className={
                            `dt-td${c.align === 'right' ? ' dt-td--right' : ''}` +
                            (c.className ? ` ${c.className}` : '')
                          }
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {totalRows > 0 && (
        <div className="dt-pagination">
          <span className="dt-page-info">
            {showingFrom}–{showingTo} of {totalRows}
          </span>
          {showSizeSelect && (
            <select
              className="dt-page-size"
              value={effPageSize}
              onChange={(e) => changePageSize(parseInt(e.target.value, 10))}
              aria-label="Rows per page"
            >
              {pageSizes.map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          )}
          <div className="dt-page-buttons">
            <button
              type="button"
              className="dt-page-btn"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 0}
              aria-label="Previous page"
            >
              ‹
            </button>
            {pageButtons(safePage, totalPages).map((p2, i) =>
              p2 === '…' ? (
                <span key={`gap-${i}`} className="dt-page-btn" aria-hidden>
                  …
                </span>
              ) : (
                <button
                  key={p2}
                  type="button"
                  className={`dt-page-btn ${p2 === safePage ? 'dt-page-btn--active' : ''}`}
                  onClick={() => goToPage(p2 as number)}
                >
                  {(p2 as number) + 1}
                </button>
              ),
            )}
            <button
              type="button"
              className="dt-page-btn"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages - 1}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact page-button list: always show first, last, current ±1; gaps as "…".
function pageButtons(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const out: (number | '…')[] = [0];
  if (current > 2) out.push('…');
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) out.push(i);
  if (current < total - 3) out.push('…');
  out.push(total - 1);
  return out;
}
