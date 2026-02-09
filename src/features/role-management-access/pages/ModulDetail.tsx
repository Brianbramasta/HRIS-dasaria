import { DataTable, DataTableColumn, DataTableAction } from '../../../components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil, IconHapus } from '@/icons/components/icons';
import useModulDetail, { ModulData } from '../hooks/useModulDetail';
import AddModulModal from '../components/modals/modul/AddModulModal';
import EditModulModal from '../components/modals/modul/EditModulModal';
import DeleteModulModal from '../components/modals/modul/DeleteModulModal';

export default function ModulDetail() {
  const {
    modulData,
    handleAddModul,
    handleEditModul,
    handleDeleteModul,
    handleDetailModul,
    isAddModulModalOpen,
    setIsAddModulModalOpen,
    isEditModulModalOpen,
    setIsEditModulModalOpen,
    isDeleteModulModalOpen,
    setIsDeleteModulModalOpen,
    selectedModul,
    onDeleteConfirm,
    layananId,
    refreshData,
    loading,
  } = useModulDetail();

  // Columns for Modul
  const modulColumns: DataTableColumn<ModulData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    // { id: 'idModul', label: 'Id Modul', minWidth: 150 },
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
        loading={loading}
      />
      <AddModulModal
        isOpen={isAddModulModalOpen}
        onClose={() => setIsAddModulModalOpen(false)}
        appsId={layananId}
        onSuccess={refreshData}
      />
      <EditModulModal
        isOpen={isEditModulModalOpen}
        onClose={() => setIsEditModulModalOpen(false)}
        data={selectedModul}
        onSuccess={refreshData}
      />
      <DeleteModulModal
        isOpen={isDeleteModulModalOpen}
        onClose={() => setIsDeleteModulModalOpen(false)}
        onDelete={onDeleteConfirm}
        modulName={selectedModul?.modul}
        isLoading={loading}
      />
    </div>
  );
}
