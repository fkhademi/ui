# Conventions

> **One rule above all others: no one-off patterns. Everything is universal.**
>
> If you find yourself writing a class, helper, endpoint, or shape that serves
> exactly one page or one caller — stop. The right move is almost always to
> extend an existing primitive (or add a new universal one), not to inline
> a snowflake. Consistency *is* the product.

This document is the binding contract for the codebase. Reviewers reject
changes that violate it.

---

## UI / CSS

- **Design tokens are the only source of color, radius, and motion.**
  Defined in `packages/client/src/styles/tokens.css`, exposed via Tailwind
  semantic colors (`bg-primary`, `text-muted-foreground`, etc.). Never use
  raw Tailwind color scales (`bg-blue-500`) or hex literals in JSX.
- **No inline styles.** `style={{...}}` is forbidden in JSX except for
  truly dynamic values that cannot be expressed via classes (e.g., a chart
  width computed from data — and even then, prefer CSS variables).
- **Component classes are named for their *shape*, not their *site of use*.**
  Good: `.list-row`, `.dashboard-card`, `.health-badge--up`.
  Bad: `.zones-page-header`, `.records-table-row-edit-mode`.
- **Layout vs. style.** Positional utilities (`flex`, `gap-4`, `w-full`) may
  appear in JSX. Visual identity (colors, radii, shadows, transitions) lives
  in the component class.
- **Variants use `--modifier` suffix.** `.btn`, `.btn-primary`, `.btn-danger`.
  Never `.btnPrimary` or `.button.primary`.
- **Dark mode** via the `.dark` class on `html`. Tokens flip; component
  classes do not.
- **Accessibility (WCAG 2.1 AA) is the baseline.** Every interactive element
  is keyboard reachable and has a visible `:focus-visible` ring.
- **i18n-ready.** Every user-facing string goes through `t()`, even pre-launch.

## API

- **OpenAPI is the source of truth.** Server stubs and TypeScript client are
  codegen'd from `packages/shared/openapi/openapi.yaml`. Never hand-write
  a handler signature that drifts from the spec.
- **Errors are RFC 7807 problem details**, always. Stable `type` URIs under
  `https://dnswiz.io/errors/<slug>`.
- **List endpoints use cursor pagination**, always. Shape: `{ items, next_cursor }`.
  Never offset/limit.
- **All mutating endpoints accept `Idempotency-Key`.** Implemented via shared
  middleware; never per-handler.
- **All responses include `X-Request-ID`.** Echo if the client provided one,
  generate otherwise.
- **Versioning** in the URL path (`/v1/...`). Deprecation policy: 12 months
  from the date deprecation is announced in the response header.

## Server (Go)

- **Tenant scope is enforced at the database** via Postgres Row-Level Security,
  not in application code. The standard request context sets `app.tenant_id`
  on the session; queries follow automatically.
- **One way to do each cross-cutting thing.** Logging, tracing, metrics, error
  emission, audit, authn, authz — single canonical helper / middleware.
  Per-handler variants are bugs.
- **Handlers stay thin.** Parse → call service → render. Business logic lives
  in service packages with reusable shapes.
- **No raw SQL outside of `internal/db` (sqlc-generated) or migrations.**
  No "just this one query" inline.
- **Errors carry context.** Wrap with `fmt.Errorf("... %w", err)`; never
  swallow.
- **OTEL on every request.** Traces, metrics, structured logs — all carry
  `tenant_id`, `user_id`, `request_id` as first-class attributes.

## Data

- **`tenant_id` is a column on every domain table.** RLS policy enforces
  isolation. No exceptions for "internal" tables that touch tenant data.
- **Timestamps are `timestamptz`** with `created_at` and `updated_at`
  defaulted. `updated_at` maintained by trigger.
- **Soft delete via `deleted_at timestamptz`** where reversibility matters.
  Hard delete only where compliance requires it; documented per-table.
- **Migrations are forward-only.** Expand-then-contract for schema changes.
  No `down` migrations.

## Configuration

- **Env vars are reserved for bootstrap-essentials** that cannot live in the
  database: `DNSWIZ_DATABASE_URL`, `DNSWIZ_MASTER_KEY`, optionally
  `DNSWIZ_HTTP_ADDR`. Adding a fourth is a discussion, not a default.
- **Everything else lives in `system_settings` or `tenant_settings`** and is
  edited in the admin UI. SSO, SMTP, OTEL endpoints, webhook URLs, billing
  keys, feature flags, branding — all of it.
- **Secrets in settings are encrypted at rest** with `DNSWIZ_MASTER_KEY`,
  never returned verbatim by the API (return masked previews).

## Audit

- **Every state-changing action emits an audit row** via a single shared
  helper, with before/after JSON. No "I'll add the audit later" — the
  helper is mandatory at the service boundary.

## PLG

- **Every feature has a defined free-tier behavior.** No feature ships
  "Business+ only" without an explicit, documented decision. Default is
  "available on free tier with sensible quota."
- **Every meaningful product event goes through `analytics.Track()`.**
  Signup, login, zone created, record created, quota hit, upgrade clicked,
  activation. Funnel coverage is mandatory, not nice-to-have.
- **No "Contact Sales" walls below Enterprise.** Every quota a free or pro
  user can hit shows an in-product upgrade flow, never a form. The only
  place "Talk to us" is acceptable is the Enterprise plan card.
- **Magic link is the canonical auth path.** OAuth providers and passwords
  are tier-2 additions, not the primary flow. SSO is an Enterprise-tier
  add-on that callbacks into the same session creation code.

## One product, multiple plans

- **"Enterprise" is a row in the `plans` table**, not a separate codebase,
  build flag, or directory. Same UI, same database, same code path. Feature
  gates are columns on `plans`.
- **Same signup flow for all plans.** Enterprise prospects self-serve too;
  the Enterprise plan card has a "Talk to us" CTA — that is the only
  difference in the funnel.
- See `docs/product.md` for the seams left open for future enterprise
  features (SSO callback, audit export, BYOK).

## Restraint (the other half of "universal")

- **The minimum reusable primitive only.** Universal does not mean
  elaborate. No event buses, plugin systems, strategy patterns, or
  configuration frameworks introduced before they have a second caller.
- **Boring managed services beat bespoke infra.** Stripe Customer Portal
  > our own billing UI. Resend/SES > our own SMTP retry queue. Postgres >
  Redis until Postgres actually hurts.
- **Don't pre-build for scale you don't have.** Single counter table beats
  raw events + rollups until the single table actually hurts at a million
  tenants. Then split it.
- **Don't add config knobs "in case."** Hardcode the first value; the
  second value's first appearance is the right moment to extract.

## Process

- **A new feature does not introduce a new pattern unless it has to.** First
  question in review: "could this fit the existing primitives?"
- **If you must add a primitive, design it for the next three callers**, not
  just the one you have today.
- **Deletes are first-class refactors.** Removing a one-off in favor of the
  universal pattern is always welcome.
