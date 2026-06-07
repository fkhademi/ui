import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, RefObject, CSSProperties } from 'react';

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
 * config sections" surface — user settings, platform admin, tenant
 * detail page.
 *
 * Two modes:
 *   1. Accordion (default): pass `children` + `open` + `onToggle`. The
 *      card expands on click; a chevron rotates as the state hint.
 *   2. Inline action: pass a `right` slot (e.g. a toggle switch) and
 *      omit children. The card is a one-row control with no body.
 *      Right-slot mode disables click-to-expand so the slot owns the
 *      interaction.
 *
 * Don't pass `right` and `children` together — the header would have
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
 * Layout-only. Visual identity is in the `.field*` classes — the input
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

/**
 * Small (i) icon you place beside a form label. Click pops a card with
 * one or two sentences. Use sparingly — every (i) you add is a thing
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
 * never-used features, etc. Center-aligned, low-contrast — the empty
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
 * Recommended placement is the right edge of the brand row — that's
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

interface AppShellNavItem {
    to: string;
    icon: ReactNode;
    label: string;
    /** Optional numeric badge rendered on the right of the row.
     *  Hidden when value is undefined or 0. Capped at "99+". */
    badge?: number;
    /** Render `false` to omit the item (e.g. behind a feature flag or
     *  permission check). Filtered out before rendering. */
    hidden?: boolean;
}
interface AppShellBrand {
    to: string;
    icon: ReactNode;
    label: string;
}
interface AppShellUser {
    name: string;
    email?: string;
    /** Free-form ReactNode slot for chips / status badges / plan info
     *  shown beneath the user's name+email. */
    meta?: ReactNode;
}
interface AppShellProps {
    brand: AppShellBrand;
    navItems: AppShellNavItem[];
    user?: AppShellUser | null;
    onLogout?: () => void;
    /** Per-app localStorage key for the collapse preference. Different
     *  products should use different keys so they don't trample each
     *  other if both are open in the same browser. */
    collapseKey: string;
    children: ReactNode;
}
/**
 * Standard application chrome: sticky left rail with brand, nav,
 * user info, and a collapse toggle; scrollable main panel.
 *
 * Layout primitives are CSS-driven (`.app-shell`, `.app-sidebar*`,
 * `.app-content`) so the visual identity stays out of consumer JSX.
 * The collapse preference persists via localStorage, keyed by
 * `collapseKey` so multiple apps can coexist independently.
 *
 * The main panel scrolls. Pages should not add their own
 * `min-h-screen` / `overflow` wrappers — the shell owns that.
 */
declare function AppShell({ brand, navItems, user, onLogout, collapseKey, children, }: AppShellProps): react_jsx_runtime.JSX.Element;

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
 *      menu are treated as "inside" — clicks within either keep the
 *      menu open.
 *   3. Dismissing on Escape.
 *
 * The returned `menuStyle` is undefined when the menu is closed or the
 * trigger hasn't measured yet — guard your render with `{open && style && …}`
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
 * Brand specification shape. Each doon-family product (doon, dnswiz,
 * pgwiz, pwwiz, …) ships a BrandSpec describing its palette and the
 * three canonical SVG renditions of its mark.
 *
 * SVG inner markup is a string so the same spec drives:
 *   - React consumers (BrandMark with dangerouslySetInnerHTML)
 *   - Astro consumers (set:html with the same string)
 *   - Build-time emitters that write favicon.svg / mark.svg /
 *     wordmark.svg out to a public/ dir for static serving
 *
 * Keep the strings free of script content and event handlers — they
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
 * dnswiz brand: dot inside a ring (the authoritative answer everyone
 * resolves to). Sister to the doon.io mark which is the bare dot.
 * Accent is dnswiz green (Tailwind green-400); ink is the standard
 * near-black surface used across the doon family.
 */
declare const dnswizBrand: BrandSpec;

/**
 * doon.io brand: a single accent-orange dot. The parent brand of the
 * doon-family products; dnswiz / pgwiz / pwwiz marks extend this with
 * their own shapes around the same dot anchor.
 */
declare const doonBrand: BrandSpec;

declare const brands: {
    readonly dnswiz: BrandSpec;
    readonly doon: BrandSpec;
};
type BrandName = keyof typeof brands;

interface BrandMarkProps {
    /** Which doon-family brand to render. */
    name: BrandName;
    /**
     * Which rendition.
     *
     *   `mark` (default) — the symbol only, uses `currentColor` so the
     *     consumer can theme it via parent text color. Use inside a
     *     colored tile (e.g. `bg-primary/15 text-primary`).
     *
     *   `favicon` — ink-square tile with the mark inside, brand colors
     *     hardcoded. Use when there's no surrounding tile (tab icons,
     *     sign-in pages, og images).
     *
     *   `wordmark` — brand name in system-font bold with the accent
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
 * every dnswiz / doon / pgwiz / pwwiz logo render across React and
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

export { AppShell, type AppShellBrand, type AppShellNavItem, type AppShellProps, type AppShellUser, BrandMark, type BrandMarkProps, type BrandName, type BrandPalette, type BrandSpec, type BrandSvgSpec, EmptyState, Field, FieldHelp, PageHeader, SettingsCard, SettingsCards, SidebarCollapseToggle, type UseFloatingMenuOptions, type UseFloatingMenuResult, brands, dnswizBrand, doonBrand, useFloatingMenu, useSidebarCollapsed };
