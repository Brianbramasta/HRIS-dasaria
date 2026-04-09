import { useState, useEffect, useCallback } from 'react';
import { organizationHistoryService } from '@/features/employee/services/detail/organzationHistory';
import { OrganizationChangeListParams, OrganizationChangeListItemRaw } from '@/features/employee/services/OrganizationChangeService';
import useFilterStore from '@/stores/filterStore';
import { formatFilterValue } from '@/utils/formatFilterValue';

export type OrgHistoryRow = {
  id: string;
  employee_id: string;
  employee_name: string;
  change_type_id: string;
  change_type_name: string;
  marital_status: string;
  dependents: number;
  reason_change: string;
  decree_file?: string | null;
  adendum_file?: string | null;
  previous_position: {
    employee_category: string;
    employee_category_id: string;
    company: string;
    office: string;
    directorate: string;
    division: string;
    department: string;
    unit: string | null;
    position: string | null;
    rank_position: string;
    structural_position: string;
    position_level: string;
    effective_date: string;
    gaji_pokok: number;
    tunjangan_pernikahan: number;
    tunjangan_jabatan: number;
    tunjangan_lama_kerja: number;
    grade: string;
    tunjangan_dekresi: Array<{
      id: string;
      amount: number;
      allowance_name: string;
    }>;
    take_home_pay: number;
  };
  new_position: {
    employee_category: string;
    employee_category_id: string;
    company: string;
    office: string;
    directorate: string;
    division: string;
    department: string | null;
    unit: string | null;
    position: string | null;
    rank_position: string;
    structural_position: string;
    position_level: string;
    effective_date: string;
    gaji_pokok: number;
    tunjangan_pernikahan: number;
    tunjangan_jabatan: number;
    tunjangan_lama_kerja: number;
    grade: string;
    tunjangan_dekresi: Array<{
      id: string;
      amount: number;
      allowance_name: string;
    }>;
    take_home_pay: number;
  };
};

export interface UseOrganizationHistoryOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
  resetKey?: string;
}

export interface UseOrganizationHistoryReturn {
  rows: OrgHistoryRow[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  fetch: (params?: OrganizationChangeListParams) => Promise<void>;
  handleSearchChange: (search: string) => void;
  handleSortChange: (columnId: string, order: 'asc' | 'desc') => void;
  handlePageChange: (newPage: number) => void;
  handleRowsPerPageChange: (newLimit: number) => void;
  handleColumnFilterChange: (columnId: string, values: string[]) => void;
  handleDateRangeFilterChange: (columnId: string, startDate: string, endDate: string | null) => void;
  columnFilters: Record<string, string[]>;
  dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;
}

function mapToRow(item: OrganizationChangeListItemRaw): OrgHistoryRow {
  return item as OrgHistoryRow;
}

export function useOrganizationHistory(employeeId?: string, options: UseOrganizationHistoryOptions = {}): UseOrganizationHistoryReturn {
  const { initialPage = 1, initialLimit = 10, autoFetch = true, resetKey = 'riwayat-organisasi' } = options;
  
  const [rows, setRows] = useState<OrgHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters[resetKey]));
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

  const fetch = useCallback(
    async (params?: OrganizationChangeListParams) => {
      if (!employeeId) {
        setRows([]);
        setTotal(0);
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        // Build query params for organizationHistoryService
        const queryParams: any = {
          page,
          per_page: limit,
          employeeId,
        };

        if (params?.search) queryParams.search = params.search;
        if (params?.column) queryParams.column = params.column;
        if (params?.sort) queryParams.sort = params.sort;
        if (params?.filter) queryParams.filter = Array.isArray(params.filter) ? params.filter : [params.filter];
        
        // Handle filter - convert to array if needed
        const filterParam = params?.filter ?? filterValue;
        if (filterParam) {
          queryParams.filter = Array.isArray(filterParam) ? filterParam : [filterParam];
        }

        // Add column filters - format: filter_column[column_name][in][]=value
        Object.entries(columnFilters).forEach(([columnId, values]) => {
          if (values && values.length > 0) {
            // Map new column IDs back to API parameter names
            let filterKey = columnId;
            if (columnId.startsWith('old_')) {
              filterKey = 'previous_position';
            } else if (columnId.startsWith('new_')) {
              filterKey = 'new_position';
            }
            
            values.forEach((value) => {
              const key = `filter_column[${filterKey}][in][]`;
              if (!queryParams[key]) {
                queryParams[key] = [];
              }
              queryParams[key].push(value);
            });
          }
        });

        // Add date range filters - format: filter_column[column_name][range][]=start_date & filter_column[column_name][range][]=end_date
        Object.entries(dateRangeFilters).forEach(([columnId, dateRange]) => {
          if (dateRange && dateRange.startDate) {
            // Map new column IDs back to API parameter names
            let filterKey = columnId;
            if (columnId.startsWith('old_')) {
              filterKey = 'previous_position';
            } else if (columnId.startsWith('new_')) {
              filterKey = 'new_position';
            }
            
            const key = `filter_column[${filterKey}][range][]`;
            if (!queryParams[key]) {
              queryParams[key] = [];
            }
            queryParams[key].push(dateRange.startDate);
            if (dateRange.endDate) {
              queryParams[key].push(dateRange.endDate);
            }
          }
        });

        const resp = await organizationHistoryService.getEmployeeOrganizationChanges(queryParams);
        const apiResponse = (resp as any)?.data;
        
        if (apiResponse) {
          const data = apiResponse.data ?? [];
          setRows(data.map(mapToRow));
          setTotal(apiResponse.total || 0);
        } else {
          setError('Gagal memuat riwayat organisasi');
          setRows([]);
          setTotal(0);
        }
      } catch (err: any) {
        setError(err?.message || 'Gagal memuat riwayat organisasi');
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [employeeId, page, limit, columnFilters, dateRangeFilters, filterValue, resetKey]
  );

  // Auto-fetch when page, limit, or filters change
  useEffect(() => {
    if (autoFetch) {
      void fetch();
    }
  }, [autoFetch, fetch]);

  const handleSearchChange = useCallback(
    (search: string) => {
      setPage(1); // Reset to first page when searching
      fetch({ search });
    },
    [fetch]
  );

  const handleSortChange = useCallback(
    (columnId: string, order: 'asc' | 'desc') => {
      // Map new column IDs back to API parameter names
      let sortColumn = columnId;
      if (columnId.startsWith('old_')) {
        sortColumn = 'previous_position';
      } else if (columnId.startsWith('new_')) {
        sortColumn = 'new_position';
      }
      fetch({ column: sortColumn, sort: order });
    },
    [fetch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing page size
    },
    []
  );

  const handleColumnFilterChange = useCallback((columnId: string, values: string[]) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
    setPage(1); // Reset to first page when filtering
  }, []);

  const handleDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
    setDateRangeFilters((prev) => ({
      ...prev,
      [columnId]: { startDate, endDate },
    }));
    setPage(1); // Reset to first page when filtering
  }, []);

  return {
    rows,
    loading,
    error,
    total,
    page,
    limit,
    fetch,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    columnFilters,
    dateRangeFilters,
  };
}

