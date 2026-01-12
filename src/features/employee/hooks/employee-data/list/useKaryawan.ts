import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Karyawan, EmployeeListItem } from '../../../types/dto/EmployeeType';
import { TableFilter } from '../../../../../types/SharedType';
import employeeMasterDataService from '../../../services/EmployeeMasterData.service';
import useFilterStore from '../../../../../stores/filterStore';
import { addNotification } from '../../../../../stores/notificationStore';
import errorHandle from '@/utils/errorHandle';

export interface UseKaryawanOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useKaryawan(options: UseKaryawanOptions = {}) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true } = options;
  const navigate = useNavigate();

  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  const filterValue = useFilterStore((s) => s.filters['Data Master Karyawan'] ?? '');
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

  // Modal states
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/data-karyawan/form` : '/data-karyawan/form';

  /**
   * Transform API response data to Karyawan interface
   */
  const transformApiDataToKaryawan = (apiData: EmployeeListItem): Karyawan => {
    console.log('Transforming API data:', apiData);

    return {
      // Core Identity
      id: apiData.employee_id || apiData.id || '',
      employee_id: apiData.employee_id || apiData.id,
      full_name: apiData.full_name,
      name: apiData.full_name,
      email: apiData.email,
      avatar: apiData.avatar || undefined,
      
      // Personal Information
      birth_date: apiData.birth_date,
      
      // Position & Organization
      position: apiData.position || '',
      job_title: apiData.job_title || '',
      jabatan: apiData.job_title || '',
      position_level: apiData.position_level ,
      grade: apiData.grade,
      
      // Company & Structure
      company: apiData.company || '',
      office: apiData.office,
      department: apiData.department,
      division: apiData.division,
      directorate: apiData.directorate,
      
      // Employment Details
      start_date: apiData.start_date,
      tanggalJoin: apiData.start_date || '',
      end_date: apiData.end_date,
      employment_status: apiData.employment_status,
      payroll_status: apiData.payroll_status || '-',
      employee_data_status: apiData.employee_data_status,
      employee_category: apiData.employee_category,
      contract_remaining: apiData.contract_remaining,
      
      // Access & Permissions
      user_access: apiData.user_access || undefined,
    };
  };

  const fetchKaryawan = useCallback(
    async (params?: Partial<TableFilter>) => {
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

        const response = await employeeMasterDataService.getEmployees(queryParams);
        
        if (response && response.meta?.status === 200 && response.data) {
          const apiResponse = response.data;
          
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
        console.error('Fetch Karyawan error:', err);
        errorHandle(err)
      } finally {
        setLoading(false);
      }
    },
    [page, limit, filterValue, columnFilters, dateRangeFilters]
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
  }, [page, limit, filterValue, columnFilters, dateRangeFilters, autoFetch]);

  const createKaryawan = useCallback(
    async (formData: FormData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await employeeMasterDataService.createEmployee(formData);

        if (response && response.meta?.status === 200) {
          addNotification({
            variant: 'success',
            title: response?.meta?.message || 'Karyawan berhasil ditambahkan',
          });
          await fetchKaryawan();
          return response.data;
        } else {
          const errorMsg = response?.meta?.message || 'Gagal membuat karyawan';
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

        if (response && response.meta?.status === 200) {
          // addNotification({
          //   variant: 'success',
          //   title: response?.meta?.message || 'Karyawan berhasil diperbarui',
          // });
          await fetchKaryawan();
          return response.data;
        } else {
          const errorMsg = response?.meta?.message || 'Gagal memperbarui karyawan';
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

        if (response && response.meta.status === 200) {
          // addNotification({
          //   variant: 'success',
          //   title: response?.meta?.message || 'Karyawan berhasil dihapus',
          // });
          await fetchKaryawan();
        } else {
          const errorMsg = response?.meta?.message || 'Gagal menghapus karyawan';
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
      fetchKaryawan({ sortBy: columnId, sortOrder: order });
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

  const handleAddKaryawan = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleExportKaryawan = useCallback(async () => {
    await exportKaryawan('csv');
  }, [exportKaryawan]);

  const handleDeleteClick = useCallback((row: Karyawan) => {
    setSelectedKaryawan(row);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedKaryawan) return;
    try {
      setDeleteSubmitting(true);
      await deleteKaryawan(selectedKaryawan.id);
      setShowDeleteModal(false);
      setSelectedKaryawan(null);
    } catch (err) {
      addNotification({
        variant: 'error',
        title: 'Gagal menghapus karyawan',
        description: err as string | undefined,
        hideDuration: 4000,
      });
    } finally {
      setDeleteSubmitting(false);
    }
  }, [selectedKaryawan, deleteKaryawan]);

  const handleAddModalClose = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleAddManual = useCallback(() => {
    setShowAddModal(false);
    navigate('/employee-data/form');
  }, [navigate]);

  const handleImportFile = useCallback(() => {
    setShowAddModal(false);
    setShowShareModal(true);
  }, []);

  const handleShareModalClose = useCallback(() => {
    setShowShareModal(false);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

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

  

  return {
    data,
    loading,
    error,
    total,
    page,
    limit,
    navigate,
    fetchKaryawan,
    createKaryawan,
    updateKaryawan,
    deleteKaryawan,
    exportKaryawan,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    // Modal states
    selectedKaryawan,
    showDetailModal,
    showAddModal,
    showShareModal,
    showDeleteModal,
    deleteSubmitting,
    shareUrl,
    // Modal handlers
    handleAddKaryawan,
    handleExportKaryawan,
    handleDeleteClick,
    handleConfirmDelete,
    handleAddModalClose,
    handleAddManual,
    handleImportFile,
    handleShareModalClose,
    handleDeleteModalClose,
    setShowDetailModal,
    setSelectedKaryawan,
    // Column filters
    columnFilters,
    handleColumnFilterChange,
    // Date range filters
    dateRangeFilters,
    handleDateRangeFilterChange,
  };
}

export default useKaryawan;
