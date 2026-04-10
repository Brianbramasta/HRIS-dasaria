import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
import { IconPencil as Edit, FileText } from '@/icons/components/icons';
import { useDepartments } from '../../Index';
import type { DepartmentRow } from '../../types/OrganizationTableTypes';
import AddDepartmentModal from '../../components/modals/department/AddDepartmentModal';
import EditDepartmentModal from '../../components/modals/department/EditDepartmentModal';
import DeleteDepartmentModal from '../../components/modals/department/DeleteDepartmentModal';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';

type Props = { resetKey: string };

const departmentColumns: DataTableColumn<DepartmentRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-departemen', label: 'Nama Departemen', sortable: true },
  { id: 'nama-divisi', label: 'Divisi', sortable: true },
  { id: 'deskripsi', label: 'Deskripsi Umum', sortable: true },
  { id: 'file-sk-dan-memo', label: 'File SK dan Memo', sortable: false, align: 'center', isAction: true, format: (row: DepartmentRow) => (
    row.fileUrl ? <button onClick={() => handleViewFileByUrl((row.fileUrl as string))} className='flex items-center justify-center w-full'><FileText size={16} /></button> : '—' )},
];

export default function DepartmentsTab({ resetKey }: Props) {
  const { 
    rows, 
    page, 
    pageSize, 
    total, 
    setPage, 
    setPageSize, 
    setSearch, 
    setSort,
    fetchDepartments, 
    exportCSV,
    addModal,
    editModal,
    deleteModal,
    selected,
    handleAddOpen,
    handleEditOpen,
    handleClose,
    handleSuccess,
  } = useDepartments() as any;

  const actionsIconOnly: DataTableAction<any>[] = [
    { label: '', onClick: (row: any) => handleEditOpen(row.raw), variant: 'outline', className: 'border-0', icon: <Edit/> },
    // { label: '', onClick: (row: any) => handleDeleteOpen(row.raw), variant: 'outline', className: 'border-0', color: 'error', icon: <Trash/> },
  ];

  return (
    <>
    <DataTable
      title="Departemen"
      data={rows}
      columns={departmentColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchDepartments(); }}
      onSortChange={(columnId, order) => { setSort(columnId, order); fetchDepartments(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchDepartments(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDepartments(); }}
      useExternalPagination
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      loading={false}
      onAdd={handleAddOpen}
      onExport={() => exportCSV('departemen.csv', rows)}
    />
    <AddDepartmentModal
      isOpen={addModal.isOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
    <EditDepartmentModal
      isOpen={editModal.isOpen}
      onClose={handleClose} 
      department={selected}
      onSuccess={handleSuccess}
    />
    <DeleteDepartmentModal
      isOpen={deleteModal.isOpen}
      onClose={handleClose}
      department={selected}
      onSuccess={handleSuccess}
    />
    </>
  );
}
