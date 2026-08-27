/**
 * Number formatting for values people read rather than compute with.
 *
 * These live here because every console that shows a cost writes the same
 * three lines, and the copies drift: one rounds to two places, one to four,
 * one forgets that a float divided by a hundred renders as
 * 18.695779299999998.
 */

/**
 * Money held in minor units (cents), rendered for display.
 *
 * Takes minor units so the caller never divides, which is where a
 * floating-point tail like 18.695779299999998 comes from.
 *
 * Two decimals by default, the way a person writes an amount. Pass
 * digits: 'adaptive' for a column that spans orders of magnitude, where a
 * per-request cost is fractions of a cent and rounding it to two places shows
 * every row as $0.00; adaptive keeps four digits below a unit and two at or
 * above one. It is opt-in because a price list wants $0.15 rather than
 * $0.1500.
 */
export function money(
  minorUnits: number,
  opts: { digits?: number | 'adaptive'; currency?: string } = {},
): string {
  const { digits = 2, currency = '$' } = opts;
  const value = (Number(minorUnits) || 0) / 100;
  const places =
    digits === 'adaptive' ? (Math.abs(value) < 1 && value !== 0 ? 4 : 2) : digits;
  // Sign outside the symbol: a credit reads -$13.87, not $-13.87.
  const sign = value < 0 ? '-' : '';
  return (
    sign +
    currency +
    Math.abs(value).toLocaleString(undefined, {
      minimumFractionDigits: places,
      maximumFractionDigits: places,
    })
  );
}

/**
 * A count shortened for a headline: 41K, 46M.
 *
 * For a figure someone glances at, not one they reconcile against. Anywhere
 * the exact number matters, show the exact number.
 */
export function compactNumber(n: number): string {
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(
    Number(n) || 0,
  );
}

/** A fraction (0.42) as a percentage (42.0%). */
export function percent(fraction: number, digits = 1): string {
  return ((Number(fraction) || 0) * 100).toFixed(digits) + '%';
}
