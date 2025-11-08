import React, { useMemo } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
import { Edit, Trash, FileText } from 'react-feather';
import { useDivisions } from '../../index';
import type { DivisionRow } from '../../types/organizationTable.types';

type Props = { resetKey: string };

const divisionColumns: DataTableColumn<DivisionRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Divisi', label: 'Nama Divisi', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

export default function DivisionsTab({ resetKey }: Props) {
  const { divisions, fetchDivisions, setSearch, setPage, setPageSize, setSort } = useDivisions();

  const rows: DivisionRow[] = useMemo(() => {
    return (divisions || []).map((d, idx) => ({
      no: idx + 1,
      'Nama Divisi': (d as any).name ?? '—',
      'Deskripsi Umum': (d as any).description ?? '—',
      'File SK dan Memo': ((d as any).skFile || (d as any).memoFile) ? 'Ada' : '—',
    }));
  }, [divisions]);

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

  React.useEffect(() => { fetchDivisions(); }, []);

  return (
    <DataTable
      title="Divisi"
      data={rows}
      columns={divisionColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchDivisions(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchDivisions(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchDivisions(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDivisions(); }}
      onColumnVisibilityChange={() => { fetchDivisions(); }}
      onAdd={() => console.log('Add Division')}
      onExport={() => exportCSV('divisi.csv', rows)}
    />
  );
}