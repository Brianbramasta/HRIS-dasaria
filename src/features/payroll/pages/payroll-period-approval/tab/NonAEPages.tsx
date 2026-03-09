import { DataTableColumn } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import PayrollApprovalModal from '../../../components/modals/payroll-period-approval/PayrollApprovalModal';
import useNonAEPages from '../../../hooks/pages/payroll-period-approval/useNonAEPages';
import { NonAERow } from '../../../hooks/pages/payroll-period-approval/useNonAEPages';


export default function NonAETab({ }: { resetKey?: string }) {
  const {
    rows,
    baseColumns: baseColumnsFromHook,
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
    isApprovalModalOpen,
    isSubmitting,
    selectedRowsForApproval,
    isDirectorHrga,
    isFat,
    isBod,
    handleDetailNavigation,
    handleApprovalWithModal,
    handleApprovalConfirm,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleApprovalTypeChange,
    setIsDropdownOpen,
    setIsApprovalModalOpen,
    setSelectedRowsForApproval,
    isPendingForApprovalType,
  } = useNonAEPages();

  // Add format function for status column
  const baseColumns: DataTableColumn<NonAERow>[] = baseColumnsFromHook.map(col => {
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
    <>
      <PenggajianTabBase
        key={`payroll-approval-non-ae-${approvalType}`}
        resetKey="payroll-approval-non-ae"
        rows={rows}
        baseColumns={baseColumns}
        detailPathPrefix={detailPathPrefix}
        title={title}
        onDetailNavigation={handleDetailNavigation}
        onFinalize={handleApprovalWithModal}
        approvalType={approvalType}
        disableSelection={false}
        isRowSelectable={(row) => isPendingForApprovalType(String(row.statusPersetujuan))}
        loading={loading}
        useExternalPagination={isApprovalPage && (isDirectorHrga || isFat || isBod)}
        externalPage={page}
        externalTotal={total}
        pageSize={pageSize}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
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
                  onClick={() => handleApprovalTypeChange('Persetujuan oleh Direktur HRGA')}
                >
                  Persetujuan oleh Direktur HRGA
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleApprovalTypeChange('Persetujuan oleh FAT')}
                >
                  Persetujuan oleh FAT
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleApprovalTypeChange('Persetujuan oleh BOD')}
                >
                  Persetujuan oleh BOD
                </button>
              </div>
            </Dropdown>
          </div>
        }
      />
      
      {/* Payroll Approval Modal */}
      <PayrollApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedRowsForApproval([]);
        }}
        onConfirm={handleApprovalConfirm}
        submitting={isSubmitting}
        statusPersetujuan={selectedRowsForApproval.length > 0 ? selectedRowsForApproval[0].statusPersetujuan : ''}
        periodDate={selectedRowsForApproval.length > 0 ? selectedRowsForApproval[0].tanggalPengajuan : ''}
        approvalType={approvalType}
      />
    </>
  );
}
