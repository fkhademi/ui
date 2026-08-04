import type { BrandSpec } from './types';

/**
 * aigw brand: a gateway hub, a dot-in-ring gate with nodes routing through it,
 * in indigo. It reads as "many callers in, many models, tools, and agents out,
 * through one governed gate". The mark is the diagonal hub; the favicon is a
 * simpler cross variant on a dark tile that stays crisp at favicon size.
 * Distinct from the dnswiz blue dot-in-ring, still part of the doon family.
 */
export const aigwBrand: BrandSpec = {
  name: 'aigw',
  palette: {
    accent: '#4f46e5',
    ink: '#0a0a0a',
  },
  favicon: {
    viewBox: '0 0 32 32',
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <path d="M9.4 9.4 L12.7 12.7 M22.6 9.4 L19.3 12.7 M9.4 22.6 L12.7 19.3 M22.6 22.6 L19.3 19.3" fill="none" stroke="#818cf8" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="8" cy="8" r="2" fill="#818cf8"/>
      <circle cx="24" cy="8" r="2" fill="#818cf8"/>
      <circle cx="8" cy="24" r="2" fill="#818cf8"/>
      <circle cx="24" cy="24" r="2" fill="#818cf8"/>
      <circle cx="16" cy="16" r="5" fill="none" stroke="#818cf8" stroke-width="2"/>
      <circle cx="16" cy="16" r="2" fill="#818cf8"/>
    `.trim(),
  },
  mark: {
    viewBox: '0 0 32 32',
    inner: `
      <path d="M8.6 8.6 L12.3 12.3 M23.4 8.6 L19.7 12.3 M8.6 23.4 L12.3 19.7 M23.4 23.4 L19.7 19.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      <circle cx="7" cy="7" r="2" fill="currentColor"/>
      <circle cx="25" cy="7" r="2" fill="currentColor"/>
      <circle cx="7" cy="25" r="2" fill="currentColor"/>
      <circle cx="25" cy="25" r="2" fill="currentColor"/>
      <circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="16" cy="16" r="2" fill="currentColor"/>
    `.trim(),
  },
  wordmark: {
    viewBox: '0 0 320 96',
    inner: `
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">aigw</text>
      <circle cx="258" cy="68" r="10" fill="none" stroke="#4f46e5" stroke-width="2.5"/>
      <circle cx="258" cy="68" r="4" fill="#4f46e5"/>
      <circle cx="258" cy="53" r="2.6" fill="#4f46e5"/>
      <circle cx="258" cy="83" r="2.6" fill="#4f46e5"/>
      <circle cx="243" cy="68" r="2.6" fill="#4f46e5"/>
      <circle cx="273" cy="68" r="2.6" fill="#4f46e5"/>
    `.trim(),
  },
};
