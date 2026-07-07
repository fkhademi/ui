import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { HelpCircle, ChevronDown, Check, ChevronLeft, LogOut, SlidersHorizontal, Search, ChevronUp, X, Pencil, PowerOff, Power, Trash2 } from 'lucide-react';
import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
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
  const [menuH, setMenuH] = useState(0);
  useLayoutEffect(() => {
    setMenuH(open && menuRef.current ? menuRef.current.offsetHeight : 0);
  }, [open, rect]);
  const menuStyle = rect ? computeStyle(rect, align, gap, menuH) : void 0;
  return { triggerRef, menuRef, menuStyle };
}
function computeStyle(rect, align, gap, menuH) {
  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  const openUp = menuH > 0 && menuH > spaceBelow && spaceAbove > spaceBelow;
  const vertical = openUp ? { bottom: window.innerHeight - rect.top + gap, maxHeight: Math.max(0, spaceAbove) } : { top: rect.bottom + gap, maxHeight: Math.max(0, spaceBelow) };
  const horizontal = align === "right" ? { right: window.innerWidth - rect.right } : align === "left" ? { left: rect.left } : { left: rect.left, width: rect.width };
  return { position: "fixed", overflowY: "auto", ...vertical, ...horizontal };
}
function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  size = "md",
  block = false,
  disabled = false,
  className = ""
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const { triggerRef, menuRef, menuStyle } = useFloatingMenu({
    open,
    onClose: () => setOpen(false),
    align: "stretch"
  });
  const selected = options.find((o) => o.value === value);
  useEffect(() => {
    if (open) setActive(Math.max(0, options.findIndex((o) => o.value === value)));
  }, [open]);
  function onKeyDown(e) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = options[active];
      if (o) {
        onChange(o.value);
        setOpen(false);
      }
    }
  }
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-2 text-sm";
  return /* @__PURE__ */ jsxs("div", { className: `${block ? "block" : "inline-block"} ${className}`, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        ref: triggerRef,
        type: "button",
        disabled,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        onClick: () => setOpen((o) => !o),
        onKeyDown,
        className: `flex ${block ? "w-full" : ""} items-center justify-between gap-2 rounded-lg border border-border bg-surface text-foreground transition hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 ${pad}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: `truncate ${selected ? "" : "text-muted-foreground"}`, children: selected ? selected.label : placeholder }),
          /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: "shrink-0 text-muted-foreground" })
        ]
      }
    ),
    open && menuStyle && /* @__PURE__ */ jsx(
      "div",
      {
        ref: menuRef,
        role: "listbox",
        style: menuStyle,
        className: "z-50 min-w-[8rem] overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-lg",
        children: options.map((o, i) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": o.value === value,
            onMouseEnter: () => setActive(i),
            onClick: () => {
              onChange(o.value);
              setOpen(false);
            },
            className: `flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm ${i === active ? "bg-accent" : ""} ${o.value === value ? "text-foreground" : "text-muted-foreground"}`,
            children: [
              /* @__PURE__ */ jsx(Check, { size: 14, className: o.value === value ? "text-primary" : "opacity-0" }),
              /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: o.label })
            ]
          },
          o.value
        ))
      }
    )
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
    accent: "#3b82f6",
    ink: "#0a0a0a"
  },
  favicon: {
    viewBox: "0 0 32 32",
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <circle cx="16" cy="16" r="4" fill="#3b82f6"/>
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
      <circle cx="296" cy="68" r="12" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
      <circle cx="296" cy="68" r="5" fill="#3b82f6"/>
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
function DataTable(p) {
  const {
    columns,
    // Destructure-default only applies for undefined, not null. The
    // server now coerces empty pages to [], but stay defensive so an
    // older API or a bad fetch doesn't blow up the table.
    rows: rawRows,
    getRowId,
    isLoading,
    error,
    searchKeys,
    searchableKeys,
    defaultSort = null,
    defaultPageSize = 25,
    pageSizes = [10, 25, 50, 100],
    selectedIds,
    onSelectionChange,
    onRowActivate,
    onRowClick,
    onRowContext,
    onSelectionDelete,
    emptyState,
    extraActions,
    serverPagination
  } = p;
  const rows = rawRows ?? [];
  const sp = serverPagination;
  const server = !!sp;
  const searchCols = searchKeys ?? searchableKeys ?? [];
  const selected = selectedIds ?? /* @__PURE__ */ new Set();
  const [sort, setSort] = useState(defaultSort);
  const [search, setSearch] = useState(sp?.search ?? "");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(0);
  const tableRef = useRef(null);
  const serverSort = !!sp?.onSortChange;
  const serverSearch = !!sp?.onSearchChange;
  const effSort = serverSort ? sp.sort ?? null : sort;
  const onSearchRef = useRef(sp?.onSearchChange);
  onSearchRef.current = sp?.onSearchChange;
  const spSearchRef = useRef(sp?.search);
  spSearchRef.current = sp?.search;
  useEffect(() => {
    if (serverSearch) setSearch(sp?.search ?? "");
  }, [sp?.search, serverSearch]);
  useEffect(() => {
    if (!serverSearch) return;
    const t = setTimeout(() => {
      if (search !== (spSearchRef.current ?? "")) onSearchRef.current?.(search);
    }, 300);
    return () => clearTimeout(t);
  }, [search, serverSearch]);
  useEffect(() => {
    if (!server) setPage(0);
  }, [search, pageSize, rows, server]);
  const filtered = useMemo(() => {
    if (serverSearch) return rows;
    if (!search.trim() || searchCols.length === 0) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) => searchCols.some((k) => {
        const col = columns.find((c) => c.key === k);
        let v;
        if (col?.searchValue) v = col.searchValue(r);
        else v = r[k];
        return v != null && String(v).toLowerCase().includes(q);
      })
    );
  }, [rows, search, searchCols, columns, serverSearch]);
  const sorted = useMemo(() => {
    if (serverSort) return filtered;
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const getter = col.sortValue ?? ((r) => r[col.key]);
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = getter(a) ?? "";
      const bv = getter(b) ?? "";
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sort, columns, serverSort]);
  const effPageSize = server ? sp.pageSize : pageSize;
  const totalRows = server ? sp.total : sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / effPageSize));
  const safePage = server ? sp.page : Math.min(page, totalPages - 1);
  const paged = server ? sorted : sorted.slice(safePage * effPageSize, safePage * effPageSize + effPageSize);
  const goToPage = (p2) => server ? sp.onPageChange(Math.max(0, Math.min(p2, totalPages - 1))) : setPage(p2);
  const changePageSize = (n) => server ? sp.onPageSizeChange?.(n) : setPageSize(n);
  const showSizeSelect = !server || !!sp.onPageSizeChange;
  const showingFrom = totalRows === 0 ? 0 : safePage * effPageSize + 1;
  const showingTo = Math.min(totalRows, (safePage + 1) * effPageSize);
  function toggleSort(key) {
    if (serverSort) {
      const cur = sp.sort;
      const dir = cur && cur.key === key && cur.dir === "desc" ? "asc" : "desc";
      sp.onSortChange(key, dir);
      return;
    }
    setSort(
      (s) => !s || s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null
    );
  }
  const [anchorIdx, setAnchorIdx] = useState(null);
  function commit(next) {
    onSelectionChange?.(next);
  }
  function selectOnly(id, idx) {
    commit(/* @__PURE__ */ new Set([id]));
    setAnchorIdx(idx);
  }
  function toggleOne(id, idx) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    commit(next);
    setAnchorIdx(idx);
  }
  function selectRange(toIdx) {
    const from = anchorIdx ?? toIdx;
    const [lo, hi] = from < toIdx ? [from, toIdx] : [toIdx, from];
    const next = /* @__PURE__ */ new Set();
    for (let i = lo; i <= hi; i++) next.add(getRowId(sorted[i]));
    commit(next);
  }
  function clearSelection() {
    if (selected.size === 0) return;
    commit(/* @__PURE__ */ new Set());
  }
  function onRowMouseDown(row, idx, e) {
    const id = getRowId(row);
    if (e.button === 2) return;
    if (e.detail >= 2) e.preventDefault();
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      toggleOne(id, idx);
      return;
    }
    if (e.shiftKey) {
      e.preventDefault();
      selectRange(idx);
      return;
    }
    if (onRowClick) {
      onRowClick(row);
      return;
    }
    if (selected.size === 1 && selected.has(id)) {
      clearSelection();
    } else {
      selectOnly(id, idx);
    }
  }
  function onRowDoubleClick(row) {
    onRowActivate?.(row);
  }
  function onSurfaceClick(e) {
    const target = e.target;
    if (target.closest("tr.dt-tr")) return;
    if (target.closest(".dt-toolbar")) return;
    if (target.closest(".dt-pagination")) return;
    clearSelection();
  }
  function onKey(e) {
    if (sorted.length === 0) return;
    const lastSelectedId = [...selected].pop();
    const currentIdx = lastSelectedId ? sorted.findIndex((r) => getRowId(r) === lastSelectedId) : -1;
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = Math.min(sorted.length - 1, currentIdx < 0 ? 0 : currentIdx + 1);
        selectOnly(getRowId(sorted[next]), next);
        scrollRowIntoView(next);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const next = Math.max(0, currentIdx < 0 ? 0 : currentIdx - 1);
        selectOnly(getRowId(sorted[next]), next);
        scrollRowIntoView(next);
        break;
      }
      case "Enter": {
        if (selected.size === 1 && onRowActivate && currentIdx >= 0) {
          e.preventDefault();
          onRowActivate(sorted[currentIdx]);
        }
        break;
      }
      case "Delete":
      case "Backspace": {
        if (selected.size > 0 && onSelectionDelete) {
          e.preventDefault();
          onSelectionDelete();
        }
        break;
      }
      case "Escape": {
        clearSelection();
        break;
      }
      case "a":
      case "A": {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          const next = /* @__PURE__ */ new Set();
          sorted.forEach((r) => next.add(getRowId(r)));
          commit(next);
        }
        break;
      }
    }
  }
  function scrollRowIntoView(sortedIdx) {
    if (!server) {
      const targetPage = Math.floor(sortedIdx / effPageSize);
      if (targetPage !== safePage) setPage(targetPage);
    }
    requestAnimationFrame(() => {
      const el = tableRef.current?.querySelector(
        `tr.dt-tr[data-row-idx="${sortedIdx % effPageSize}"]`
      );
      el?.scrollIntoView({ block: "nearest" });
    });
  }
  const isEmpty = !isLoading && !error && rows.length === 0;
  const isFilteredEmpty = !isEmpty && !isLoading && !error && sorted.length === 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: tableRef,
      className: "data-table",
      tabIndex: 0,
      onKeyDown: onKey,
      onClick: onSurfaceClick,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "dt-toolbar", children: [
          (searchCols.length > 0 || serverSearch) && /* @__PURE__ */ jsxs("div", { className: "dt-search-wrap", children: [
            /* @__PURE__ */ jsx(Search, { size: 14, className: "dt-search-icon" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "search",
                placeholder: "Search\u2026",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "dt-search",
                autoComplete: "off"
              }
            )
          ] }),
          !sp && /* @__PURE__ */ jsxs("div", { className: "dt-count", children: [
            isLoading ? "loading\u2026" : `${sorted.length} ${sorted.length === 1 ? "row" : "rows"}`,
            search && rows.length !== sorted.length && /* @__PURE__ */ jsxs(Fragment, { children: [
              " \xB7 filtered from ",
              rows.length
            ] })
          ] }),
          extraActions && /* @__PURE__ */ jsx("div", { className: "ml-auto", children: extraActions })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "dt-card", children: /* @__PURE__ */ jsxs("table", { className: "dt-table", children: [
          /* @__PURE__ */ jsx("thead", { className: "dt-thead", children: /* @__PURE__ */ jsx("tr", { children: columns.map((c) => {
            const isSorted = effSort?.key === c.key;
            return /* @__PURE__ */ jsx(
              "th",
              {
                onClick: c.sortable ? () => toggleSort(c.key) : void 0,
                style: c.width ? { width: c.width } : void 0,
                className: `dt-th${c.align === "right" ? " dt-th--right" : ""}` + (c.sortable ? " dt-th--sortable" : "") + (isSorted ? " dt-th--sorted" : ""),
                children: /* @__PURE__ */ jsxs("span", { className: "dt-th-inner", children: [
                  c.label,
                  isSorted && effSort && (effSort.dir === "asc" ? /* @__PURE__ */ jsx(ChevronUp, { size: 11 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 11 }))
                ] })
              },
              c.key
            );
          }) }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            isLoading && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "dt-empty", children: "Loading\u2026" }) }),
            error && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "dt-empty text-destructive", children: error.message }) }),
            isEmpty && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, children: emptyState ?? /* @__PURE__ */ jsx("div", { className: "dt-empty", children: "No rows." }) }) }),
            isFilteredEmpty && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, children: /* @__PURE__ */ jsxs("div", { className: "dt-empty", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                'No matches for "',
                search,
                '".'
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "btn-ghost mt-2",
                  onClick: () => setSearch(""),
                  children: [
                    /* @__PURE__ */ jsx(X, { size: 12 }),
                    "Clear search"
                  ]
                }
              )
            ] }) }) }),
            !isLoading && !error && paged.map((row, idx) => {
              const id = getRowId(row);
              const isSelected = selected.has(id);
              const sortedIdx = safePage * effPageSize + idx;
              return /* @__PURE__ */ jsx(
                "tr",
                {
                  "data-row-idx": idx,
                  className: "dt-tr" + (onRowActivate || onRowClick ? " dt-tr--clickable" : "") + (isSelected ? " dt-tr--selected" : ""),
                  onMouseDown: (e) => onRowMouseDown(row, sortedIdx, e),
                  onDoubleClick: () => onRowDoubleClick(row),
                  onContextMenu: onRowContext ? (e) => {
                    e.preventDefault();
                    if (!selected.has(id)) selectOnly(id, sortedIdx);
                    onRowContext(row, e.clientX, e.clientY);
                  } : void 0,
                  children: columns.map((c) => {
                    const content = c.render ? c.render(row) : String(row[c.key] ?? "");
                    if (c.truncate) {
                      const fullText = c.searchValue ? c.searchValue(row) ?? "" : String(row[c.key] ?? "");
                      return /* @__PURE__ */ jsx(
                        "td",
                        {
                          style: c.width ? { width: c.width } : void 0,
                          className: `dt-td dt-td--truncate${c.align === "right" ? " dt-td--right" : ""}` + (c.className ? ` ${c.className}` : ""),
                          children: /* @__PURE__ */ jsx("span", { className: "dt-cell-truncate", title: fullText || void 0, children: content })
                        },
                        c.key
                      );
                    }
                    return /* @__PURE__ */ jsx(
                      "td",
                      {
                        style: c.width ? { width: c.width } : void 0,
                        className: `dt-td${c.align === "right" ? " dt-td--right" : ""}` + (c.className ? ` ${c.className}` : ""),
                        children: content
                      },
                      c.key
                    );
                  })
                },
                id
              );
            })
          ] })
        ] }) }),
        totalRows > 0 && /* @__PURE__ */ jsxs("div", { className: "dt-pagination", children: [
          /* @__PURE__ */ jsxs("span", { className: "dt-page-info", children: [
            showingFrom,
            "\u2013",
            showingTo,
            " of ",
            totalRows
          ] }),
          showSizeSelect && /* @__PURE__ */ jsx(
            "select",
            {
              className: "dt-page-size",
              value: effPageSize,
              onChange: (e) => changePageSize(parseInt(e.target.value, 10)),
              "aria-label": "Rows per page",
              children: pageSizes.map((n) => /* @__PURE__ */ jsxs("option", { value: n, children: [
                n,
                " / page"
              ] }, n))
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "dt-page-buttons", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "dt-page-btn",
                onClick: () => goToPage(safePage - 1),
                disabled: safePage === 0,
                "aria-label": "Previous page",
                children: "\u2039"
              }
            ),
            pageButtons(safePage, totalPages).map(
              (p2, i) => p2 === "\u2026" ? /* @__PURE__ */ jsx("span", { className: "dt-page-btn", "aria-hidden": true, children: "\u2026" }, `gap-${i}`) : /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: `dt-page-btn ${p2 === safePage ? "dt-page-btn--active" : ""}`,
                  onClick: () => goToPage(p2),
                  children: p2 + 1
                },
                p2
              )
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "dt-page-btn",
                onClick: () => goToPage(safePage + 1),
                disabled: safePage >= totalPages - 1,
                "aria-label": "Next page",
                children: "\u203A"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function pageButtons(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const out = [0];
  if (current > 2) out.push("\u2026");
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) out.push(i);
  if (current < total - 3) out.push("\u2026");
  out.push(total - 1);
  return out;
}
function SelectionToolbar(props) {
  if (props.count === 0) return null;
  const canEdit = props.count === 1 && !!props.onEdit;
  const showDisable = props.onDisable && props.anyActive === true;
  const showEnable = props.onEnable && props.anyActive === false;
  return /* @__PURE__ */ jsxs("div", { className: "selection-toolbar", role: "toolbar", "aria-label": "Selection", children: [
    /* @__PURE__ */ jsxs("span", { className: "selection-count", children: [
      props.count,
      " selected"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "selection-actions", children: [
      canEdit && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "toolbar-btn",
          onClick: props.onEdit,
          "aria-label": "Edit selected",
          children: [
            /* @__PURE__ */ jsx(Pencil, { size: 14 }),
            "Edit"
          ]
        }
      ),
      showDisable && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "toolbar-btn",
          onClick: props.onDisable,
          "aria-label": "Disable selected",
          children: [
            /* @__PURE__ */ jsx(PowerOff, { size: 14 }),
            "Disable"
          ]
        }
      ),
      showEnable && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "toolbar-btn",
          onClick: props.onEnable,
          "aria-label": "Enable selected",
          children: [
            /* @__PURE__ */ jsx(Power, { size: 14 }),
            "Enable"
          ]
        }
      ),
      props.extra,
      props.onDelete && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "toolbar-btn toolbar-btn--danger",
          onClick: props.onDelete,
          "aria-label": "Delete selected",
          children: [
            /* @__PURE__ */ jsx(Trash2, { size: 14 }),
            "Delete"
          ]
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "selection-sep" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "toolbar-btn",
          onClick: props.onClear,
          "aria-label": "Clear selection",
          children: /* @__PURE__ */ jsx(X, { size: 14 })
        }
      )
    ] })
  ] });
}
function ContextMenu(props) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const overflowX = rect.right - window.innerWidth;
    const overflowY = rect.bottom - window.innerHeight;
    if (overflowX > 0) el.style.left = `${props.x - overflowX - 4}px`;
    if (overflowY > 0) el.style.top = `${props.y - overflowY - 4}px`;
  }, [props.x, props.y]);
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") props.onClose();
    }
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) props.onClose();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [props]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: "menu",
      style: { left: props.x, top: props.y },
      role: "menu",
      onContextMenu: (e) => e.preventDefault(),
      children: props.items.map(
        (it, i) => it.kind === "sep" ? /* @__PURE__ */ jsx("div", { className: "menu-sep", role: "separator" }, i) : /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: `menu-item ${it.danger ? "menu-item--danger" : ""}`,
            disabled: it.disabled,
            onClick: () => {
              it.onClick();
              props.onClose();
            },
            children: [
              it.icon,
              it.label,
              it.shortcut && /* @__PURE__ */ jsx("kbd", { children: it.shortcut })
            ]
          },
          i
        )
      )
    }
  );
}

export { AppShell, BrandMark, ColumnToggle, ContextMenu, DataTable, EmptyState, Field, FieldHelp, PageHeader, Select, SelectionToolbar, SettingsCard, SettingsCards, SidebarCollapseToggle, brands, dnswizBrand, doonBrand, useColumnVisibility, useFloatingMenu, useSidebarCollapsed };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map