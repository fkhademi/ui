/**
 * Brand specification shape. Each doon-family product (doon, dnswiz,
 * …) ships a BrandSpec describing its palette and the three canonical
 * SVG renditions of its mark.
 *
 * SVG inner markup is a string so the same spec drives:
 *   - React consumers (BrandMark with dangerouslySetInnerHTML)
 *   - Astro consumers (set:html with the same string)
 *   - Build-time emitters that write favicon.svg / mark.svg /
 *     wordmark.svg out to a public/ dir for static serving
 *
 * Keep the strings free of script content and event handlers — they
 * are pure shape + color declarations only.
 */

export interface BrandPalette {
  /** Accent hex (the brand's primary expressive color). */
  accent: string;
  /** Ink hex (the dark surface for favicon tiles, wordmark text). */
  ink: string;
}

export interface BrandSvgSpec {
  /** SVG viewBox attribute, e.g. "0 0 32 32". */
  viewBox: string;
  /** SVG inner content as raw markup. No <svg> wrapper. */
  inner: string;
}

export interface BrandSpec {
  /** Brand name used as the BrandMark `name` prop. */
  name: string;
  palette: BrandPalette;
  /**
   * Tile variant for tab icons and favicons. Includes the ink-tile
   * background, so it works on any surface. Colors are hardcoded since
   * the favicon SVG must look identical at every render site.
   */
  favicon: BrandSvgSpec;
  /**
   * Mark only, no background. Uses `currentColor` so consumers can
   * theme it via the parent text color. The default sidebar / inline
   * variant.
   */
  mark: BrandSvgSpec;
  /**
   * Wordmark: brand name in system-font bold with the accent shape at
   * the end. Used for footers, social cards, hero illustrations.
   */
  wordmark: BrandSvgSpec;
}
