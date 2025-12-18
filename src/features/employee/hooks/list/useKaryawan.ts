import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Karyawan, KaryawanFilterParams, EmployeeListItem } from '../../types/Employee';
import employeeMasterDataService from '../../services/EmployeeMasterData.service';
import useFilterStore from '../../../../stores/filterStore';
import { addNotification } from '../../../../stores/notificationStore';

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

    // Map position level number to string
    const getPositionLevel = (level?: number): string | undefined => {
      if (!level) return undefined;
      switch (level) {
        case 1: return 'Staff';
        case 2: return 'Junior Staff';
        case 3: return 'Senior Staff';
        case 4: return 'Manager';
        case 5: return 'Senior Manager';
        case 6: return 'Director';
        default: return `Level ${level}`;
      }
    };

    return {
      // Core Identity
      id: apiData.id,
      idKaryawan: apiData.id,
      name: apiData.full_name,
      full_name: apiData.full_name,
      email: apiData.email,
      
      // Personal Information
      birth_date: apiData.birth_date,
      birth_place: apiData.birth_place,
      national_id: apiData.national_id,
      religion: apiData.religion,
      blood_type: apiData.blood_type,
      gender: apiData.gender,
      marital_status: apiData.marital_status,
      last_education: apiData.last_education,
      household_dependents: apiData.household_dependents,
      phone_number: apiData.phone_number,
      current_address: apiData.current_address,
      ktp_address: apiData.ktp_address,
      
      // Position & Organization
      posisi: apiData.position_name || '',
      position_name: apiData.position_name,
      jabatan: apiData.job_title_name || '',
      job_title_name: apiData.job_title_name,
      jenjangJabatan: getPositionLevel(apiData.position_level),
      position_level: apiData.position_level,
      grade: apiData.grade,
      
      // Company & Structure
      company: apiData.company_name || '',
      company_name: apiData.company_name,
      office: apiData.office_name,
      office_name: apiData.office_name,
      department: apiData.department_name,
      department_name: apiData.department_name,
      departement: apiData.department_name, // alias
      divisi: apiData.division_name,
      division_name: apiData.division_name,
      direktorat: apiData.directorate_name,
      directorate_name: apiData.directorate_name,
      
      // Employment Details
      tanggalJoin: apiData.start_date || '',
      start_date: apiData.start_date,
      tanggalBerakhir: apiData.end_date,
      end_date: apiData.end_date,
      employment_status: apiData.employment_status,
      status: getEmploymentStatus(apiData.employment_status),
      statusPayroll: getPayrollStatus(apiData.payroll_status),
      payroll_status: apiData.payroll_status,
      employee_data_status: apiData.employee_data_status,
      resignation_status: apiData.resignation_status,
      kategori: getEmployeeCategory(apiData.employee_category),
      employee_category: apiData.employee_category,
      
      // Access & Permissions
      posisiAccess: apiData.user_access,
      user_access: apiData.user_access,
      
      // Bank & Financial
      bank_name: apiData.bank_name,
      bank_account_number: apiData.bank_account_number,
      bank_account_holder: apiData.bank_account_holder,
      npwp: apiData.npwp,
      ptkp_id: apiData.ptkp_id,
      
      // BPJS
      bpjs_employment_number: apiData.bpjs_employment_number,
      bpjs_employment_status: apiData.bpjs_employment_status,
      bpjs_health_number: apiData.bpjs_health_number,
      bpjs_health_status: apiData.bpjs_health_status,
      
      // System Fields
      deleted_at: apiData.deleted_at,
      created_at: apiData.created_at,
      updated_at: apiData.updated_at,
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

        if (response && response.meta.status === 200) {
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
    navigate('/data-karyawan/form');
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
  };
}

export default useKaryawan;
