/**
 * Brand registry. Each doon-family product registers its BrandSpec
 * here so `<BrandMark name="…">` and Astro consumers can pick by name.
 *
 * To add a new brand: drop a `<name>.ts` file next to this one and add
 * the export below. The BrandSpec interface keeps everyone honest.
 */

import { dnswizBrand } from './dnswiz';
import { doonBrand } from './doon';

export const brands = {
  dnswiz: dnswizBrand,
  doon: doonBrand,
} as const;

export type BrandName = keyof typeof brands;

export { dnswizBrand, doonBrand };
export type { BrandSpec, BrandPalette, BrandSvgSpec } from './types';
