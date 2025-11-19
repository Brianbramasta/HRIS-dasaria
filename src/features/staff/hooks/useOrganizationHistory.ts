import { useState, useCallback, useEffect } from 'react';
import organizationHistoryService, {
  OrganizationHistoryItem,
  OrganizationHistoryFilterParams,
} from '../services/organizationHistoryService';
import useFilterStore from '../../../stores/filterStore';

export interface UseOrganizationHistoryOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useOrganizationHistory(options: UseOrganizationHistoryOptions = {}) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true } = options;

  const [data, setData] = useState<OrganizationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const filterValue = useFilterStore((s) => s.filters['Organization History'] ?? '');

  const fetchOrganizationHistory = useCallback(
    async (params?: OrganizationHistoryFilterParams) => {
      try {
        setLoading(true);
        setError(null);

        const response = await organizationHistoryService.list({
          page,
          limit,
          filter: params?.filter ?? filterValue,
          ...params,
        });

        const payload = response.data as any;
        const items = Array.isArray(payload) ? payload : payload.items || payload.data || [];
        setData(items);
        setTotal(payload.total || 0);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, filterValue]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchOrganizationHistory();
    }
  }, [fetchOrganizationHistory, autoFetch, filterValue]);

  const createOrganizationHistory = useCallback(
    async (payload: Omit<OrganizationHistoryItem, 'id'>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizationHistoryService.create(payload);
        await fetchOrganizationHistory();
        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchOrganizationHistory]
  );

  const updateOrganizationHistory = useCallback(
    async (id: string, payload: Partial<OrganizationHistoryItem>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await organizationHistoryService.update(id, payload);
        await fetchOrganizationHistory();
        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchOrganizationHistory]
  );

  const deleteOrganizationHistory = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await organizationHistoryService.remove(id);
        await fetchOrganizationHistory();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchOrganizationHistory]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setPage(1);
      fetchOrganizationHistory({ search });
    },
    [fetchOrganizationHistory]
  );

  const handleSortChange = useCallback(
    (columnId: string, order: 'asc' | 'desc') => {
      setPage(1);
      fetchOrganizationHistory({ sortBy: columnId, order });
    },
    [fetchOrganizationHistory]
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
      setPage(1);
    },
    []
  );

  return {
    data,
    loading,
    error,
    total,
    page,
    limit,
    fetchOrganizationHistory,
    createOrganizationHistory,
    updateOrganizationHistory,
    deleteOrganizationHistory,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
  };
}

export default useOrganizationHistory;