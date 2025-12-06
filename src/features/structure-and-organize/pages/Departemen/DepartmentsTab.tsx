import  { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { useDepartments } from '../../index';
import type { DepartmentRow } from '../../types/organizationTable.types';
import type { DepartmentListItem } from '../../types/organization.api.types';
import { useModal } from '../../../../hooks/useModal';
import AddDepartmentModal from '../../components/modals/Departemen/AddDepartmentModal';
import EditDepartmentModal from '../../components/modals/Departemen/EditDepartmentModal';
import DeleteDepartmentModal from '../../components/modals/Departemen/DeleteDepartmentModal';
import { FileText } from '@/icons/components/icons';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';
import { formatUrlFile } from '@/utils/formatUrlFile';

type Props = { resetKey: string };

const departmentColumns: DataTableColumn<DepartmentRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'Nama Departemen', label: 'Nama Departemen', sortable: true },
  { id: 'Nama Divisi', label: 'Divisi', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: false, isAction: true, format: (row: DepartmentRow) => (
    
    row.fileUrl ? <a href={formatUrlFile(row.fileUrl as string)} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'><FileText size={16} /></a> : '—' )},
];

export default function DepartmentsTab({ resetKey }: Props) {
  // Sinkronisasi pagination eksternal dengan DataTable (server-side pagination)
  const { departments, fetchDepartments, setSearch, setPage, setPageSize, setSort, page, pageSize, total } = useDepartments() as any;
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DepartmentListItem | null>(null);
  const fileStore = useFileStore();

  // Perbaikan: tambahkan tipe eksplisit pada parameter callback map untuk menghindari implicit any
  const rows: any[] = useMemo(() => {
    return (departments || []).map((d: DepartmentListItem, idx: number) => ({
      no: idx + 1,
      'Nama Departemen': (d as any).name ?? '—',
      'Nama Divisi': (d as any).divisionName ?? '—',
      'File SK dan Memo': (d as any).skFile ?? '_',
      raw: d,
    }));
  }, [departments]);

  const actionsIconOnly = [
    { label: '', onClick: (row: any) => { setSelected(row.raw as DepartmentListItem); editModal.openModal(); }, variant: 'outline', className: 'border-0', icon: <Edit/> },
    { label: '', onClick: (row: any) => { setSelected(row.raw as DepartmentListItem); deleteModal.openModal(); }, variant: 'outline', className: 'border-0', color: 'error', icon: <Trash/> },
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
      title="Departemen"
      data={rows}
      columns={departmentColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      // Menjalankan pencarian ketika user menekan Enter
      onSearchChange={(val) => { setSearch(val); fetchDepartments(); }}
      // Menjalankan sort berdasarkan kolom dan urutan dari DataTable
      onSortChange={(columnId, order) => { setSort(columnId, order); fetchDepartments(); }}
      // Pagination eksternal: page 1-based, DataTable konversi internal otomatis
      onPageChangeExternal={(p) => { setPage(p); fetchDepartments(); }}
      // Ubah ukuran halaman dan refetch
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDepartments(); }}
      // Aktifkan mode pagination eksternal agar DataTable tidak slice data
      useExternalPagination
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      loading={false}
      
      onAdd={() => addModal.openModal()}
      onExport={() => exportCSV('departemen.csv', rows)}
    />
    <AddDepartmentModal
      isOpen={addModal.isOpen}
      onClose={() => { addModal.closeModal(); fileStore.clearSkFile(); }}
      onSuccess={() => {
        fetchDepartments();
        addModal.closeModal();
        addNotification({
          description: 'Departemen berhasil ditambahkan',
          variant: 'success',
          hideDuration: 4000,
          title: 'Departemen ditambahkan',
        });
      }}
    />
    <EditDepartmentModal
      isOpen={editModal.isOpen}
      onClose={() => { editModal.closeModal(); setSelected(null); fileStore.clearSkFile(); }} 
      department={selected}
      onSuccess={() => {
        fetchDepartments();
        editModal.closeModal();
        addNotification({
          description: 'Departemen berhasil diupdate',
          variant: 'success',
          hideDuration: 4000,
          title: 'Departemen diupdate',
        });
      }}
    />
    <DeleteDepartmentModal
      isOpen={deleteModal.isOpen}
      onClose={() => { deleteModal.closeModal(); setSelected(null); fileStore.clearSkFile(); }}
      department={selected}
      onSuccess={() => {
        fetchDepartments();
        deleteModal.closeModal();
        addNotification({
          description: 'Departemen berhasil dihapus',
          variant: 'success',
          hideDuration: 4000,
          title: 'Departemen dihapus',
        });
      }}
    />
    </>
  );
}
