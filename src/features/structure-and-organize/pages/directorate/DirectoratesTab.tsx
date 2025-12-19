import { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { useDirectorates } from '../../Index';
import type { DirectorateRow } from '../../types/OrganizationTableTypes';
import type { DirectorateListItem } from '../../types/OrganizationApiTypes';
import { useModal } from '../../../../hooks/useModal';
import AddDirectorateModal from '../../components/modals/directorate/AddDirectorateModal';
import EditDirectorateModal from '../../components/modals/directorate/EditDirectorateModal';
import DeleteDirectorateModal from '../../components/modals/directorate/DeleteDirectorateModal';
import { FileText } from '@/icons/components/icons';
import { addNotification } from '@/stores/notificationStore';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { useFileStore } from '@/stores/fileStore';

type Props = { resetKey: string };

const directorateColumns: DataTableColumn<DirectorateRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'direktorat-name', label: 'Nama Direktorat', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'file-sk-dan-memo', label: 'File SK dan Memo', sortable: false, align: 'center', isAction: true, format: (row: DirectorateRow) => (
    row.fileUrl ? <a href={formatUrlFile(row.fileUrl as string)} target="_blank" rel="noopener noreferrer" className='flex justify-center items-center'><FileText size={16} /></a> : '—' )},  
];

export default function DirectoratesTab({ resetKey }: Props) {
  const { directorates, fetchDirectorates, setSearch, setPage, setPageSize, setSort, page, pageSize, total } = useDirectorates();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DirectorateListItem | null>(null);
  const fileStore = useFileStore();

  const rows: any[] = useMemo(() => {
    return (directorates || []).map((d, idx) => ({
      no: idx + 1,
      'nama-direktorat': (d as any).name ?? '—',
      'deskripsi-umum': (d as any).description ?? '—',
      'file-sk-dan-memo': (d as any).skFile ??'-',
      raw: d,
    }));
  }, [directorates]);

  const actionsIconOnly = [
    { label: '', onClick: (row: any) => { setSelected(row.raw as DirectorateListItem); editModal.openModal(); }, variant: 'outline', className: 'border-0', icon: <Edit  /> },
    { label: '', onClick: (row: any) => { setSelected(row.raw as DirectorateListItem); deleteModal.openModal(); }, variant: 'outline', className: 'border-0', color: 'error', icon: <Trash  /> },
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
      title="Direktorat"
      data={rows}
      columns={directorateColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchDirectorates(); }}
      onSortChange={(columnId, order) => { setSort(columnId, order); fetchDirectorates(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchDirectorates(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDirectorates(); }}
      useExternalPagination
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      
      onAdd={() => addModal.openModal()}
      onExport={() => exportCSV('direktorat.csv', rows)}
    />
    <AddDirectorateModal
      isOpen={addModal.isOpen}
      onClose={() => { addModal.closeModal(); fileStore.clearSkFile(); }}
      onSuccess={() => {
        fetchDirectorates();
        addModal.closeModal();
        addNotification({
          description: 'Direktorat berhasil ditambahkan',
          variant: 'success',
          hideDuration: 4000,
          title: 'Direktorat ditambahkan',
        });
      }}
    />
    <EditDirectorateModal
      isOpen={editModal.isOpen}
      onClose={() => { editModal.closeModal(); setSelected(null); fileStore.clearSkFile(); }}
      directorate={selected}
      onSuccess={() => {
        fetchDirectorates();
        editModal.closeModal();
        addNotification({
          description: 'Direktorat berhasil diupdate',
          variant: 'success',
          hideDuration: 4000,
          title: 'Direktorat diupdate',
        });
      }}
    />
    <DeleteDirectorateModal
      isOpen={deleteModal.isOpen}
      onClose={() => { deleteModal.closeModal(); setSelected(null);fileStore.clearSkFile();  }}
      directorate={selected}
      onSuccess={() => {
        fetchDirectorates();
        deleteModal.closeModal();
        addNotification({
          description: 'Direktorat berhasil dihapus',
          variant: 'success',
          hideDuration: 4000,
          title: 'Direktorat dihapus',
        });
      }}
    />
    </>
  );
}
