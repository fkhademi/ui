import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

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
 * `min-h-screen` / `overflow` wrappers - the shell owns that.
 */
declare function AppShell({ brand, navItems, user, onLogout, collapseKey, children, }: AppShellProps): react_jsx_runtime.JSX.Element;

export { AppShell, type AppShellBrand, type AppShellNavItem, type AppShellProps, type AppShellUser };
