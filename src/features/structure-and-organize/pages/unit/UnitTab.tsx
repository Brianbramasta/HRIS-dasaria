import { useState } from 'react';
import DataTable, { DataTableColumn } from '../../../../components/shared/datatable/DataTable';
import { IconPencil as Edit, FileText } from '@/icons/components/icons';
import { useUnits, type UnitRow } from '../../hooks/useUnits';
import AddUnitModal from '../../components/modals/unit/AddUnitModal';
import EditUnitModal from '../../components/modals/unit/EditUnitModal';
import DeleteUnitmodal from '../../components/modals/unit/DeleteUnitmodal';
import { useFileStore } from '@/stores/fileStore';
import { formatUrlFile } from '@/utils/formatUrlFile';

type Props = { resetKey: string };

const unitColumns: DataTableColumn<UnitRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-unit', label: 'Nama Unit', sortable: true },
  { id: 'departemen', label: 'Departemen', sortable: true },
  { id: 'deskripsi-umum', label: 'Deksripsi Umum', sortable: true },
  {
    id: 'file-sk-dan-memo',
    label: 'File SK dan Memo',
    sortable: false,
    align: 'center',
    isAction: true,
    format: (row: UnitRow) =>
      row.fileUrl ? (
        <a
          href={formatUrlFile(row.fileUrl as string)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center"
        >
          <FileText size={16} />
        </a>
      ) : (
        '—'
      ),
  },
];

export default function UnitTab({ resetKey }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitRow | null>(null);
  const { rows_column, total, page, pageSize, loading, setPage, setPageSize, setSearch, setSort, fetchUnits } = useUnits();
  const fileStore = useFileStore();

  return (
    <>
      <DataTable
        title="Unit"
        data={rows_column}
        columns={unitColumns}
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
            onClick: row => {
              setSelectedUnit(row);
              setIsEditOpen(true);
            },
          },
          // {
          //   label: '',
          //   variant: 'outline',
          //   className: 'border-0',
          //   color: 'error',
          //   icon: <Trash />,
          //   onClick: row => {
          //     setSelectedUnit(row);
          //     setIsDeleteOpen(true);
          //   },
          // },
        ]}
        searchable
        filterable
        resetKey={resetKey}
        onSearchChange={val => {
          setSearch(val);
          fetchUnits();
        }}
        onSortChange={(columnId, order) => {
          setSort(columnId, order);
          fetchUnits();
        }}
        onPageChangeExternal={p => {
          setPage(p);
          fetchUnits();
        }}
        onRowsPerPageChangeExternal={ps => {
          setPageSize(ps);
          fetchUnits();
        }}
        onColumnVisibilityChange={() => {}}
        onAdd={() => setIsAddOpen(true)}
        onExport={() => {}}
      />
      <AddUnitModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          fileStore.clearSkFile();
          fetchUnits();
        }}
        onSuccess={() => {
          setIsAddOpen(false);
          fileStore.clearSkFile();
          fetchUnits();
        }}
      />
      <EditUnitModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUnit(null);
          fileStore.clearSkFile();
        }}
        onSuccess={() => {
          setIsEditOpen(false);
          setSelectedUnit(null);
          fileStore.clearSkFile();
          fetchUnits();
        }}
        unit={selectedUnit}
      />
      <DeleteUnitmodal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUnit(null);
          fileStore.clearSkFile();
        }}
        unit={selectedUnit}
        onSuccess={() => {
          setIsDeleteOpen(false);
          setSelectedUnit(null);
          fileStore.clearSkFile();
          fetchUnits();
        }}
      />
    </>
  );
}
