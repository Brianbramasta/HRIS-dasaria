import React, { useMemo } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
import { Edit, Trash, FileText } from 'react-feather';
import { usePositions } from '../../index';
import type { PositionRow } from '../../types/organizationTable.types';

type Props = { resetKey: string };

const positionColumns: DataTableColumn<PositionRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Jabatan', label: 'Nama Jabatan', sortable: true },
  { id: 'Grade', label: 'Grade', sortable: true },
  { id: 'Deskripsi Tugas', label: 'Deskripsi Tugas', sortable: true },
  { id: 'Bawahan Langsung', label: 'Bawahan Langsung', sortable: true },
  { id: 'File SK & MoU', label: 'File SK & MoU', sortable: true, format: () => <FileText size={16} /> },
];

export default function PositionsTab({ resetKey }: Props) {
  const { positions, fetchPositions, setSearch, setPage, setPageSize, setSort } = usePositions();

  const rows: PositionRow[] = useMemo(() => {
    return (positions || []).map((p, idx) => ({
      no: idx + 1,
      'Nama Jabatan': (p as any).name ?? '—',
      Grade: (p as any).grade ?? (p as any).level ?? '—',
      'Deskripsi Tugas': (p as any).jobDescription ?? (p as any).description ?? '—',
      'Bawahan Langsung': Array.isArray((p as any).directSubordinates) ? (p as any).directSubordinates.join(', ') : '—',
      'File SK & MoU': ((p as any).skFile || (p as any).memoFile) ? 'Ada' : '—',
    }));
  }, [positions]);

  const actionsIconOnly = [
    { label: '', onClick: (row: any) => console.log('Edit', row), variant: 'outline', className: 'border-0', icon: <Edit size={16} /> },
    { label: '', onClick: (row: any) => console.log('Delete', row), variant: 'outline', className: 'border-0', color: 'error', icon: <Trash size={16} /> },
  ] as DataTableAction<any>[];

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => { fetchPositions(); }, []);

  return (
    <DataTable
      title="Jabatan"
      data={rows}
      columns={positionColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchPositions(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchPositions(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchPositions(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchPositions(); }}
      onColumnVisibilityChange={() => { fetchPositions(); }}
      onAdd={() => console.log('Add Position')}
      onExport={() => exportCSV('jabatan.csv', rows)}
    />
  );
}