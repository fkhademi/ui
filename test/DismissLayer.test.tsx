// Escape closes the layer opened last and nothing under it, and keys typed
// into a control inside a table row stay with that control.
import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from '../src/components/Drawer';
import { Modal } from '../src/components/Modal';
import { ConfirmDiscardProvider } from '../src/components/guardedClose';
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

describe('Modal', () => {
  test('Escape on a modal over a drawer closes only the modal', async () => {
    const closeDrawer = vi.fn();
    const closeModal = vi.fn();
    render(
      <Drawer open title="Deal" onClose={closeDrawer}>
        <Modal open title="Delete?" onClose={closeModal}>Sure?</Modal>
      </Drawer>,
    );
    escape();
    await Promise.resolve();
    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(closeDrawer).not.toHaveBeenCalled();
  });

  test("closing with edits asks the app's confirm, not the browser's", async () => {
    const ask = vi.fn(async () => false);
    const onClose = vi.fn();
    const native = vi.fn(() => true);
    window.confirm = native;
    render(
      <ConfirmDiscardProvider value={ask}>
        <Modal open title="Rename" onClose={onClose}>
          <input aria-label="name" />
        </Modal>
      </ConfirmDiscardProvider>,
    );
    fireEvent.input(screen.getByLabelText('name'), { target: { value: 'x' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    await Promise.resolve();
    expect(ask).toHaveBeenCalledTimes(1);
    expect(native).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('focus returns to the control that opened it', () => {
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal open={open} title="Info" onClose={() => setOpen(false)} dirty={false}>Hello</Modal>
        </>
      );
    }
    render(<Host />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    return Promise.resolve().then(() => expect(document.activeElement).toBe(opener));
  });
});

describe('MenuButton', () => {
  test('opens its menu, runs an item, and toggles shut on a second click', async () => {
    const { MenuButton } = await import('../src/components/MenuButton');
    const onDelete = vi.fn();
    render(<MenuButton items={[{ kind: 'action', label: 'Delete', danger: true, onClick: onDelete }]} />);
    const button = screen.getByRole('button', { name: 'More actions' });
    fireEvent.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
