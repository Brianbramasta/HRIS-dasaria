// Dokumentasi: Halaman BPJS + integrasi Modal Edit BPJS untuk update data
import { DataTable, type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil } from '@/icons/components/icons';
import EditBpjsModal from '@/features/payroll/components/modals/payroll-configuration/bpjs/editBpjsModal';
import { useBpjsPage } from '@/features/payroll/hooks/payroll-configuration/bpjs/useBpjsPage';

type BpjsRow = {
  no?: number;
  detailBpjs: string;
  kategoriBpjs: string;
  jenis: string;
  percent: string;
  original?: any;
};

// Dokumentasi: Komponen utama halaman BPJS: render tabel dan kelola modal edit
export default function BpjsPage() {
  const {
    rows,
    loading,
    total,
    page,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    editModal,
    selected,
    handleEditOpen,
    handleClose,
    handleSuccess,
  } = useBpjsPage();

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    // Exporting original data for better format
    const exportData = data.map(r => ({
      'Detail BPJS': r.detailBpjs,
      'Kategori': r.kategoriBpjs,
      'Jenis': r.jenis,
      'Persentase': r.percent
    }));
    
    const headers = Object.keys(exportData[0]);
    const csv = [headers.join(','), ...exportData.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
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

  const columns: DataTableColumn<BpjsRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'detailBpjs', label: 'Detail BPJS', sortable: true },
    { id: 'kategoriBpjs', label: 'Kategori BPJS', sortable: true },
    { id: 'jenis', label: 'Jenis', sortable: true, align: 'center' },
    { id: 'percent', label: '%Value', sortable: true, align: 'center' },
  ];

  const actions: DataTableAction<BpjsRow>[] = [
    {
      label: '',
      icon: <IconPencil />,
      onClick: (row) => {
        if (row.original) {
          handleEditOpen(row.original);
        }
      },
      variant: 'outline',
      className: 'border-0',
    },
  ];

  return (
    <div className="p-4">
      <DataTable
        title="BPJS"
        data={rows}
        columns={columns}
        actions={actions}
        loading={loading}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        onPageChangeExternal={setPage}
        onRowsPerPageChangeExternal={setPageSize}
        onSearchChange={setSearch}
        onSortChange={(column, order) => setSort(column, order)}
        searchable
        filterable
        onExport={() => exportCSV('bpjs.csv', rows)}
      />
      <EditBpjsModal
        isOpen={editModal.isOpen}
        onClose={handleClose}
        defaultValues={selected}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
