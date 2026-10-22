import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Combobox } from '../src/components/Combobox';
import { Drawer } from '../src/components/Drawer';

const OPTIONS = [
  { value: '1', label: 'Acme' },
  { value: '2', label: 'Beta Corp' },
  { value: '3', label: 'Probe Co' },
];

describe('Combobox', () => {
  test('typing filters, arrows move, Enter picks the option value', () => {
    const onChange = vi.fn();
    render(<Combobox value="" onChange={onChange} options={OPTIONS} />);
    const field = screen.getByRole('combobox');
    fireEvent.change(field, { target: { value: 'co' } });
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Beta Corp', 'Probe Co']);
    fireEvent.keyDown(field, { key: 'ArrowDown' });
    fireEvent.keyDown(field, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('3');
  });

  test('leaving without a pick keeps the old value', () => {
    const onChange = vi.fn();
    render(<Combobox value="1" onChange={onChange} options={OPTIONS} />);
    const field = screen.getByRole('combobox') as HTMLInputElement;
    fireEvent.change(field, { target: { value: 'zzz' } });
    fireEvent.blur(field);
    expect(onChange).not.toHaveBeenCalled();
    expect(field.value).toBe('Acme');
  });

  test('with allowFree, typed text that matches nothing is the value', () => {
    const onChange = vi.fn();
    render(<Combobox value="" onChange={onChange} options={OPTIONS} allowFree />);
    const field = screen.getByRole('combobox');
    fireEvent.change(field, { target: { value: 'Newco' } });
    expect(screen.getByRole('option', { name: /Use “Newco”/ })).toBeInTheDocument();
    fireEvent.keyDown(field, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('Newco');
  });

  test('Escape closes the list and leaves the drawer open', () => {
    const onClose = vi.fn();
    render(
      <Drawer open title="New contact" onClose={onClose} dirty={false}>
        <Combobox value="" onChange={() => {}} options={OPTIONS} />
      </Drawer>,
    );
    const field = screen.getByRole('combobox');
    fireEvent.change(field, { target: { value: 'a' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(field, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Combobox searched elsewhere', () => {
  test('typing reports the text, shows the given options unfiltered, and keeps the picked label', () => {
    const onQuery = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <Combobox value="9" selectedLabel="Zeta" onChange={onChange} options={OPTIONS} onQueryChange={onQuery} />,
    );
    const field = screen.getByRole('combobox') as HTMLInputElement;
    expect(field.value).toBe('Zeta');
    fireEvent.change(field, { target: { value: 'zzz' } });
    expect(onQuery).toHaveBeenLastCalledWith('zzz');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    rerender(<Combobox value="9" selectedLabel="Zeta" onChange={onChange} options={[]} onQueryChange={onQuery} />);
    fireEvent.blur(field);
    expect(field.value).toBe('Zeta');
  });
});

test('emptying the field clears the value', () => {
  const onChange = vi.fn();
  render(<Combobox value="1" onChange={onChange} options={OPTIONS} />);
  const field = screen.getByRole('combobox');
  fireEvent.change(field, { target: { value: '' } });
  fireEvent.blur(field);
  expect(onChange).toHaveBeenCalledWith('');
});

test('an empty list stays closed until something is typed', () => {
  render(<Combobox value="" onChange={() => {}} options={[]} allowFree />);
  const field = screen.getByRole('combobox');
  fireEvent.click(field);
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  fireEvent.change(field, { target: { value: 'New' } });
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});
