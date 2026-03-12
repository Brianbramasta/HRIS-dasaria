import { Link } from 'react-router';
import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
import { IconPencil as Edit, FileText } from '@/icons/components/icons';
import { useBusinessLines } from '../../Index';
import AddBusinessLineModal from '../../components/modals/business-line/AddBusinessLineModal';
import EditBusinessLineModal from '../../components/modals/business-line/EditBusinessLineModal';
import DeleteBusinessLineModal from '../../components/modals/business-line/DeleteBusinessLineModal';

import type { BLRow } from '../../types/OrganizationTableTypes';

type Props = { resetKey: string };

const businessLineColumns: DataTableColumn<BLRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'lini-bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'file-sk-dan-memo', label: 'Detail', sortable: false, align: 'center', isAction: true, format: (_val, row) => (
    <Link to={`/structure-and-organize/business-lines/${(row as any).id ?? (row as any).no}`} className="flex justify-center items-center">
      <FileText size={16} />
    </Link>
  ) },
];

export default function BusinessLinesTab({ resetKey }: Props) {
  const {
    rows_column,
    loading,
    total,
    page,
    pageSize,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    
    // Modal & Handlers
    addModal,
    editModal,
    deleteModal,
    selected,
    handleAddOpen,
    handleEditOpen,
    handleClose,
    handleSuccess,
  } = useBusinessLines() as any; // Cast to any to avoid type issues if return type is not fully inferred yet, though strictly it should be typed. useDepartments used 'as any'.

  const actions: DataTableAction<any>[] = [
    { 
      label: '', 
      variant: 'outline', 
      className: 'border-0', 
      icon: <Edit />, 
      onClick: (row: any) => handleEditOpen(row.raw) 
    },
    // { 
    //   label: '', 
    //   variant: 'outline', 
    //   className: 'border-0', 
    //   color: 'error', 
    //   icon: <Trash />, 
    //   onClick: (row: any) => handleDeleteOpen(row.raw) 
    // },
  ];

  return (
    <>
      <DataTable
        title="Lini Bisnis"
        data={rows_column}
        columns={businessLineColumns}
        loading={loading}
        pageSize={pageSize}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        actions={actions}
        searchable
        filterable
        resetKey={resetKey}
        onSearchChange={(val) => { setSearch(val); }}
        onSortChange={(columnId, order) => { setSort(columnId, order); }}
        onPageChangeExternal={(p) => { setPage(p); }}
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); }}
        
        onAdd={handleAddOpen}
        onExport={() => {}}
      />

      <AddBusinessLineModal
        isOpen={addModal.isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
      <EditBusinessLineModal
        isOpen={editModal.isOpen}
        onClose={handleClose}
        businessLine={selected}
        onSuccess={handleSuccess}
      />
      <DeleteBusinessLineModal
        isOpen={deleteModal.isOpen}
        onClose={handleClose}
        businessLine={selected}
        onSuccess={handleSuccess}
      />
    </>
  );
}
