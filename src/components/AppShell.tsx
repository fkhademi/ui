import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useSidebarCollapsed, SidebarCollapseToggle } from './SidebarCollapse';

export interface AppShellNavItem {
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

export interface AppShellBrand {
  to: string;
  icon: ReactNode;
  label: string;
}

export interface AppShellUser {
  name: string;
  email?: string;
  /** Free-form ReactNode slot for chips / status badges / plan info
   *  shown beneath the user's name+email. */
  meta?: ReactNode;
}

export interface AppShellProps {
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
export function AppShell({
  brand,
  navItems,
  user,
  onLogout,
  collapseKey,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useSidebarCollapsed(collapseKey);
  const visibleItems = navItems.filter(i => !i.hidden);

  return (
    <div className="app-shell">
      <aside className={`app-sidebar${collapsed ? ' app-sidebar--collapsed' : ''}`}>
        <div className="app-sidebar-brand">
          <Link to={brand.to} className="flex items-center gap-2 min-w-0 text-foreground">
            <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary grid place-items-center shrink-0">
              {brand.icon}
            </div>
            <span className="truncate">{brand.label}</span>
          </Link>
          <SidebarCollapseToggle
            collapsed={collapsed}
            onToggle={() => setCollapsed(v => !v)}
          />
        </div>

        <div className="app-sidebar-section app-sidebar-section--scroll">
          {visibleItems.map(item => (
            <AppShellNavLink key={item.to} {...item} />
          ))}
        </div>

        <div className="app-sidebar-footer">
          {user && (
            <div className="app-sidebar-user">
              <div className="app-sidebar-user-name">{user.name}</div>
              {user.email && <div className="app-sidebar-user-email">{user.email}</div>}
              {user.meta && <div className="app-sidebar-user-meta">{user.meta}</div>}
            </div>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="app-sidebar-item app-sidebar-item--full"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </aside>

      <main className="app-content">{children}</main>
    </div>
  );
}

function AppShellNavLink({ to, icon, label, badge }: AppShellNavItem) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      title={label}
      className={({ isActive }) =>
        `app-sidebar-item${isActive ? ' app-sidebar-item--active' : ''}`
      }
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full bg-warning/15 text-warning flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  );
}
