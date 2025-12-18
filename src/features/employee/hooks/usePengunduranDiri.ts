import { useState, useCallback, useEffect } from 'react';
import { PengunduranDiri, PengunduranDiriFilterParams, ResignStatus } from '../types/Resignation';
import pengunduranDiriService from '../services/ResignationService';
import useFilterStore from '../../../stores/filterStore';

export interface UsePengunduranDiriOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
  status?: ResignStatus | 'all';
}

export function usePengunduranDiri(options: UsePengunduranDiriOptions = {}) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true, status = 'all' } = options;

  const [data, setData] = useState<PengunduranDiri[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [currentStatus, setCurrentStatus] = useState<ResignStatus | 'all'>(status);
  const filterValue = useFilterStore((s) => s.filters['global'] ?? '');

  const fetchPengunduranDiri = useCallback(
    async (params?: PengunduranDiriFilterParams) => {
      try {
        setLoading(true);
        setError(null);

        const response = await pengunduranDiriService.getPengunduranDiri({
          page,
          limit,
          status: currentStatus,
          filter: params?.filter ?? filterValue,
          ...params,
        });

        if (response) {
          const payload = response.data as any;
          const items = Array.isArray(payload) ? payload : payload.items || payload.data || [];
          setData(items);
          setTotal(response.data.total || 0);
        } else {
          setError(response || 'Gagal memuat data pengunduran diri');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, currentStatus, filterValue]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPengunduranDiri();
    }
  }, [fetchPengunduranDiri, autoFetch, filterValue]);

  const createPengunduranDiri = useCallback(
    async (data: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await pengunduranDiriService.createPengunduranDiri(data);

        if (response) {
          await fetchPengunduranDiri();
          return response.data;
        } else {
          setError(response || 'Gagal membuat pengunduran diri');
          throw new Error(response);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPengunduranDiri]
  );

  const updatePengunduranDiri = useCallback(
    async (id: string, data: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await pengunduranDiriService.updatePengunduranDiri(id, data);

        if (response) {
          await fetchPengunduranDiri();
          return response.data;
        } else {
          setError(response || 'Gagal memperbarui pengunduran diri');
          throw new Error(response);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui data';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPengunduranDiri]
  );

  const approvePengunduranDiri = useCallback(
    async (id: string, tanggalEfektif: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await pengunduranDiriService.approvePengunduranDiri(id, tanggalEfektif);

        if (response) {
          await fetchPengunduranDiri();
          return response.data;
        } else {
          setError(response || 'Gagal approve pengunduran diri');
          throw new Error(response);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat approve';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPengunduranDiri]
  );

  const rejectPengunduranDiri = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await pengunduranDiriService.rejectPengunduranDiri(id);

        if (response) {
          await fetchPengunduranDiri();
          return response.data;
        } else {
          setError(response || 'Gagal reject pengunduran diri');
          throw new Error(response);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat reject';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPengunduranDiri]
  );

  const deletePengunduranDiri = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await pengunduranDiriService.deletePengunduranDiri(id);

        if (response) {
          await fetchPengunduranDiri();
        } else {
          setError(response || 'Gagal menghapus data');
          throw new Error(response);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPengunduranDiri]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setPage(1);
      fetchPengunduranDiri({ search });
    },
    [fetchPengunduranDiri]
  );

  const handleSortChange = useCallback(
    (columnId: string, order: 'asc' | 'desc') => {
      setPage(1);
      fetchPengunduranDiri({ sortBy: columnId, order });
    },
    [fetchPengunduranDiri]
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

  const setStatusFilter = useCallback((newStatus: ResignStatus | 'all') => {
    setCurrentStatus(newStatus);
    setPage(1);
  }, []);

  return {
    data,
    loading,
    error,
    total,
    page,
    limit,
    currentStatus,
    fetchPengunduranDiri,
    createPengunduranDiri,
    updatePengunduranDiri,
    approvePengunduranDiri,
    rejectPengunduranDiri,
    deletePengunduranDiri,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    setStatusFilter,
  };
}

export default usePengunduranDiri;
