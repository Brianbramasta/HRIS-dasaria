import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
import { IconPencil as Edit } from '@/icons/components/icons';
import { useOffices } from '../../Index';
import type { OfficeRow } from '../../types/OrganizationTableTypes';
import AddOfficeModal from '../../components/modals/office/AddOfficeModal';
import EditOfficeModal from '../../components/modals/office/EditOfficeModal';
import DeleteOfficeModal from '../../components/modals/office/DeleteOfficeModal';
import { FileText } from '@/icons/components/icons';
// import { formatUrlFile } from '@/utils/formatUrlFile';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';

type Props = { resetKey: string };

const officeColumns: DataTableColumn<OfficeRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-kantor', label: 'Kantor', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'file-sk-dan-memo', label: 'File SK dan Memo', sortable: false, align: 'center', isAction: true, format: ( row: OfficeRow) => (
   
    row.fileUrl ? <button onClick={() => handleViewFileByUrl((row.fileUrl as string))} className='flex justify-center items-center w-full'><FileText size={16} /></button> : '—'
  ) },
];

export default function OfficesTab({ resetKey }: Props) {
  const { 
    rows, 
    page, 
    pageSize, 
    total, 
    setPage, 
    setPageSize, 
    setSearch, 
    setSort,
    exportCSV,
    addModal,
    editModal,
    deleteModal,
    selected,
    handleAddOpen,
    handleEditOpen,
    handleClose,
    handleSuccess,
  } = useOffices() as any;

  const actionsIconOnly: DataTableAction<any>[] = [
    { label: '', onClick: (row: any) => handleEditOpen(row.raw), variant: 'outline', className: 'border-0', icon: <Edit /> },
    // { label: '', onClick: (row: any) => handleDeleteOpen(row.raw), variant: 'outline', className: 'border-0', color: 'error', icon: <Trash /> },
  ];

  return (
    <>
    <DataTable
      title="Kantor"
      data={rows}
      columns={officeColumns}
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
      loading={false}
      onAdd={handleAddOpen}
      onExport={() => exportCSV('office.csv', rows)}
    />
    <AddOfficeModal
      isOpen={addModal.isOpen}
      onClose={handleClose} 
      onSuccess={handleSuccess}
    />
    <EditOfficeModal
      isOpen={editModal.isOpen}
      onClose={handleClose}
      office={selected}
      onSuccess={handleSuccess}
    />
    <DeleteOfficeModal
      isOpen={deleteModal.isOpen}
      onClose={handleClose}
      office={selected}
      onSuccess={handleSuccess}
    />
    </>
  );
}
