import { useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import Button from '@/components/ui/button/Button';
import { IconDownloadTemplate, IconImport } from '@/icons/components/icons';
import DeleteDataGajiModal from '@/features/payroll/components/modals/DeletePayrollDataModal';
import UploadExcelModal from '@/features/payroll/components/modals/UploadExcelModal';
import ApprovalModal from '@/features/payroll/components/modals/payroll-period/ApprovalModal';
import usePayrollTabBase, { BaseRow } from '@/features/payroll/hooks/tabs/usePayrollTabBase';

type Props<TRow extends BaseRow> = {
  resetKey: string;
  rows: TRow[];
  baseColumns: DataTableColumn<TRow>[];
  detailPathPrefix: string;
  title?: string;
  onDetailNavigation?: (id: string) => void;
  toolbarRightSlot?: React.ReactNode;
  customActions?: DataTableAction<TRow>[];
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
}: Props<TRow>) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const {
    isApprovalPage,
    isDistribusiPage,
    hasSelection,
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
  });

  const handleApprovalConfirm = async () => {
    setIsApproving(true);
    try {
      // TODO: Implementasi API call untuk finalisasi data
      console.log('Finalisasi data payroll');
      // Simulasi delay untuk demo
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsApproving(false);
      setShowApprovalModal(false);
    }
  };

  const toolbarRightSlotAtas = isApprovalPage
    ? (<>
        <div className="flex items-center gap-3">
          <Button variant="custom" className="bg-[red] text-white dark:text-white" size="sm" disabled={!hasSelection}>Ditolak</Button>
          <Button variant="custom" className="bg-success text-white dark:text-white" size="sm" disabled={!hasSelection}>Disetujui</Button>
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
          <Button variant="outline" size="sm" className="bg-success text-white dark:text-white" onClick={() => setShowUpload(true)}>
            <IconImport size={16} /> Import
          </Button>
          
          <Button variant="custom" className="w-max bg-[#007BFF] text-white dark:text-white" size="sm" onClick={() => setShowApprovalModal(true)}>
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
        toolbarRightSlotAtas={toolbarRightSlotAtas}
        appendDefaultToolbarRightAtas={isDistribusiPage}
        onExport={isDistribusiPage ? () => {} : undefined}
        resetKey={resetKey}
        toolbarRightSlot={toolbarRightSlot}
      />
      <DeleteDataGajiModal
        isOpen={showDelete}
        onClose={() => { setShowDelete(false); setRowToDelete(null); }}
        data={rowToDelete ? { idKaryawan: (rowToDelete as BaseRow).idKaryawan, pengguna: (rowToDelete as any)?.pengguna } : null}
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
        payrollPeriodName={title}
        description="Periode gaji yang disahkan akan dikunci dan tidak dapat diubah. Pastikan semua data telah sesuai sebelum melanjutkan proses approval."
      />
    </>
  );
}
