/**
 * @doon/ui — React primitives.
 *
 * For the design tokens / base styles / component CSS / Tailwind preset,
 * see the subpath exports:
 *   import '@doon/ui';                   // barrel CSS
 *   import preset from '@doon/ui/tailwind.preset.js';
 *
 * This module exports only the React side. Each primitive is built on
 * the matching CSS class family (`.page-header`, `.settings-card`,
 * `.field`, `.empty-state`) — keep them in sync if you change the API.
 */

export { PageHeader } from './components/PageHeader';
export { SettingsCard, SettingsCards } from './components/SettingsCard';
export { Field } from './components/Field';
export { FieldHelp } from './components/FieldHelp';
export { EmptyState } from './components/EmptyState';
export { useSidebarCollapsed, SidebarCollapseToggle } from './components/SidebarCollapse';
export { AppShell } from './components/AppShell';
export type {
  AppShellProps,
  AppShellBrand,
  AppShellNavItem,
  AppShellUser,
} from './components/AppShell';
