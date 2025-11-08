import React, { useMemo } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
import { Edit, Trash, FileText } from 'react-feather';
import { useCompanies } from '../../index';
import type { CompanyRow } from '../../types/organizationTable.types';

type Props = { resetKey: string };

const companyColumns: DataTableColumn<CompanyRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Perusahaan', label: 'Nama Perusahaan', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'Lini Bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Detail', label: 'Detail', sortable: true, format: () => <FileText size={16} /> },
];

export default function CompaniesTab({ resetKey }: Props) {
  const { companies, fetchCompanies, setSearch, setPage, setPageSize, setSort } = useCompanies();

  const rows: CompanyRow[] = useMemo(() => {
    return (companies || []).map((c, idx) => ({
      no: idx + 1,
      'Nama Perusahaan': (c as any).name ?? '—',
      'Deskripsi Umum': (c as any).description ?? '—',
      'Lini Bisnis': (c as any).businessLineName ?? (c as any).businessLine?.name ?? '—',
      Detail: (c as any).website ?? (c as any).details ?? '—',
    }));
  }, [companies]);

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

  React.useEffect(() => { fetchCompanies(); }, []);

  return (
    <DataTable
      title="Perusahaan"
      data={rows}
      columns={companyColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchCompanies(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchCompanies(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchCompanies(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchCompanies(); }}
      onColumnVisibilityChange={() => { fetchCompanies(); }}
      onAdd={() => console.log('Add Company')}
      onExport={() => exportCSV('perusahaan.csv', rows)}
    />
  );
}