import { DataTable, DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { useOrganizationHistoryAtasan } from '@/features/employee/hooks/organization-history/useOrganizationhistoryAtasan.tsx';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import EditRiwayatOrganisasiModal from '@/features/employee/components/modals/organization-history/EditOrganizationHistoryModal';
import { IconFileDetail } from '@/icons/components/icons';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OrganizationHistoryItem } from '@/features/employee/services/OrganizationHistoryService';

type OrgHistoryListRow = OrganizationHistoryItem & { statusPerubahan: 'Rekomendasi' | 'Selesai' };

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
      { id: 'idKaryawan', label: 'NIP' },
      {
        id: 'user',
        label: 'User',
        format: (_v, row) => (
          <div className="flex items-center gap-2">
            <img
              src={(row.user?.avatar as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.user?.name || 'User'}`}
              alt={row.user?.name || 'User'}
              className="h-6 w-6 rounded-full"
            />
            <span>{row.user?.name || '-'}</span>
          </div>
        ),
      },
      { id: 'jenisPerubahan', label: 'Jenis Perubahan' },
      { id: 'tanggalEfektif', label: 'Tanggal Efektif', format: (v) => formatDate(v as string) },
      { id: 'posisiLama', label: 'Posisi Lama' },
      { id: 'posisiBaru', label: 'Posisi Baru' },
      { id: 'divisiLama', label: 'Divisi Lama' },
      { id: 'divisiBaru', label: 'Divisi Baru' },
      { id: 'direktoratLama', label: 'Direktorat Lama' },
      { id: 'direktoratBaru', label: 'Direktorat Baru' },
      { id: 'alasanPerubahan', label: 'Alasan Perubahan' },
      {
        id: 'statusPerubahan',
        label: 'Status Perubahan',
        align: 'center',
        format: (v: string) => {
          const val = (v as string) || '-';
          const isRekom = val === 'Rekomendasi';
          const base = 'status-styling items-center rounded-full text-xs font-medium';
          const cls = isRekom ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600';
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
        submitting={false}
        hideSkFileUpload
      />
    </div>
  );
}
