// Penyesuaian besar: halaman Posisi Pegawai kompatibel dengan pagination eksternal DataTable
import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit } from '@/icons/components/icons';
import { useEmployeePositions } from '../../Index';
import { EmployeePositionRow } from '../../types/OrganizationTableTypes';
import AddEmployeePositionModal from '../../components/modals/employee-position/AddEmployeePositionModal';
import EditEmployeePositionModal from '../../components/modals/employee-position/EditEmployeePositionModal';
import DeleteEmployeePositionModal from '../../components/modals/employee-position/DeleteEmployeePositionModal';
// import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
import { formatUrlFile } from '@/utils/formatUrlFile';

type Props = { resetKey: string };

const employeePositionColumns: DataTableColumn<EmployeePositionRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-posisi', label: 'Nama Posisi', sortable: true },
  { id: 'jabatan-kepangkatan', label: 'Jabatan Kepangkatan', sortable: true },
  { id: 'jabatan-struktural', label: 'Jabatan Struktural', sortable: true },
  { id: 'direktorat', label: 'Direktorat', sortable: true },
  { id: 'divisi', label: 'Divisi', sortable: true },
  { id: 'departemen', label: 'Departemen', sortable: true },
  { id: 'unit', label: 'Unit', sortable: true },
  { id: 'deskripsi-tugas', label: 'Deskripsi Tugas', sortable: true },
  { id: 'file-sk-dan-mou', label: 'File SK & MoU', sortable: false, align: 'center', isAction: true, format: (row: EmployeePositionRow) => (row.fileUrl ? <a href={formatUrlFile(row.fileUrl as string)} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'><FileText size={16} /></a> : '—')},
];

export default function EmployeePositionsTab({ resetKey }: Props) {
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
  } = useEmployeePositions() as any;

  const actionsIconOnly: DataTableAction<any>[] = [
    {
      label: '',
      onClick: (row: any) => handleEditOpen(row.raw),
      variant: 'outline', className: 'border-0', icon: <Edit  />
    },
    // {
    //   label: '',
    //   onClick: (row: any) => handleDeleteOpen(row.raw),
    //   variant: 'outline', className: 'border-0', color: 'error', icon: <Trash  />
    // },
  ];

  return (
    <>
      <DataTable
        title="Posisi Pegawai"
        data={rows}
        columns={employeePositionColumns}
        actions={actionsIconOnly}
        searchable
        filterable
        resetKey={resetKey}
        // Dokumentasi: event pencarian hanya fetch setelah inisialisasi selesai (ditangani oleh useEffect di hook)
        onSearchChange={(val) => { setSearch(val); }}
        // Dokumentasi: event sort hanya fetch setelah inisialisasi selesai (ditangani oleh useEffect di hook)
        onSortChange={(columnId, order) => { setSort(columnId, order); }}
        // Dokumentasi: event ganti halaman hanya fetch setelah inisialisasi selesai (ditangani oleh useEffect di hook)
        onPageChangeExternal={(p) => { setPage(p); }}
        // Dokumentasi: event ganti jumlah baris hanya fetch setelah inisialisasi selesai dan reset ke halaman pertama (ditangani oleh useEffect di hook)
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); }}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        pageSize={pageSize}
        loading={false}
        // Dokumentasi: perubahan visibilitas kolom tidak memicu refetch data agar tidak menambah panggilan API saat inisialisasi
        onColumnVisibilityChange={() => {}}
        onAdd={handleAddOpen}
        onExport={() => exportCSV('posisi-pegawai.csv', rows)}
      />
      <AddEmployeePositionModal
        isOpen={addModal.isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
      <EditEmployeePositionModal
        isOpen={editModal.isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        employeePosition={selected}
      />
      <DeleteEmployeePositionModal
        isOpen={deleteModal.isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        employeePosition={selected}
      />
    </>
  );
}
