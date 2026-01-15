import { useState } from 'react';
import { Link } from 'react-router';
import DataTable, { DataTableColumn } from '../../../../components/shared/datatable/DataTable';
import { IconPencil as Edit, IconHapus as Trash, FileText } from '@/icons/components/icons';
import { useUnits, type UnitRow } from '../../hooks/useUnits';
import AddUnitModal from '../../components/modals/unit/AddUnitModal';
import EditUnitModal from '../../components/modals/unit/EditUnitModal';
import DeleteUnitmodal from '../../components/modals/unit/DeleteUnitmodal';
import { useFileStore } from '@/stores/fileStore';

type Props = { resetKey: string };

const unitColumns: DataTableColumn<UnitRow>[] = [
  { id: 'no', label: 'No', sortable: false },
  { id: 'nama-unit', label: 'Nama Unit', sortable: true },
  { id: 'departemen', label: 'Departemen', sortable: true },
  { id: 'deskripsi-umum', label: 'Deksripsi Umum', sortable: true },
  {
    id: 'file-sk-dan-memin',
    label: 'File Sk & Memin',
    sortable: false,
    align: 'center',
    isAction: true,
    format: () => (
      <div className="flex justify-center items-center">
        <FileText size={16} />
      </div>
    ),
  },
];

export default function UnitTab({ resetKey }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitRow | null>(null);
  const { rows_column, total, page, pageSize, setPage, setPageSize, setSearch } = useUnits();
  const fileStore = useFileStore();

  return (
    <>
      <DataTable
        title="Unit"
        data={rows_column}
        columns={unitColumns}
        loading={false}
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
          {
            label: '',
            variant: 'outline',
            className: 'border-0',
            color: 'error',
            icon: <Trash />,
            onClick: row => {
              setSelectedUnit(row);
              setIsDeleteOpen(true);
            },
          },
        ]}
        searchable
        filterable
        resetKey={resetKey}
        onSearchChange={val => {
          setSearch(val);
        }}
        onSortChange={() => {}}
        onPageChangeExternal={p => {
          setPage(p);
        }}
        onRowsPerPageChangeExternal={ps => {
          setPageSize(ps);
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
        }}
      />
      <EditUnitModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUnit(null);
          fileStore.clearSkFile();
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
        }}
      />
    </>
  );
}
