import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
import { IconPencil as Edit, FileText } from '@/icons/components/icons';
import { usePositions } from '../../Index';
import type { PositionRow } from '../../types/OrganizationTableTypes';
import { AddPositionModal } from '../../components/modals/job-title/AddPositionModal';
import { EditPositionModal } from '../../components/modals/job-title/EditPositionModal';
import { DeletePositionModal } from '../../components/modals/job-title/DeletePositionModal';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';

type Props = { resetKey: string };

const positionColumns: DataTableColumn<PositionRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-jabatan', label: 'Jabatan Kepangkatan', sortable: true },
  { id: 'jabatan-struktural', label: 'Jabatan Struktural', sortable: true },
  { id: 'grade', label: 'Golongan', sortable: true },
  { id: 'deskripsi-tugas', label: 'Deskripsi Tugas', sortable: true },
  { id: 'file-sk-dan-mou', label: 'File SK & MoU', sortable: false, isAction: true, format: (row: PositionRow) => (row.fileUrl ? <button onClick={() => handleViewFileByUrl((row.fileUrl as string))} className='flex items-center justify-center w-full'><FileText size={16} /></button> : '—' )},
];

// Dokumentasi: Halaman Jabatan menggunakan pagination eksternal agar kompatibel dengan DataTable
export default function PositionsTab({ resetKey }: Props) {
  const { 
    rows, 
    page, 
    pageSize, 
    total, 
    loading, 
    setSearch, 
    setPage, 
    setPageSize, 
    setSort,
    fetchPositions,
    exportCSV,
    addModal,
    editModal,
    deleteModal,
    selected,
    handleAddOpen,
    handleEditOpen,
    handleClose,
    handleSuccess,
  } = usePositions();

  const actionsIconOnly: DataTableAction<any>[] = [
    {
      label: '',
      onClick: (row: any) => handleEditOpen(row.raw),
      variant: 'outline',
      className: 'border-0',
      icon: <Edit />,
    },
    // {
    //   label: '',
    //   onClick: (row: any) => handleDeleteOpen(row.raw),
    //   variant: 'outline',
    //   className: 'border-0',
    //   color: 'error',
    //   icon: <Trash />,
    // },
  ];

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
        onSearchChange={(val) => { setSearch(val); fetchPositions(); }}
        onSortChange={(columnId, order) => { setSort(columnId, order); fetchPositions(); }}
        onPageChangeExternal={(p) => { setPage(p); fetchPositions(); }}
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchPositions(); }}
        
        onAdd={handleAddOpen}
        onExport={() => exportCSV('jabatan.csv', rows)}
      />
      <AddPositionModal
        isOpen={addModal.isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
      <EditPositionModal
        isOpen={editModal.isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        position={selected}
      />
      <DeletePositionModal
        isOpen={deleteModal.isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        position={selected}
      />
    </>
  );
}
