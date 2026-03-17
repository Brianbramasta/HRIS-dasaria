import { DataTable, DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { useApiOrganizationChange } from '@/features/employee/hooks/api/useApiOrganizationChange';
import { OrganizationChangeListItem } from '@/features/employee/types/dto/OrganizationChangeType';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { useMemo, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconFileDetail } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatImage } from '@/utils/formatImage';

type OrgHistoryListRow = OrganizationChangeListItem & { statusPerubahan: string };

export default function OrganizationHistoryPage() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const {
    organizationChanges: data,
    loading,
    pagination,
    fetchOrganizationChanges,
  } = useApiOrganizationChange();

  // Fetch data with default (all categories) on mount
  useEffect(() => {
    fetchOrganizationChanges({});
  }, [fetchOrganizationChanges]);

  // Event handlers
  const handleSearchChange = useCallback((searchValue: string) => {
    fetchOrganizationChanges({ 
      'filter[employee_name]': searchValue 
    });
  }, [fetchOrganizationChanges]);

  const handleSortChange = useCallback((sortValue: string) => {
    fetchOrganizationChanges({ 
      sort: sortValue 
    });
  }, [fetchOrganizationChanges]);

  const handlePageChange = useCallback((page: number) => {
    fetchOrganizationChanges({ 
      page 
    });
  }, [fetchOrganizationChanges]);

  const handleRowsPerPageChange = useCallback((perPage: number) => {
    fetchOrganizationChanges({ 
      per_page: perPage 
    });
  }, [fetchOrganizationChanges]);

  const handleDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
    // Note: API doesn't seem to support date range filtering in the contract
    // This would need to be implemented on the backend
    console.log('Date range filter:', columnId, startDate, endDate);
  }, []);

  const dateRangeFilters: Record<string, { startDate: string; endDate: string | null }> = {};

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  const handleDropdownClose = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleNavigateToHR = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/organization-history');
  }, [navigate]);

  const handleNavigateToAtasan = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/organization-history/atasan');
  }, [navigate]);

  // Add statusPerubahan to data for compatibility
  const rowsWithStatus = useMemo(() => 
    data.map(item => ({
      ...item,
      statusPerubahan: item.org_change_status
    })),
    [data]
  );

  // Define columns
  const columns: DataTableColumn<OrgHistoryListRow>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (_v, row) => data.findIndex((r) => r.id === row.id) + 1 },
      { id: 'employee_id', label: 'NIP' },
      {
        id: 'employee_name',
        label: 'Pengguna',
        format: (_v, row) => (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full overflow-hidden">
              {formatImage(null, row.employee_name || 'User')}
            </div>
            <span>{row.employee_name || '-'}</span>
          </div>
        ),
      },
      { id: 'change_type_name', label: 'Jenis Perubahan' },
      { id: 'effective_date', label: 'Tanggal Efektif', dateRangeFilter: true, format: (v: string) => formatDateToIndonesian(v || '') },
      {
        id: 'statusPerubahan',
        label: 'Status Perubahan',
        align: 'center',
        filterOptions: [
          { label: 'Rekomendasi', value: 'Rekomendasi' },
          { label: 'Selesai', value: 'Selesai' },
        ],
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
        // condition: (row) => Boolean((row as any)?.decree_file),
        onClick: (row) => {
          // //console.log(row);
          // return;
          // navigate(`/organization-history/preview?id=${row.id}`);
          navigate(`/organization-history/detail?id=${row.id}`);
        },
      },
      // {
      //   icon: <IconPencil />,
      //   className: 'text-gray-700',
      //   condition: (row) => !(row as any)?.decree_file,
      //   onClick: (row) => {
      //     handleEditOrganization(row);
      //   },
      // }
    ],
    [navigate]
  );

  return (
    <div className="p-4">
      <DataTable
        title="Perubahan Organisasi"
        data={rowsWithStatus}
        columns={columns}
        actions={actions}
        pageSize={pagination.perPage}
        loading={loading}
        filterable
        useExternalPagination
        externalPage={pagination.currentPage}
        externalTotal={pagination.total}
        onPageChangeExternal={handlePageChange}
        onRowsPerPageChangeExternal={handleRowsPerPageChange}
        onDateRangeFilterChange={handleDateRangeFilterChange}
        dateRangeFilters={dateRangeFilters}
        emptyMessage="Belum ada perubahan organisasi"
        addButtonLabel="Tambah Organisasi"
        onAdd={() => navigate('/organization-history/create')}
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
    </div>
  );
}
