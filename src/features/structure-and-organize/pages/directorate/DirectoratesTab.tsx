import { useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
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
  const { rows, fetchDirectorates, setSearch, setPage, setPageSize, setSort, page, pageSize, total, exportToCSV } = useDirectorates();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DirectorateListItem | null>(null);
  const fileStore = useFileStore();

  const actionsIconOnly = [
    { label: '', onClick: (row: any) => { setSelected(row.raw as DirectorateListItem); editModal.openModal(); }, variant: 'outline', className: 'border-0', icon: <Edit  /> },
    { label: '', onClick: (row: any) => { setSelected(row.raw as DirectorateListItem); deleteModal.openModal(); }, variant: 'outline', className: 'border-0', color: 'error', icon: <Trash  /> },
  ] as DataTableAction<any>[];

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
      onExport={() => exportToCSV('direktorat.csv')}
    />
    <AddDirectorateModal
      isOpen={addModal.isOpen}
      onClose={() => { addModal.closeModal(); fileStore.clearSkFile(); }}
      onSuccess={() => {
        fetchDirectorates();
        addModal.closeModal();
      }}
    />
    <EditDirectorateModal
      isOpen={editModal.isOpen}
      onClose={() => { editModal.closeModal(); setSelected(null); fileStore.clearSkFile(); }}
      directorate={selected}
      onSuccess={() => {
        fetchDirectorates();
        editModal.closeModal();
      }}
    />
    <DeleteDirectorateModal
      isOpen={deleteModal.isOpen}
      onClose={() => { deleteModal.closeModal(); setSelected(null);fileStore.clearSkFile();  }}
      directorate={selected}
      onSuccess={() => {
        fetchDirectorates();
        deleteModal.closeModal();
      }}
    />
    </>
  );
}
