// Core table behaviour, kept alongside the filter tests because filtering,
// search, sort and paging all narrow the same list and it is the interaction
// between them that breaks.
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DataTable } from '../src/components/DataTable';
import type { Column } from '../src/components/DataTable';

type Row = { id: string; name: string; count: number; status: string };

const rows: Row[] = [
  { id: '1', name: 'charlie', count: 3, status: 'active' },
  { id: '2', name: 'alpha', count: 10, status: 'archived' },
  { id: '3', name: 'bravo', count: 7, status: 'active' },
];

const columns: Column<Row>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'count', label: 'Count', sortable: true, align: 'right' },
  {
    key: 'status',
    label: 'Status',
    filterOptions: [
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ],
  },
];

const names = () =>
  screen
    .getAllByRole('row')
    .slice(1) // header
    .map((r) => r.querySelector('td')?.textContent)
    .filter(Boolean);

describe('search', () => {
  test('matches across the searchable columns', () => {
    render(
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchKeys={['name']} />,
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'brav' } });
    expect(screen.getByText('bravo')).toBeInTheDocument();
    expect(screen.queryByText('alpha')).not.toBeInTheDocument();
  });
});

describe('sort', () => {
  test('orders by a column, and reverses on a second click', async () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
    await act(async () => fireEvent.click(screen.getByText('Name')));
    expect(names()).toEqual(['alpha', 'bravo', 'charlie']);
    await act(async () => fireEvent.click(screen.getByText('Name')));
    expect(names()).toEqual(['charlie', 'bravo', 'alpha']);
  });

  test('sorts numbers as numbers, not as text', async () => {
    // 10 sorts before 3 as a string, which is the classic wrong answer.
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
    await act(async () => fireEvent.click(screen.getByText('Count')));
    expect(names()).toEqual(['charlie', 'bravo', 'alpha']);
  });
});

describe('search and filters together', () => {
  test('both narrow the same list rather than fighting', async () => {
    render(
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} searchKeys={['name']} />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /All status/i }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('option', { name: 'Active' }));
    });
    expect(names().sort()).toEqual(['bravo', 'charlie']);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'char' } });
    expect(names()).toEqual(['charlie']);
  });
});

describe('empty and loading', () => {
  test('shows the caller empty state when there are no rows', () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        getRowId={(r) => r.id}
        emptyState={<span>Nothing here yet</span>}
      />,
    );
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });
});

describe('activation', () => {
  test('double-click opens the row', async () => {
    const onRowActivate = vi.fn();
    render(
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} onRowActivate={onRowActivate} />,
    );
    await act(async () => fireEvent.doubleClick(screen.getByText('charlie')));
    expect(onRowActivate).toHaveBeenCalledWith(expect.objectContaining({ name: 'charlie' }));
  });
});

describe('empty', () => {
  test('a filter that leaves nothing says so and clears, also when filtered on a server', () => {
    const onColumnFiltersChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={[]}
        getRowId={(r) => r.id}
        emptyState={<div>No accounts yet</div>}
        serverPagination={{ total: 0, page: 0, pageSize: 25, onPageChange: () => {}, columnFilters: { status: 'active' }, onColumnFiltersChange }}
      />,
    );
    expect(screen.queryByText('No accounts yet')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onColumnFiltersChange).toHaveBeenCalledWith({});
  });

  test('a list with nothing in it shows its own empty state', () => {
    render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} emptyState={<div>No accounts yet</div>} />);
    expect(screen.getByText('No accounts yet')).toBeInTheDocument();
  });
});
