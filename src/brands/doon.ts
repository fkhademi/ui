import type { BrandSpec } from './types';

/**
 * doon.io brand: a single accent-orange dot. The parent brand of the
 * doon-family products; dnswiz / pgwiz / pwwiz marks extend this with
 * their own shapes around the same dot anchor.
 */
export const doonBrand: BrandSpec = {
  name: 'doon',
  palette: {
    accent: '#c2410c',
    ink: '#0a0a0a',
  },
  favicon: {
    viewBox: '0 0 32 32',
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <circle cx="16" cy="16" r="6" fill="#c2410c"/>
    `.trim(),
  },
  mark: {
    viewBox: '0 0 16 16',
    inner: `
      <circle cx="8" cy="8" r="3.5" fill="currentColor"/>
    `.trim(),
  },
  wordmark: {
    viewBox: '0 0 320 96',
    inner: `
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">doon</text>
      <circle cx="278" cy="68" r="12" fill="#c2410c"/>
    `.trim(),
  },
};
