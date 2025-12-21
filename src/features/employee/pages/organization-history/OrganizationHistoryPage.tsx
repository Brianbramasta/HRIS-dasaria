import { DataTable } from '@/features/structure-and-organize/components/datatable/DataTable';
import { useOrganizationHistory } from '@/features/employee/hooks/organization-history/useOrganizationHistory.tsx';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import EditRiwayatOrganisasiModal from '@/features/employee/components/modals/riwayatOrganisasi/editRiwayatOrganisasiModal';

export default function OrganizationHistoryPage() {
  const {
    rowsWithStatus,
    columns,
    actions,
    loading,
    isEditOrgOpen,
    isDropdownOpen,
    selectedRow,
    handleSearchChange,
    handleSortChange,
    handleAddOrganization,
    handleCloseModal,
    handleSubmitModal,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
  } = useOrganizationHistory();

  return (
    <div className="p-4">
      <DataTable
        title="Riwayat Organisasi"
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
              Riwayat Organisasi Karyawan (HR)
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
        initialData={selectedRow ? {
          idKaryawan: selectedRow.idKaryawan,
          nama: selectedRow.user?.name || undefined,
          jenisPerubahan: selectedRow.jenisPerubahan,
          tanggalEfektif: selectedRow.tanggalEfektif,
          alasanPerubahan: selectedRow.alasanPerubahan || undefined,
        } : undefined}
      />
    </div>
  );
}
