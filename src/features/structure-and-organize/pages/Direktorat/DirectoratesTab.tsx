import React, { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
import { Edit, Trash } from 'react-feather';
import { useDirectorates } from '../../index';
import type { DirectorateRow } from '../../types/organizationTable.types';
import type { Directorate } from '../../types/organization.types';
import { useModal } from '../../../../hooks/useModal';
import AddDirectorateModal from '../../components/modals/Direktorat/AddDirectorateModal';
import EditDirectorateModal from '../../components/modals/Direktorat/EditDirectorateModal';
import DeleteDirectorateModal from '../../components/modals/Direktorat/DeleteDirectorateModal';
import { FileText } from '@/icons/components/icons';
import { addNotification } from '@/stores/notificationStore';

type Props = { resetKey: string };

const directorateColumns: DataTableColumn<DirectorateRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Nama Direktorat', label: 'Nama Direktorat', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

export default function DirectoratesTab({ resetKey }: Props) {
  const { directorates, fetchDirectorates, setSearch, setPage, setPageSize, setSort } = useDirectorates();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<Directorate | null>(null);

  const rows: any[] = useMemo(() => {
    return (directorates || []).map((d, idx) => ({
      no: idx + 1,
      'Nama Direktorat': (d as any).name ?? '—',
      'Deskripsi Umum': (d as any).description ?? '—',
      'File SK dan Memo': ((d as any).skFile || (d as any).memoFile) ? 'Ada' : '—',
      raw: d,
    }));
  }, [directorates]);

  const actionsIconOnly = [
    { label: '', onClick: (row: any) => { setSelected(row.raw as Directorate); editModal.openModal(); }, variant: 'outline', className: 'border-0', icon: <Edit size={16} /> },
    { label: '', onClick: (row: any) => { setSelected(row.raw as Directorate); deleteModal.openModal(); }, variant: 'outline', className: 'border-0', color: 'error', icon: <Trash size={16} /> },
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

  React.useEffect(() => { fetchDirectorates(); }, []);

  return (
    <>
    <DataTable
      title="Direktorat"
      data={rows}
      columns={directorateColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchDirectorates(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchDirectorates(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchDirectorates(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchDirectorates(); }}
      onColumnVisibilityChange={() => { fetchDirectorates(); }}
      onAdd={() => addModal.openModal()}
      onExport={() => exportCSV('direktorat.csv', rows)}
    />
    <AddDirectorateModal
      isOpen={addModal.isOpen}
      onClose={addModal.closeModal}
      onSuccess={() => {
        fetchDirectorates();
        addModal.closeModal();
        addNotification({
          description: 'Direktorat berhasil ditambahkan',
          variant: 'success',
          hideDuration: 4000,
          title: 'Direktorat ditambahkan',
        });
      }}
    />
    <EditDirectorateModal
      isOpen={editModal.isOpen}
      onClose={() => { editModal.closeModal(); setSelected(null); }}
      directorate={selected}
      onSuccess={() => {
        fetchDirectorates();
        editModal.closeModal();
        addNotification({
          description: 'Direktorat berhasil diupdate',
          variant: 'success',
          hideDuration: 4000,
          title: 'Direktorat diupdate',
        });
      }}
    />
    <DeleteDirectorateModal
      isOpen={deleteModal.isOpen}
      onClose={() => { deleteModal.closeModal(); setSelected(null); }}
      directorate={selected}
      onSuccess={() => {
        fetchDirectorates();
        deleteModal.closeModal();
        addNotification({
          description: 'Direktorat berhasil dihapus',
          variant: 'success',
          hideDuration: 4000,
          title: 'Direktorat dihapus',
        });
      }}
    />
    </>
  );
}