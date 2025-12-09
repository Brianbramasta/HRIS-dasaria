import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import DataTable, { DataTableColumn, DataTableAction } from '@/features/structure-and-organize/components/datatable/DataTable';
import Button from '@/components/ui/button/Button';
import { Edit, Trash } from 'react-feather';
import { IconDownloadTemplate, IconImport } from '@/icons/components/icons';
import Checkbox from '@/components/form/input/Checkbox';

type BaseRow = { idKaryawan: string; no?: number };

type Props<TRow extends BaseRow> = {
  resetKey: string;
  rows: TRow[];
  baseColumns: DataTableColumn<TRow>[];
  detailPathPrefix: string;
  title?: string;
};

export default function PenggajianTabBase<TRow extends BaseRow>({
  resetKey,
  rows,
  baseColumns,
  detailPathPrefix,
  title = 'Periode Gajian',
}: Props<TRow>) {
  const navigate = useNavigate();
  const location = useLocation();
  const isApprovalPage = location.pathname.includes('/approval-periode-gajian');

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  // Dokumentasi: Hitung status check-all untuk header (semua baris terpilih)
  const allChecked = rows.length > 0 && rows.every((r) => !!selected[r.idKaryawan]);

  const columns: DataTableColumn<TRow>[] = useMemo(() => {
    if (!isApprovalPage) return baseColumns;
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
  }, [isApprovalPage, selected, baseColumns, rows, allChecked]);

  const actions: DataTableAction<TRow>[] = [
    {
      label: '',
      icon: <Edit />,
      onClick: (row) => {
        const id = (row as BaseRow).idKaryawan;
        navigate(`${detailPathPrefix}/${id}`);
      },
      variant: 'outline',
      className: 'border-0',
    },
    { label: '', icon: <Trash />, onClick: () => {}, variant: 'outline', className: 'border-0', color: 'error' },
  ];

  const toolbarRightSlotAtas = isApprovalPage ? (
    <div className="flex items-center gap-3">
      <Button variant="custom" className="bg-[red] text-white dark:text-white" size="sm">Ditolak</Button>
      <Button variant="custom" className="bg-success text-white dark:text-white" size="sm">Disetujui</Button>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" className="bg-success text-white dark:text-white">
        <IconImport size={16} /> Import</Button>
      <Button variant="custom" className='w-max bg-[#007BFF] text-white dark:text-white' size="sm">
        <IconDownloadTemplate size={16} />
        Template Import Data</Button>
    </div>
  );

  return (
    <DataTable
      title={title}
      data={rows}
      columns={columns}
      actions={actions}
      toolbarRightSlotAtas={toolbarRightSlotAtas}
      resetKey={resetKey}
    />
  );
}
