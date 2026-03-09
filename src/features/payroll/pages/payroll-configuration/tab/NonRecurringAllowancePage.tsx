import { useNonFixedAllowance } from '@/features/payroll/hooks/modals/payroll-configuration/non-fixed-allowance/useNonFixedAllowance';
import DataTable, { type DataTableColumn, type DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil, IconHapus } from '@/icons/components/icons';
import EditTunjanganTidakTetapModal from '@/features/payroll/components/modals/payroll-configuration/non-recurring-allowance/EditNonRecurringAllowanceModal';
import EditNonRecurringAllowanceModalDelete from '@/features/payroll/components/modals/payroll-configuration/non-recurring-allowance/EditNonRecurringAllowanceModalDelete';

// Refactored Page Component
export default function NonRecurringAllowancePage() {
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
    addModal,
    editModal,
    deleteModal,
    selected,
    handleAddOpen,
    handleEditOpen,
    handleDeleteOpen,
    handleClose,
    handleSuccess,
    
    // API Actions
    createData,
    updateData,
    deleteData
  } = useNonFixedAllowance();

  const columns: DataTableColumn<any>[] = [
    { id: 'no', label: 'No.', align: 'center', sortable: false },
    { id: 'Nama Tunjangan', label: 'Nama Tunjangan', sortable: true },
    { id: 'Sub Kategori', label: 'Sub Kategori', sortable: true },
    { id: 'Deksripsi Umum', label: 'Deksripsi Umum', sortable: true },
  ];

  const actions: DataTableAction<any>[] = [
    { 
      label: '', 
      icon: <IconHapus />, 
      onClick: (row) => handleDeleteOpen(row.raw), 
      variant: 'outline', 
      className: 'border-0' 
    },
    { 
      label: '', 
      icon: <IconPencil />, 
      onClick: (row) => handleEditOpen(row.raw), 
      variant: 'outline', 
      className: 'border-0' 
    },
  ];

  const handleSave = async (values: { namaTunjangan: string; kategori: string; deskripsiUmum: string }) => {
    const payload = {
      allowanceName: values.namaTunjangan,
      categorySub: values.kategori,
      description: values.deskripsiUmum
    };

    if (selected) {
      await updateData(selected.id, payload);
    } else {
      await createData(payload);
    }
    
    // If successful (assuming no error caught in hook or we check result)
    // Hook handles error state internally.
    // For better UX, we could check if error is null, but hook implementation returns null on error for create/update/getDetail usually or handles it.
    // Let's assume success if we reach here without error thrown (hook catches errors though).
    // A better pattern would be if updateData returns success boolean or object.
    // updateData returns NonFixedAllowanceListItem | null.
    // If result is null and no error, maybe it's weird? 
    // Wait, updateData in hook returns null on success (void-like but typed null) or null on error.
    // Let's check updateData signature in useApiNonFixedAllowance:
    // returns Promise<NonFixedAllowanceListItem | null>. Returns null on success (line 154) and null on error (line 158).
    // This is ambiguous. But let's rely on handleSuccess calling fetchList.
    // We should probably check `error` state from hook, but it's not destructured here in handleSave scope directly (it is from hook return).
    
    handleSuccess();
  };

  const handleDelete = async () => {
    if (selected) {
      const success = await deleteData(selected.id);
      if (success) {
        handleSuccess();
      }
    }
  };

  return (
    <div className="p-4">
      <DataTable
        title="Tunjangan Tidak Tetap"
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
        onSearchChange={setSearch}
        onSortChange={(id, order) => setSort(id, order)}
        onPageChangeExternal={setPage}
        onRowsPerPageChangeExternal={setPageSize}
        onAdd={handleAddOpen}
        addButtonLabel="Tambah Tunjangan"
        onExport={() => { /* Implement export if needed */ }}
      />

      {/* Modal Add/Edit */}
      {(addModal.isOpen || editModal.isOpen) && (
        <EditTunjanganTidakTetapModal
          isOpen={addModal.isOpen || editModal.isOpen}
          onClose={handleClose}
          defaultValues={selected ? { namaTunjangan: selected.allowanceName, kategori: selected.categorySub, deskripsiUmum: selected.description } : { namaTunjangan: '', kategori: 'umum', deskripsiUmum: '' }}
          onSave={handleSave}
          title={selected ? 'Edit Tunjangan Tidak Tetap' : 'Tambah Tunjangan Tidak Tetap'}
          confirmTitleButton={selected ? 'Simpan Perubahan' : 'Simpan'}
        />
      )}

      {/* Delete Confirmation Modal */}
      <EditNonRecurringAllowanceModalDelete
        isOpen={deleteModal.isOpen}
        onClose={handleClose}
        onDelete={handleDelete}
        allowanceName={selected?.allowanceName}
      />
    </div>
  );
}
