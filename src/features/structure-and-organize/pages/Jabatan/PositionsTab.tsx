import React, { useMemo } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { usePositions } from '../../index';
import type { PositionRow } from '../../types/organizationTable.types';
import { useModal } from '../../../../hooks/useModal';
import { AddPositionModal } from '../../components/modals/Jabatan/AddPositionModal';
import { EditPositionModal } from '../../components/modals/Jabatan/EditPositionModal';
import { DeletePositionModal } from '../../components/modals/Jabatan/DeletePositionModal';
import type { PositionListItem } from '../../types/organization.api.types';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
type Props = { resetKey: string };

const positionColumns: DataTableColumn<PositionRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'Nama Jabatan', label: 'Nama Jabatan', sortable: true },
  { id: 'Grade', label: 'Grade', sortable: true },
  { id: 'Deskripsi Tugas', label: 'Deskripsi Tugas', sortable: true },
  { id: 'Bawahan Langsung', label: 'Bawahan Langsung', sortable: true },
  { id: 'File SK & MoU', label: 'File SK & MoU', sortable: true, format: () => <FileText size={16} /> },
];

export default function PositionsTab({ resetKey }: Props) {
  const { positions, fetchPositions, setSearch, setPage, setPageSize, setSort } = usePositions();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = React.useState<PositionListItem | null>(null);

  const rows: PositionRow[] = useMemo(() => {
    return (positions || []).map((p, idx) => ({
      no: idx + 1,
      'Nama Jabatan': (p as any).name ?? '—',
      Grade: (p as any).grade ?? (p as any).level ?? '—',
      'Deskripsi Tugas': (p as any).jobDescription ?? (p as any).description ?? '—',
      'Bawahan Langsung': Array.isArray((p as any).directSubordinates) ? (p as any).directSubordinates.join(', ') : '—',
      'File SK & MoU': ((p as any).skFile || (p as any).memoFile) ? 'Ada' : '—',
      raw: p,
    }));
  }, [positions]);

  const actionsIconOnly = [
    {
      label: '',
      onClick: (row: any) => {
        setSelected(row.raw);
        editModal.openModal();
      },
      variant: 'outline',
      className: 'border-0',
      icon: <Edit />,
    },
    {
      label: '',
      onClick: (row: any) => {
        setSelected(row.raw);
        deleteModal.openModal();
      },
      variant: 'outline',
      className: 'border-0',
      color: 'error',
      icon: <Trash />,
    },
  ] as DataTableAction<any>[];

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => { fetchPositions(); }, [fetchPositions]);

  return (
    <>
      <DataTable
        title="Jabatan"
        data={rows}
        columns={positionColumns}
        actions={actionsIconOnly}
        searchable
        filterable
        resetKey={resetKey}
        onSearchChange={(val) => { setSearch(val); fetchPositions(); }}
        onSortChange={() => { setSort('name', 'asc'); fetchPositions(); }}
        onPageChangeExternal={(p) => { setPage(p); fetchPositions(); }}
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchPositions(); }}
        onColumnVisibilityChange={() => { fetchPositions(); }}
        onAdd={()=>addModal.openModal()}
        onExport={() => exportCSV('jabatan.csv', rows)}
      />
      <AddPositionModal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        onSuccess={() => {
          fetchPositions();
          addModal.closeModal();
          addNotification({
            description: 'Jabatan berhasil ditambahkan',
            variant: 'success',
            hideDuration: 4000,
            title: 'Jabatan ditambahkan',
          });
        }}
      />
      <EditPositionModal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        onSuccess={() => {
          fetchPositions();
          editModal.closeModal();
          addNotification({
            description: 'Jabatan berhasil diupdate',
            variant: 'success',
            hideDuration: 4000,
            title: 'Jabatan diupdate',
          });
        }}
        position={selected}
      />
      <DeletePositionModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onSuccess={() => {
          fetchPositions();
          deleteModal.closeModal();
          addNotification({
            description: 'Jabatan berhasil dihapus',
            variant: 'success',
            hideDuration: 4000,
            title: 'Jabatan dihapus',
          });
        }}
        position={selected}
      />
    </>
  );
}