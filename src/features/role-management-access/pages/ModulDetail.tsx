import { DataTable, DataTableColumn, DataTableAction } from '../../../components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil, IconHapus } from '@/icons/components/icons';
import useModulDetail, { ModulData } from '../hooks/useModulDetail';

export default function ModulDetail() {
  const {
    modulData,
    handleAddModul,
    handleEditModul,
    handleDeleteModul,
    handleDetailModul,
  } = useModulDetail();

  // Columns for Modul
  const modulColumns: DataTableColumn<ModulData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    { id: 'idModul', label: 'Id Modul', minWidth: 150 },
    { id: 'sistemLayanan', label: 'Sistem Layanan', minWidth: 150 },
    { id: 'modul', label: 'Modul', minWidth: 300 },
    {
      id: 'detail',
      label: 'Detail',
      minWidth: 100,
      align: 'center',
      sortable: false,
      format: (_value, row) => (
        <button 
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => handleDetailModul(row)}
        >
          <IconFileDetail color="#6C757D" />
        </button>
      ),
    },
  ];

  const modulActions: DataTableAction<ModulData>[] = [
    {
      icon: <IconHapus color="#6C757D" />,
      onClick: handleDeleteModul,
    },
    {
      icon: <IconPencil color="#6C757D" />,
      onClick: handleEditModul,
    },
  ];

  return (
    <div className="px-4 space-y-8 pb-8">
      <DataTable
        data={modulData}
        columns={modulColumns}
        actions={modulActions}
        title="Detail Modul"
        onAdd={handleAddModul}
        addButtonLabel="Tambah Modul"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        filterable={true}
      />
    </div>
  );
}
