import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

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

export { EmptyState, Field, FieldHelp, PageHeader, SettingsCard, SettingsCards };
