import { useId, useRef, useState, useCallback, useEffect, isValidElement, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { ChevronLeft } from 'lucide-react';

// src/components/Tooltip.tsx
var OPEN_DELAY_MS = 350;
function Tooltip({
  content,
  children,
  disabled,
  whenTruncated
}) {
  const id = useId();
  const triggerRef = useRef(null);
  const timer = useRef(null);
  const [style, setStyle] = useState(null);
  const close = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setStyle(null);
  }, []);
  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 8;
    const above = r.top > 64;
    setStyle({
      position: "fixed",
      top: above ? r.top - margin : r.bottom + margin,
      left: Math.min(Math.max(r.left + r.width / 2, 80), window.innerWidth - 80),
      transform: `translate(-50%, ${above ? "-100%" : "0"})`,
      zIndex: 60
    });
  }, []);
  const open = useCallback(
    (immediate) => {
      if (disabled || !content) return;
      if (whenTruncated) {
        const el = triggerRef.current;
        if (!el || el.scrollWidth <= el.clientWidth) return;
      }
      if (timer.current) clearTimeout(timer.current);
      if (immediate) place();
      else timer.current = setTimeout(place, OPEN_DELAY_MS);
    },
    [content, disabled, whenTruncated, place]
  );
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    if (!style) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [style, close]);
  if (!isValidElement(children)) return children;
  const trigger = cloneElement(children, {
    ref: (node) => {
      triggerRef.current = node;
      const own = children.ref;
      if (typeof own === "function") own(node);
      else if (own && typeof own === "object") own.current = node;
    },
    "aria-describedby": style ? id : void 0,
    onMouseEnter: (e) => {
      open(false);
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e) => {
      close();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e) => {
      open(true);
      children.props.onFocus?.(e);
    },
    onBlur: (e) => {
      close();
      children.props.onBlur?.(e);
    }
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    trigger,
    style && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          id,
          role: "tooltip",
          style,
          className: "pointer-events-none max-w-xs rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground shadow-lg",
          children: content
        }
      ),
      document.body
    )
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
  return /* @__PURE__ */ jsx(Tooltip, { content: collapsed ? "Expand sidebar" : "Collapse sidebar", children: /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      className: "app-sidebar-collapse",
      onClick: onToggle,
      "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
      children: /* @__PURE__ */ jsx(ChevronLeft, { size: 14, className: "app-sidebar-collapse-icon" })
    }
  ) });
}

export { SidebarCollapseToggle, Tooltip, useSidebarCollapsed };
//# sourceMappingURL=chunk-TH76AULU.js.map
//# sourceMappingURL=chunk-TH76AULU.js.map