import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

/**
 * Small wrapper hook + button for collapsing the .app-sidebar rail.
 * Apps that use the shared `.app-sidebar` class can opt in by:
 *
 *   const [collapsed, setCollapsed] = useSidebarCollapsed('myapp');
 *   <aside className={`app-sidebar${collapsed ? ' app-sidebar--collapsed' : ''}`}>
 *     ...
 *     <SidebarCollapseToggle collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
 *   </aside>
 *
 * State persists per-app to localStorage under `<key>-sidebar-collapsed`
 * so each app keeps its own preference.
 */
export function useSidebarCollapsed(storageKey: string): [boolean, (next: boolean | ((v: boolean) => boolean)) => void] {
  const fullKey = `${storageKey}-sidebar-collapsed`;
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(fullKey) === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(fullKey, collapsed ? '1' : '0');
    } catch {
      /* private mode etc. — preference just doesn't persist */
    }
  }, [collapsed, fullKey]);
  return [collapsed, setCollapsed];
}

/**
 * Visual toggle. Drop it inside the sidebar footer:
 *   <SidebarCollapseToggle collapsed={collapsed} onToggle={() => ...} />
 *
 * The chevron rotates 180° in the collapsed state via .app-sidebar--collapsed
 * scoping the icon class.
 */
export function SidebarCollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="app-sidebar-collapse"
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <ChevronLeft size={14} className="app-sidebar-collapse-icon" />
    </button>
  );
}
