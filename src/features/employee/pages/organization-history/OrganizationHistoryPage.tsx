import { DataTable, DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { useOrganizationHistory, OrganizationChangeItem } from '@/features/employee/hooks/organization-history/useOrganizationHistory.tsx';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import EditRiwayatOrganisasiModal from '@/features/employee/components/modals/organization-history/EditOrganizationHistoryModal';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconPencil, IconFileDetail } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';

type OrgHistoryListRow = OrganizationChangeItem & { statusPerubahan: string };

export default function OrganizationHistoryPage() {
  const navigate = useNavigate();
  
  const {
    data,
    rowsWithStatus,
    loading,
    total,
    page,
    limit,
    isEditOrgOpen,
    isDropdownOpen,
    selectedRow,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleDateRangeFilterChange,
    dateRangeFilters,
    handleAddOrganization,
    handleEditOrganization,
    handleCloseModal,
    handleSubmitModal,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
    // setSelectedRow,
    // setIsEditOrgOpen,
    detail,
  } = useOrganizationHistory();

  // Define columns
  const columns: DataTableColumn<OrgHistoryListRow>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (_v, row) => data.findIndex((r) => r.id === row.id) + 1 },
      { id: 'employee_id', label: 'NIP' },
      {
        id: 'full_name',
        label: 'Nama',
        format: (_v, row) => (
          <div className="flex items-center gap-2">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.full_name || 'User'}`}
              alt={row.full_name || 'User'}
              className="h-6 w-6 rounded-full"
            />
            <span>{row.full_name || '-'}</span>
          </div>
        ),
      },
      { id: 'change_type', label: 'Jenis Perubahan' },
      { id: 'effective_date', label: 'Tanggal Efektif', dateRangeFilter: true, format: (v: string) => formatDateToIndonesian(v || '') },
      { id: 'old_company', label: 'Perusahaan Lama' },
      { id: 'new_company', label: 'Perusahaan Baru' },
      { id: 'old_directorate', label: 'Direktorat Lama' },
      { id: 'new_directorate', label: 'Direktorat Baru' },
      { id: 'old_division', label: 'Divisi Lama' },
      { id: 'new_division', label: 'Divisi Baru' },
      { id: 'old_department', label: 'Departemen Lama' },
      { id: 'new_department', label: 'Departemen Baru' },
      {
        id: 'old_unit',
        label: 'Unit Lama',
        format: (v: string | undefined) => v || '-',
      },
      {
        id: 'new_unit',
        label: 'Unit Baru',
        format: (v: string | undefined) => v || '-',
      },
      { id: 'old_position', label: 'Posisi Lama' },
      { id: 'new_position', label: 'Posisi Baru' },
      { id: 'old_job_title', label: 'Jabatan Kepangkatan Lama' },
      { id: 'new_job_title', label: 'Jabatan Kepangkatan Baru' },
      {
        id: 'old_structural_job_title',
        label: 'Jabatan Struktural Lama',
        format: (v: string | null | undefined) => v || '-',
      },
      {
        id: 'new_structural_job_title',
        label: 'Jabatan Struktural Baru',
        format: (v: string | null | undefined) => v || '-',
      },
      { id: 'old_position_level', label: 'Jenjang Jabatan Lama' },
      { id: 'new_position_level', label: 'Jenjang Jabatan Baru' },
      { id: 'old_employee_category', label: 'Kategori Karyawan Lama' },
      { id: 'new_employee_category', label: 'Kategori Karyawan Baru' },
      { id: 'reason', label: 'Alasan Perubahan' },
      {
        id: 'statusPerubahan',
        label: 'Status Perubahan',
        align: 'center',
        format: (v: string) => {
          const val = (v as string) || '-';
          // Basic styling for different statuses
          let cls = 'bg-gray-100 text-gray-600';
          if (val.toLowerCase().includes('approv') || val.toLowerCase() === 'selesai') cls = 'bg-green-100 text-green-600';
          else if (val.toLowerCase().includes('reject')) cls = 'bg-red-100 text-red-600';
          else if (val.toLowerCase().includes('rekom') || val.toLowerCase().includes('pending')) cls = 'bg-orange-100 text-orange-600';
          
          const base = ' rounded-full p-[10px] flex justify-center text-xs font-medium';
          return <span className={`${base} ${cls}`}>{val}</span>;
        },
      },
    ],
    [data]
  );

  // Define actions
  const actions: DataTableAction<OrgHistoryListRow>[] = useMemo(
    () => [
      {
        icon: <IconFileDetail />,
        className: 'text-gray-700',
        condition: (row) => Boolean((row as any)?.decree_file),
        onClick: (row) => {
          // console.log(row);
          // return;
          // navigate(`/organization-history/preview?id=${row.id}`);
          navigate(`/employee-data/${row.employee_id}?mode=view&tab=organization-history`);
        },
      },
      {
        icon: <IconPencil />,
        className: 'text-gray-700',
        condition: (row) => !(row as any)?.decree_file,
        onClick: (row) => {
          handleEditOrganization(row);
        },
      }
    ],
    [navigate, handleEditOrganization]
  );

  return (
    <div className="p-4">
      <DataTable
        title="Perubahan Organisasi"
        data={rowsWithStatus}
        columns={columns}
        actions={actions}
        pageSize={limit}
        loading={loading}
        filterable
        useExternalPagination
        externalPage={page}
        externalTotal={total}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        emptyMessage="Belum ada perubahan organisasi"
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
        // submitting={isSubmitting}
        initialData={selectedRow ? detail || undefined : undefined}
      />
    </div>
  );
}
