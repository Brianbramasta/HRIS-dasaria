import { DataTable, DataTableColumn, DataTableAction } from '../../../components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil, IconHapus } from '@/icons/components/icons';
import useRoleManagement, { RoleData, LayananData } from '../hooks/useRoleManagement';
import AddServiceModal from '../components/modals/service/AddServiceModal';
import EditServiceModal from '../components/modals/service/EditServiceModal';
import DeleteServiceModal from '../components/modals/service/DeleteServiceModal';
import DeleteRoleModal from '../components/modals/detail-role/DeleteRoleModal';

export default function HakAksesPage() {
  const {
    roleData,
    layananData,
    handleAddRole,
    handleAddLayanan,
    handleDeleteRole,
    handleDeleteLayanan,
    handleEditRole,
    handleEditLayanan,
    handleDetailRole,
    handleDetailLayanan,
    isAddServiceModalOpen,
    handleCloseAddServiceModal,
    isDeleteServiceModalOpen,
    handleCloseDeleteServiceModal,
    selectedServiceToDelete,
    handleConfirmDeleteService,
    isEditServiceModalOpen,
    handleCloseEditServiceModal,
    selectedServiceToEdit,
    isDeleteRoleModalOpen,
    handleCloseDeleteRoleModal,
    selectedRoleToDelete,
    handleConfirmDeleteRole,
  } = useRoleManagement();

  // Columns for Role Akses
  const roleColumns: DataTableColumn<RoleData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    { id: 'idRole', label: 'Id Role', minWidth: 150 },
    { id: 'role', label: 'Role', minWidth: 150 },
    { id: 'sistemLayanan', label: 'Sistem Layanan', minWidth: 300 },
    {
      id: 'detail',
      label: 'Detail',
      minWidth: 100,
      align: 'center',
      sortable: false,
      format: (_value, row) => (
        <button
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => handleDetailRole(row.idRole)}
        >
          <IconFileDetail color="#6C757D" />
        </button>
      ),
    },
  ];

  // Columns for Sistem Layanan
  const layananColumns: DataTableColumn<LayananData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    // { id: 'idLayanan', label: 'Id Layanan', minWidth: 150 },
    { id: 'sistemLayanan', label: 'Sistem Layanan', minWidth: 300 },
    {
      id: 'detail',
      label: 'Detail',
      minWidth: 100,
      align: 'center',
      sortable: false,
      format: (_value, row) => (
        <button
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => handleDetailLayanan(row.idLayanan)}
        >
          <IconFileDetail color="#6C757D" />
        </button>
      ),
    },
  ];

  const roleActions: DataTableAction<RoleData>[] = [
    {
      icon: <IconHapus color="#6C757D" />,
      onClick: handleDeleteRole,
    },
    {
      icon: <IconPencil color="#6C757D" />,
      onClick: handleEditRole,
    },
  ];

  const layananActions: DataTableAction<LayananData>[] = [
    {
      icon: <IconHapus color="#6C757D" />,
      onClick: handleDeleteLayanan,
    },
    {
      icon: <IconPencil color="#6C757D" />,
      onClick: handleEditLayanan,
    },
  ];

  return (
    <div className="px-4 space-y-8 pb-8">
      <DataTable
        data={roleData}
        columns={roleColumns}
        actions={roleActions}
        title="Role Akses"
        onAdd={handleAddRole}
        addButtonLabel="Tambah Role"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        filterable={true}
      />

      <DataTable
        data={layananData}
        columns={layananColumns}
        actions={layananActions}
        title="Sistem Layanan"
        onAdd={handleAddLayanan}
        addButtonLabel="Tambah Layanan"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        filterable={true}
      />

      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={handleCloseAddServiceModal}
      />
      <DeleteServiceModal
        isOpen={isDeleteServiceModalOpen}
        onClose={handleCloseDeleteServiceModal}
        onDelete={handleConfirmDeleteService}
        serviceName={selectedServiceToDelete?.sistemLayanan}
      />
      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        onClose={handleCloseEditServiceModal}
        data={selectedServiceToEdit}
      />
      <DeleteRoleModal
        isOpen={isDeleteRoleModalOpen}
        onClose={handleCloseDeleteRoleModal}
        onDelete={handleConfirmDeleteRole}
        roleName={selectedRoleToDelete?.role}
      />
    </div>
  );
}
