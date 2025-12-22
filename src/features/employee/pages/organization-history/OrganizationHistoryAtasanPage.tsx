import { DataTable } from '@/features/structure-and-organize/components/datatable/DataTable';
import { useOrganizationHistoryAtasan } from '@/features/employee/hooks/organization-history/useOrganizationhistoryAtasan.tsx';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import EditRiwayatOrganisasiModal from '@/features/employee/components/modals/organization-history/EditOrganizationHistoryModal';

export default function OrganizationHistoryAtasanPage() {
  const {
    rowsWithStatus,
    columns,
    actions,
    loading,
    isEditOrgOpen,
    isDropdownOpen,
    handleSearchChange,
    handleSortChange,
    handleAddOrganization,
    handleCloseModal,
    handleSubmitModal,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
  } = useOrganizationHistoryAtasan();

  return (
    <div className="p-4">
      <DataTable
        title="Riwayat Organisasi & Rekomendasi"
        data={rowsWithStatus}
        columns={columns}
        actions={actions}
        loading={loading}
        filterable
        emptyMessage="Belum ada riwayat organisasi"
        addButtonLabel="Tambah Organisasi"
        onAdd={handleAddOrganization}
        searchPlaceholder="Cari berdasarkan kata kunci"
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        toolbarRightSlot={
          <div className="relative">
            <Button
              onClick={handleDropdownToggle}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 dropdown-toggle"
            >
              Riwayat Organisasi & Rekomendasi (Atasan)
              <ChevronDown size={16} />
            </Button>
            <Dropdown isOpen={isDropdownOpen} onClose={handleDropdownClose}>
              <div className="p-2 w-64">
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleNavigateToHR}
                >
                  Riwayat Organisasi Karyawan (HR)
                </button>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleNavigateToAtasan}
                >
                  Riwayat Organisasi & Rekomendasi (Atasan)
                </button>
              </div>
            </Dropdown>
          </div>
        }
      />

      <EditRiwayatOrganisasiModal
        isOpen={isEditOrgOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        submitting={false}
        hideSkFileUpload
      />
    </div>
  );
}
