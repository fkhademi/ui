// Per-column filters.
//
// The behaviour that matters is what a table does when it is NOT asked to
// filter: existing callers pass no filterOptions and must see exactly the
// table they had before, with no extra header row and no rows removed.
import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DataTable } from '../src/components/DataTable';
import type { Column } from '../src/components/DataTable';

type Row = { id: string; name: string; status: string };

const rows: Row[] = [
  { id: '1', name: 'alpha', status: 'active' },
  { id: '2', name: 'beta', status: 'archived' },
  { id: '3', name: 'gamma', status: 'active' },
];

const columns: Column<Row>[] = [
  { key: 'name', label: 'Name' },
  {
    key: 'status',
    label: 'Status',
    filterOptions: [
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ],
  },
];

const openFilter = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /All status/i }));
  });
};

const choose = async (label: string) => {
  await act(async () => {
    fireEvent.click(screen.getByRole('option', { name: label }));
  });
};

describe('a table with no filterable column', () => {
  test('renders no filter row', () => {
    render(
      <DataTable columns={[{ key: 'name', label: 'Name' }]} rows={rows} getRowId={(r) => r.id} />,
    );
    expect(screen.queryByRole('button', { name: /All /i })).not.toBeInTheDocument();
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
  });
});

describe('filtering locally', () => {
  test('narrows the rows to the chosen value', async () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
    await openFilter();
    await choose('Archived');
    expect(screen.getByText('beta')).toBeInTheDocument();
    expect(screen.queryByText('alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('gamma')).not.toBeInTheDocument();
  });

  test('clearing restores them', async () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
    await openFilter();
    await choose('Archived');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Clear .*filter/i }));
    });
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('gamma')).toBeInTheDocument();
  });

  test('uses filterValue when the cell shows something other than the raw value', async () => {
    const derived: Column<Row>[] = [
      { key: 'name', label: 'Name' },
      {
        key: 'state',
        label: 'State',
        render: (r) => (r.status === 'active' ? 'Live' : 'Retired'),
        filterValue: (r) => r.status,
        filterOptions: [
          { value: 'active', label: 'Live' },
          { value: 'archived', label: 'Retired' },
        ],
      },
    ];
    render(<DataTable columns={derived} rows={rows} getRowId={(r) => r.id} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /All state/i }));
    });
    await choose('Retired');
    expect(screen.getByText('beta')).toBeInTheDocument();
    expect(screen.queryByText('alpha')).not.toBeInTheDocument();
  });
});

describe('text filters', () => {
  const textColumns: Column<Row>[] = [
    { key: 'name', label: 'Name', filterable: true },
    { key: 'status', label: 'Status' },
  ];

  test('match a substring, not the whole value', async () => {
    render(<DataTable columns={textColumns} rows={rows} getRowId={(r) => r.id} />);
    fireEvent.change(screen.getByLabelText(/filter by name/i), { target: { value: 'lph' } });
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.queryByText('beta')).not.toBeInTheDocument();
  });

  test('ignore case', async () => {
    render(<DataTable columns={textColumns} rows={rows} getRowId={(r) => r.id} />);
    fireEvent.change(screen.getByLabelText(/filter by name/i), { target: { value: 'ALPHA' } });
    expect(screen.getByText('alpha')).toBeInTheDocument();
  });

  test('are cleared with the rest', async () => {
    render(<DataTable columns={textColumns} rows={rows} getRowId={(r) => r.id} />);
    fireEvent.change(screen.getByLabelText(/filter by name/i), { target: { value: 'alpha' } });
    expect(screen.queryByText('beta')).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Clear .*filter/i }));
    });
    expect(screen.getByText('beta')).toBeInTheDocument();
  });

  test('an option filter still matches the whole value, not a substring', async () => {
    // 'active' is a substring of 'archived' in neither direction, but a
    // careless shared implementation would make the two modes behave alike.
    render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
    await openFilter();
    await choose('Active');
    expect(screen.queryByText('beta')).not.toBeInTheDocument();
    expect(screen.getByText('alpha')).toBeInTheDocument();
  });
});

describe('filtering on the server', () => {
  test('reports the choice and leaves the rows alone', async () => {
    // Rows arrive already filtered, so cutting them again would hide records
    // the server deliberately returned.
    const onColumnFiltersChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        serverPagination={{
          page: 0,
          pageSize: 25,
          total: 3,
          onPageChange: () => {},
          columnFilters: {},
          onColumnFiltersChange,
        }}
      />,
    );
    await openFilter();
    await choose('Archived');
    expect(onColumnFiltersChange).toHaveBeenCalledWith({ status: 'archived' });
    expect(screen.getByText('alpha')).toBeInTheDocument();
  });
});
