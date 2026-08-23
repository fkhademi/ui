import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // happy-dom rather than jsdom: jsdom's CommonJS entry requires an ESM-only
    // CSS package, and the worker dies before any test runs.
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.tsx'],
    globals: true,
  },
});
