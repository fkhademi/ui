import type { BrandSpec } from './types';

/**
 * dnswiz brand: dot inside a ring (the authoritative answer everyone
 * resolves to). Sister to the doon.io mark which is the bare dot.
 * Accent is dnswiz green (Tailwind green-400); ink is the standard
 * near-black surface used across the doon family.
 */
export const dnswizBrand: BrandSpec = {
  name: 'dnswiz',
  palette: {
    accent: '#4ade80',
    ink: '#0a0a0a',
  },
  favicon: {
    viewBox: '0 0 32 32',
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="#4ade80" stroke-width="2"/>
      <circle cx="16" cy="16" r="4" fill="#4ade80"/>
    `.trim(),
  },
  mark: {
    viewBox: '0 0 16 16',
    inner: `
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="8" cy="8" r="2.5" fill="currentColor"/>
    `.trim(),
  },
  wordmark: {
    viewBox: '0 0 320 96',
    inner: `
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">dnswiz</text>
      <circle cx="296" cy="68" r="12" fill="none" stroke="#4ade80" stroke-width="2.5"/>
      <circle cx="296" cy="68" r="5" fill="#4ade80"/>
    `.trim(),
  },
};
