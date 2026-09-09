import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../src/components/Select';

const OPTIONS = [
  { value: 'at', label: 'Austria' },
  { value: 'be', label: 'Belgium' },
  { value: 'ba', label: 'Bahrain' },
  { value: 'ca', label: 'Canada' },
  { value: 'ch', label: 'Switzerland' },
];

function open(trigger: HTMLElement) {
  fireEvent.click(trigger);
}

describe('Select typeahead', () => {
  test('a letter jumps to the first option starting with it', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} />);
    const trigger = screen.getByRole('button');
    fireEvent.keyDown(trigger, { key: 'b' });
    expect(onChange).toHaveBeenCalledWith('be');
  });

  test('more letters narrow to a prefix', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} />);
    const trigger = screen.getByRole('button');
    fireEvent.keyDown(trigger, { key: 'b' });
    fireEvent.keyDown(trigger, { key: 'a' });
    expect(onChange).toHaveBeenLastCalledWith('ba');
  });

  test('repeating a letter cycles through options starting with it', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} />);
    const trigger = screen.getByRole('button');
    fireEvent.keyDown(trigger, { key: 'b' });
    expect(onChange).toHaveBeenLastCalledWith('be');
    fireEvent.keyDown(trigger, { key: 'b' });
    expect(onChange).toHaveBeenLastCalledWith('ba');
  });

  test('matching is case-insensitive', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'C' });
    expect(onChange).toHaveBeenCalledWith('ca');
  });

  test('no match leaves the value alone', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'z' });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('typing while open moves the highlight without selecting', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} />);
    const trigger = screen.getByRole('button');
    open(trigger);
    fireEvent.keyDown(trigger, { key: 'c' });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('ca');
  });

  test('space still opens the menu rather than starting a search', () => {
    render(<Select value="at" onChange={vi.fn()} options={OPTIONS} />);
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.keyDown(trigger, { key: ' ' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  test('a modifier combination is left to the browser', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'c', metaKey: true });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('arrow keys still work', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} />);
    const trigger = screen.getByRole('button');
    open(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('be');
  });
});

describe('Select defaultOpen', () => {
  test('opens on mount when asked', () => {
    render(<Select value="at" onChange={vi.fn()} options={OPTIONS} defaultOpen />);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  test('stays shut by default', () => {
    render(<Select value="at" onChange={vi.fn()} options={OPTIONS} />);
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
  });

  test('an option can be chosen straight away', () => {
    const onChange = vi.fn();
    render(<Select value="at" onChange={onChange} options={OPTIONS} defaultOpen />);
    fireEvent.click(screen.getByText('Canada'));
    expect(onChange).toHaveBeenCalledWith('ca');
  });
});
