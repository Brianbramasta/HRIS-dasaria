import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RowPengajuan } from '../types/SubmissionPageType';
import { TableFilter } from '../../../types/SharedType';
import { useApiSubmissionType } from './api/useApiSubmissionType';
import useFilterStore from '../../../stores/filterStore';
import errorHandle from '@/utils/errorHandle';

export interface UseSubmissionTypeOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useSubmissionTypeData(options: UseSubmissionTypeOptions = {}) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true } = options;
  const navigate = useNavigate();

  const [data, setData] = useState<RowPengajuan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const filterValue = useFilterStore((s: any) => s.filters['SubmissionPage']);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

  // Modal states
  const [selectedSubmission, setSelectedSubmission] = useState<RowPengajuan | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // API hook
  const { submissions, pagination, fetchIndex, loading: apiLoading } = useApiSubmissionType();

  /**
   * Transform API response data to RowPengajuan interface
   */
  const transformApiDataToRowPengajuan = (apiData: any): RowPengajuan => {
    return {
      nip: apiData.nip || '',
      name: apiData.name || '',
      jenisPengajuan: apiData.submission_type || '',
      tanggalPengajuan: apiData.submission_date || '',
      status: apiData.status || '',
      catatan: apiData.note ?? '-',
      token: apiData.token ?? '',
      submission_type: apiData.submission_type ?? '',
      is_filled: apiData.is_filled ?? 0,
    };
  };

  const fetchSubmissions = useCallback(
    async (params?: Partial<TableFilter>) => {
      try {
        setLoading(true);
        setError(null);

        // Build query params for API
        const queryParams: any = {
          page,
          per_page: limit,
        };

        if (params?.search) queryParams.search = params.search;
        if (params?.sortBy) queryParams.column = params.sortBy;
        if (params?.sortOrder) queryParams.sort = params.sortOrder;
        
        // Handle filter - convert to array if needed
        const filterParam = params?.filter ?? filterValue;
        if (filterParam) {
          queryParams.filter = Array.isArray(filterParam) ? filterParam : [filterParam];
        }

        // Add column filters - format: filter_column[column_name][in][]=value
        Object.entries(columnFilters).forEach(([columnId, values]) => {
          if (values && values.length > 0) {
            values.forEach((value) => {
              const key = `filter_column[${columnId}][in][]`;
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
            const key = `filter_column[${columnId}][range][]`;
            if (!queryParams[key]) {
              queryParams[key] = [];
            }
            queryParams[key].push(dateRange.startDate);
            if (dateRange.endDate) {
              queryParams[key].push(dateRange.endDate);
            }
          }
        });

        await fetchIndex(queryParams);
        
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
        setError(errorMessage);
        console.error('Fetch Submissions error:', err);
        errorHandle(err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, filterValue, columnFilters, dateRangeFilters, fetchIndex]
  );

  // Transform API data to RowPengajuan interface
  useEffect(() => {
    const transformedData = (submissions || []).map(transformApiDataToRowPengajuan);
    setData(transformedData);
    setTotal(pagination.total || 0);
  }, [submissions, pagination.total]);

  // Auto-fetch when page, limit, or filter changes
  useEffect(() => {
    if (autoFetch) {
      fetchSubmissions();
    }
  }, [autoFetch, page, limit, filterValue, columnFilters, dateRangeFilters]);

  const handleSearchChange = useCallback(
    (search: string) => {
      fetchSubmissions({ search });
    },
    [fetchSubmissions]
  );

  const handleSortChange = useCallback(
    (columnId: string, order: 'asc' | 'desc') => {
      fetchSubmissions({ sortBy: columnId, sortOrder: order });
    },
    [fetchSubmissions]
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
  }, []);

  const handleDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
    setDateRangeFilters((prev) => ({
      ...prev,
      [columnId]: { startDate, endDate },
    }));
  }, []);

  const handleRefresh = useCallback(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    data,
    loading: loading || apiLoading,
    error,
    total,
    page,
    limit,
    navigate,
    fetchSubmissions,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleRefresh,
    // Modal states
    selectedSubmission,
    showDetailModal,
    setSelectedSubmission,
    setShowDetailModal,
    // Column filters
    columnFilters,
    dateRangeFilters,
  };
}

export default useSubmissionTypeData;
