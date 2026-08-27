import { describe, expect, it } from 'vitest';
import { compactNumber, money, percent } from '../src/format';

describe('money', () => {
  it('does not leak the float that comes from dividing by a hundred', () => {
    // 1869.5779299999998 cents is what a sum of per-request costs looks like.
    // Rendered without care it reaches the page as $18.695779299999998.
    expect(money(1869.5779299999998)).toBe('$18.70');
  });

  it('keeps enough digits for a cost smaller than a unit', () => {
    // Rounded to two places every row of a per-request table reads $0.00,
    // which is the same as showing nothing.
    expect(money(4.38)).toBe('$0.0438');
    expect(money(0.01)).toBe('$0.0001');
  });

  it('uses two places once the amount is one or more', () => {
    expect(money(1387)).toBe('$13.87');
    expect(money(100)).toBe('$1.00');
  });

  it('renders zero as a whole amount rather than four zeroes', () => {
    expect(money(0)).toBe('$0.00');
  });

  it('handles negatives, which a credit or an adjustment produces', () => {
    expect(money(-1387)).toBe('-$13.87');
    expect(money(-4.38)).toBe('-$0.0438');
  });

  it('survives what an API actually sends when a field is absent', () => {
    expect(money(NaN)).toBe('$0.00');
    expect(money(undefined as unknown as number)).toBe('$0.00');
  });

  it('takes another currency symbol', () => {
    expect(money(1387, '€')).toBe('€13.87');
  });
});

describe('compactNumber', () => {
  it('shortens a headline figure', () => {
    expect(compactNumber(41_000)).toBe('41K');
    expect(compactNumber(46_000_000)).toBe('46M');
  });

  it('leaves a small number alone', () => {
    expect(compactNumber(146)).toBe('146');
  });

  it('treats a missing value as zero rather than NaN', () => {
    expect(compactNumber(undefined as unknown as number)).toBe('0');
  });
});

describe('percent', () => {
  it('renders a fraction as a percentage', () => {
    expect(percent(0.42)).toBe('42.0%');
    expect(percent(0.4235, 2)).toBe('42.35%');
  });
});
