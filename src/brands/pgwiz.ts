import type { BrandSpec } from './types';

/**
 * pgwiz brand: a ring that does not close, with a dot at the returning tip.
 *
 * Sister to dnswiz, whose ring is closed - the authoritative answer everyone
 * resolves to. pgwiz's argument is recurrence rather than authority, so the
 * path leaves and comes back round toward the dot at the centre. At 16px the
 * difference that reads between the two is closed versus returning.
 *
 * Emerald rather than a second blue: two blue siblings are indistinguishable
 * in a tab bar. Geometry is on the family grid - 32 for the favicon, 16 for
 * the mark, centre at the midpoint, a 60 degree gap at the top, and stroke
 * weights matching dnswiz so they sit together at small sizes.
 */
export const pgwizBrand: BrandSpec = {
  name: 'pgwiz',
  palette: {
    accent: '#10b981',
    ink: '#0a0a0a',
  },
  favicon: {
    viewBox: '0 0 32 32',
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <path d="M21 7.34 A 10 10 0 1 1 11 7.34" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
      <circle cx="21" cy="7.34" r="2.5" fill="#10b981"/>
      <circle cx="16" cy="16" r="4" fill="#10b981"/>
    `.trim(),
  },
  mark: {
    viewBox: '0 0 16 16',
    inner: `
      <path d="M10.5 3.67 A 5 5 0 1 1 5.5 3.67" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="10.5" cy="3.67" r="1.5" fill="currentColor"/>
      <circle cx="8" cy="8" r="2.5" fill="currentColor"/>
    `.trim(),
  },
  wordmark: {
    viewBox: '0 0 320 96',
    inner: `
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">pgwiz</text>
      <path d="M302 58.4 A 12 12 0 1 1 290 58.4" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="302" cy="58.4" r="3.5" fill="#10b981"/>
      <circle cx="296" cy="68" r="5" fill="#10b981"/>
    `.trim(),
  },
};
