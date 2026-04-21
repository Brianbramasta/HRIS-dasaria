import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTableColumn,
  DataTableAction,
} from "@/components/shared/datatable/DataTable";
import PenggajianTabBase from "../../../components/tabs/PayrollTabBase";
import Button from "@/components/ui/button/Button";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { ChevronDown } from "react-feather";
import useNonAEPages from "../../../hooks/pages/payroll-period/useNonAEPages";
import { NonAERow } from "../../../hooks/pages/payroll-period/useNonAEPages";
import {
  IconFileDetail,
  IconPencil as Edit,
  IconHapus as Trash,
} from "@/icons/components/icons";
import React from "react";
import DevGeneratePayrollButton from "@/features/payroll/components/dev/DevGeneratePayrollButton";

export default function NonAETab({}: { resetKey?: string }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [approvalType, setApprovalType] = React.useState(
    "Persetujuan oleh Direktur HRGA",
  );

  const {
    rows,
    baseColumns: baseColumnsFromHook,
    loading,
    pageSize,
    page,
    total,
    columnFilters,
    dateRangeFilters,
    title,
    detailPathPrefix,
    isApprovalPage,
    handleDetailNavigation,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleFinalize,
    isRowSelectable,
    canEditDelete,
  } = useNonAEPages();

  const handleApprovalTypeChange = (type: string) => {
    setApprovalType(type);
    setIsDropdownOpen(false);
  };

  // Add format function for status column
  const baseColumns: DataTableColumn<NonAERow>[] = useMemo(() =>
    baseColumnsFromHook.map(
      (col) => {
        if (col.id === "statusPenggajian") {
          return {
            ...col,
            format: (v: any) => {
              const value = String(v ?? "");
              const lowered = value.toLowerCase();

              const badgeClass = lowered.includes("menunggu maker")
                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200"
                : lowered.includes("selesai")
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200"
                  : lowered.includes("distribusi")
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200";

              return (
                <span
                  className={`rounded-full p-[10px] flex justify-center text-center text-xs status-styling ${badgeClass}`}
                >
                  {value}
                </span>
              );
            },
          };
        }
        return col;
      },
    ), [baseColumnsFromHook]
  );

  const actions: DataTableAction<NonAERow>[] = useMemo(
    () => [
      {
        icon: React.createElement(IconFileDetail),
        onClick: (row) => {
          navigate(
            `${detailPathPrefix}/${row.payrollId}?approvalType=${encodeURIComponent(approvalType)}`,
          );
        },
        variant: "outline",
        color: "info",
        condition: (row) =>
          !row.statusPenggajian.toLowerCase().includes("menunggu maker"),
      },
      {
        icon: <Edit />,
        onClick: (row) => {
          navigate(`${detailPathPrefix}/${row.payrollId}`);
        },
        condition: (row) => {
          const editableStatuses = ["Menunggu Maker"];
          return editableStatuses.includes(row.statusPenggajian);
        },
        variant: "outline",
        className: "border-0",
      },
      {
        icon: <Trash />,
        onClick: (_row) => {
          // This would need to be handled by the parent component
          //console.log('Delete action for:', _row);
        },
        condition: (row) => {
          const editableStatuses = ["Menunggu Maker"];
          return editableStatuses.includes(row.statusPenggajian);
        },
        variant: "outline",
        className: "border-0",
        color: "error",
      },
    ],
    [navigate, detailPathPrefix, approvalType],
  );

  return (
    <PenggajianTabBase
      resetKey="payroll-period-non-ae"
      rows={rows}
      baseColumns={baseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      customActions={actions}
      isRowSelectable={isRowSelectable}
      canEditDelete={canEditDelete}
      disableImportButton={false}
      disableFinalizeButton={false}
      disableSelection={false}
      loading={loading}
      pageSize={pageSize}
      useExternalPagination={true}
      externalPage={page}
      externalTotal={total}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
      onPageChangeExternal={handlePageChange}
      onRowsPerPageChangeExternal={handleRowsPerPageChange}
      onColumnFilterChange={handleColumnFilterChange}
      columnFilters={columnFilters}
      onDateRangeFilterChange={handleDateRangeFilterChange}
      dateRangeFilters={dateRangeFilters}
      onFinalize={handleFinalize}
      templateType="Staff"
      toolbarRightSlot={
        <div className="flex flex-col sm:flex-row gap-2">
          <DevGeneratePayrollButton
            types={["Staff"]}
           onGenerated={() => navigate('/payroll-period/non-ae', { replace: true })}
          />

          {isApprovalPage && (
            <div className="relative">
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-1 dropdown-toggle w-full sm:w-auto"
              >
                {approvalType}
                <ChevronDown size={16} />
              </Button>

              <Dropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
              >
                <div className="p-2 w-64">
                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() =>
                      handleApprovalTypeChange("Persetujuan oleh FAT")
                    }
                  >
                    Persetujuan oleh FAT
                  </button>

                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() =>
                      handleApprovalTypeChange("Persetujuan oleh Direktur HRGA")
                    }
                  >
                    Persetujuan oleh Direktur HRGA
                  </button>

                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() =>
                      handleApprovalTypeChange("Persetujuan oleh BOD")
                    }
                  >
                    Persetujuan oleh BOD
                  </button>
                </div>
              </Dropdown>
            </div>
          )}
        </div>
      }
    />
  );
}
