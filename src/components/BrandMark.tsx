import { brands, type BrandName } from '../brands';

export interface BrandMarkProps {
  /** Which doon-family brand to render. */
  name: BrandName;
  /**
   * Which rendition.
   *
   *   `mark` (default) — the symbol only, uses `currentColor` so the
   *     consumer can theme it via parent text color. Use inside a
   *     colored tile (e.g. `bg-primary/15 text-primary`).
   *
   *   `favicon` — ink-square tile with the mark inside, brand colors
   *     hardcoded. Use when there's no surrounding tile (tab icons,
   *     sign-in pages, og images).
   *
   *   `wordmark` — brand name in system-font bold with the accent
   *     shape at the end. Use for footers, hero illustrations.
   */
  variant?: 'mark' | 'favicon' | 'wordmark';
  /**
   * Width in CSS px. Height is derived from the viewBox aspect ratio.
   * Default 16 (matches favicon / sidebar inline use). Set to 28 for
   * the sign-in hero tile, 64+ for hero illustrations.
   */
  size?: number;
  /** Optional className passthrough so the consumer can tweak color
   *  on `mark` (uses currentColor), or add hover effects. */
  className?: string;
}

/**
 * Brand-mark renderer for the doon family. Single source of truth for
 * every dnswiz / doon / pgwiz / pwwiz logo render across React and
 * Astro consumers.
 *
 *   <BrandMark name="dnswiz" />                  inline 16px mark
 *   <BrandMark name="dnswiz" variant="favicon" size={28} />
 *   <BrandMark name="dnswiz" variant="wordmark" size={120} />
 *
 * The SVG inner markup comes from `src/brands/<name>.ts`. Update there
 * to update everywhere.
 */
export function BrandMark({
  name,
  variant = 'mark',
  size = 16,
  className,
}: BrandMarkProps) {
  const spec = brands[name][variant];
  const [, , vbWStr, vbHStr] = spec.viewBox.split(/\s+/);
  const vbW = Number(vbWStr) || 1;
  const vbH = Number(vbHStr) || 1;
  const height = Math.round((size * vbH) / vbW);
  return (
    <svg
      viewBox={spec.viewBox}
      width={size}
      height={height}
      role="img"
      aria-label={name}
      className={className}
      dangerouslySetInnerHTML={{ __html: spec.inner }}
    />
  );
}
