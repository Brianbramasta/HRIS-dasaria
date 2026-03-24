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
import useTHRPages from "../../../hooks/pages/payroll-period/useTHRPages";
import { THRRow } from "../../../hooks/pages/payroll-period/useTHRPages";
import {
  IconFileDetail,
  IconPencil as Edit,
  IconHapus as Trash,
} from "@/icons/components/icons";
import React from "react";
import DevGeneratePayrollButton from "@/features/payroll/components/dev/DevGeneratePayrollButton";

export default function THRTab({}: { resetKey?: string }) {
  const navigate = useNavigate();
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
    isApprovalPage,
    isDropdownOpen,
    approvalType,
    handleDetailNavigation,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    setIsDropdownOpen,
    handleApprovalTypeChange,
    isRowSelectable,
    canEditDelete,
    handleFinalize,
  } = useTHRPages();
  // Add format function for status column
  const enhancedColumns: DataTableColumn<THRRow>[] = baseColumns.map((col) => {
    if (col.id === "statusTHR") {
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
  });

  const actions: DataTableAction<THRRow>[] = useMemo(
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
          !row.statusTHR.toLowerCase().includes("menunggu maker"),
      },
      {
        icon: <Edit />,
        onClick: (row) => {
          navigate(`${detailPathPrefix}/${row.payrollId}`);
        },
        condition: (row) => {
          const editableStatuses = ["Menunggu Maker"];
          return editableStatuses.includes(row.statusTHR);
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
          return editableStatuses.includes(row.statusTHR);
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
      resetKey="payroll-period-thr"
      rows={rows}
      baseColumns={enhancedColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      customActions={actions}
      isRowSelectable={isRowSelectable}
      canEditDelete={canEditDelete}
      disableImportButton={false}
      disableTemplateButton={true}
      disableFinalizeButton={false}
      disableSelection={false}
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
      onFinalize={handleFinalize}
      templateType="Thr"
      toolbarRightSlot={
        <>
          <DevGeneratePayrollButton
            types={["Thr"]}
            onGenerated={() => navigate('/payroll-period/thr', { replace: true })}
          />

          {isApprovalPage && (
            <div className="relative">
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 dropdown-toggle"
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
        </>
      }
    />
  );
}
