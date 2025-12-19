import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import DataTable, { DataTableColumn, DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import Button from '@/components/ui/button/Button';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { IconDownloadTemplate, IconImport } from '@/icons/components/icons';
import Checkbox from '@/components/form/input/Checkbox';
import DeleteDataGajiModal from '@/features/payroll/components/modals/DeletePayrollDataModal';
import UploadExcelModal from '@/features/payroll/components/modals/UploadExcelModal';

type BaseRow = { idKaryawan: string; no?: number };

type Props<TRow extends BaseRow> = {
  resetKey: string;
  rows: TRow[];
  baseColumns: DataTableColumn<TRow>[];
  detailPathPrefix: string;
  title?: string;
  onDetailNavigation?: (id: string) => void;
  toolbarRightSlot?: React.ReactNode;
};

export default function PenggajianTabBase<TRow extends BaseRow>({
  resetKey,
  rows,
  baseColumns,
  detailPathPrefix,
  title = 'Periode Gajian',
  onDetailNavigation,
  toolbarRightSlot,
}: Props<TRow>) {
  const navigate = useNavigate();
  const location = useLocation();
  // Dokumentasi: Deteksi halaman Approval & Distribusi untuk mengatur checkbox & toolbar
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  // Dokumentasi: Hitung status check-all untuk header (semua baris terpilih)
  const allChecked = rows.length > 0 && rows.every((r) => !!selected[r.idKaryawan]);
  const hasSelection = Object.values(selected).some(Boolean);

  // Dokumentasi: state untuk kontrol modal delete dan data baris yang dipilih
  const [showDelete, setShowDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<TRow | null>(null);
  // Dokumentasi: state kontrol modal upload import CSV
  const [showUpload, setShowUpload] = useState(false);

  const columns: DataTableColumn<TRow>[] = useMemo(() => {
    if (!isApprovalPage && !isDistribusiPage) return baseColumns;
    // Dokumentasi: Tambahkan kolom aksi 'select' dengan header checkbox untuk check-all
    const selectCol: DataTableColumn<TRow> = {
      id: 'select',
      label: '',
      align: 'center',
      sortable: false,
      isAction: true,
      headerFormat: () => (
        <Checkbox
          checked={allChecked}
          onChange={(checked) => {
            const next: Record<string, boolean> = {};
            rows.forEach((r) => {
              next[r.idKaryawan] = checked;
            });
            setSelected(next);
          }}
        />
      ),
      format: (_v, row) => (
        <Checkbox
          checked={!!selected[(row as BaseRow).idKaryawan]}
          onChange={(checked) =>
            setSelected((prev) => ({ ...prev, [(row as BaseRow).idKaryawan]: checked }))
          }
        />
      ),
    };
    return [selectCol, ...baseColumns];
  }, [isApprovalPage, isDistribusiPage, selected, baseColumns, rows, allChecked]);

  const actions: DataTableAction<TRow>[] = [
    {
      label: '',
      icon: <Edit />,
      onClick: (row) => {
        const id = (row as BaseRow).idKaryawan;
        if (onDetailNavigation) {
          onDetailNavigation(id);
        } else {
          navigate(`${detailPathPrefix}/${id}`);
        }
      },
      variant: 'outline',
      className: 'border-0',
    },
    // Dokumentasi: tombol hapus membuka modal konfirmasi
    { label: '', icon: <Trash />, onClick: (row) => { setRowToDelete(row as TRow); setShowDelete(true); }, variant: 'outline', className: 'border-0', color: 'error' },
  ];

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
