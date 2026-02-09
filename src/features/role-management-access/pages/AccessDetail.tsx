import { DataTable, DataTableColumn, DataTableAction } from '../../../components/shared/datatable/DataTable';
import { IconPencil, IconHapus } from '@/icons/components/icons';
import useAccessDetail, { AccessData } from '../hooks/useAccessDetail';
import AddAccessModal from '../components/modals/access/AddAccessModal';
import EditAccessModal from '../components/modals/access/EditAccessModal';
import DeleteAccessModal from '../components/modals/access/DeleteAccessModal';

export default function AccessDetail() {
  const {
    featureId,
    accessData,
    loading,
    handleAddAccess,
    handleEditAccess,
    handleDeleteAccess,
    isAddAccessModalOpen,
    setIsAddAccessModalOpen,
    isEditAccessModalOpen,
    setIsEditAccessModalOpen,
    isDeleteAccessModalOpen,
    setIsDeleteAccessModalOpen,
    selectedAccess,
    onDeleteConfirm,
    refreshData,
  } = useAccessDetail();

  const accessColumns: DataTableColumn<AccessData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    { id: 'akses', label: 'Akses', minWidth: 200 },
    { id: 'code', label: 'Kode', minWidth: 100 },
    { id: 'deskripsi', label: 'Deskripsi', minWidth: 300 },
    { id: 'fitur', label: 'Fitur', minWidth: 200 },
  ];

  const accessActions: DataTableAction<AccessData>[] = [
    {
      icon: <IconHapus color="#6C757D" />,
      onClick: handleDeleteAccess,
    },
    {
      icon: <IconPencil color="#6C757D" />,
      onClick: handleEditAccess,
    },
  ];

  return (
    <div className="px-4 space-y-8 pb-8">
      <DataTable
        data={accessData}
        columns={accessColumns}
        actions={accessActions}
        title="Detail Akses"
        onAdd={handleAddAccess}
        addButtonLabel="Tambah Akses"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        filterable={true}
      />

      <AddAccessModal
        isOpen={isAddAccessModalOpen}
        onClose={() => setIsAddAccessModalOpen(false)}
        featureId={featureId}
        onSuccess={refreshData}
      />
      <EditAccessModal
        isOpen={isEditAccessModalOpen}
        onClose={() => setIsEditAccessModalOpen(false)}
        data={selectedAccess}
        onSuccess={refreshData}
      />
      <DeleteAccessModal
        isOpen={isDeleteAccessModalOpen}
        onClose={() => setIsDeleteAccessModalOpen(false)}
        onDelete={onDeleteConfirm}
        data={selectedAccess}
      />
    </div>
  );
}
