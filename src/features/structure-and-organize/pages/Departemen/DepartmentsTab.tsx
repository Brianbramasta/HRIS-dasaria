import React, { useMemo, useState } from 'react';
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

type Props = { resetKey: string };

const departmentColumns: DataTableColumn<DepartmentRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'Nama Departemen', label: 'Nama Departemen', sortable: true },
  { id: 'Nama Divisi', label: 'Divisi', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

export default function DepartmentsTab({ resetKey }: Props) {
  const { departments, fetchDepartments, setSearch, setPage, setPageSize, setSort } = useDepartments();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DepartmentListItem | null>(null);

  const rows: any[] = useMemo(() => {
    return (departments || []).map((d, idx) => ({
      no: idx + 1,
      'Nama Departemen': (d as any).name ?? '—',
      'Nama Divisi': (d as any).divisionName ?? '—',
      'File SK dan Memo': ((d as any).skFile || (d as any).memoFile) ? 'Ada' : '—',
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
      onSearchChange={(val) => { setSearch(val); fetchDepartments(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchDepartments(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchDepartments(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDepartments(); }}
      
      onAdd={() => addModal.openModal()}
      onExport={() => exportCSV('departemen.csv', rows)}
    />
    <AddDepartmentModal
      isOpen={addModal.isOpen}
      onClose={addModal.closeModal}
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
      onClose={() => { editModal.closeModal(); setSelected(null); }}
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
      onClose={() => { deleteModal.closeModal(); setSelected(null); }}
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
