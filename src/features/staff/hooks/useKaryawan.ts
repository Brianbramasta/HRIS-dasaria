import { useState, useCallback, useEffect } from 'react';
import { Karyawan, KaryawanFilterParams } from '../types/Karyawan';
import employeeMasterDataService, { EmployeeListItem } from '../services/employeeMasterData.service';
import useFilterStore from '../../../stores/filterStore';
import { addNotification } from '../../../stores/notificationStore';

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
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const filterValue = useFilterStore((s) => s.filters['Data Master Karyawan'] ?? '');

  /**
   * Transform API response data to Karyawan interface
   */
  const transformApiDataToKaryawan = (apiData: EmployeeListItem): Karyawan => {
    // Map employment status number to string
    const getEmploymentStatus = (status?: number): 'aktif' | 'cuti' | 'resign' | 'nonaktif' | undefined => {
      if (!status) return undefined;
      switch (status) {
        case 1: return 'aktif';
        case 2: return 'nonaktif';
        case 3: return 'aktif'; // probation is still active
        case 4: return 'resign';
        default: return undefined;
      }
    };

    // Map payroll status number to string
    const getPayrollStatus = (status?: number): string | undefined => {
      if (!status) return undefined;
      switch (status) {
        case 1: return 'aktif';
        case 2: return 'nonaktif';
        case 3: return 'suspended';
        default: return undefined;
      }
    };

    // Map employee category number to string
    const getEmployeeCategory = (category?: number): string | undefined => {
      if (!category) return undefined;
      switch (category) {
        case 1: return 'Non-Staff';
        case 2: return 'Staff';
        case 3: return 'Partner';
        default: return undefined;
      }
    };

    return {
      id: apiData.id,
      idKaryawan: apiData.id,
      name: apiData.full_name,
      email: apiData.email,
      posisi: apiData.position_name || apiData.position || '',
      jabatan: apiData.job_title_name || '',
      tanggalJoin: apiData.start_date || '',
      tanggalBerakhir: apiData.end_date,
      company: apiData.company_name || '',
      department: apiData.department_name || apiData.department || '',
      departement: apiData.department_name || apiData.department || '', // alias
      office: apiData.office_name,
      divisi: apiData.division_name,
      grade: apiData.grade,
      statusPayroll: getPayrollStatus(apiData.payroll_status),
      kategori: getEmployeeCategory(apiData.employee_category),
      status: getEmploymentStatus(apiData.employment_status),
    };
  };

  const fetchKaryawan = useCallback(
    async (params?: KaryawanFilterParams) => {
      try {
        setLoading(true);
        setError(null);

        // Build query params for employeeMasterDataService
        const queryParams: any = {
          page,
          per_page: limit,
        };

        if (params?.search) queryParams.search = params.search;
        if (params?.sortBy) queryParams.column = params.sortBy;
        if (params?.order) queryParams.sort = params.order;
        
        // Handle filter - convert to array if needed
        const filterParam = params?.filter ?? filterValue;
        if (filterParam) {
          queryParams.filter = Array.isArray(filterParam) ? filterParam : [filterParam];
        }

        const response = await employeeMasterDataService.getEmployees(queryParams);
        
        // API returns { meta: { status, message }, data: {...} } not the standard ApiResponse
        const apiResult = response as any;
        
        if (apiResult && apiResult.meta?.status === 200 && apiResult.data) {
          const apiResponse = apiResult.data;
          
          // Transform API data to Karyawan interface
          const transformedData = apiResponse.data.map(transformApiDataToKaryawan);
          
          setData(transformedData);
          setTotal(apiResponse.total || 0);
          // Don't update page/limit from response to avoid conflicts
        } else {
          setError('Gagal memuat data karyawan');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, filterValue]
  );

  // Auto-fetch when page, limit, or filter changes
  useEffect(() => {
    if (autoFetch) {
      // Skip initial fetch if it's the first render (will be handled separately)
      if (isInitialFetch) {
        setIsInitialFetch(false);
        fetchKaryawan();
      } else {
        // For subsequent changes, fetch data
        fetchKaryawan();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filterValue, autoFetch]);

  const createKaryawan = useCallback(
    async (formData: FormData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await employeeMasterDataService.createEmployee(formData);

        if (response && response.success) {
          addNotification({
            variant: 'success',
            title: response.message || 'Karyawan berhasil ditambahkan',
          });
          await fetchKaryawan();
          return response.data;
        } else {
          const errorMsg = response?.message || 'Gagal membuat karyawan';
          setError(errorMsg);
          addNotification({
            variant: 'error',
            title: errorMsg,
          });
          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat karyawan';
        setError(errorMessage);
        addNotification({
          variant: 'error',
          title: errorMessage,
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchKaryawan]
  );

  const updateKaryawan = useCallback(
    async (id: string, formData: FormData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await employeeMasterDataService.updateEmployee(id, formData);

        if (response && response.success) {
          addNotification({
            variant: 'success',
            title: response.message || 'Karyawan berhasil diperbarui',
          });
          await fetchKaryawan();
          return response.data;
        } else {
          const errorMsg = response?.message || 'Gagal memperbarui karyawan';
          setError(errorMsg);
          addNotification({
            variant: 'error',
            title: errorMsg,
          });
          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui karyawan';
        setError(errorMessage);
        addNotification({
          variant: 'error',
          title: errorMessage,
        });
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

        const response = await employeeMasterDataService.deleteEmployee(id);

        if (response && response.success) {
          addNotification({
            variant: 'success',
            title: response.message || 'Karyawan berhasil dihapus',
          });
          await fetchKaryawan();
        } else {
          const errorMsg = response?.message || 'Gagal menghapus karyawan';
          setError(errorMsg);
          addNotification({
            variant: 'error',
            title: errorMsg,
          });
          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus karyawan';
        setError(errorMessage);
        addNotification({
          variant: 'error',
          title: errorMessage,
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchKaryawan]
  );

  const exportKaryawan = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (_format: 'csv' | 'excel' = 'csv') => {
      try {
        setError(null);
        addNotification({
          variant: 'info',
          title: 'Fitur export belum tersedia',
        });
        // TODO: Implement export when API endpoint is available
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat export data';
        setError(errorMessage);
        addNotification({
          variant: 'error',
          title: errorMessage,
        });
        throw err;
      }
    },
    []
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      fetchKaryawan({ search });
    },
    [fetchKaryawan]
  );

  const handleSortChange = useCallback(
    (columnId: string, order: 'asc' | 'desc') => {
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
      setPage(1); // Reset to first page when changing page size
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
