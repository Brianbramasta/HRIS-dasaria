// Penyesuaian besar: halaman Posisi Pegawai kompatibel dengan pagination eksternal DataTable
import React, { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { useEmployeePositions } from '../../index';
import type { EmployeePositionListItem } from '../../types/organization.api.types';
import { EmployeePositionRow } from '../../types/organizationTable.types';
import AddEmployeePositionModal from '../../components/modals/PosisiPegawai/AddEmployeePositionModal';
import EditEmployeePositionModal from '../../components/modals/PosisiPegawai/EditEmployeePositionModal';
import DeleteEmployeePositionModal from '../../components/modals/PosisiPegawai/DeleteEmployeePositionModal';
import { useModal } from '../../../../hooks/useModal';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
import { useFileStore } from '@/stores/fileStore';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { useFilterStore } from '@/stores/filterStore';

type Props = { resetKey: string };

const employeePositionColumns: DataTableColumn<EmployeePositionRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'Nama Posisi', label: 'Nama Posisi', sortable: true },
  { id: 'Jabatan', label: 'Jabatan', sortable: true },
  { id: 'Direktorat', label: 'Direktorat', sortable: true },
  { id: 'Divisi', label: 'Divisi', sortable: true },
  { id: 'Departemen', label: 'Departemen', sortable: true },
  { id: 'File SK & MoU', label: 'File SK & MoU', sortable: false, align: 'center', isAction: true, format: (row: EmployeePositionRow) => (row.fileUrl ? <a href={formatUrlFile(row.fileUrl as string)} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'><FileText size={16} /></a> : '—')},
];

export default function EmployeePositionsTab({ resetKey }: Props) {
  // Dokumentasi: gunakan tipe return dari useEmployeePositions agar inference parameter map tidak any
  const { employeePositions, fetchEmployeePositions, setSearch, setPage, setPageSize, setSort, page, pageSize, total } = useEmployeePositions();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selectedEmployeePosition, setSelectedEmployeePosition] = useState<EmployeePositionListItem | null>(null);
  const fileStore = useFileStore();
  // Dokumentasi: flag untuk memastikan fetch awal hanya berjalan sekali saat mount
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  // Dokumentasi: ambil nilai filter dari store untuk kunci judul tabel
  const filterValue = useFilterStore((s) => s.filters['Posisi Pegawai'] ?? '');

  const rows: EmployeePositionRow[] = useMemo(() => {
    // DOK: Pastikan kolom bertipe string; gunakan nama file untuk tampilan
    // Alasan: tipe EmployeePositionRow mengharuskan 'File SK & MoU' bertipe string
    return (employeePositions || []).map((ep: EmployeePositionListItem, idx: number) => ({
      id: ep.id,
      no: idx + 1,
      'Nama Posisi': ep.name ?? ep.positionName ?? '—',
      Jabatan: ep.positionName ?? '—',
      Direktorat: ep.directorateName ?? '—',
      Divisi: ep.divisionName ?? '—',
      Departemen: ep.departmentName ?? '—',
      'File SK & MoU': ep.skFile ?? '—',
      fileUrl: ep.skFile?.fileUrl ?? undefined,
      raw: ep,
    }));
  }, [employeePositions]);

  const handleAddSuccess = () => {
    fetchEmployeePositions();
  };

  const handleUpdateSuccess = () => {
    fetchEmployeePositions();
  };

  const handleDeleteSuccess = () => {
    fetchEmployeePositions();
  };

  const actionsIconOnly = [
    {
      label: '',
      onClick: (row: any) => {
        setSelectedEmployeePosition(row.raw as EmployeePositionListItem);
        editModal.openModal();
      },
      variant: 'outline', className: 'border-0', icon: <Edit  />
    },
    {
      label: '',
      onClick: (row: any) => {
        setSelectedEmployeePosition(row.raw as EmployeePositionListItem);
        deleteModal.openModal();
      },
      variant: 'outline', className: 'border-0', color: 'error', icon: <Trash  />
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

  // Dokumentasi: jalankan fetch list sekali saat mount dan set penanda selesai inisialisasi
  React.useEffect(() => { fetchEmployeePositions(); setHasInitialFetch(true); }, []);

  // Dokumentasi: ketika tombol Cari di modal Filter ditekan (menyimpan ke filterStore),
  // sinkronkan pencarian dan jalankan request API seperti halaman Jabatan
  React.useEffect(() => {
    if (!hasInitialFetch) return;
    setSearch(filterValue);
    setPage(1);
    fetchEmployeePositions({ search: filterValue, page: 1 });
  }, [filterValue, hasInitialFetch]);

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
        // Dokumentasi: event pencarian hanya fetch setelah inisialisasi selesai
        onSearchChange={(val) => { setSearch(val); setPage(1); if (hasInitialFetch) { fetchEmployeePositions({ search: val, page: 1 }); } }}
        // Dokumentasi: event sort hanya fetch setelah inisialisasi selesai
        onSortChange={(columnId, order) => { setSort(columnId, order); if (hasInitialFetch) { fetchEmployeePositions({ sortBy: columnId, sortOrder: order }); } }}
        // Dokumentasi: event ganti halaman hanya fetch setelah inisialisasi selesai
        onPageChangeExternal={(p) => { setPage(p); if (hasInitialFetch) { fetchEmployeePositions({ page: p }); } }}
        // Dokumentasi: event ganti jumlah baris hanya fetch setelah inisialisasi selesai dan reset ke halaman pertama
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); setPage(1); if (hasInitialFetch) { fetchEmployeePositions({ pageSize: ps, page: 1 }); } }}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        pageSize={pageSize}
        // Dokumentasi: perubahan visibilitas kolom tidak memicu refetch data agar tidak menambah panggilan API saat inisialisasi
        onColumnVisibilityChange={() => {}}
        onAdd={() => addModal.openModal()}
        onExport={() => exportCSV('posisi-pegawai.csv', rows)}
      />
      <AddEmployeePositionModal
        isOpen={addModal.isOpen}
        onClose={() => { addModal.closeModal(); fileStore.clearSkFile(); }}
        onSuccess={() => {
          handleAddSuccess();
          addModal.closeModal();
          addNotification({
            description: 'Posisi pegawai berhasil ditambahkan',
            variant: 'success',
            hideDuration: 4000,
            title: 'Posisi pegawai ditambahkan',
          });
        }}
      />
      <EditEmployeePositionModal
        isOpen={editModal.isOpen}
        onClose={() => { editModal.closeModal(); setSelectedEmployeePosition(null); fileStore.clearSkFile(); }}
        onSuccess={() => {
          handleUpdateSuccess();
          editModal.closeModal();
          addNotification({
            description: 'Posisi pegawai berhasil diupdate',
            variant: 'success',
            hideDuration: 4000,
            title: 'Posisi pegawai diupdate',
          });
        }}
        employeePosition={selectedEmployeePosition}
      />
      <DeleteEmployeePositionModal
        isOpen={deleteModal.isOpen}
        onClose={() => { deleteModal.closeModal(); setSelectedEmployeePosition(null); fileStore.clearSkFile(); }}
        onSuccess={() => {
          handleDeleteSuccess();
          deleteModal.closeModal();
          addNotification({
            description: 'Posisi pegawai berhasil dihapus',
            variant: 'success',
            hideDuration: 4000,
            title: 'Posisi pegawai dihapus',
          });
        }}
        employeePosition={selectedEmployeePosition}
      />
    </>
  );
}
