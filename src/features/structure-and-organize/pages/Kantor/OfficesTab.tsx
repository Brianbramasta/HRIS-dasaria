import  { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../components/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { useOffices } from '../../index';
import type { OfficeRow } from '../../types/organizationTable.types';
import { useModal } from '../../../../hooks/useModal';
import type { OfficeListItem } from '../../types/organization.api.types';
import AddOfficeModal from '../../components/modals/Kantor/AddOfficeModal';
import EditOfficeModal from '../../components/modals/Kantor/EditOfficeModal';
import DeleteOfficeModal from '../../components/modals/Kantor/DeleteOfficeModal';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { useFileStore } from '@/stores/fileStore';
type Props = { resetKey: string };

const officeColumns: DataTableColumn<OfficeRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'Office', label: 'Kantor', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'File SK dan Memo', sortable: false, align: 'center', isAction: true, format: (row: OfficeRow) => (
    // <div onClick={() => {
    //   console.log(formatUrlFile(row.fileUrl as string));
    //   if (row.fileUrl) {
    //     window.open(formatUrlFile(row.fileUrl as string));
    //   }
    // }} className='w-full flex justify-center items-center'><FileText size={16} /></div>
    row.fileUrl ? <a href={formatUrlFile(row.fileUrl as string)} target="_blank" rel="noopener noreferrer" className='flex justify-center items-center'><FileText size={16} /></a> : '—'
  ) },
];

export default function OfficesTab({ resetKey }: Props) {
  const { offices, fetchOffices, setSearch, setPage, setPageSize, setSort, page, pageSize, total } = useOffices();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<OfficeListItem | null>(null);
  const fileStore = useFileStore();

  const rows: OfficeRow[] = useMemo(() => {
    return (offices || []).map((o, idx) => ({
      no: idx + 1,
      Office: (o as any).name ?? '—',
      'Deskripsi Umum': (o as any).description ?? '—',
      'File SK dan Memo': (o as any).skFile ??'-',
      raw: o,
    }));
  }, [offices]);

  const actionsIconOnly = [
    { label: '', onClick: (row: any) => { setSelected(row.raw as OfficeListItem); editModal.openModal(); }, variant: 'outline', className: 'border-0', icon: <Edit /> },
    { label: '', onClick: (row: any) => { setSelected(row.raw as OfficeListItem); deleteModal.openModal(); }, variant: 'outline', className: 'border-0', color: 'error', icon: <Trash /> },
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
      title="Kantor"
      data={rows}
      columns={officeColumns}
      actions={actionsIconOnly}
      searchable
      filterable
      resetKey={resetKey}
      onSearchChange={(val) => { setSearch(val); fetchOffices(); }}
      onSortChange={(columnId, order) => { setSort(columnId, order); fetchOffices(); }}
      onPageChangeExternal={(p) => { setPage(p); fetchOffices(); }}
      onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchOffices(); }}
      useExternalPagination
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      
      onAdd={() => addModal.openModal()}
      onExport={() => exportCSV('office.csv', rows)}
    />
    <AddOfficeModal
      isOpen={addModal.isOpen}
      onClose={() => { addModal.closeModal(); fileStore.clearSkFile(); }} 
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
      onClose={() => { editModal.closeModal(); setSelected(null); fileStore.clearSkFile(); }}
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
