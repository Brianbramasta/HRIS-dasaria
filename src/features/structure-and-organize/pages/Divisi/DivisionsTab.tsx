import React, { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { useDivisions } from '../../index';
import type { DivisionRow } from '../../types/organizationTable.types';
import type { DivisionListItem } from '../../types/organization.api.types';
import { useModal } from '../../../../hooks/useModal';
import AddDivisionModal from '../../components/modals/Divisi/AddDivisionModal';
import EditDivisionModal from '../../components/modals/Divisi/EditDivisionModal';
import DeleteDivisionModal from '../../components/modals/Divisi/DeleteDivisionModal';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
type Props = { resetKey: string };

const divisionColumns: DataTableColumn<DivisionRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'Nama Divisi', label: 'Nama Divisi', sortable: true },
  { id: 'Direktorat', label: 'Direktorat', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

export default function DivisionsTab({ resetKey }: Props) {
  const { divisions, fetchDivisions, setSearch, setPage, setPageSize, setSort } = useDivisions();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DivisionListItem | null>(null);

  const rows: any[] = useMemo(() => {
    console.log('divisions', divisions);
    return (divisions || []).map((d, idx) => ({
      no: idx + 1,
      'Nama Divisi': (d as any).name ?? '—',
      'Direktorat': (d as any).directorateName ?? '—',
      'Deskripsi Umum': (d as any).description ?? '—',
      'File SK dan Memo': ((d as any).skFile || (d as any).memoFile) ? 'Ada' : '—',
      raw: d,
    }));
  }, [divisions]);

  const actionsIconOnly = [
    { label: '', onClick: (row: any) => { setSelected(row.raw as DivisionListItem); editModal.openModal(); }, variant: 'outline', className: 'border-0', icon: <Edit /> },
    { label: '', onClick: (row: any) => { setSelected(row.raw as DivisionListItem); deleteModal.openModal(); }, variant: 'outline', className: 'border-0', color: 'error', icon: <Trash /> },
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
      title="Divisi"
      data={rows}
      columns={divisionColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchDivisions(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchDivisions(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchDivisions(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDivisions(); }}
      
      onAdd={() => addModal.openModal()}
      onExport={() => exportCSV('divisi.csv', rows)}
    />
    <AddDivisionModal
      isOpen={addModal.isOpen}
      onClose={addModal.closeModal}
      onSuccess={() => {
        fetchDivisions();
        addModal.closeModal();
        addNotification({
          description: 'Divisi berhasil ditambahkan',
          variant: 'success',
          hideDuration: 4000,
          title: 'Divisi ditambahkan',
        });
      }}
    />
    <EditDivisionModal
      isOpen={editModal.isOpen}
      onClose={() => { editModal.closeModal(); setSelected(null); }}
      division={selected}
      onSuccess={() => {
        fetchDivisions();
        editModal.closeModal();
        addNotification({
          description: 'Divisi berhasil diupdate',
          variant: 'success',
          hideDuration: 4000,
          title: 'Divisi diupdate',
        });
      }}
    />
    <DeleteDivisionModal
      isOpen={deleteModal.isOpen}
      onClose={() => { deleteModal.closeModal(); setSelected(null); }}
      division={selected}
      onSuccess={() => {
        fetchDivisions();
        deleteModal.closeModal();
        addNotification({
          description: 'Divisi berhasil dihapus',
          variant: 'success',
          hideDuration: 4000,
          title: 'Divisi dihapus',
        });
      }}
    />
    </>
  );
}
