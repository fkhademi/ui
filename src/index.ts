/**
 * @doon/ui - React primitives.
 *
 * For the design tokens / base styles / component CSS / Tailwind preset,
 * see the subpath exports:
 *   import '@doon/ui';                   // barrel CSS
 *   import preset from '@doon/ui/tailwind.preset.js';
 *
 * This module exports only the React side. Each primitive is built on
 * the matching CSS class family (`.page-header`, `.settings-card`,
 * `.field`, `.empty-state`) - keep them in sync if you change the API.
 */

export { PageHeader } from './components/PageHeader';
export { SettingsCard, SettingsCards } from './components/SettingsCard';
export { Field } from './components/Field';
export { Select } from './components/Select';
export type { SelectOption } from './components/Select';
export { Checkbox } from './components/Checkbox';
export { DatePicker } from './components/DatePicker';
export { FieldHelp } from './components/FieldHelp';
export { EmptyState } from './components/EmptyState';
export { useSidebarCollapsed, SidebarCollapseToggle } from './components/SidebarCollapse';
// AppShell lives at '@doon/ui/app-shell'. It is the only component that
// imports react-router-dom, and exporting it here forced that dependency
// on every consumer of this package.
export { useFloatingMenu } from './components/FloatingMenu';
export type {
  UseFloatingMenuOptions,
  UseFloatingMenuResult,
} from './components/FloatingMenu';
export { ColumnToggle, useColumnVisibility } from './components/ColumnToggle';
export type {
  ColumnToggleItem,
  ColumnToggleProps,
  ColumnVisibility,
} from './components/ColumnToggle';
export { BrandMark } from './components/BrandMark';
export type { BrandMarkProps } from './components/BrandMark';
export { DataTable } from './components/DataTable';
export type { Column, DataTableProps } from './components/DataTable';
export { SelectionToolbar } from './components/SelectionToolbar';
export { Tooltip } from './components/Tooltip';
export { ContextMenu } from './components/ContextMenu';
export type { ContextMenuItem } from './components/ContextMenu';
export { Toggle } from './components/Toggle';
export { Drawer, DrawerFooter, useDrawerClose } from './components/Drawer';
export type { ConfirmDiscard } from './components/Drawer';
export { MultiSelect } from './components/MultiSelect';
export type { MultiSelectOption } from './components/MultiSelect';
export { brands, aigwBrand, dnswizBrand, doonBrand, pgwizBrand } from './brands';
export type { BrandName, BrandSpec, BrandPalette, BrandSvgSpec } from './brands';
export { money, compactNumber, percent } from './format';
