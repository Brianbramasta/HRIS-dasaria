import React, { useMemo } from 'react';
import { Link } from 'react-router';
import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
// import { /*Edit,*/ Trash } from 'react-feather';
import {  IconHapus as Trash } from '@/icons/components/icons';
import { useCompanies } from '../../Index';
import type { CompanyRow } from '../../types/OrganizationTableTypes';
import type { CompanyListItem } from '../../types/OrganizationApiTypes';
import AddCompanyModal from '../../components/modals/company/AddCompanyModal';
import EditCompanyModal from '../../components/modals/company/EditCompanyModal';
import DeleteCompanyModal from '../../components/modals/company/DeleteCompanyModal';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
import { useFileStore } from '@/stores/fileStore';
import { ExportCSV } from '@/hooks/useExport';

type Props = { resetKey: string };

const companyColumns: DataTableColumn<CompanyRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-perusahaan', label: 'Nama Perusahaan', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'lini-bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Detail', label: 'Detail', sortable: false, align: 'center', isAction: true, format: (_val, row) => (
    <Link to={`/structure-and-organize/companies/${(row as any).id ?? (row as any).no}`} className="flex justify-center items-center text-brand-600 hover:underline">
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
  const fileStore = useFileStore();
  

  const rows: (CompanyRow & { id?: string })[] = useMemo(() => {
    return (companies || []).map((c, idx) => ({
      id: (c as any).id,
      no: idx + 1,
      'nama-perusahaan': (c as any).name ?? '—',
      'deskripsi-umum': (c as any).description ?? '—',
      'lini-bisnis': (c as any).businessLineName ?? (c as any).businessLine?.name ?? '—',
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

  // const exportCSV = (filename: string, data: any[]) => {
  //   if (!data || data.length === 0) return;
  //   const headers = Object.keys(data[0]);
  //   const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
  //   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', filename);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };


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
      onExport={() => true}
    />
    <AddCompanyModal
      isOpen={isAddOpen}
      onClose={() => { setAddOpen(false); fileStore.clearSkFile(); }} 
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
      onClose={() => { setEditOpen(false); setSelectedCompany(null); fileStore.clearSkFile(); }}
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
