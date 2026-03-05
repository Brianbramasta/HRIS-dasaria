import PayrollTabBase from '@/features/payroll/components/tabs/PayrollTabBase';
import useAEPages from '@/features/payroll/hooks/pages/distribution-payroll/useAEPages';
import { SalaryDistributionData } from '@/features/payroll/hooks/pages/distribution-payroll/useAEPages';

const toPayrollDistributionFilterColumnId = (columnId: string): string => {
  const map: Record<string, string> = {
    tanggalPengajuan: 'periode',
    statusPersetujuan: 'payroll_status_name',
  };
  return map[columnId] || columnId;
};

export default function AEPages() {
  const {
    rows,
    baseColumns,
    loading,
    pageSize,
    page,
    total,
    columnFilters,
    dateRangeFilters,
    title,
    detailPathPrefix,
    customActions,
    handleDistribusiSlipGaji,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    isRowSelectable,
  } = useAEPages();

  return (
    <>
      <PayrollTabBase<SalaryDistributionData>
        resetKey="distribution-ae"
        rows={rows}
        baseColumns={baseColumns}
        detailPathPrefix={detailPathPrefix}
        title={title}
        customActions={customActions}
        onFinalize={handleDistribusiSlipGaji}
        disableSelection={false}
        isRowSelectable={isRowSelectable}

        loading={loading}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        pageSize={pageSize}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        onColumnFilterChange={(columnId, values) => {
          const apiColumnId = toPayrollDistributionFilterColumnId(columnId);
          handleColumnFilterChange(apiColumnId, values);
        }}
        columnFilters={columnFilters}
        onDateRangeFilterChange={(columnId, startDate, endDate) => {
          const apiColumnId = toPayrollDistributionFilterColumnId(columnId);
          handleDateRangeFilterChange(apiColumnId, startDate, endDate);
        }}
        dateRangeFilters={dateRangeFilters}
      />
    </>
  );
}
