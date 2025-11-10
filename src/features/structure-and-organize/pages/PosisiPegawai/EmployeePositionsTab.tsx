import React, { useMemo } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
import { Edit, Trash, FileText } from 'react-feather';
import { useEmployeePositions } from '../../index';
import type { EmployeePositionRow } from '../../types/organizationTable.types';

type Props = { resetKey: string };

const employeePositionColumns: DataTableColumn<EmployeePositionRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Posisi', label: 'Nama Posisi', sortable: true },
  { id: 'Jabatan', label: 'Jabatan', sortable: true },
  { id: 'Direktorat', label: 'Direktorat', sortable: true },
  { id: 'Divisi', label: 'Divisi', sortable: true },
  { id: 'Departemen', label: 'Departemen', sortable: true },
  { id: 'File SK & MoU', label: 'File SK & MoU', sortable: true, format: () => <FileText size={16} /> },
];

export default function EmployeePositionsTab({ resetKey }: Props) {
  const { employeePositions, fetchEmployeePositions, setSearch, setPage, setPageSize, setSort } = useEmployeePositions();

  const rows: EmployeePositionRow[] = useMemo(() => {
    return (employeePositions || []).map((ep, idx) => ({
      no: idx + 1,
      'Nama Posisi': (ep as any).name ?? (ep as any).positionName ?? '—',
      Jabatan: (ep as any).position?.name ?? (ep as any).positionName ?? '—',
      Direktorat: (ep as any).directorate?.name ?? (ep as any).directorateName ?? '—',
      Divisi: (ep as any).division?.name ?? (ep as any).divisionName ?? '—',
      Departemen: (ep as any).department?.name ?? (ep as any).departmentName ?? '—',
      'File SK & MoU': ((ep as any).skFile || (ep as any).memoFile) ? 'Ada' : '—',
    }));
  }, [employeePositions]);

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

  React.useEffect(() => { fetchEmployeePositions(); }, []);

  return (
    <DataTable
      title="Posisi Pegawai"
      data={rows}
      columns={employeePositionColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchEmployeePositions(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchEmployeePositions(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchEmployeePositions(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchEmployeePositions(); }}
      onColumnVisibilityChange={() => { fetchEmployeePositions(); }}
      onAdd={() => console.log('Add Employee Position')}
      onExport={() => exportCSV('posisi-pegawai.csv', rows)}
    />
  );
}