import type { BrandSpec } from './types';

/**
 * dnswiz brand: a lowercase d followed by the root dot that ends every
 * fully qualified name. The dot is the doon anchor, in dnswiz blue.
 */
export const dnswizBrand: BrandSpec = {
  name: 'dnswiz',
  palette: {
    accent: '#3b82f6',
    ink: '#0a0a0a',
  },
  favicon: {
    viewBox: '0 0 32 32',
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <circle cx="13.25" cy="18.06" r="4.13" fill="none" stroke="#fafafa" stroke-width="2.5"/>
      <path d="M17.38 8.78V22.19" fill="none" stroke="#fafafa" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="22.33" cy="20.95" r="2.06" fill="#3b82f6"/>
    `.trim(),
  },
  mark: {
    viewBox: '0 0 32 32',
    inner: `
      <circle cx="12" cy="19" r="6" fill="none" stroke="currentColor" stroke-width="3.6"/>
      <path d="M18 5.5V25" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round"/>
      <circle cx="25.2" cy="23.2" r="3" fill="#3b82f6"/>
    `.trim(),
  },
  wordmark: {
    viewBox: '0 0 336 96',
    inner: `
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">dnswiz<tspan fill="#3b82f6">.</tspan></text>
    `.trim(),
  },
};
