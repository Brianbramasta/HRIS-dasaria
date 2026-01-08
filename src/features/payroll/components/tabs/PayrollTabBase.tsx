import DataTable, { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import Button from '@/components/ui/button/Button';
import { IconDownloadTemplate, IconImport } from '@/icons/components/icons';
import DeleteDataGajiModal from '@/features/payroll/components/modals/DeletePayrollDataModal';
import UploadExcelModal from '@/features/payroll/components/modals/UploadExcelModal';
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
          {/* Dokumentasi: tombol Import membuka modal upload */}
          <Button variant="outline" size="sm" className="bg-success text-white dark:text-white" onClick={() => setShowUpload(true)}>
            <IconImport size={16} /> Import
          </Button>
          <Button variant="custom" className='w-max bg-[#007BFF] text-white dark:text-white' size="sm">
            <IconDownloadTemplate size={16} />
            Template Import Data
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
    </>
  );
}
