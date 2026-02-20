import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import Checkbox from '@/components/form/input/Checkbox';

export type BaseRow = { idKaryawan: string; payrollId?: string; no?: number };

export type UsePayrollTabBaseProps<TRow extends BaseRow> = {
  rows: TRow[];
  baseColumns: DataTableColumn<TRow>[];
  detailPathPrefix: string;
  onDetailNavigation?: (id: string) => void;
  customActions?: DataTableAction<TRow>[];
  canEditDelete?: (row: TRow) => boolean;
  enableSelection?: boolean;
  disableSelection?: boolean;
  isRowSelectable?: (row: TRow) => boolean;
};

export default function usePayrollTabBase<TRow extends BaseRow>({
  rows,
  baseColumns,
  detailPathPrefix,
  onDetailNavigation,
  customActions,
  canEditDelete,
  enableSelection = true,
  disableSelection = false,
  isRowSelectable,
}: UsePayrollTabBaseProps<TRow>) {
  const navigate = useNavigate();
  const location = useLocation();
  // Dokumentasi: Deteksi halaman Approval & Distribusi untuk mengatur checkbox & toolbar
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const isPayrollPeriodPage = location.pathname.includes('/payroll-period') && !isApprovalPage;

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const rowKeyMap = useMemo(() => {
    const map = new Map<TRow, string>();
    const occurrenceById = new Map<string, number>();
    rows.forEach((r, index) => {
      const rawKey = (r as BaseRow).idKaryawan;
      if (!rawKey) {
        map.set(r, `__row_${index}`);
        return;
      }

      const id = String(rawKey);
      const occurrence = occurrenceById.get(id) ?? 0;
      occurrenceById.set(id, occurrence + 1);

      const key = occurrence === 0 ? id : `${id}__${occurrence}`;
      map.set(r, key);
    });
    return map;
  }, [rows]);

  const getRowKey = (row: TRow) => {
    const mapped = rowKeyMap.get(row);
    if (mapped) return mapped;

    const id = String((row as BaseRow).idKaryawan ?? '');
    const no = (row as BaseRow).no;
    if (id && no != null) return `${id}__no_${no}`;

    if (!id) return '';

    const indexInRows = rows.findIndex((r) => {
      if (r === row) return true;
      return (r as BaseRow).idKaryawan === id && (no == null || (r as BaseRow).no === no);
    });

    return indexInRows >= 0 ? `${id}__idx_${indexInRows}` : id;
  };

  const selectableRows = useMemo(() => {
    if (!isRowSelectable) return rows;
    return rows.filter((r) => isRowSelectable(r));
  }, [rows, isRowSelectable]);

  // Dokumentasi: Hitung status check-all untuk header (semua baris terpilih)
  const allChecked =
    selectableRows.length > 0 &&
    selectableRows.every((r) => {
      const key = getRowKey(r);
      return !!selected[key];
    });
  const hasSelection = selectableRows.some((r) => !!selected[getRowKey(r)]);

  const selectedRows = useMemo(() => {
    if (!rows.length) return [] as TRow[];
    return rows.filter((r) => {
      const key = getRowKey(r);
      return !!selected[key];
    });
  }, [rows, selected, rowKeyMap]);

  const clearSelection = () => setSelected({});

  // Dokumentasi: state untuk kontrol modal delete dan data baris yang dipilih
  const [showDelete, setShowDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<TRow | null>(null);
  // Dokumentasi: state kontrol modal upload import CSV
  const [showUpload, setShowUpload] = useState(false);

  const columns: DataTableColumn<TRow>[] = useMemo(() => {
    if (!enableSelection) return baseColumns;
    if (!isApprovalPage && !isDistribusiPage && !isPayrollPeriodPage) return baseColumns;
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
          disabled={disableSelection || selectableRows.length === 0}
          onChange={(checked) => {
            if (disableSelection) return;
            const next: Record<string, boolean> = {};
            selectableRows.forEach((r) => {
              next[getRowKey(r)] = checked;
            });
            setSelected(next);
          }}
        />
      ),
      format: (_v, row) => (
        (() => {
          const rowSelectable = isRowSelectable ? isRowSelectable(row as TRow) : true;
          const disabled = disableSelection || !rowSelectable;
          return (
        <Checkbox
          checked={!!selected[getRowKey(row as TRow)]}
          disabled={disabled}
          onChange={(checked) =>
            disabled ? undefined : setSelected((prev) => ({ ...prev, [getRowKey(row as TRow)]: checked }))
          }
        />
          );
        })()
      ),
    };
    return [selectCol, ...baseColumns];
  }, [enableSelection, disableSelection, isApprovalPage, isDistribusiPage, isPayrollPeriodPage, selected, baseColumns, rows, allChecked, rowKeyMap, selectableRows, isRowSelectable]);

  const actions: DataTableAction<TRow>[] = useMemo(() => {
    // Dokumentasi: jika ada custom actions, gunakan itu, jika tidak gunakan default actions
    if (customActions) return customActions;

    const allowEditDelete = (row: TRow) => {
      if (!canEditDelete) return true;
      return !!canEditDelete(row);
    };

    const onDetail = (row: TRow) => {
      const baseRow = row as BaseRow;
      const id = baseRow.payrollId ?? baseRow.idKaryawan;
      if (onDetailNavigation) {
        onDetailNavigation(id);
      } else {
        navigate(`${detailPathPrefix}/${id}`);
      }
    };

    const detailAction: DataTableAction<TRow> = {
      label: '',
      icon: <IconFileDetail />,
      onClick: onDetail,
      condition: allowEditDelete,
      variant: 'outline',
      className: 'border-0',
    };

    if (isApprovalPage) return [detailAction];

    return [
      detailAction,
      {
        label: '',
        icon: <Edit />,
        onClick: onDetail,
        condition: allowEditDelete,
        variant: 'outline',
        className: 'border-0',
      },
      // Dokumentasi: tombol hapus membuka modal konfirmasi
      { label: '', icon: <Trash />, onClick: (row) => { setRowToDelete(row as TRow); setShowDelete(true); }, condition: allowEditDelete, variant: 'outline', className: 'border-0', color: 'error' },
    ];
  }, [customActions, canEditDelete, navigate, detailPathPrefix, onDetailNavigation, isApprovalPage]);

  return {
    isApprovalPage,
    isDistribusiPage,
    selected,
    setSelected,
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
  };
}
