import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { ReactNode, RefObject, CSSProperties, ReactElement, FormEvent } from 'react';

/**
 * Standard page header used at the top of every authenticated page.
 *
 * Layout:
 *
 *   ┌─ <title>          [actions slot, right-aligned] ─┐
 *   │  <subtitle>                                       │
 *   └───────────────────────────────────────────────────┘
 *
 * The `actions` slot lives in the top-right and is typically a primary
 * button or a small inline form (e.g. a search box on the table page).
 * Omit for a header-only page.
 *
 * Pair with `<PageHeader.HelpIcon>` (TODO when needed) for inline help
 * popovers next to the title.
 */
declare function PageHeader({ title, subtitle, actions, }: {
    title: ReactNode;
    subtitle?: ReactNode;
    actions?: ReactNode;
}): react_jsx_runtime.JSX.Element;

/**
 * Card-shaped collapsible section. Use for any "list of expandable
 * config sections" surface - e.g. settings and detail pages.
 *
 * Two modes:
 *   1. Accordion (default): pass `children` + `open` + `onToggle`. The
 *      card expands on click; a chevron rotates as the state hint.
 *   2. Inline action: pass a `right` slot (e.g. a toggle switch) and
 *      omit children. The card is a one-row control with no body.
 *      Right-slot mode disables click-to-expand so the slot owns the
 *      interaction.
 *
 * Don't pass `right` and `children` together - the header would have
 * two competing interaction targets. Pick one.
 */
declare function SettingsCard({ icon, title, summary, open, onToggle, right, children, }: {
    icon: ReactNode;
    title: string;
    summary: string;
    open?: boolean;
    onToggle?: () => void;
    right?: ReactNode;
    children?: ReactNode;
}): react_jsx_runtime.JSX.Element;
/**
 * Standard container for a list of SettingsCards. Just `flex flex-col gap-2`,
 * named for clarity at the call site.
 */
