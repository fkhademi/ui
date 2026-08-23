import { useSidebarCollapsed, SidebarCollapseToggle } from './chunk-NZUZIMAT.js';
import { Link, NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { jsxs, jsx } from 'react/jsx-runtime';

function AppShell({
  brand,
  navItems,
  user,
  onLogout,
  collapseKey,
  children
}) {
  const [collapsed, setCollapsed] = useSidebarCollapsed(collapseKey);
  const visibleItems = navItems.filter((i) => !i.hidden);
  return /* @__PURE__ */ jsxs("div", { className: "app-shell", children: [
    /* @__PURE__ */ jsxs("aside", { className: `app-sidebar${collapsed ? " app-sidebar--collapsed" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "app-sidebar-brand", children: [
        /* @__PURE__ */ jsxs(Link, { to: brand.to, className: "flex items-center gap-2 min-w-0 text-foreground", children: [
          /* @__PURE__ */ jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/15 text-primary grid place-items-center shrink-0", children: brand.icon }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: brand.label })
        ] }),
        /* @__PURE__ */ jsx(
          SidebarCollapseToggle,
          {
            collapsed,
            onToggle: () => setCollapsed((v) => !v)
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "app-sidebar-section app-sidebar-section--scroll", children: visibleItems.map((item) => /* @__PURE__ */ jsx(AppShellNavLink, { ...item }, item.to)) }),
      /* @__PURE__ */ jsxs("div", { className: "app-sidebar-footer", children: [
        user && /* @__PURE__ */ jsxs("div", { className: "app-sidebar-user", children: [
          /* @__PURE__ */ jsx("div", { className: "app-sidebar-user-name", children: user.name }),
          user.email && /* @__PURE__ */ jsx("div", { className: "app-sidebar-user-email", children: user.email }),
          user.meta && /* @__PURE__ */ jsx("div", { className: "app-sidebar-user-meta", children: user.meta })
        ] }),
        onLogout && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: onLogout,
            className: "app-sidebar-item app-sidebar-item--full",
            children: [
              /* @__PURE__ */ jsx(LogOut, { size: 16 }),
              /* @__PURE__ */ jsx("span", { children: "Sign out" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "app-content", children })
  ] });
}
function AppShellNavLink({ to, icon, label, badge }) {
  return /* @__PURE__ */ jsxs(
    NavLink,
    {
      to,
      end: to === "/",
      title: label,
      className: ({ isActive }) => `app-sidebar-item${isActive ? " app-sidebar-item--active" : ""}`,
      children: [
        icon,
        /* @__PURE__ */ jsx("span", { className: "flex-1", children: label }),
        badge !== void 0 && badge > 0 && /* @__PURE__ */ jsx("span", { className: "min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full bg-warning/15 text-warning flex items-center justify-center", children: badge > 99 ? "99+" : badge })
      ]
    }
  );
}

export { AppShell };
//# sourceMappingURL=app-shell.js.map
//# sourceMappingURL=app-shell.js.map