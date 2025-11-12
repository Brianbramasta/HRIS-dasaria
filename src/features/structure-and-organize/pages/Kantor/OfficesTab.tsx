import React, { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
import { Edit, Trash, FileText } from 'react-feather';
import { useOffices } from '../../index';
import type { OfficeRow } from '../../types/organizationTable.types';
import { useModal } from '../../../../hooks/useModal';
import type { Office } from '../../types/organization.types';
import AddOfficeModal from '../../components/modals/Kantor/AddOfficeModal';
import EditOfficeModal from '../../components/modals/Kantor/EditOfficeModal';
import DeleteOfficeModal from '../../components/modals/Kantor/DeleteOfficeModal';
import { addNotification } from '@/stores/notificationStore';

type Props = { resetKey: string };

const officeColumns: DataTableColumn<OfficeRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Office', label: 'Office', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: true, format: () => <FileText size={16} /> },
];

export default function OfficesTab({ resetKey }: Props) {
  const { offices, fetchOffices, setSearch, setPage, setPageSize, setSort } = useOffices();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<Office | null>(null);

  const rows: OfficeRow[] = useMemo(() => {
    return (offices || []).map((o, idx) => ({
      no: idx + 1,
      Office: (o as any).name ?? '—',
      'Deskripsi Umum': (o as any).description ?? '—',
      'File SK dan Memo': ((o as any).skFile || (o as any).memoFile) ? 'Ada' : '—',
      raw: o,
    }));
  }, [offices]);

  const actionsIconOnly = [
    { label: '', onClick: (row: any) => { setSelected(row.raw as Office); editModal.openModal(); }, variant: 'outline', className: 'border-0', icon: <Edit size={16} /> },
    { label: '', onClick: (row: any) => { setSelected(row.raw as Office); deleteModal.openModal(); }, variant: 'outline', className: 'border-0', color: 'error', icon: <Trash size={16} /> },
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

  React.useEffect(() => { fetchOffices(); }, []);

  return (
    <>
    <DataTable
      title="Office"
      data={rows}
      columns={officeColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchOffices(); }}
      onSortChange={() => { setSort('name', 'asc'); fetchOffices(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchOffices(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchOffices(); }}
      onColumnVisibilityChange={() => { fetchOffices(); }}
      onAdd={() => addModal.openModal()}
      onExport={() => exportCSV('office.csv', rows)}
    />
    <AddOfficeModal
      isOpen={addModal.isOpen}
      onClose={addModal.closeModal}
      onSuccess={() => {fetchOffices();
        addNotification({
          description: 'Kantor berhasil ditambahkan',
          variant: 'success',
          hideDuration: 4000,
          title: 'Kantor ditambahkan',
        });
      }}
    />
    <EditOfficeModal
      isOpen={editModal.isOpen}
      onClose={() => { editModal.closeModal(); setSelected(null); }}
      office={selected}
      onSuccess={() => {fetchOffices();
        addNotification({
          description: 'Kantor berhasil diupdate',
          variant: 'success',
          hideDuration: 4000,
          title: 'Kantor diupdate',
        });
      }}
    />
    <DeleteOfficeModal
      isOpen={deleteModal.isOpen}
      onClose={() => { deleteModal.closeModal(); setSelected(null); }}
      office={selected}
      onSuccess={() => {fetchOffices();
        addNotification({
          description: 'Kantor berhasil dihapus',
          variant: 'success',
          hideDuration: 4000,
          title: 'Kantor dihapus',
        });
      }}
    />
    </>
  );
}