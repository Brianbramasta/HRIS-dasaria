import React, { useMemo } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { usePositions } from '../../Index';
import type { PositionRow } from '../../types/OrganizationTableTypes';
import { useModal } from '../../../../hooks/useModal';
import { AddPositionModal } from '../../components/modals/job-title/AddPositionModal';
import { EditPositionModal } from '../../components/modals/job-title/EditPositionModal';
import { DeletePositionModal } from '../../components/modals/job-title/DeletePositionModal';
import type { PositionListItem } from '../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
import { useFileStore } from '@/stores/fileStore';
import { formatUrlFile } from '@/utils/formatUrlFile';
type Props = { resetKey: string };

const positionColumns: DataTableColumn<PositionRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'Nama Jabatan', label: 'Nama Jabatan', sortable: true },
  { id: 'Grade', label: 'Golongan', sortable: true },
  { id: 'Deskripsi Tugas', label: 'Deskripsi Tugas', sortable: true },
  { id: 'Bawahan Langsung', label: 'Bawahan Langsung', sortable: true },
  { id: 'File SK & MoU', label: 'File SK & MoU', sortable: false, isAction: true, format: (row: PositionRow) => (row.fileUrl ? <a href={formatUrlFile(row.fileUrl as string)} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'><FileText size={16} /></a> : '—' )},
];

// Dokumentasi: Halaman Jabatan menggunakan pagination eksternal agar kompatibel dengan DataTable
export default function PositionsTab({ resetKey }: Props) {
  const { positions, fetchPositions, setSearch, setPage, setPageSize, setSort, page, pageSize, total, loading } = usePositions();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = React.useState<PositionListItem | null>(null);
  const fileStore = useFileStore();

  const rows: PositionRow[] = useMemo(() => {
    return (positions || []).map((p, idx) => ({
      no: idx + 1,
      'Nama Jabatan': (p as any).name ?? '—',
      Grade: (p as any).grade ?? (p as any).level ?? '—',
      'Deskripsi Tugas': (p as any).jobDescription ?? (p as any).description ?? '—',
      'Bawahan Langsung': Array.isArray((p as any).directSubordinates) ? (p as any).directSubordinates.join(', ') : '—',
      'File SK & MoU': (p as any).skFile ?? '—',
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


  return (
    <>
      <DataTable
        title="Jabatan"
        data={rows}
        columns={positionColumns}
        actions={actionsIconOnly}
        loading={loading}
        pageSize={pageSize}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        searchable
        filterable
        resetKey={resetKey}
        onSearchChange={(val) => { setSearch(val); }}
        onSortChange={(columnId, order) => { setSort(columnId, order); }}
        onPageChangeExternal={(p) => { setPage(p); }}
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); }}
        
        onAdd={()=>addModal.openModal()}
        onExport={() => exportCSV('jabatan.csv', rows)}
      />
      <AddPositionModal
        isOpen={addModal.isOpen}
        onClose={() => { addModal.closeModal(); fileStore.clearSkFile(); }}
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
        onClose={() => { editModal.closeModal(); fileStore.clearSkFile(); }}
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
        onClose={() => { deleteModal.closeModal(); fileStore.clearSkFile(); }}
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
