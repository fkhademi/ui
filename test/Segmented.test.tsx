import { describe, expect, test } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Segmented } from '../src/components/Segmented';

function Harness() {
  const [v, setV] = useState<'a' | 'b' | 'c'>('a');
  return (
    <Segmented
      ariaLabel="Range"
      value={v}
      onChange={setV}
      options={[
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
        { value: 'c', label: 'C' },
      ]}
    />
  );
}

describe('Segmented', () => {
  test('a click selects the option', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('radio', { name: 'C' }));
    expect(screen.getByRole('radio', { name: 'C' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'A' }).getAttribute('aria-checked')).toBe('false');
  });

  test('arrow keys skip a disabled option and wrap around', () => {
    render(<Harness />);
    const group = screen.getByRole('radiogroup', { name: 'Range' });
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'C' }).getAttribute('aria-checked')).toBe('true');
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'A' }).getAttribute('aria-checked')).toBe('true');
    fireEvent.keyDown(group, { key: 'ArrowLeft' });
    expect(screen.getByRole('radio', { name: 'C' }).getAttribute('aria-checked')).toBe('true');
  });

  test('only the selected option is in the tab order', () => {
    render(<Harness />);
    expect(screen.getByRole('radio', { name: 'A' }).tabIndex).toBe(0);
    expect(screen.getByRole('radio', { name: 'C' }).tabIndex).toBe(-1);
  });
});
