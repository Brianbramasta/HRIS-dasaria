import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import Checkbox from '@/components/form/input/Checkbox';

export type BaseRow = { idKaryawan: string; no?: number };

export type UsePayrollTabBaseProps<TRow extends BaseRow> = {
  rows: TRow[];
  baseColumns: DataTableColumn<TRow>[];
  detailPathPrefix: string;
  onDetailNavigation?: (id: string) => void;
  customActions?: DataTableAction<TRow>[];
};

export default function usePayrollTabBase<TRow extends BaseRow>({
  rows,
  baseColumns,
  detailPathPrefix,
  onDetailNavigation,
  customActions,
}: UsePayrollTabBaseProps<TRow>) {
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

  const actions: DataTableAction<TRow>[] = useMemo(() => {
    // Dokumentasi: jika ada custom actions, gunakan itu, jika tidak gunakan default actions
    if (customActions) return customActions;

    return [
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
  }, [customActions, navigate, detailPathPrefix, onDetailNavigation]);

  return {
    isApprovalPage,
    isDistribusiPage,
    selected,
    setSelected,
    hasSelection,
    showDelete,
    setShowDelete,
    rowToDelete,
    setRowToDelete,
    showUpload,
    setShowUpload,
    columns,
    actions,
  };
}
