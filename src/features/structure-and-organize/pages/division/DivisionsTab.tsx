import  { useMemo, useState } from 'react';
import DataTable, { DataTableColumn, DataTableAction } from '../../../../components/shared/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import { useDivisions } from '../../Index';
import type { DivisionRow } from '../../types/OrganizationTableTypes';
import type { DivisionListItem } from '../../types/OrganizationApiTypes';
import { useModal } from '../../../../hooks/useModal';
import AddDivisionModal from '../../components/modals/division/AddDivisionModal';
import EditDivisionModal from '../../components/modals/division/EditDivisionModal';
import DeleteDivisionModal from '../../components/modals/division/DeleteDivisionModal';
import { addNotification } from '@/stores/notificationStore';
import { FileText } from '@/icons/components/icons';
type Props = { resetKey: string };
import { useFileStore } from '@/stores/fileStore';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { divisionsService } from '../../services/request/DivisionsService';


const divisionColumns: DataTableColumn<DivisionRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-divisi', label: 'Nama Divisi', sortable: true },
  { id: 'direktorat', label: 'Direktorat', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'file-sk-dan-memo', label: 'File SK dan Memo', sortable: false, isAction: true, align: 'center', format: (row: DivisionRow) => (

      row.fileUrl ? <a href={formatUrlFile(row.fileUrl as string)} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'><FileText size={16} /></a> : '—'
    )  },
];

export default function DivisionsTab({ resetKey }: Props) {
  const { divisions, fetchDivisions, setSearch, setPage, setPageSize, setSort } = useDivisions();
  const addModal = useModal(false);
  const editModal = useModal(false);
  const deleteModal = useModal(false);
  const [selected, setSelected] = useState<DivisionListItem | null>(null);
  const fileStore = useFileStore();

  const rows: any[] = useMemo(() => {
    console.log('divisions', divisions);
    return (divisions || []).map((d, idx) => ({
      no: idx + 1,
      'nama-divisi': (d as any).name ?? '—',
      'direktorat': (d as any).directorateName ?? '—',
      'deskripsi-umum': (d as any).description ?? '—',
      'file-sk-dan-memo': (d as any).skFile ?? '—',
      raw: d,
    }));
  }, [divisions]);

  const actionsIconOnly = [
    {
      label: '',
      variant: 'outline',
      className: 'border-0',
      icon: <Edit />,
      onClick: async (row: any) => {
        const id = row?.raw?.id;
        if (id) {
          const detail = await divisionsService.getById(id);
          setSelected(detail as DivisionListItem);
        } else {
          setSelected(row.raw as DivisionListItem);
        }
        editModal.openModal();
      },
    },
    {
      label: '',
      variant: 'outline',
      className: 'border-0',
      color: 'error',
      icon: <Trash />,
      onClick: (row: any) => {
        setSelected(row.raw as DivisionListItem);
        deleteModal.openModal();
      },
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
      onClose={() => { addModal.closeModal(); fileStore.clearSkFile(); }}
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
      onClose={() => { editModal.closeModal(); setSelected(null); fileStore.clearSkFile(); }}
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
      onClose={() => { deleteModal.closeModal(); setSelected(null); fileStore.clearSkFile(); }}
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
