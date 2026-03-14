import { DataTable } from '../../../../../components/shared/datatable/DataTable';
import { useContractRenewal } from '../../../hooks/contract-renewal/useContractRenewal';



export default function PerpanjanganKontrak() {
  const {
    data,
    isLoading,
    columns,
    actions,
    columnFilters,
    dateRangeFilters,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleSearchChange,
    handleSortChange,
    currentPage,
    totalItems,
    perPage,
    handlePageChange,
    handleRowsPerPageChange,
  } = useContractRenewal();

  

  return (
    <div className="space-y-6">
      <DataTable
        data={data}
        columns={columns}
        actions={actions}
        title="Perpanjangan Kontrak"
        searchable={true}
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={perPage}
        pageSizeOptions={[10, 25, 50]}
        filterable={true}
        loading={isLoading}
        emptyMessage="Tidak ada data kontrak"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        useExternalPagination={true}
        externalPage={currentPage}
        externalTotal={totalItems}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        // toolbarRightSlot={
        //   <div className="relative">
        //     <Button
        //       onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        //       variant="outline"
        //       size="sm"
        //       className="flex items-center gap-1 dropdown-toggle"
        //     >
        //       Pengajuan & Kelola Kontrak
        //       <ChevronDown size={16} />
        //     </Button>
        //     <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
        //       <div className="p-2 w-64">
        //         <button
        //           className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        //           onClick={handleNavigateToExtension}
        //         >
        //           Pengajuan & Kelola Kontrak
        //         </button>
        //         <button
        //           className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        //           onClick={handleNavigateToApproval}
        //         >
        //           Persetujuan Perpanjangan Kontrak
        //         </button>
        //       </div>
        //     </Dropdown>
        //   </div>
        // }
      />
    </div>
  );
}