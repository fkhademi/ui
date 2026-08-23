/**
 * @doon/ui/app-shell - the standard application chrome.
 *
 * Kept out of the main entry point on purpose. AppShell is the only thing
 * in this package that touches react-router-dom, and a static import in
 * the barrel forced that dependency on every consumer, including the ones
 * that route by other means and never render an AppShell.
 *
 * Import it from this subpath instead:
 *
 *   import { AppShell } from '@doon/ui/app-shell';
 *
 * react-router-dom is an optional peer. Install it if you use this entry.
 */

export { AppShell } from './components/AppShell';
export type {
  AppShellProps,
  AppShellBrand,
  AppShellNavItem,
  AppShellUser,
} from './components/AppShell';
