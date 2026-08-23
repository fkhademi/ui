import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { jsx } from 'react/jsx-runtime';

// src/components/SidebarCollapse.tsx
function useSidebarCollapsed(storageKey) {
  const fullKey = `${storageKey}-sidebar-collapsed`;
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(fullKey) === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(fullKey, collapsed ? "1" : "0");
    } catch {
    }
  }, [collapsed, fullKey]);
  return [collapsed, setCollapsed];
}
function SidebarCollapseToggle({
  collapsed,
  onToggle
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      className: "app-sidebar-collapse",
      onClick: onToggle,
      "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
      title: collapsed ? "Expand sidebar" : "Collapse sidebar",
      children: /* @__PURE__ */ jsx(ChevronLeft, { size: 14, className: "app-sidebar-collapse-icon" })
    }
  );
}

export { SidebarCollapseToggle, useSidebarCollapsed };
//# sourceMappingURL=chunk-NZUZIMAT.js.map
//# sourceMappingURL=chunk-NZUZIMAT.js.map