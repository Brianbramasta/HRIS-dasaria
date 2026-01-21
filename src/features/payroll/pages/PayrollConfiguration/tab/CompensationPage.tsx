// Dokumentasi: Tabel Kompensasi menggunakan DataTable dengan kolom No., Level Jabatan, Kategori, General, Junior, Middle, Senior, dan Aksi
// Dokumentasi: Integrasi Modal EditKompensasiModal - buka saat tombol edit diklik
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
// import { Edit } from 'react-feather';
import { IconPencil } from '@/icons/components/icons';
import EditKompensasiModal from '@/features/payroll/components/modals/payroll-configuration/compensation/editCompensationModal';
import { useCompensation, CompensationRow } from '@/features/payroll/hooks/payroll-configuration/compensation/useCompensation';

export default function KompensasiPage() {
  const {
    rows,
    loading,
    total,
    page,
    pageSize,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    editModal,
    initialFormData,
    handleEditOpen,
    handleEditClose,
    handleEditSubmit,
  } = useCompensation();

  // Dokumentasi: util sederhana untuk ekspor data ke CSV mengikuti pola halaman lain
  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).filter(k => k !== 'raw' && k !== 'id');
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
  const columns: DataTableColumn<CompensationRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'level-jabatan', label: 'Level Jabatan', sortable: true },
    { id: 'kategori', label: 'Kategori', sortable: true },
    { id: 'general', label: 'General', align: 'center', sortable: true },
    { id: 'junior', label: 'Junior', align: 'center', sortable: true },
    { id: 'middle', label: 'Middle', align: 'center', sortable: true },
    { id: 'senior', label: 'Senior', align: 'center', sortable: true },
  ];

  const actions: DataTableAction<CompensationRow>[] = [
    {
      label: '',
      icon: <IconPencil  />,
      onClick: (row) => handleEditOpen(row.raw),
      variant: 'outline',
      className: 'border-0',
    },
  ];

  return (
    <div className="p-4">
      <DataTable
        title="Kompensasi"
        data={rows}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={pageSize}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        searchable
        filterable
        onSearchChange={(val) => setSearch(val)}
        onSortChange={(columnId, order) => setSort(columnId, order)}
        onPageChangeExternal={(p) => setPage(p)}
        onRowsPerPageChangeExternal={(ps) => setPageSize(ps)}
        onExport={() => exportCSV('kompensasi.csv', rows)}
      />
      {/* Dokumentasi: Render modal edit kompensasi ketika state showEdit true */}
      <EditKompensasiModal
        isOpen={editModal.isOpen}
        initialData={initialFormData}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        submitting={loading}
      />
    </div>
  );
}
