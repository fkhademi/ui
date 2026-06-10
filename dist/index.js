import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { HelpCircle, ChevronLeft, LogOut, SlidersHorizontal, Check, ChevronDown } from 'lucide-react';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

// src/components/PageHeader.tsx
function PageHeader({
  title,
  subtitle,
  actions
}) {
  return /* @__PURE__ */ jsxs("div", { className: "page-header", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "page-title", children: title }),
      subtitle && /* @__PURE__ */ jsx("div", { className: "page-subtitle", children: subtitle })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "page-actions", children: actions })
  ] });
}
function SettingsCard({
  icon,
  title,
  summary,
  open,
  onToggle,
  right,
  children
}) {
  const isAccordion = !right && !!children;
  const headerClass = isAccordion ? "settings-card-header settings-card-header--clickable" : "settings-card-header";
  const headerInner = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "settings-card-icon", children: icon }),
    /* @__PURE__ */ jsxs("div", { className: "settings-card-text", children: [
      /* @__PURE__ */ jsx("div", { className: "settings-card-title", children: title }),
      /* @__PURE__ */ jsx("div", { className: "settings-card-summary", children: summary })
    ] }),
    right ?? /* @__PURE__ */ jsx(ChevronDown, { size: 16, className: "settings-card-chev" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: `settings-card${open ? " settings-card--open" : ""}`, children: [
    isAccordion ? /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onToggle,
        "aria-expanded": open,
        className: headerClass,
        children: headerInner
      }
    ) : /* @__PURE__ */ jsx("div", { className: headerClass, children: headerInner }),
    open && children && /* @__PURE__ */ jsx("div", { className: "settings-card-body", children })
  ] });
}
function SettingsCards({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "settings-cards", children });
}
function FieldHelp({
  title,
  body
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({});
  const wrapRef = useRef(null);
  const popRef = useRef(null);
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = wrapRef.current?.getBoundingClientRect();
    if (!trigger) return;
    const POP_W = 256;
    const MARGIN = 8;
    let left;
    if (trigger.right - POP_W < MARGIN) {
      left = trigger.left;
    } else {
      left = trigger.right - POP_W;
    }
    let top = trigger.bottom + 6;
    const ESTIMATED_H = 180;
    if (top + ESTIMATED_H > window.innerHeight - MARGIN) {
      top = trigger.top - ESTIMATED_H - 6;
    }
    setPos({ top, left, width: POP_W });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (wrapRef.current?.contains(e.target) || popRef.current?.contains(e.target)) {
        return;
      }
      setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return /* @__PURE__ */ jsxs("span", { ref: wrapRef, className: "field-help", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "field-help-trigger",
        "aria-label": `Explain ${title}`,
        "aria-expanded": open,
        onClick: (e) => {
          e.preventDefault();
          setOpen((v) => !v);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        },
        children: /* @__PURE__ */ jsx(HelpCircle, { size: 13 })
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { ref: popRef, className: "field-help-pop", role: "tooltip", style: pos, children: [
      /* @__PURE__ */ jsx("div", { className: "field-help-title", children: title }),
      /* @__PURE__ */ jsx("div", { className: "field-help-body", children: body })
    ] })
  ] });
}
function Field({
  label,
  hint,
  error,
  help,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("label", { className: "field-label", children: [
      /* @__PURE__ */ jsx("span", { children: label }),
      help && /* @__PURE__ */ jsx(FieldHelp, { title: help.title, body: help.body })
    ] }),
    children,
    error ? /* @__PURE__ */ jsx("div", { className: "field-error", children: error }) : hint ? /* @__PURE__ */ jsx("div", { className: "field-hint", children: hint }) : null
  ] });
}
function EmptyState({
  icon,
  title,
  subtitle,
  action
}) {
  return /* @__PURE__ */ jsxs("div", { className: "empty-state", children: [
    icon && /* @__PURE__ */ jsx("div", { className: "empty-state-icon", children: icon }),
    /* @__PURE__ */ jsx("div", { className: "empty-state-title", children: title }),
    subtitle && /* @__PURE__ */ jsx("div", { className: "empty-state-sub", children: subtitle }),
    action && /* @__PURE__ */ jsx("div", { className: "mt-4", children: action })
  ] });
}
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
function useFloatingMenu({
  open,
  onClose,
  align = "stretch",
  gap = 4
}) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!open || !triggerRef.current) {
      setRect(null);
      return;
    }
    const update = () => setRect(triggerRef.current?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => {
      const t = e.target;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  const menuStyle = rect ? computeStyle(rect, align, gap) : void 0;
  return { triggerRef, menuRef, menuStyle };
}
function computeStyle(rect, align, gap) {
  const top = rect.bottom + gap;
  switch (align) {
    case "right":
      return {
        position: "fixed",
        top,
        right: window.innerWidth - rect.right
      };
    case "left":
      return {
        position: "fixed",
        top,
        left: rect.left
      };
    case "stretch":
    default:
      return {
        position: "fixed",
        top,
        left: rect.left,
        width: rect.width
      };
  }
}
function ColumnToggle({ items, onToggle, label = "Columns", className }) {
  const [open, setOpen] = useState(false);
  const { triggerRef, menuRef, menuStyle } = useFloatingMenu({
    open,
    onClose: () => setOpen(false),
    align: "right"
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        ref: triggerRef,
        type: "button",
        className: `btn-secondary h-9 px-3.5 text-xs${className ? ` ${className}` : ""}`,
        onClick: () => setOpen((v) => !v),
        "aria-haspopup": "menu",
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-4 h-4 mr-2" }),
          label
        ]
      }
    ),
    open && menuStyle && // Rendered inline rather than portaled — `.menu` is position:fixed
    // (via menuStyle) so it floats over the page without a react-dom
    // dependency. The trigger sits in a table toolbar with no
    // transformed/clipping ancestor, so fixed positioning is enough.
    /* @__PURE__ */ jsxs("div", { ref: menuRef, className: "menu", style: menuStyle, role: "menu", children: [
      /* @__PURE__ */ jsx("div", { className: "menu-heading", children: label }),
      items.map((item) => {
        const locked = item.canHide === false;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            role: "menuitemcheckbox",
            "aria-checked": item.visible,
            className: "menu-item",
            disabled: locked,
            onClick: () => {
              if (!locked) onToggle(item.id);
            },
            children: [
              /* @__PURE__ */ jsx("span", { className: `column-toggle-check${item.visible ? " column-toggle-check--on" : ""}`, children: item.visible && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3" }) }),
              /* @__PURE__ */ jsx("span", { className: "flex-1", children: item.label })
            ]
          },
          item.id
        );
      })
    ] })
  ] });
}
function useColumnVisibility(storageKey, defaultHidden = []) {
  const fullKey = `${storageKey}-cols`;
  const [columnVisibility, setColumnVisibility] = useState(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      if (raw) return JSON.parse(raw);
    } catch {
    }
    const init = {};
    for (const id of defaultHidden) init[id] = false;
    return init;
  });
  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(columnVisibility));
    } catch {
    }
  }, [fullKey, columnVisibility]);
  return { columnVisibility, setColumnVisibility };
}

