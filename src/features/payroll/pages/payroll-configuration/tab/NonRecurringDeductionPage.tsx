
// Dokumentasi: Tabel Potongan Tidak Tetap + integrasi Modal Tambah/Edit
import DataTable, { type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil, IconHapus } from '@/icons/components/icons';
import NonRecurringDeductionModal from '@/features/payroll/components/modals/payroll-configuration/non-recurring-deduction/NonRecurringDeductionModal';
import NonRecurringDeductionModalDelete from '@/features/payroll/components/modals/payroll-configuration/non-recurring-deduction/NonRecurringDeductionModalDelete';
import { useNonRecurringDeduction } from '@/features/payroll/hooks/payroll-configuration/non-recurring-deduction/useNonRecurringDeduction';

type DeductionRow = {
  id: string;
  no: number;
  deductionName: string;
  category: string;
  description: string;
};

export default function NonRecurringDeductionPage() {
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
    
    addModal,
    editModal,
    deleteModal,
    detailValues,
    selectedName,
    
    handleAddOpen,
    handleEditOpen,
    handleDelete,
    onDeleteConfirm,
    handleSave,
  } = useNonRecurringDeduction();

  const columns: DataTableColumn<DeductionRow>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'deductionName', label: 'Nama Potongan', sortable: true },
    { id: 'category', label: 'Kategori', sortable: true },
    { id: 'description', label: 'Deksripsi Umum', sortable: true },
  ];

  const actions: DataTableAction<DeductionRow>[] = [
  
    { 
      label: '', 
      icon: <IconHapus />, 
      onClick: (row) => handleDelete(row.id, row.deductionName), 
      variant: 'outline', 
      className: 'border-0',
      color: 'error' 
    },  { 
      label: '', 
      icon: <IconPencil />, 
      onClick: (row) => handleEditOpen(row.id), 
      variant: 'outline', 
      className: 'border-0' 
    }
  ];

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
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

  return (
    <div className="p-4">
      <DataTable
        title="Potongan Tidak Tetap"
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
        
        onExport={() => exportCSV('potongan-tidak-tetap.csv', rows)}
        onAdd={handleAddOpen}
        addButtonLabel="Tambah Potongan"
      />

      {/* Add Modal */}
      <NonRecurringDeductionModal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        onSave={handleSave}
        title="Tambah Potongan Tidak Tetap"
        confirmTitleButton="Simpan"
        isLoading={loading}
      />

      {/* Edit Modal */}
      <NonRecurringDeductionModal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        defaultValues={detailValues}
        onSave={handleSave}
        title="Edit Potongan Tidak Tetap"
        confirmTitleButton="Simpan Perubahan"
        isLoading={loading}
      />

      {/* Delete Modal */}
      <NonRecurringDeductionModalDelete
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onDelete={onDeleteConfirm}
        deductionName={selectedName}
      />
    </div>
  );
}
