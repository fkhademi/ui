import { defineConfig } from 'tsup';

/**
 * Build the React component layer to `dist/`. The CSS files in `src/`
 * are NOT bundled — they're shipped as-is via the package.json
 * `exports` field so PostCSS/Tailwind in the consuming app can process
 * them in context (Tailwind needs to see @apply against the consumer's
 * own theme).
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'lucide-react'],
});
