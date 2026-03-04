import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import useTHRPages from '../../../hooks/pages/payroll-period-approval/useTHRPages';
import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import { THRRow } from '../../../hooks/pages/payroll-period-approval/useTHRPages';

export default function THRTab({ }: { resetKey?: string }) {
  const {
    rows,
    baseColumns,
    loading,
    page,
    total,
    pageSize,
    columnFilters,
    dateRangeFilters,
    title,
    detailPathPrefix,
    isApprovalPage,
    isDropdownOpen,
    approvalType,
    handleDetailNavigation,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearchChange,
    handleSortChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleApprovalTypeChange,
    setIsDropdownOpen,
    isPendingForApprovalType,
  } = useTHRPages();

  // Add format function for status column
  const formattedBaseColumns: DataTableColumn<THRRow>[] = baseColumns.map(col => {
    if (col.id === 'statusPersetujuan') {
      return {
        ...col,
        format: (v: any) => {
          const statusText = String(v);
          const normalize = (s: string) => s.trim().toLowerCase();

          const pendingMap: Record<string, string> = {
            'Persetujuan oleh Direktur HRGA': 'menunggu diproses direktur hrga',
            'Persetujuan oleh FAT': 'menunggu diproses fat',
            'Persetujuan oleh BOD': 'menunggu diproses bod',
          };

          const expectedPending = pendingMap[approvalType];
          const isPending = expectedPending ? normalize(statusText) === expectedPending : true;

          const badgeClass = isPending
            ? 'status-styling text-center rounded-full bg-orange-100 p-[10px] flex justify-center text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-200'
            : 'status-styling text-center rounded-full bg-blue-100 p-[10px] flex justify-center text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-200';

          return <span className={badgeClass}>{statusText}</span>;
        },
      };
    }
    return col;
  });

  return (
    <PenggajianTabBase
      resetKey="payroll-approval-thr"
      rows={rows}
      baseColumns={formattedBaseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      loading={loading}
      useExternalPagination={true}
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      onPageChangeExternal={handlePageChange}
      onRowsPerPageChangeExternal={handleRowsPerPageChange}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
      onColumnFilterChange={handleColumnFilterChange}
      columnFilters={columnFilters}
      onDateRangeFilterChange={handleDateRangeFilterChange}
      dateRangeFilters={dateRangeFilters}
      toolbarRightSlot={
        isApprovalPage && <div className="relative">
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 dropdown-toggle"
          >
            {approvalType}
            <ChevronDown size={16} />
          </Button>
          <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
            <div className="p-2 w-64">
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  handleApprovalTypeChange('Persetujuan oleh Direktur HRGA');
                }}
              >
                Persetujuan oleh Direktur HRGA
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  handleApprovalTypeChange('Persetujuan oleh FAT');
                }}
              >
                Persetujuan oleh FAT
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  handleApprovalTypeChange('Persetujuan oleh BOD');
                }}
              >
                Persetujuan oleh BOD
              </button>
            </div>
          </Dropdown>
        </div>
      }
    />
  );
}
