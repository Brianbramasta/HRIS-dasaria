import React, { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
import { Edit, Trash } from 'react-feather';
import { useEmployeePositions } from '../../index';
import type { EmployeePosition } from '../../types/organization.types';
import { EmployeePositionRow } from '../../types/organizationTable.types';
import AddEmployeePositionModal from '../../components/modals/PosisiPegawai/AddEmployeePositionModal';
import EditEmployeePositionModal from '../../components/modals/PosisiPegawai/EditEmployeePositionModal';
import DeleteEmployeePositionModal from '../../components/modals/PosisiPegawai/DeleteEmployeePositionModal';
import { useModal } from '../../../../hooks/useModal';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
type Props = { resetKey: string };

const employeePositionColumns: DataTableColumn<EmployeePositionRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Posisi', label: 'Nama Posisi', sortable: true },
  { id: 'Jabatan', label: 'Jabatan', sortable: true },
  { id: 'Direktorat', label: 'Direktorat', sortable: true },
  { id: 'Divisi', label: 'Divisi', sortable: true },
  { id: 'Departemen', label: 'Departemen', sortable: true },
  { id: 'File SK & MoU', label: 'File SK & MoU', sortable: true, format: () => <FileText size={16} /> },
];

export default function EmployeePositionsTab({ resetKey }: Props) {
  const { employeePositions, fetchEmployeePositions, setSearch, setPage, setPageSize, setSort } = useEmployeePositions();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selectedEmployeePosition, setSelectedEmployeePosition] = useState<EmployeePosition | null>(null);

  const rows: EmployeePositionRow[] = useMemo(() => {
    return (employeePositions || []).map((ep, idx) => ({
      id: ep.id,
      no: idx + 1,
      'Nama Posisi': (ep as any).name ?? (ep as any).positionName ?? '—',
      Jabatan: (ep as any).position?.name ?? (ep as any).positionName ?? '—',
      Direktorat: (ep as any).directorate?.name ?? (ep as any).directorateName ?? '—',
      Divisi: (ep as any).division?.name ?? (ep as any).divisionName ?? '—',
      Departemen: (ep as any).department?.name ?? (ep as any).departmentName ?? '—',
      'File SK & MoU': ((ep as any).skFile || (ep as any).memoFile) ? 'Ada' : '—',
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
        setSelectedEmployeePosition(row.raw as EmployeePosition);
        editModal.openModal();
      },
      variant: 'outline', className: 'border-0', icon: <Edit size={16} />
    },
    {
      label: '',
      onClick: (row: any) => {
        setSelectedEmployeePosition(row.raw as EmployeePosition);
        deleteModal.openModal();
      },
      variant: 'outline', className: 'border-0', color: 'error', icon: <Trash size={16} />
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

  React.useEffect(() => { fetchEmployeePositions(); }, []);

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
        onSearchChange={(val) => { setSearch(val); fetchEmployeePositions(); }}
        onSortChange={() => { setSort('name', 'asc'); fetchEmployeePositions(); }}
        onPageChangeExternal={(p) => { setPage(p); fetchEmployeePositions(); }}
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchEmployeePositions(); }}
        onColumnVisibilityChange={() => { fetchEmployeePositions(); }}
        onAdd={() => addModal.openModal()}
        onExport={() => exportCSV('posisi-pegawai.csv', rows)}
      />
      <AddEmployeePositionModal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
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
        onClose={() => { editModal.closeModal(); setSelectedEmployeePosition(null); }}
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
        onClose={() => { deleteModal.closeModal(); setSelectedEmployeePosition(null); }}
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