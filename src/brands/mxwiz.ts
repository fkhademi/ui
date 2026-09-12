import type { BrandSpec } from './types';

/**
 * mxwiz brand: routes converging on the doon dot — many domains, one
 * mailbox, which is the whole argument of the product.
 *
 * The siblings each say something different with the same anchor. dnswiz
 * closes a ring around it (authority: the answer everyone resolves to);
 * pgwiz leaves the ring open (recurrence); aigw surrounds it symmetrically
 * (mediation: many in, many out). mxwiz is deliberately asymmetric — three
 * routes in, one destination — because that asymmetry is the difference
 * between a gateway and a mailbox.
 *
 * No envelope, on purpose. Every mail product has one, so it identifies the
 * category and not the product; and an outlined envelope with a fold is a
 * grey smudge at 16px, which is where this mark spends most of its life. The
 * convergence survives that size because it is three strokes and a disc.
 *
 * Accent is iris, the same hue the product sets as --primary, so the mark
 * and the interface it sits in are one colour.
 */
export const mxwizBrand: BrandSpec = {
  name: 'mxwiz',
  palette: {
    accent: '#6949ca',
    ink: '#0a0a0a',
  },
  favicon: {
    viewBox: '0 0 32 32',
    inner: `
      <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
      <path d="M6 8.2 L15.2 14.4 M6 16 L15.2 16 M6 23.8 L15.2 17.6" fill="none" stroke="#6949ca" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="21" cy="16" r="5" fill="#6949ca"/>
    `.trim(),
  },
  mark: {
    viewBox: '0 0 16 16',
    inner: `
      <path d="M2.2 3.9 L7.4 7.2 M2.2 8 L7.4 8 M2.2 12.1 L7.4 8.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="10.8" cy="8" r="2.6" fill="currentColor"/>
    `.trim(),
  },
  wordmark: {
    viewBox: '0 0 330 96',
    inner: `
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, system-ui, sans-serif" font-size="84" font-weight="700" letter-spacing="-3.6" fill="#0a0a0a">mxwiz</text>
      <path d="M262 55.5 L293 64.6 M262 68 L293 68 M262 80.5 L293 71.4" fill="none" stroke="#6949ca" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="302" cy="68" r="8" fill="#6949ca"/>
    `.trim(),
  },
};
