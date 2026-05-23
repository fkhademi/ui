# @doon/ui

Shared design tokens, base styles, semantic component classes, and Tailwind preset for the doon side projects. Public so it's frictionless to consume, but the intended audience is my own apps, not the world at large.

## What's in it

- **Tokens** (`src/tokens.css`) — light/dark CSS variables for color, radius, motion. Single source of truth.
- **Base** (`src/base.css`) — body, focus rings, scrollbar resets.
- **Components** (`src/components.css`) — semantic classes (`.btn`, `.field`, `.card`, `.app-shell`, `.page-header`, …). Named for their *shape*, not their site of use.
- **Utilities** (`src/utilities.css`) — small generic utilities (tabular-nums, safe-area padding, etc.).
- **Tailwind preset** (`tailwind.preset.js`) — semantic color names, shadows, motion. Drop into a consuming app's `tailwind.config.js` via `presets: [...]`.

## Install

```bash
npm install @doon/ui
```

## Use it

```js
// tailwind.config.js
import preset from '@doon/ui/tailwind.preset.js';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
};
```

```ts
// main.tsx (in this order — base first, app overrides after)
import '@doon/ui';
import './styles/app-tokens.css';   // app-specific token overrides
```

Each consuming app overrides only the tokens it cares to differ on. The simplest case is a single `--primary` HSL value:

```css
/* my-app/src/styles/app-tokens.css */
:root      { --primary: 217 91% 60%; }     /* indigo */
.dark      { --primary: 217 91% 65%; }
```

Everything else (radii, neutrals, focus rings, shadows, motion) inherits from this package.

## Conventions

The binding rules are in [`docs/conventions.md`](docs/conventions.md). Read them before adding anything. The two that matter most:

1. **No one-off patterns.** Every primitive is universal and reusable. Snowflakes are bugs.
2. **The minimum reusable primitive only.** Universal does not mean elaborate.

## Versioning

Semver, strictly:

- **patch** — CSS-only tweak, no class renames or removals.
- **minor** — new tokens, new classes, new utilities. Additive.
- **major** — renames, removals, breaking token shape.

Consuming apps pin to a tag. Bumps are opt-in per app.
