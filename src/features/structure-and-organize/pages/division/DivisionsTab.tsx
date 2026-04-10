import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
import { IconPencil as Edit, FileText } from '@/icons/components/icons';
import { useDivisions } from '../../Index';
import type { DivisionRow } from '../../types/OrganizationTableTypes';
import AddDivisionModal from '../../components/modals/division/AddDivisionModal';
import EditDivisionModal from '../../components/modals/division/EditDivisionModal';
import DeleteDivisionModal from '../../components/modals/division/DeleteDivisionModal';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';

type Props = { resetKey: string };

const divisionColumns: DataTableColumn<DivisionRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-divisi', label: 'Nama Divisi', sortable: true },
  { id: 'direktorat', label: 'Direktorat', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'file-sk-dan-memo', label: 'File SK dan Memo', sortable: false, isAction: true, align: 'center', format: (row: DivisionRow) => (
      row.fileUrl ? <button onClick={() => handleViewFileByUrl((row.fileUrl as string))} className='flex items-center justify-center w-full'><FileText size={16} /></button> : '—'
    )  },
];

export default function DivisionsTab({ resetKey }: Props) {
  const { 
    rows, 
    page, 
    pageSize, 
    total, 
    setPage, 
    setPageSize, 
    setSearch, 
    setSort,
    fetchDivisions, 
    exportCSV,
    addModal,
    editModal,
    deleteModal,
    selected,
    handleAddOpen,
    handleEditOpen,
    handleClose,
    handleSuccess,
  } = useDivisions() as any;

  const actionsIconOnly: DataTableAction<any>[] = [
    { 
      label: '', 
      onClick: (row: any) => handleEditOpen(row.raw), 
      variant: 'outline', 
      className: 'border-0', 
      icon: <Edit/> 
    },
    // { 
    //   label: '', 
    //   onClick: (row: any) => handleDeleteOpen(row.raw), 
    //   variant: 'outline', 
    //   className: 'border-0', 
    //   color: 'error', 
    //   icon: <Trash/> 
    // },
  ];

  return (
    <>
    <DataTable
      title="Divisi"
      data={rows}
      columns={divisionColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchDivisions(); }}
      onSortChange={(columnId, order) => { setSort(columnId, order); fetchDivisions(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchDivisions(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDivisions(); }}
      useExternalPagination
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      loading={false}
      onAdd={handleAddOpen}
      onExport={() => exportCSV('divisi.csv', rows)}
    />
    <AddDivisionModal
      isOpen={addModal.isOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
    <EditDivisionModal
      isOpen={editModal.isOpen}
      onClose={handleClose}
      division={selected}
      onSuccess={handleSuccess}
    />
    <DeleteDivisionModal
      isOpen={deleteModal.isOpen}
      onClose={handleClose}
      division={selected}
      onSuccess={handleSuccess}
    />
    </>
  );
}
