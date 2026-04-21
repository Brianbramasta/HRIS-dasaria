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
    error,
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
      {error && (
        <div className="h-fit rounded-lg border border-l-8 border-[#EE0017] bg-[#F1AEB580]/60 p-4 dark:border-red-800 dark:bg-red-900/20 mb-6 shadow-lg">
           <div className="text-lg font-semibold text-[#212529] dark:text-red-300 mb-2 text-center">Skema Baru Belum Digunakan</div>
            <div className="text-xs text-[#626262] dark:text-red-400 text-center">
              Menu pelanggaran belum dapat digunakan pada fase saat ini. Fitur ini masih dalam tahap pengembangan dan akan segera tersedia.
            </div>
        </div>
      )}
      
      <DataTable<PelanggaranEntry>
        title="Pelanggaran"
        resetKey='pelanggaran'
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
