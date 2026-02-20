import { useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import Button from '@/components/ui/button/Button';
import { IconDownloadTemplate, IconImport } from '@/icons/components/icons';
import DeleteDataGajiModal from '@/features/payroll/components/modals/DeletePayrollDataModal';
import UploadExcelModal from '@/features/payroll/components/modals/UploadExcelModal';
import ApprovalModal from '@/features/payroll/components/modals/payroll-period/ApprovalModal';
import usePayrollTabBase, { BaseRow } from '@/features/payroll/hooks/tabs/usePayrollTabBase';
import { useApiPayrollPeriod } from '@/features/payroll/hooks/api/useApiPayrollPeriod';

type Props<TRow extends BaseRow> = {
  resetKey: string;
  rows: TRow[];
  baseColumns: DataTableColumn<TRow>[];
  detailPathPrefix: string;
  title?: string;
  onDetailNavigation?: (id: string) => void;
  toolbarRightSlot?: React.ReactNode;
  customActions?: DataTableAction<TRow>[];
  onFinalize?: (rows: TRow[]) => Promise<boolean>;

  enableSelection?: boolean;
  disableSelection?: boolean;
  isRowSelectable?: (row: TRow) => boolean;
  disableImportButton?: boolean;
  disableFinalizeButton?: boolean;

  loading?: boolean;
  pageSize?: number;
  useExternalPagination?: boolean;
  externalPage?: number;
  externalTotal?: number;
  onSearchChange?: (search: string) => void;
  onSortChange?: (columnId: string, order: 'asc' | 'desc') => void;
  onPageChangeExternal?: (page: number) => void;
  onRowsPerPageChangeExternal?: (rowsPerPage: number) => void;
  onColumnFilterChange?: (columnId: string, values: string[]) => void;
  columnFilters?: Record<string, string[]>;
  onDateRangeFilterChange?: (columnId: string, startDate: string, endDate: string | null) => void;
  dateRangeFilters?: Record<string, { startDate: string; endDate: string | null }>;

  canEditDelete?: (row: TRow) => boolean;
};

export default function PenggajianTabBase<TRow extends BaseRow>({
  resetKey,
  rows,
  baseColumns,
  detailPathPrefix,
  title = 'Periode Gajian',
  onDetailNavigation,
  toolbarRightSlot,
  customActions,
  onFinalize,

  enableSelection = true,
  disableSelection = false,
  isRowSelectable,
  disableImportButton = false,
  disableFinalizeButton = false,

  loading,
  pageSize,
  useExternalPagination,
  externalPage,
  externalTotal,
  onSearchChange,
  onSortChange,
  onPageChangeExternal,
  onRowsPerPageChangeExternal,
  onColumnFilterChange,
  columnFilters,
  onDateRangeFilterChange,
  dateRangeFilters,

  canEditDelete,
}: Props<TRow>) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { deletePayrollPeriod } = useApiPayrollPeriod();

  const {
    isApprovalPage,
    isDistribusiPage,
    hasSelection,
    selectedRows,
    clearSelection,
    showDelete,
    setShowDelete,
    rowToDelete,
    setRowToDelete,
    showUpload,
    setShowUpload,
    columns,
    actions,
  } = usePayrollTabBase({
    rows,
    baseColumns,
    detailPathPrefix,
    onDetailNavigation,
    customActions,
    canEditDelete,
    enableSelection,
    disableSelection,
    isRowSelectable,
  });

  const handleApprovalConfirm = async () => {
    setIsApproving(true);
    try {
      if (!onFinalize) return;
      const ok = await onFinalize(selectedRows as TRow[]);
      if (ok) clearSelection();
    } finally {
      setIsApproving(false);
      setShowApprovalModal(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;
    const baseRow = rowToDelete as BaseRow;
    const payrollId = baseRow.payrollId ?? baseRow.idKaryawan;
    if (!payrollId) return;

    setIsDeleting(true);
    try {
      const ok = await deletePayrollPeriod({ payrollId: String(payrollId) });
      if (!ok) return;

      setShowDelete(false);
      setRowToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const toolbarRightSlotAtas = isApprovalPage
    ? (<>
        <div className="flex items-center gap-3">
          {/* <Button variant="custom" className="bg-[red] text-white dark:text-white" size="sm" disabled={!hasSelection}>Ditolak</Button> */}
          <Button variant="custom" className="bg-success text-white dark:text-white" size="sm" disabled={!hasSelection}>Setuju</Button>
        </div>
        </>
      )
    : isDistribusiPage
    ? (
        <div className="flex items-center gap-3">
          <Button variant="custom" className='w-max bg-[#007BFF] text-white dark:text-white' size="sm" disabled={!hasSelection}>Distribusi Gaji</Button>
        </div>
      )
    : (
        <div className="flex items-center gap-3">
          <Button variant="custom" className="w-max border border-[#007BFF] bg-[white] text-[#007BFF] dark:text-white color-[#007BFF]" size="sm">
            <IconDownloadTemplate size={16} color="#007BFF" />
            Template Import Data
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-success text-white dark:text-white"
            onClick={() => setShowUpload(true)}
            disabled={disableImportButton}
          >
            <IconImport size={16} /> Import
          </Button>

          <Button
            variant="custom"
            className="w-max bg-[#007BFF] text-white dark:text-white"
            size="sm"
            disabled={!hasSelection || disableFinalizeButton}
            onClick={() => setShowApprovalModal(true)}
          >
            Finalisasi Data
          </Button>
        </div>
      );

  // Dokumentasi: render DataTable dan modal delete
  return (
    <>
      <DataTable
        title={title}
        data={rows}
        columns={columns}
        actions={actions}
        loading={loading}
        pageSize={pageSize}
        toolbarRightSlotAtas={toolbarRightSlotAtas}
        appendDefaultToolbarRightAtas={isDistribusiPage}
        onExport={isDistribusiPage ? () => {} : undefined}
        resetKey={resetKey}
        toolbarRightSlot={toolbarRightSlot}

        useExternalPagination={useExternalPagination}
        externalPage={externalPage}
        externalTotal={externalTotal}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
        onPageChangeExternal={onPageChangeExternal}
        onRowsPerPageChangeExternal={onRowsPerPageChangeExternal}
        onColumnFilterChange={onColumnFilterChange}
        columnFilters={columnFilters}
        onDateRangeFilterChange={onDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
      />
      <DeleteDataGajiModal
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setRowToDelete(null); }}
        data={rowToDelete ? { idKaryawan: (rowToDelete as BaseRow).idKaryawan, pengguna: (rowToDelete as any)?.pengguna } : null}
        handleDelete={handleDeleteConfirm}
        submitting={isDeleting}
      />
      <UploadExcelModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onImport={async (_file) => { console.log(_file); setShowUpload(false); }}
      />
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onConfirm={handleApprovalConfirm}
        submitting={isApproving}
        description="Periode gaji yang disahkan akan dikunci dan tidak dapat diubah. Pastikan semua data telah sesuai sebelum melanjutkan proses approval."
      />
    </>
  );
}
