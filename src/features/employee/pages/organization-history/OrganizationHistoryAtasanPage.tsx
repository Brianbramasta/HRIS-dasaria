import { DataTable, DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { useOrganizationHistoryAtasan, OrganizationChangeItem } from '@/features/employee/hooks/organization-history/useOrganizationhistoryAtasan.tsx';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { useMemo } from 'react';
import { IconFileDetail } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { formatImage } from '@/utils/formatImage';
import { useNavigate } from 'react-router-dom';

type OrgHistoryListRow = OrganizationChangeItem & { statusPerubahan: string };

export default function OrganizationHistoryAtasanPage() {
  const navigate = useNavigate();
  const {
    data,
    rowsWithStatus,
    loading,
    total,
    page,
    limit,
    isDropdownOpen,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleDateRangeFilterChange,
    dateRangeFilters,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
  } = useOrganizationHistoryAtasan();

  // Define columns
  const columns: DataTableColumn<OrgHistoryListRow>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (_v, row) => data.findIndex((r) => r.id === row.id) + 1 },
      { id: 'employee_id', label: 'NIP' },
      {
        id: 'full_name',
        label: 'Pengguna',
        format: (_v, row) => (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full overflow-hidden">
              {formatImage(null, row.full_name || 'User')}
            </div>
            <span>{row.full_name || '-'}</span>
          </div>
        ),
      },
      { id: 'change_type', label: 'Jenis Perubahan' },
      { id: 'effective_date', label: 'Tanggal Efektif', dateRangeFilter: true, format: (v: string) => formatDateToIndonesian(v || '') },
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
    [data]
  );

  // Define actions (Atasan only has view action)
  const actions: DataTableAction<OrgHistoryListRow>[] = useMemo(
    () => [
      {
        icon: <IconFileDetail />,
        className: 'text-gray-700',
        condition: (row) => Boolean((row as any)?.decree_file),
        onClick: (row) => {
          // navigate(`/organization-history/preview?id=${row.id}`);
          window.open(formatUrlFile((row as any)?.decree_file), '_blank');
          // navigate(`/employee-data/${row.employee_id}?mode=view&tab=organization-history`);
        },
      }
    ],
    []
  );

  return (
    <div className="p-4">
      <DataTable
        title="Perubahan Organisasi & Rekomendasi"
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
        onAdd={() => navigate('/organization-history/detail?mode=add')}
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
    </div>
  );
}
