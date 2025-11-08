import React, { useMemo } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
import { Edit, Trash, FileText } from 'react-feather';
import { useDepartments } from '../../index';
import type { DepartmentRow } from '../../types/organizationTable.types';

type Props = { resetKey: string };

const departmentColumns: DataTableColumn<DepartmentRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Departemen', label: 'Nama Departemen', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

export default function DepartmentsTab({ resetKey }: Props) {
  const { departments, fetchDepartments, setSearch, setPage, setPageSize, setSort } = useDepartments();

  const rows: DepartmentRow[] = useMemo(() => {
    return (departments || []).map((d, idx) => ({
      no: idx + 1,
      'Nama Departemen': (d as any).name ?? '—',
      'File SK dan Memo': ((d as any).skFile || (d as any).memoFile) ? 'Ada' : '—',
    }));
  }, [departments]);

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

  React.useEffect(() => { fetchDepartments(); }, []);

  return (
    <DataTable
      title="Departemen"
      data={rows}
      columns={departmentColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchDepartments(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchDepartments(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchDepartments(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDepartments(); }}
      onColumnVisibilityChange={() => { fetchDepartments(); }}
      onAdd={() => console.log('Add Department')}
      onExport={() => exportCSV('departemen.csv', rows)}
    />
  );
}