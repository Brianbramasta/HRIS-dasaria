import { useState, useCallback, useEffect } from 'react';
import { Karyawan, KaryawanFilterParams } from '../types/Karyawan';
import karyawanService from '../services/karyawanService';

export interface UseKaryawanOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useKaryawan(options: UseKaryawanOptions = {}) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true } = options;

  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const fetchKaryawan = useCallback(
    async (params?: KaryawanFilterParams) => {
      try {
        setLoading(true);
        setError(null);

        const response = await karyawanService.getKaryawan({
          page,
          limit,
          ...params,
        });
        console.log('Fetched karyawan response:', response.data);
        if (response) {
          const payload = response.data as any;
          const items = Array.isArray(payload) ? payload : payload.items || payload.data || [];
          setData(items);
          setTotal(payload.total || 0);
        } else {
          setError(response || 'Gagal memuat data karyawan');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchKaryawan();
    }
  }, [fetchKaryawan, autoFetch]);

  const createKaryawan = useCallback(
    async (karyawanData: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await karyawanService.createKaryawan(karyawanData);

        if (response) {
          await fetchKaryawan();
          return response.data;
        } else {
          setError(response || 'Gagal membuat karyawan');
          throw new Error(response);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat karyawan';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchKaryawan]
  );

  const updateKaryawan = useCallback(
    async (id: string, karyawanData: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await karyawanService.updateKaryawan(id, karyawanData);

        if (response) {
          await fetchKaryawan();
          return response.data;
        } else {
          setError(response || 'Gagal memperbarui karyawan');
          throw new Error(response);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui karyawan';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchKaryawan]
  );

  const deleteKaryawan = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await karyawanService.deleteKaryawan(id);

        if (response) {
          await fetchKaryawan();
        } else {
          setError(response || 'Gagal menghapus karyawan');
          throw new Error(response);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus karyawan';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchKaryawan]
  );

  const exportKaryawan = useCallback(
    async (format:'csv' | 'excel' = 'csv')=>{console.log('Fetched pengunduran diri response:',format)}
    // async (format: 'csv' | 'excel' = 'csv') => {
    //   try {
    //     setError(null);
    //     const blob = await karyawanService.exportKaryawan(format);
        
    //     // Create download link
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `karyawan_${new Date().getTime()}.${format === 'csv' ? 'csv' : 'xlsx'}`;
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     document.body.removeChild(a);
    //   } catch (err) {
    //     const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat export data';
    //     setError(errorMessage);
    //     throw err;
    //   }
    // },
   , []
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setPage(1);
      fetchKaryawan({ search });
    },
    [fetchKaryawan]
  );

  const handleSortChange = useCallback(
    (columnId: string, order: 'asc' | 'desc') => {
      setPage(1);
      fetchKaryawan({ sortBy: columnId, order });
    },
    [fetchKaryawan]
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
    fetchKaryawan,
    createKaryawan,
    updateKaryawan,
    deleteKaryawan,
    exportKaryawan,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
  };
}

export default useKaryawan;
