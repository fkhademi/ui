import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';

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

export { EmptyState, Field, FieldHelp, PageHeader, SettingsCard, SettingsCards };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map