import { DataTable } from '@/components/shared/datatable/DataTable';
import { type OrgHistoryRow } from '@/features/employee/hooks/employee-data/detail/contract/useOrganizationHistory';
import { useOrganizationHistoryTab } from '@/features/employee/hooks/tab/useOrganizationHistoryTab';

 

 

// const formatDate = (iso: string) => {
//   if (!iso) return '-';
//   const d = new Date(iso);
//   const fmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
//   return fmt.format(d);
// };

interface Props { 
  employeeId?: string;
  isEditable: boolean }

export default function OrganizationHistoryTab({employeeId,  isEditable }: Props) {
  void isEditable;
  const {
    rows,
    columns,
    actions,
    loading,
    total,
    page,
    limit,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    columnFilters,
    dateRangeFilters,
  } = useOrganizationHistoryTab(employeeId);

  return (
      <DataTable<OrgHistoryRow>
        resetKey='riwayat-organisasi'
        title="Riwayat Organisasi"
        data={rows}
        columns={columns}
        actions={actions ? actions : []}
        filterable
        searchable={true}
        searchPlaceholder="Cari berdasarkan kata kunci"
        loading={loading}
        emptyMessage="Belum ada riwayat organisasi"
        pageSize={limit}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        useExternalPagination={true}
        externalPage={page}
        externalTotal={total}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        // addButtonLabel="Tambah Riwayat"
        // onAdd={() => //console.log('Add Org History')}
      />
  );
}
