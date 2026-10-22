// Escape closes the layer opened last and nothing under it, and keys typed
// into a control inside a table row stay with that control.
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from '../src/components/Drawer';
import { Select } from '../src/components/Select';
import { DatePicker } from '../src/components/DatePicker';
import { DataTable } from '../src/components/DataTable';
import type { Column } from '../src/components/DataTable';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Bravo' },
];

const escape = () => fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

describe('Escape', () => {
  test('closes an open list inside a drawer, then the drawer', () => {
    const onClose = vi.fn();
    render(
      <Drawer open title="Edit" onClose={onClose}>
        <Select value="a" onChange={() => {}} options={OPTIONS} />
      </Drawer>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Alpha/ }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    escape();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    escape();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('a closed select that handles Escape itself keeps the drawer open', () => {
    const onClose = vi.fn();
    const onEscape = vi.fn();
    render(
      <Drawer open title="Edit" onClose={onClose}>
        <Select value="a" onChange={() => {}} options={OPTIONS} onEscape={onEscape} autoFocus />
      </Drawer>,
    );
    fireEvent.keyDown(screen.getByRole('button', { name: /Alpha/ }), { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('a date picker opened on mount closes on Escape and leaves the drawer', () => {
    const onClose = vi.fn();
    render(
      <Drawer open title="Edit" onClose={onClose}>
        <DatePicker value="2026-10-22" onChange={() => {}} defaultOpen />
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    escape();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('a control inside a table row', () => {
  type Row = { id: string; name: string };
  const rows: Row[] = [{ id: '1', name: 'alpha' }, { id: '2', name: 'bravo' }];
  const columns: Column<Row>[] = [
    { key: 'name', label: 'Name', render: (r) => <input aria-label={`edit ${r.name}`} defaultValue={r.name} /> },
  ];

  test('Enter and Ctrl+A in an input do not open or select rows', () => {
    const onRowActivate = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowActivate={onRowActivate}
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(screen.getAllByRole('row')[1]);
    onSelectionChange.mockClear();
    const input = screen.getByLabelText('edit alpha');
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.keyDown(input, { key: 'a', ctrlKey: true });
    expect(onRowActivate).not.toHaveBeenCalled();
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});
