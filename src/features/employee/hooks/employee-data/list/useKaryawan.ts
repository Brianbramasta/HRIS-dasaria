import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeEntity } from '../../../types/entity/EmployeeEntity';
import { TableFilter } from '../../../../../types/SharedType';
import employeeMasterDataService from '../../../services/EmployeeMasterData.service';
import useFilterStore from '../../../../../stores/filterStore';
import { addNotification } from '../../../../../stores/notificationStore';
import errorHandle from '@/utils/errorHandle';
import { formatFilterValue } from '@/utils/formatFilterValue';
import { getEmployeeStatusDropdownOptions, DropdownOption } from '../form/useFormulirKaryawan';
import { EmployeeModel } from '../../../models/EmployeeModel';

export interface UseKaryawanOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

export function useKaryawan(options: UseKaryawanOptions = {}) {
  const { initialPage = 1, initialLimit = 10, autoFetch = true } = options;
  const navigate = useNavigate();

  const [data, setData] = useState<EmployeeEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters[s.resetKey]));
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});
  const [employmentStatusFilterOptions, setEmploymentStatusFilterOptions] = useState<DropdownOption[]>([]);

  // Modal states
  const [selectedKaryawan, setSelectedKaryawan] = useState<EmployeeEntity | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/employee-data/form` : '/employee-data/form';

  // Debug: Log data changes
  useEffect(() => {
    console.log('useKaryawan - data updated:', data);
  }, [data]);

  /**
   * Helper function for rendering remaining contract badge
   */
  const renderSisaKontrakBadge = useCallback((sisaKontrak: string | undefined) => {
    if (!sisaKontrak) {
      return { className: 'status-styling rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800', text: '-' };
    }

    const sisaKontrakStr = sisaKontrak.toString().toLowerCase().trim();
    let bgClass = '';
    let textClass = '';

    if (sisaKontrakStr === 'berakhir') {
      bgClass = 'bg-red-100';
      textClass = 'text-red-800';
    } else if (sisaKontrakStr.includes('hari')) {
      bgClass = 'bg-pink-100';
      textClass = 'text-pink-800';
    } else if (sisaKontrakStr.includes('minggu')) {
      bgClass = 'bg-pink-100';
      textClass = 'text-pink-800';
    } else if (sisaKontrakStr.includes('bulan')) {
      const match = sisaKontrakStr.match(/(\d+)/);
      if (match) {
        const bulanNum = parseInt(match[1]);
        if (bulanNum <= 2) {
          bgClass = 'bg-orange-100';
          textClass = 'text-orange-800';
        } else if (bulanNum >= 3 && bulanNum <= 6) {
          bgClass = 'bg-blue-100';
          textClass = 'text-blue-800';
        } else if (bulanNum > 6) {
          bgClass = 'bg-green-100';
          textClass = 'text-green-800';
        }
      }
    } else {
      bgClass = 'bg-gray-300';
      textClass = 'text-[#404040]';
    }

    return { 
      className: `status-styling rounded-full px-3 py-1 text-xs font-medium ${bgClass} ${textClass}`, 
      text: sisaKontrak 
    };
  }, []);

  /**
   * Helper function for employment status badge
   */
  const renderEmploymentStatusBadge = useCallback((value: string | undefined) => {
    if (!value) {
      return { className: 'inline-block rounded-full p-[10px] w-full text-center text-xs font-medium bg-gray-100 text-gray-800', text: '-' };
    }

    const statusValue = value.toLowerCase().trim();
    let bgClass = '';
    let textClass = '';

    if (statusValue === 'aktif' || statusValue === 'active') {
      bgClass = 'bg-green-100';
      textClass = 'text-green-800';
    } else if (statusValue === 'pengunduran diri' || statusValue === 'resign') {
      bgClass = 'bg-blue-100';
      textClass = 'text-blue-800';
    } else if (statusValue === 'tidak aktif' || statusValue === 'inactive') {
      bgClass = 'bg-red-100';
      textClass = 'text-red-800';
    } else if (statusValue === 'evaluasi' || statusValue === 'evaluation') {
      bgClass = 'bg-orange-100';
      textClass = 'text-orange-800';
    } else {
      bgClass = 'bg-gray-100';
      textClass = 'text-gray-800';
    }

    return {
      className: `inline-block rounded-full p-[10px] w-full text-center text-xs font-medium ${bgClass} ${textClass}`,
      text: value
    };
  }, []);

  /**
   * Helper function for payroll status badge
   */
  const renderPayrollStatusBadge = useCallback((value: string | undefined) => {
    if (!value) {
      return { className: 'inline-block rounded-full p-[10px] w-full text-center text-xs font-medium bg-gray-100 text-gray-800', text: '-' };
    }

    const statusValue = value.toLowerCase().trim();
    const bgClass = (statusValue === 'aktif' || statusValue === 'active') ? 'bg-green-100' : 'bg-red-100';
    const textClass = (statusValue === 'aktif' || statusValue === 'active') ? 'text-green-800' : 'text-red-800';

    return {
      className: `inline-block rounded-full p-[10px] w-full text-center text-xs font-medium ${bgClass} ${textClass}`,
      text: value
    };
  }, []);

  /**
   * Helper function for employee data status badge
   */
  const renderEmployeeDataStatusBadge = useCallback((value: string | undefined) => {
    if (!value) {
      return { className: 'inline-block rounded-full p-[10px] w-full text-center text-xs font-medium bg-gray-100 text-gray-800', text: '-' };
    }

    const statusValue = value.toLowerCase().trim();
    const bgClass = (statusValue === 'lengkap' || statusValue === 'complete') ? 'bg-green-100' : 'bg-red-100';
    const textClass = (statusValue === 'lengkap' || statusValue === 'complete') ? 'text-green-800' : 'text-red-800';

    return {
      className: `inline-block rounded-full p-[10px] w-full text-center text-xs font-medium ${bgClass} ${textClass}`,
      text: value
    };
  }, []);

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
          
          // Transform API data to Karyawan interface using Model
          const transformedData = EmployeeModel.transformListFromApi(apiResponse.data);
          
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
      fetchKaryawan();
    }
  }, [autoFetch, fetchKaryawan]);

  // Load employment status filter options
  useEffect(() => {
    const loadStatusOptions = async () => {
      const opts = await getEmployeeStatusDropdownOptions();
      const mapped = (opts || []).map((o) => ({ label: o.label, value: o.value }));
      setEmploymentStatusFilterOptions(mapped);
    };
    loadStatusOptions();
  }, []);

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

  const handleDeleteClick = useCallback((row: EmployeeEntity) => {
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
    // Employment status filter options
    employmentStatusFilterOptions,
    // Badge rendering functions
    renderSisaKontrakBadge,
    renderEmploymentStatusBadge,
    renderPayrollStatusBadge,
    renderEmployeeDataStatusBadge,
  };
}

export default useKaryawan;
