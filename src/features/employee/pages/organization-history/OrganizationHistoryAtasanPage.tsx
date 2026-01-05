import { DataTable, DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { useOrganizationHistoryAtasan, OrganizationChangeItem } from '@/features/employee/hooks/organization-history/useOrganizationhistoryAtasan.tsx';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import EditRiwayatOrganisasiModal from '@/features/employee/components/modals/organization-history/EditOrganizationHistoryModal';
import { IconFileDetail } from '@/icons/components/icons';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type OrgHistoryListRow = OrganizationChangeItem & { statusPerubahan: string };

export default function OrganizationHistoryAtasanPage() {
  const navigate = useNavigate();
  
  const {
    data,
    rowsWithStatus,
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

  // Format date helper
  const formatDate = useCallback((iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    return fmt.format(d);
  }, []);

  // Define columns
  const columns: DataTableColumn<OrgHistoryListRow>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (_v, row) => data.findIndex((r) => r.id === row.id) + 1 },
      // { id: 'employee_id', label: 'NIP' },
      {
        id: 'full_name',
        label: 'Nama Karyawan',
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
      { id: 'effective_date', label: 'Tanggal Efektif', format: (v) => formatDate(v as string) },
      { id: 'old_position', label: 'Posisi Lama' },
      { id: 'new_position', label: 'Posisi Baru' },
      { id: 'old_division', label: 'Divisi Lama' },
      { id: 'new_division', label: 'Divisi Baru' },
      { id: 'old_directorate', label: 'Direktorat Lama' },
      { id: 'new_directorate', label: 'Direktorat Baru' },
      { id: 'reason', label: 'Alasan Perubahan' },
      {
        id: 'statusPerubahan',
        label: 'Status Perubahan',
        align: 'center',
        format: (v: string) => {
          const val = (v as string) || '-';
          let cls = 'bg-gray-100 text-gray-600';
          if (val.toLowerCase().includes('approv') || val.toLowerCase() === 'selesai') cls = 'bg-green-100 text-green-600';
          else if (val.toLowerCase().includes('reject')) cls = 'bg-red-100 text-red-600';
          else if (val.toLowerCase().includes('rekom') || val.toLowerCase().includes('pending')) cls = 'bg-orange-100 text-orange-600';
          
          const base = 'status-styling items-center rounded-full text-xs font-medium p-[10px] flex justify-center';
          return <span className={`${base} ${cls}`}>{val}</span>;
        },
      },
    ],
    [data, formatDate]
  );

  // Define actions (Atasan only has view action)
  const actions: DataTableAction<OrgHistoryListRow>[] = useMemo(
    () => [
      {
        icon: <IconFileDetail />,
        className: 'text-gray-700',
        onClick: (row) => {
          navigate(`/organization-history/preview?id=${row.id}`);
        },
      },
    ],
    [navigate]
  );

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
        // submitting={isSubmitting}
        hideSkFileUpload
      />
    </div>
  );
}
