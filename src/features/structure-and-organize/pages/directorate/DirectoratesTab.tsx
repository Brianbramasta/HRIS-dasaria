import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
import { IconPencil as Edit } from '@/icons/components/icons';
import { useDirectorates } from '../../Index';
import type { DirectorateRow } from '../../types/OrganizationTableTypes';
import AddDirectorateModal from '../../components/modals/directorate/AddDirectorateModal';
import EditDirectorateModal from '../../components/modals/directorate/EditDirectorateModal';
import DeleteDirectorateModal from '../../components/modals/directorate/DeleteDirectorateModal';
import { FileText } from '@/icons/components/icons';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';

type Props = { resetKey: string };

const directorateColumns: DataTableColumn<DirectorateRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'direktorat-name', label: 'Nama Direktorat', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'file-sk-dan-memo', label: 'File SK dan Memo', sortable: false, align: 'center', isAction: true, format: (row: DirectorateRow) => (
    row.fileUrl ? <button onClick={() => handleViewFileByUrl((row.fileUrl as string))} className='flex justify-center items-center w-full'><FileText size={16} /></button> : '—' )},  
];

export default function DirectoratesTab({ resetKey }: Props) {
  const { 
    rows, 
    setSearch, 
    setPage, 
    setPageSize, 
    setSort, 
    page, 
    pageSize, 
    total, 
    exportToCSV, 
    addModal,
    editModal,
    deleteModal,
    selected,
    handleAddOpen,
    handleEditOpen,
    handleClose,
    handleSuccess
  } = useDirectorates();

  const actionsIconOnly: DataTableAction<any>[] = [
    { label: '', onClick: (row: any) => handleEditOpen(row.raw), variant: 'outline', className: 'border-0', icon: <Edit  /> },
    // { label: '', onClick: (row: any) => handleDeleteOpen(row.raw), variant: 'outline', className: 'border-0', color: 'error', icon: <Trash  /> },
  ];

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
      onSearchChange={(val) => { setSearch(val); }}
      onSortChange={(columnId, order) => { setSort(columnId, order); }}
      onPageChangeExternal={(p) => { setPage(p); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); }}
      useExternalPagination
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      onAdd={handleAddOpen}
      onExport={() => exportToCSV('direktorat.csv')}
    />
    <AddDirectorateModal
      isOpen={addModal.isOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
    <EditDirectorateModal
      isOpen={editModal.isOpen}
      onClose={handleClose}
      directorate={selected}
      onSuccess={handleSuccess}
    />
    <DeleteDirectorateModal
      isOpen={deleteModal.isOpen}
      onClose={handleClose}
      directorate={selected}
      onSuccess={handleSuccess}
    />
    </>
  );
}
