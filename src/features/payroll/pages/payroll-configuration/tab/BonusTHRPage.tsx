
// Dokumentasi: Tabel Tunjangan Hari Raya + integrasi Modal Edit THR
import DataTable, { type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil } from '@/icons/components/icons';
import Switch from '@/components/form/switch/Switch';
import EditThrModal from '@/features/payroll/components/modals/payroll-configuration/thr/EditThrModal';
import { useConfigurationTHR } from '@/features/payroll/hooks/payroll-configuration/thr/useConfigurationTHR';

type THRConfigRow = {
  id: string;
  no: number;
  'Lama Kerja': string;
  'Deksripsi Umum': string;
  raw: any;
};

export default function THRPage() {
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
    
    // Modal & Handlers
    editModal,
    selected,
    handleEditOpen,
    handleClose,
    handleSave,
    handleToggleStatus,
  } = useConfigurationTHR();

  // Columns definition
  const columns: DataTableColumn<THRConfigRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'Lama Kerja', label: 'Lama Kerja', sortable: true },
    { id: 'Deksripsi Umum', label: 'Deksripsi Umum', sortable: true },
  ];

  const actions: DataTableAction<THRConfigRow>[] = [
    { 
      label: '', 
      icon: <IconPencil />, 
      onClick: (row) => handleEditOpen(row.raw), 
      variant: 'outline', 
      className: 'border-0' 
    },
  ];

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).filter(k => k !== 'raw' && k !== 'id');
    const csv = [headers.join(',') , ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
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

  const switchSlot = (
    <Switch
      label={'Status THR'}
      defaultChecked={false} 
      onChange={(val) => handleToggleStatus(val)}
      color="blue"
    />
  );

  return (
    <div className="p-4">
      <DataTable
        title="Tunjangan Hari Raya"
        data={rows}
        columns={columns}
        actions={actions}
        searchable
        filterable
        loading={loading}
        pageSize={pageSize}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        onSearchChange={(val) => setSearch(val)}
        onSortChange={(columnId, order) => setSort(columnId, order)}
        onPageChangeExternal={(p) => setPage(p)}
        onRowsPerPageChangeExternal={(ps) => setPageSize(ps)}
        onExport={() => exportCSV('tunjangan-hari-raya.csv', rows)}
        toolbarRightSlotAtas={switchSlot}
      />
      {editModal.isOpen && (
        <EditThrModal
          isOpen={editModal.isOpen}
          onClose={handleClose}
          defaultValues={selected ? {
            lamaKerja: selected.lengthOfService,
            deskripsiUmum: selected.description
          } : null}
          onSave={handleSave}
          isLoading={loading}
        />
      )}
    </div>
  );
}