declare function SettingsCards({ children }: {
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;

/**
 * Form-field wrapper. Pairs a label with its input (passed as
 * children), plus optional hint, error, and help-popover slots.
 *
 *   <Field label="Email" hint="Sign-in identity.">
 *     <input type="email" className="field" {...} />
 *   </Field>
 *
 * The `help` prop renders an (i) popover next to the label for terse
 * inline explanations. The `error` prop renders red text below the input.
 *
 * Layout-only. Visual identity is in the `.field*` classes - the input
 * itself gets the `.field` or `.field-mono` class at the call site.
 */
declare function Field({ label, hint, error, help, children, }: {
    label: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    help?: {
        title: string;
        body: ReactNode;
    };
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;

type SelectOption = {
    value: string;
    label: string;
};
/**
 * Styled dropdown select - a trigger button plus a popover list, to replace the
 * native <select> for visual consistency across the product. The list is
 * PORTALED and positioned by useFloatingMenu, so it is location-aware: it opens
 * downward, flips above the trigger when there is not enough room below, escapes
 * any overflow-hidden ancestor (drawers, settings cards, scroll boxes), and caps
 * its height to the available space. Closes on outside-click and Escape.
 * Keyboard: Enter/Space/ArrowDown opens, arrows move, Enter selects, Escape
 * closes. Visual identity uses the consuming app's CSS vars.
 *
 *   <Select value={region} onChange={setRegion} options={[{value:'eu',label:'EU'}]} />
 */
declare function Select({ value, onChange, options, placeholder, size, block, disabled, className, autoFocus, onBlur, onEscape, }: {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    size?: 'sm' | 'md';
    /** Fill the container width (and left-align like a form field). */
    block?: boolean;
    disabled?: boolean;
    className?: string;
    /** Focus the trigger on mount. For a control that replaces a cell the
     *  moment editing starts, where the user should not have to click twice. */
    autoFocus?: boolean;
    /** Focus left the control without a choice being made. Only fires while the
     *  menu is CLOSED: reaching into the menu moves focus into a portal, which
     *  looks like leaving and is not. */
    onBlur?: () => void;
    /** Escape pressed while the menu is closed. Escape with the menu open closes
     *  it first, so a caller using this to abandon an edit does not lose the
     *  edit on the keystroke that was meant to dismiss the list. */
    onEscape?: () => void;
}): react_jsx_runtime.JSX.Element;

/**
 * Styled checkbox that replaces the native <input type="checkbox"> so the
 * control matches the rest of the UI instead of the OS chrome. The real
 * input stays in the DOM (screen-reader friendly, keeps native focus and
 * space-to-toggle); a sibling box is styled off its checked/focus state via
 * peer- utilities. Pass a label to get the whole row clickable.
 *
 * Set `indeterminate` for a parent row whose children are partly selected. It
 * is a DOM property rather than an attribute, so it is applied through a ref,
 * and it takes visual precedence over `checked` the way the native control
 * does.
 */
declare function Checkbox({ checked, onChange, label, indeterminate, disabled, block, className, }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: ReactNode;
    /** Partly-selected state for a parent row. Shows a dash and outranks checked. */
    indeterminate?: boolean;
    disabled?: boolean;
    /** Fill the container width, for full-width form rows and list items. */
    block?: boolean;
    className?: string;
}): react_jsx_runtime.JSX.Element;

/**
 * Styled date picker that replaces the native <input type="date"> so the
 * control matches the rest of the UI. value / onChange use an ISO
 * "YYYY-MM-DD" string (empty = no date), exactly like the native input, so
 * it drops in without touching the surrounding form logic. The calendar is
 * portaled and positioned by useFloatingMenu (opens down, flips up, clamps
 * on-screen) and toggles shut on a second trigger click.
 */
declare function DatePicker({ value, onChange, placeholder, disabled, block, className, }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    /** Fill the container width. */
    block?: boolean;
    className?: string;
}): react_jsx_runtime.JSX.Element;

/**
 * Small (i) icon you place beside a form label. Click pops a card with
 * one or two sentences. Use sparingly - every (i) you add is a thing
 * the user has to scan past.
 *
 * Smart positioning: on open, measures the trigger and the viewport,
 * then anchors the popover so it never clips off-screen. Drawer-friendly:
 * if the trigger is close to the right edge, the popover opens to the
 * LEFT (and vice versa).
 *
 * Keep `body` to one or two sentences. Longer explanations belong in
 * docs, not in a popover.
 */
declare function FieldHelp({ title, body, }: {
    title: string;
    body: ReactNode;
}): react_jsx_runtime.JSX.Element;

/**
 * "No data yet" screen for empty lists, filtered-to-zero tables,
 * never-used features, etc. Center-aligned, low-contrast - the empty
 * state should feel calm, not alarming.
 *
 *   <EmptyState
 *     icon={<Inbox />}
 *     title="No accounts yet"
 *     subtitle="Add your first account to start tracking deals."
 *     action={<button className="btn-primary">New account</button>}
 *   />
 */
declare function EmptyState({ icon, title, subtitle, action, }: {
    icon?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
}): react_jsx_runtime.JSX.Element;

/**
 * Small wrapper hook + button for collapsing the .app-sidebar rail.
 * Apps that use the shared `.app-sidebar` class can opt in by:
 *
 *   const [collapsed, setCollapsed] = useSidebarCollapsed('myapp');
 *   <aside className={`app-sidebar${collapsed ? ' app-sidebar--collapsed' : ''}`}>
 *     <div className="app-sidebar-brand">
 *       <Link to="/">...brand...</Link>
 *       <SidebarCollapseToggle collapsed={collapsed}
 *                              onToggle={() => setCollapsed(v => !v)} />
 *     </div>
 *     ...
 *   </aside>
 *
 * Recommended placement is the right edge of the brand row - that's
 * the only spot in the rail that never moves between collapsed and
 * expanded states. Hide rules for the collapsed state target spans
 * specifically so the <button> here survives.
 *
 * State persists per-app to localStorage under `<key>-sidebar-collapsed`
 * so each app keeps its own preference.
 */
declare function useSidebarCollapsed(storageKey: string): [boolean, (next: boolean | ((v: boolean) => boolean)) => void];
/**
 * Visual toggle. Drop it on the right edge of the .app-sidebar-brand
 * row (see useSidebarCollapsed comment above for the recommended JSX).
 *
 * The chevron rotates 180° in the collapsed state via
 * .app-sidebar--collapsed scoping the icon class.
 */
declare function SidebarCollapseToggle({ collapsed, onToggle, }: {
    collapsed: boolean;
    onToggle: () => void;
}): react_jsx_runtime.JSX.Element;

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
 *      menu are treated as "inside" - clicks within either keep the
 *      menu open.
 *   3. Dismissing on Escape.
 *
 * The returned `menuStyle` is undefined when the menu is closed or the
 * trigger hasn't measured yet - guard your render with `{open && style && …}`
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
interface UseFloatingMenuOptions {
    open: boolean;
    onClose: () => void;
    /** How the menu's horizontal position relates to the trigger. */
    align?: 'stretch' | 'left' | 'right';
    /** Vertical gap between trigger bottom and menu top, in px. Default 4. */
    gap?: number;
}
interface UseFloatingMenuResult<TriggerEl extends HTMLElement, MenuEl extends HTMLElement> {
    triggerRef: RefObject<TriggerEl>;
    menuRef: RefObject<MenuEl>;
    /** `undefined` until the trigger has been measured. Spread onto the
     *  menu element to position it. */
    menuStyle: CSSProperties | undefined;
}
declare function useFloatingMenu<TriggerEl extends HTMLElement = HTMLButtonElement, MenuEl extends HTMLElement = HTMLDivElement>({ open, onClose, align, gap, }: UseFloatingMenuOptions): UseFloatingMenuResult<TriggerEl, MenuEl>;

/**
 * Show/hide-columns control for data tables. The presentational half of
 * "optional columns": a `.btn-secondary` trigger that opens a `.menu`
 * popover (positioned via useFloatingMenu) listing each hideable column
 * with a checkbox. The table owns the actual visibility state - this
 * component is deliberately framework-agnostic (no @tanstack/react-table
 * dependency); it just renders items and reports toggles.
 *
 * Pair it with `useColumnVisibility` below to persist the choice.
 */
interface ColumnToggleItem {
    id: string;
    label: string;
    visible: boolean;
    /** When false the row is shown but locked on (can't be hidden). */
    canHide?: boolean;
}
interface ColumnToggleProps {
    items: ColumnToggleItem[];
    onToggle: (id: string) => void;
    /** Trigger label + menu heading. Default "Columns". */
    label?: string;
    className?: string;
}
declare function ColumnToggle({ items, onToggle, label, className }: ColumnToggleProps): react_jsx_runtime.JSX.Element;
/**
 * Persisted column-visibility state, shaped to drop straight into
 * @tanstack/react-table's `state.columnVisibility` /
 * `onColumnVisibilityChange` (a plain `id -> visible` map where a `false`
 * entry hides the column; absent means visible). Kept tanstack-shaped but
 * tanstack-free so the hook has no table-library dependency.
 *
 * Persists per `storageKey` to localStorage (`<key>-cols`), mirroring
 * `useSidebarCollapsed`. `defaultHidden` seeds columns that should start
 * hidden the first time, before the user has expressed a preference.
 */
type ColumnVisibility = Record<string, boolean>;
declare function useColumnVisibility(storageKey: string, defaultHidden?: string[]): {
    columnVisibility: ColumnVisibility;
    setColumnVisibility: (updater: ColumnVisibility | ((prev: ColumnVisibility) => ColumnVisibility)) => void;
};

/**
 * Brand specification shape. Each doon-family product (doon, dnswiz,
 * …) ships a BrandSpec describing its palette and the three canonical
 * SVG renditions of its mark.
 *
 * SVG inner markup is a string so the same spec drives:
 *   - React consumers (BrandMark with dangerouslySetInnerHTML)
 *   - Astro consumers (set:html with the same string)
 *   - Build-time emitters that write favicon.svg / mark.svg /
 *     wordmark.svg out to a public/ dir for static serving
 *
 * Keep the strings free of script content and event handlers - they
 * are pure shape + color declarations only.
 */
interface BrandPalette {
    /** Accent hex (the brand's primary expressive color). */
    accent: string;
    /** Ink hex (the dark surface for favicon tiles, wordmark text). */
    ink: string;
}
interface BrandSvgSpec {
    /** SVG viewBox attribute, e.g. "0 0 32 32". */
    viewBox: string;
    /** SVG inner content as raw markup. No <svg> wrapper. */
    inner: string;
}
interface BrandSpec {
    /** Brand name used as the BrandMark `name` prop. */
    name: string;
    palette: BrandPalette;
    /**
     * Tile variant for tab icons and favicons. Includes the ink-tile
     * background, so it works on any surface. Colors are hardcoded since
     * the favicon SVG must look identical at every render site.
     */
    favicon: BrandSvgSpec;
    /**
     * Mark only, no background. Uses `currentColor` so consumers can
     * theme it via the parent text color. The default sidebar / inline
     * variant.
     */
    mark: BrandSvgSpec;
    /**
     * Wordmark: brand name in system-font bold with the accent shape at
     * the end. Used for footers, social cards, hero illustrations.
     */
    wordmark: BrandSvgSpec;
}

/**
 * aigw brand: a gateway hub, a dot-in-ring gate with nodes routing through it,
 * in indigo. It reads as "many callers in, many models, tools, and agents out,
 * through one governed gate". The mark is the diagonal hub; the favicon is a
 * simpler cross variant on a dark tile that stays crisp at favicon size.
 * Distinct from the dnswiz blue dot-in-ring, still part of the doon family.
 */
declare const aigwBrand: BrandSpec;

/**
 * dnswiz brand: dot inside a ring (the authoritative answer everyone
 * resolves to). Sister to the doon.io mark which is the bare dot.
 * Accent is dnswiz blue (Tailwind blue-500); ink is the standard
 * near-black surface used across the doon family.
 */
declare const dnswizBrand: BrandSpec;

/**
 * doon.io brand: a single accent-orange dot. The parent brand of the
 * doon-family products; sibling marks (e.g. dnswiz) extend this with
 * their own shapes around the same dot anchor.
 */
declare const doonBrand: BrandSpec;

/**
 * pgwiz brand: a ring that does not close, with a dot at the returning tip.
 *
 * Sister to dnswiz, whose ring is closed - the authoritative answer everyone
 * resolves to. pgwiz's argument is recurrence rather than authority, so the
 * path leaves and comes back round toward the dot at the centre. At 16px the
 * difference that reads between the two is closed versus returning.
 *
 * Emerald rather than a second blue: two blue siblings are indistinguishable
 * in a tab bar. Geometry is on the family grid - 32 for the favicon, 16 for
 * the mark, centre at the midpoint, a 60 degree gap at the top, and stroke
 * weights matching dnswiz so they sit together at small sizes.
 */
declare const pgwizBrand: BrandSpec;

declare const brands: {
    readonly aigw: BrandSpec;
    readonly dnswiz: BrandSpec;
    readonly doon: BrandSpec;
    readonly pgwiz: BrandSpec;
};
type BrandName = keyof typeof brands;

interface BrandMarkProps {
    /** Which doon-family brand to render. */
    name: BrandName;
    /**
     * Which rendition.
     *
     *   `mark` (default) - the symbol only, uses `currentColor` so the
     *     consumer can theme it via parent text color. Use inside a
     *     colored tile (e.g. `bg-primary/15 text-primary`).
     *
     *   `favicon` - ink-square tile with the mark inside, brand colors
     *     hardcoded. Use when there's no surrounding tile (tab icons,
     *     sign-in pages, og images).
     *
     *   `wordmark` - brand name in system-font bold with the accent
     *     shape at the end. Use for footers, hero illustrations.
     */
    variant?: 'mark' | 'favicon' | 'wordmark';
    /**
     * Width in CSS px. Height is derived from the viewBox aspect ratio.
     * Default 16 (matches favicon / sidebar inline use). Set to 28 for
     * the sign-in hero tile, 64+ for hero illustrations.
     */
    size?: number;
    /** Optional className passthrough so the consumer can tweak color
     *  on `mark` (uses currentColor), or add hover effects. */
    className?: string;
}
/**
 * Brand-mark renderer for the doon family. Single source of truth for
 * every doon-family logo render (doon, dnswiz, …) across React and
 * Astro consumers.
 *
 *   <BrandMark name="dnswiz" />                  inline 16px mark
 *   <BrandMark name="dnswiz" variant="favicon" size={28} />
 *   <BrandMark name="dnswiz" variant="wordmark" size={120} />
 *
 * The SVG inner markup comes from `src/brands/<name>.ts`. Update there
 * to update everywhere.
 */
declare function BrandMark({ name, variant, size, className, }: BrandMarkProps): react_jsx_runtime.JSX.Element;

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
 * Keyboard nav (when the table has focus - click any row first):
 *   ↑ / ↓        move selection
 *   Enter        activate single-selected row
 *   Delete /
 *   Backspace    fire onSelectionDelete
 *   Esc          clear selection
 *   Cmd/Ctrl+A   select all visible
 */
type Column<T> = {
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
    /** When false, the column can't be hidden from the Columns menu (kept
     *  always-on). Use for the primary identifying column. Only relevant when
     *  the table sets columnStorageKey. Defaults to hideable. */
    hideable?: boolean;
    /** Turns on a per-column text filter, matching a substring of filterValue
     *  (or row[key]). Narrower than the search box, which matches across every
     *  searchable column at once and cannot express "only this column". */
    filterable?: boolean;
    /** Turns on a per-column filter offering exactly these values, matched
     *  whole. Implies filterable. Use when the column holds a small closed set
     *  (status, type, owner); anything open-ended wants filterable instead. */
    filterOptions?: {
        value: string;
        label: string;
    }[];
    /** Placeholder for a text filter. Defaults to "Filter <label>". */
    filterPlaceholder?: string;
    /** Value the filter compares against. Defaults to row[key]. Set it when the
     *  cell renders something other than the raw value. */
    filterValue?: (row: T) => string | null | undefined;
};
type SortState = {
    key: string;
    dir: 'asc' | 'desc';
} | null;
type DataTableProps<T> = {
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
    /** When set, the table renders a built-in "Columns" menu (persisted to
     *  localStorage under this key) so users can show/hide columns. Columns
     *  with hideable:false stay locked on. Omit to disable the menu entirely. */
    columnStorageKey?: string;
    /** Column keys hidden by default the first time (before the user picks).
     *  Only used with columnStorageKey. */
    columnsDefaultHidden?: string[];
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
        /** Controlled sort. When onSortChange is set, a header click calls it and
         *  the table does NOT sort locally (rows arrive already server-sorted); the
         *  header indicator reflects `sort`. */
        sort?: SortState;
        onSortChange?: (key: string, dir: 'asc' | 'desc') => void;
        /** Controlled/server search. When onSearchChange is set, the search box is
         *  controlled + debounced and the table does NOT filter rows locally. */
        search?: string;
        onSearchChange?: (q: string) => void;
        /** Controlled/server column filters, keyed by column. When
         *  onColumnFiltersChange is set the table does NOT filter rows locally;
         *  rows are expected to arrive already filtered. */
        columnFilters?: Record<string, string>;
        onColumnFiltersChange?: (next: Record<string, string>) => void;
    };
};
type LegacyProps<T> = DataTableProps<T> & {
    searchableKeys?: string[];
};
declare function DataTable<T>(p: LegacyProps<T>): react_jsx_runtime.JSX.Element;

/**
 * Floating top-pill toolbar that appears whenever 1+ rows are selected
 * in a DataTable. Reuses the .selection-toolbar primitives lifted from
 * pwsafe (see styles/components.css).
 *
 * Edit is enabled iff exactly one row is selected - multi-row edit is
 * a feature, not a primitive. Bulk delete works on any count.
 *
 * Disable/Enable is shown when the caller provides both `anyActive` and
 * the corresponding handler. If any selected row is active we show
 * "Disable"; if every selected row is inactive we show "Enable". The
 * caller decides what "active" means for its entity type.
 *
 * Extra actions go in `extra` between Edit and Delete.
 */
declare function SelectionToolbar(props: {
    count: number;
    onEdit?: () => void;
    /** Bulk delete. Omit for entities that have no delete concept. */
    onDelete?: () => void;
    onClear: () => void;
    /** Optional disable/enable controls. Both can be omitted for entities
     *  that don't support being deactivated. */
    anyActive?: boolean;
    onDisable?: () => void;
    onEnable?: () => void;
    extra?: ReactNode;
}): react_jsx_runtime.JSX.Element | null;

declare function Tooltip({ content, children, disabled, }: {
    content: ReactNode;
    /** A single element that can take a ref and event handlers. */
    children: ReactElement;
    disabled?: boolean;
}): react_jsx_runtime.JSX.Element;

/**
 * Right-click menu, anchored to the cursor at the time of the
 * contextmenu event. Reuses the .menu/.menu-item primitives lifted
 * from pwsafe (see styles/components.css).
 *
 * Closes on:
 *  - escape
 *  - outside click
 *  - any item click (caller closes after action)
 *
 * Position is auto-adjusted to stay on-screen.
 */
type ContextMenuItem = {
    kind: 'action';
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    danger?: boolean;
    shortcut?: string;
    disabled?: boolean;
} | {
    kind: 'sep';
};
declare function ContextMenu(props: {
    x: number;
    y: number;
    items: ContextMenuItem[];
    onClose: () => void;
}): react_jsx_runtime.JSX.Element;

/**
 * Two-state switch styled by the central .toggle / .toggle-thumb pair.
 *
 * The click handler fires synchronously - wrap it in a confirm or a
 * drawer-trigger when the action needs intent (e.g. disabling MFA).
 */
declare function Toggle({ on, onClick, ariaLabel, disabled, }: {
    on: boolean;
    onClick: () => void;
    ariaLabel?: string;
    disabled?: boolean;
}): react_jsx_runtime.JSX.Element;

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
type ConfirmDiscard = (opts: {
    title: string;
    body: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
}) => Promise<boolean>;
type CloseFn = () => void;
declare function useDrawerClose(): CloseFn;
declare function Drawer({ open, dirty, title, onClose, children, size, confirmDiscard, discardTitle, discardBody, }: {
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
}): react.ReactPortal | null;
/**
 * Standard drawer footer with Cancel (routes through requestClose so
 * dirty-confirm fires) + Save. The Save button submits the form living inside
 * the same drawer panel, so HTML constraints run before the form's onSubmit.
 */
declare function DrawerFooter({ pending, label, disabled, children, }: {
    pending?: boolean;
    onSubmit?: (e: FormEvent) => void;
    label?: string;
    disabled?: boolean;
    children?: ReactNode;
}): react_jsx_runtime.JSX.Element;

type MultiSelectOption = {
    value: string;
    label: string;
};
/**
 * Searchable multi-select combobox with chips. The popover is portaled and
 * positioned with useFloatingMenu, so it floats cleanly over an overflow
 * ancestor (a drawer body, a scroll container) instead of being clipped.
 *
 * allowFree lets the caller type a value that isn't in `options` (a glob, or a
 * runtime-only value like an IdP group / JWT subject) - so suggestion-backed
 * fields still accept free entry.
 */
declare function MultiSelect({ value, onChange, options, allowFree, placeholder, }: {
    value: string[];
    onChange: (v: string[]) => void;
    options?: MultiSelectOption[];
    allowFree?: boolean;
    placeholder?: string;
}): react_jsx_runtime.JSX.Element;

export { BrandMark, type BrandMarkProps, type BrandName, type BrandPalette, type BrandSpec, type BrandSvgSpec, Checkbox, type Column, ColumnToggle, type ColumnToggleItem, type ColumnToggleProps, type ColumnVisibility, type ConfirmDiscard, ContextMenu, type ContextMenuItem, DataTable, type DataTableProps, DatePicker, Drawer, DrawerFooter, EmptyState, Field, FieldHelp, MultiSelect, type MultiSelectOption, PageHeader, Select, type SelectOption, SelectionToolbar, SettingsCard, SettingsCards, SidebarCollapseToggle, Toggle, Tooltip, type UseFloatingMenuOptions, type UseFloatingMenuResult, aigwBrand, brands, dnswizBrand, doonBrand, pgwizBrand, useColumnVisibility, useDrawerClose, useFloatingMenu, useSidebarCollapsed };
