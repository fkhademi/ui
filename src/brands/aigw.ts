import type { BrandSpec } from './types';

/**
 * aigw brand: a dot inside a ring, in doon-family accent orange. Sibling
 * to the dnswiz mark (same dot-in-ring shape, blue) and the doon.io parent
 * (the bare dot). The ring reads as the governed perimeter every call
 * resolves through; the dot is the doon-family anchor. Ink is the standard
 * near-black surface used across the family.
 */
export const aigwBrand: BrandSpec = {
  name: 'aigw',
  palette: {
    accent: '#c2410c',
    ink: '#0a0a0a',
  },
  favicon: {
    viewBox: '0 0 32 32',
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <circle cx="16" cy="16" r="10.5" fill="none" stroke="#c2410c" stroke-width="2"/>
      <circle cx="16" cy="16" r="4" fill="#c2410c"/>
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
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">aigw</text>
      <circle cx="258" cy="68" r="12" fill="none" stroke="#c2410c" stroke-width="2.5"/>
      <circle cx="258" cy="68" r="5" fill="#c2410c"/>
    `.trim(),
  },
};