// src/brands/dnswiz.ts
var dnswizBrand = {
  name: "dnswiz",
  palette: {
    accent: "#4ade80",
    ink: "#0a0a0a"
  },
  favicon: {
    viewBox: "0 0 32 32",
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="#4ade80" stroke-width="2"/>
      <circle cx="16" cy="16" r="4" fill="#4ade80"/>
    `.trim()
  },
  mark: {
    viewBox: "0 0 16 16",
    inner: `
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="8" cy="8" r="2.5" fill="currentColor"/>
    `.trim()
  },
  wordmark: {
    viewBox: "0 0 320 96",
    inner: `
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">dnswiz</text>
      <circle cx="296" cy="68" r="12" fill="none" stroke="#4ade80" stroke-width="2.5"/>
      <circle cx="296" cy="68" r="5" fill="#4ade80"/>
    `.trim()
  }
};

// src/brands/doon.ts
var doonBrand = {
  name: "doon",
  palette: {
    accent: "#c2410c",
    ink: "#0a0a0a"
  },
  favicon: {
    viewBox: "0 0 32 32",
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <circle cx="16" cy="16" r="6" fill="#c2410c"/>
    `.trim()
  },
  mark: {
    viewBox: "0 0 16 16",
    inner: `
      <circle cx="8" cy="8" r="3.5" fill="currentColor"/>
    `.trim()
  },
  wordmark: {
    viewBox: "0 0 320 96",
    inner: `
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">doon</text>
      <circle cx="278" cy="68" r="12" fill="#c2410c"/>
    `.trim()
  }
};

// src/brands/index.ts
var brands = {
  dnswiz: dnswizBrand,
  doon: doonBrand
};
function BrandMark({
  name,
  variant = "mark",
  size = 16,
  className
}) {
  const spec = brands[name][variant];
  const [, , vbWStr, vbHStr] = spec.viewBox.split(/\s+/);
  const vbW = Number(vbWStr) || 1;
  const vbH = Number(vbHStr) || 1;
  const height = Math.round(size * vbH / vbW);
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: spec.viewBox,
      width: size,
      height,
      role: "img",
      "aria-label": name,
      className,
      dangerouslySetInnerHTML: { __html: spec.inner }
    }
  );
}

export { AppShell, BrandMark, ColumnToggle, EmptyState, Field, FieldHelp, PageHeader, SettingsCard, SettingsCards, SidebarCollapseToggle, brands, dnswizBrand, doonBrand, useColumnVisibility, useFloatingMenu, useSidebarCollapsed };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map