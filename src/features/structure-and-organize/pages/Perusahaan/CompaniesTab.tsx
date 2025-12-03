import React, { useMemo } from 'react';
import { Link } from 'react-router';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
// import { /*Edit,*/ Trash } from 'react-feather';
import {  IconHapus as Trash } from '@/icons/components/icons';
import { useCompanies } from '../../index';
import type { CompanyRow } from '../../types/organizationTable.types';
import type { CompanyListItem } from '../../types/organization.api.types';
import AddCompanyModal from '../../components/modals/Perusahaan/AddCompanyModal';
import EditCompanyModal from '../../components/modals/Perusahaan/EditCompanyModal';
import DeleteCompanyModal from '../../components/modals/Perusahaan/DeleteCompanyModal';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';

type Props = { resetKey: string };

const companyColumns: DataTableColumn<CompanyRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'Nama Perusahaan', label: 'Nama Perusahaan', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'Lini Bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Detail', label: 'Detail', sortable: false, isAction: true, format: (_val, row) => (
    <Link to={`/structure-and-organize/companies/${(row as any).id ?? (row as any).no}`} className="text-brand-600 hover:underline">
      <FileText size={16} />
    </Link>
  ) },
];

export default function CompaniesTab({ resetKey }: Props) {
  const { companies, fetchCompanies, setSearch, setPage, setPageSize, setSort, page, pageSize, total, loading } = useCompanies();

  const [isAddOpen, setAddOpen] = React.useState(false);
  const [isEditOpen, setEditOpen] = React.useState(false);
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<CompanyListItem | null>(null);

  const rows: (CompanyRow & { id?: string })[] = useMemo(() => {
    return (companies || []).map((c, idx) => ({
      id: (c as any).id,
      no: idx + 1,
      'Nama Perusahaan': (c as any).name ?? '—',
      'Deskripsi Umum': (c as any).description ?? '—',
      'Lini Bisnis': (c as any).businessLineName ?? (c as any).businessLine?.name ?? '—',
      Detail: (c as any).website ?? (c as any).details ?? '—',
    }));
  }, [companies]);

  const actionsIconOnly = [
    // { label: '', onClick: (row: any) => {
    //     const comp = companies.find((c) => c.id === row.id) || null;
    //     setSelectedCompany(comp);
    //     setEditOpen(true);
    //   }, variant: 'outline', className: 'border-0', icon: <Edit size={16} /> },
    { label: '', onClick: (row: any) => {
        const comp = companies.find((c) => c.id === row.id) || null;
        setSelectedCompany(comp);
        setDeleteOpen(true);
      }, variant: 'outline', className: 'border-0', color: 'error', icon: <Trash  /> },
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


  return (
    <div>
    <DataTable
      title="Perusahaan"
      data={rows}
      columns={companyColumns}
      actions={actionsIconOnly}
      loading={loading}
      pageSize={pageSize}
      useExternalPagination
      externalPage={page}
      externalTotal={total}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); }}
      onSortChange={(columnId, order) => { setSort(columnId, order); }}
      onPageChangeExternal={(p) => { setPage(p); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); }}
      
      onAdd={() => setAddOpen(true)}
      onExport={() => exportCSV('perusahaan.csv', rows)}
    />
    <AddCompanyModal
      isOpen={isAddOpen}
      onClose={() => setAddOpen(false)}
      onSuccess={() => {fetchCompanies();
        addNotification({
          description: 'Perusahaan berhasil ditambahkan',
          variant: 'success',
          hideDuration: 4000,
          title: 'Perusahaan ditambahkan',
        });
      }}
    />
    <EditCompanyModal
      isOpen={isEditOpen}
      onClose={() => { setEditOpen(false); setSelectedCompany(null); }}
      company={selectedCompany}
      onSuccess={() => {fetchCompanies();
        addNotification({
          description: 'Perusahaan berhasil diubah',
          variant: 'success',
          hideDuration: 4000,
          title: 'Perusahaan diubah',
        });
      }}
    />
    <DeleteCompanyModal
      isOpen={isDeleteOpen}
      onClose={() => { setDeleteOpen(false); setSelectedCompany(null); }}
      company={selectedCompany || undefined}
      onSuccess={() => {fetchCompanies();
        addNotification({
          description: 'Perusahaan berhasil dihapus',
          variant: 'success',
          hideDuration: 4000,
          title: 'Perusahaan dihapus',
        });
      }}
    />
    </div>
  );
}
