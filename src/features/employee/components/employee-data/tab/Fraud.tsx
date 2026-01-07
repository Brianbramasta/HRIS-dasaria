import { DataTable } from '@/components/shared/datatable/DataTable';
import PelanggaranModal, { type PelanggaranEntry } from '@/features/employee/components/modals/employee-data/fraud/FraudModal';
import { useFraudTab } from '@/features/employee/hooks/tab/useFraudTab';
 
interface Props {
  employeeId: string;
}
 
export default function PelanggaranTab({ employeeId }: Props) {
  const {
    list,
    columns,
    actions,
    isOpen,
    editing,
    disciplinaryOptions,
    handleAdd,
    handleSave,
    closeModal,
    isLoading,
    isSubmitting,
    page,
    total,
    limit,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleDateRangeFilterChange,
    dateRangeFilters,
    handleColumnFilterChange,
    columnFilters,
  } = useFraudTab({ employeeId });
 
  return (
    <>
      <DataTable<PelanggaranEntry>
        title="Pelanggaran"
        data={list}
        columns={columns}
        actions={actions}
        filterable
        loading={isLoading}
        emptyMessage="Tidak ada catatan pelanggaran."
        addButtonLabel="Tambah Pelanggaran"
        onAdd={handleAdd}
        
        useExternalPagination={true}
        externalPage={page}
        externalTotal={total}
        pageSize={limit}
        
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
      />
 
      <PelanggaranModal
        isOpen={isOpen}
        mode={editing ? 'edit' : 'add'}
        initialData={editing ?? undefined}
        onClose={closeModal}
        onSubmit={handleSave}
        submitting={isLoading || isSubmitting}
        disciplinaryOptions={disciplinaryOptions}
        onFileChange={() => {}}
      />
    </>
    
  );
}
