import  { useMemo, useState } from 'react';
import { Link } from 'react-router';
import DataTable, { DataTableColumn } from '../../../../components/shared/datatable/DataTable';
// import { Edit, Trash } from 'react-feather';
import { IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';
import {
  useBusinessLines,
} from '../../Index';
import AddBusinessLineModal from '../../components/modals/business-line/AddBusinessLineModal';
import EditBusinessLineModal from '../../components/modals/business-line/EditBusinessLineModal';
import DeleteBusinessLineModal from '../../components/modals/business-line/DeleteBusinessLineModal';
import { addNotification } from '../../../../stores/notificationStore';

import type { BLRow } from '../../types/OrganizationTableTypes';
import { businessLinesService } from '../../services/request/BusinessLinesService';
import type { BusinessLineListItem } from '../../types/OrganizationApiTypes';
import { FileText } from '@/icons/components/icons';
import { useFileStore } from '@/stores/fileStore';

type Props = { resetKey: string };



const businessLineColumns: DataTableColumn<BLRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'lini-bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'deskripsi-umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'file-sk-dan-memo', label: 'Detail', sortable: false, align: 'center', isAction: true, format: (_val, row) => (
    <Link to={`/structure-and-organize/business-lines/${(row as any).id ?? (row as any).no}`} className="flex justify-center items-center">
      <FileText size={16} />
    </Link>
  ) },
];

export default function BusinessLinesTab({ resetKey }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedBusinessLine, setSelectedBusinessLine] = useState<BusinessLineListItem | null>(null);
  const fileStore = useFileStore();

  const {
    businessLines,
    fetchBusinessLines,
    loading,
    total,
    page,
    pageSize,
    rows_column,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    getById
  } = useBusinessLines();

  // pages only call addNotification; the container is rendered globally in App.tsx

  



  return (
    <>
      <DataTable
        title="Lini Bisnis"
        data={rows_column}
        columns={businessLineColumns}
        loading={loading}
        pageSize={pageSize}
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        actions={[
          {
            label: '',
            variant: 'outline',
            className: 'border-0',
            icon: <Edit />,
            onClick: async (row: any) => {
              const idx = (row?.no ?? 0) - 1;
              setSelectedIndex(idx);
              const detail = await getById(businessLines[idx].id);
              console.log('detail',detail)
              setSelectedBusinessLine(detail as BusinessLineListItem);
              setIsEditOpen(true);
            },
          },
          {
            label: '',
            variant: 'outline',
            className: 'border-0',
            color: 'error',
            icon: <Trash />,
            onClick: (row: any) => {
              const idx = (row?.no ?? 0) - 1;
              setSelectedIndex(idx);
              setIsDeleteOpen(true);
            },
          },
        ]}
        searchable
        filterable
        resetKey={resetKey}
        onSearchChange={(val) => { setSearch(val); }}
        onSortChange={(columnId, order) => { setSort(columnId, order); }}
        onPageChangeExternal={(p) => { setPage(p); }}
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); }}
        onColumnVisibilityChange={() => {}}

        onAdd={() => setIsAddOpen(true)}
        onExport={true}
      />

      <AddBusinessLineModal
        isOpen={isAddOpen}
        onClose={() => { setIsAddOpen(false); fileStore.clearSkFile(); }}
        onSuccess={() => {
          fetchBusinessLines();
          addNotification({
            variant: 'success',
            title: 'Lini Bisnis ditambahkan',
            description: 'Berhasil menambahkan lini bisnis',
            hideDuration: 4000,
          });
        }}
      />
      <EditBusinessLineModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          fileStore.clearSkFile();
        }}
        businessLine={selectedBusinessLine}
        onSuccess={() => {
          fetchBusinessLines();
          addNotification({
            variant: 'success',
            title: 'Lini Bisnis diubah',
            description: 'Berhasil mengubah lini bisnis',
            hideDuration: 4000,
          });
        }}
      />
      <DeleteBusinessLineModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); fileStore.clearSkFile(); }}
        businessLine={selectedIndex !== null ? (businessLines?.[selectedIndex] as any) : null}
        onSuccess={() => {
          fetchBusinessLines();
          addNotification({
            variant: 'success',
            title: 'Lini Bisnis dihapus',
            description: 'Berhasil menghapus lini bisnis',
            hideDuration: 4000,
          });
        }}
      />

      {/* notification container moved to App.tsx */}
    </>
  );
}
