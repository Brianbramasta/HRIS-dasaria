import { DataTable, DataTableColumn, DataTableAction } from '../../../components/shared/datatable/DataTable';
import { IconFileDetail, IconPencil, IconHapus } from '@/icons/components/icons';
import useRoleManagement, { RoleData, LayananData } from '../hooks/useRoleManagement';
import { useApiRolesAccess } from '../hooks/api/useApiRolesAccess';
import { useEffect, useMemo } from 'react';
import AddServiceModal from '../components/modals/service/AddServiceModal';
import EditServiceModal from '../components/modals/service/EditServiceModal';
import DeleteServiceModal from '../components/modals/service/DeleteServiceModal';
import DeleteRoleModal from '../components/modals/detail-role/DeleteRoleModal';

export default function HakAksesPage() {
  const {
    // roleData, // We will override this
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
    columnFilters,
    handleColumnFilterChange,
    fetchApps,
    appsLoading,
  } = useRoleManagement();

  const { appsPerRole, fetchAppsPerRole, loading } = useApiRolesAccess();

  useEffect(() => {
    fetchAppsPerRole();
    fetchApps();
  }, [fetchAppsPerRole, fetchApps]);

  const apiRoleData: RoleData[] = useMemo(() => {
    return appsPerRole.map((item, index) => ({
      id: item.role_id, // DataTable might need 'id'
      no: index + 1,
      idRole: item.role_id,
      role: item.role_name,
      sistemLayanan: item.list_apps.map(app => app.app_name).join(', '),
    }));
  }, [appsPerRole]);

  // Columns for Role Akses
  const roleColumns: DataTableColumn<RoleData>[] = [
    { id: 'no', label: 'No.', minWidth: 50, sortable: false },
    // { id: 'idRole', label: 'Id Role', minWidth: 150 },
    { id: 'role', label: 'Role', minWidth: 150 },
    {
      id: 'sistemLayanan',
      label: 'Sistem Layanan',
      minWidth: 300,
      filterOptions: layananData.map(item => ({
        label: item.sistemLayanan,
        value: item.sistemLayanan
      })),
      filterMaxRows: 3
    },
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
    {
      id: 'sistemLayanan',
      label: 'Sistem Layanan',
      minWidth: 300,

    },
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
        data={apiRoleData}
        columns={roleColumns}
        actions={roleActions}
        title="Role Akses"
        onAdd={handleAddRole}
        addButtonLabel="Tambah Role"
        searchPlaceholder="Cari berdasarkan kata kunci"
        pageSize={10}
        filterable={true}
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        loading={loading}
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
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        loading={appsLoading}
      />

      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={handleCloseAddServiceModal}
        onSuccess={fetchApps}
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
        onSuccess={fetchApps}
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
