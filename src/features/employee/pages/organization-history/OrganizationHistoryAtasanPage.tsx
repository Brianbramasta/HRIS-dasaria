import { DataTable, DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { useApiOrganizationChange } from '@/features/employee/hooks/api/useApiOrganizationChange';
import { OrganizationChangeListItem } from '@/features/employee/types/dto/OrganizationChangeType';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { useMemo, useEffect, useCallback, useState } from 'react';
import { IconFileDetail } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';
// import { formatUrlFile } from '@/utils/formatUrlFile';
import { formatImage } from '@/utils/formatImage';
import { useNavigate } from 'react-router-dom';
import useFilterStore from '@/stores/filterStore';
import { formatFilterValue } from '@/utils/formatFilterValue';

type OrgHistoryListRow = OrganizationChangeListItem & { statusPerubahan: string };

export default function OrganizationHistoryAtasanPage() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});
    
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters['OrganizationHistoryAtasan']));
  
  const {
    organizationChanges: data,
    loading,
    pagination,
    fetchOrganizationChanges,
  } = useApiOrganizationChange();

  // Fetch data with category=recomendation filter on mount
  useEffect(() => {
    fetchOrganizationChanges({ category: 'recomendation' });
  }, [fetchOrganizationChanges]);

  // Helper function to build query params
  const buildQueryParams = useCallback((baseParams: any = {}) => {
    const params: any = { ...baseParams, category: 'recomendation' };
    
    // Add column filters (multiple values)
    Object.entries(columnFilters).forEach(([key, values]) => {
      if (values && values.length > 0 && key === 'statusPerubahan') {
        params['filter_column[org_change_status][in][]'] = values;
      }
    });
    
    // Add date range filters
    Object.entries(dateRangeFilters).forEach(([key, range]) => {
      if (key === 'effective_date' && (range.startDate || range.endDate)) {
        const dateRange = [];
        if (range.startDate) dateRange.push(range.startDate);
        if (range.endDate) dateRange.push(range.endDate);
        if (dateRange.length > 0) {
          params['filter_column[effective_date][range][]'] = dateRange;
        }
      }
    });
    
    // Add filter items from filter modal
    if (filterValue) {
      params.filter = Array.isArray(filterValue) ? filterValue : [filterValue];
    }
    
    return params;
  }, [columnFilters, dateRangeFilters, filterValue]);

  // Event handlers
  const handleSearchChange = useCallback((searchValue: string) => {
    const params = buildQueryParams({ search: searchValue });
    fetchOrganizationChanges(params);
  }, [fetchOrganizationChanges, buildQueryParams]);

  const handleSortChange = useCallback((sortValue: string) => {
    const params = buildQueryParams({ sort: sortValue });
    fetchOrganizationChanges(params);
  }, [fetchOrganizationChanges, buildQueryParams]);

  const handlePageChange = useCallback((page: number) => {
    const params = buildQueryParams({ page });
    fetchOrganizationChanges(params);
  }, [fetchOrganizationChanges, buildQueryParams]);

  const handleRowsPerPageChange = useCallback((perPage: number) => {
    const params = buildQueryParams({ per_page: perPage });
    fetchOrganizationChanges(params);
  }, [fetchOrganizationChanges, buildQueryParams]);

  const handleColumnFilterChange = useCallback((columnId: string, values: string[]) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnId]: values
    }));
  }, []);

  const handleDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
    setDateRangeFilters(prev => ({
      ...prev,
      [columnId]: { startDate, endDate }
    }));
  }, []);


  // Refetch data when filters change
  useEffect(() => {
    const params = buildQueryParams();
    fetchOrganizationChanges(params);
  }, [columnFilters, dateRangeFilters, filterValue, buildQueryParams, fetchOrganizationChanges]);

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
          { label: 'Upload Dokumen', value: 'Upload Dokumen' },
          { label: 'Selesai', value: 'Selesai' },
        ],
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
        // condition: (row) => Boolean((row as any)?.decree_file),
        onClick: (row) => {
          // navigate(`/organization-history/preview?id=${row.id}`);
          navigate(`/organization-history/detail?id=${row.id}&atasan=true`);
          // window.open(formatUrlFile((row as any)?.decree_file), '_blank');
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
        resetKey='OrganizationHistoryAtasan'
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
        onColumnFilterChange={handleColumnFilterChange}
        columnFilters={columnFilters}
        emptyMessage="Belum ada perubahan organisasi"
        addButtonLabel="Tambah Organisasi"
        onAdd={() => navigate('/organization-history/create?mode=atasan')}
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
