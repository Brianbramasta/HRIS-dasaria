import { useCallback, useEffect, useMemo, useState } from 'react';
import { addNotification } from '@/stores/notificationStore';
import fraudService from '../../../../services/detail/FraudService';
import {  type ViolationItem, type CreateViolationPayload, type UpdateViolationPayload, type ViolationListItemRaw, type ViolationDetailRaw, type ViolationListParams } from '@/features/employee/types/dto/FraudType';

export interface UseFraudContractOptions {
  employeeId: string;
  autoFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface UseFraudContractReturn {
  violations: ViolationItem[];
  detail: ViolationItem | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  total: number;
  page: number;
  limit: number;
  fetchViolations: (params?: ViolationListParams) => Promise<void>;
  createViolation: (payload: CreateViolationPayload) => Promise<boolean>;
  getDetail: (violationId: string) => Promise<ViolationItem | null>;
  updateViolation: (violationId: string, payload: UpdateViolationPayload) => Promise<boolean>;
  deleteViolation: (violationId: string) => Promise<boolean>;
  getDisciplinaryOptions: (search?: string) => Promise<DropdownOption[]>;
  refresh: () => Promise<void>;
  handleSearchChange: (search: string) => void;
  handleSortChange: (columnId: string, order: 'asc' | 'desc') => void;
  handlePageChange: (newPage: number) => void;
  handleRowsPerPageChange: (newLimit: number) => void;
  handleDateRangeFilterChange: (columnId: string, startDate: string, endDate: string | null) => void;
  dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;
  handleColumnFilterChange: (columnId: string, values: string[]) => void;
  columnFilters: Record<string, string[]>;
}

export function useFraudContract({ employeeId, autoFetch = true, initialPage = 1, initialLimit = 10 }: UseFraudContractOptions): UseFraudContractReturn {
  const [violations, setViolations] = useState<ViolationItem[]>([]);
  const [detail, setDetail] = useState<ViolationItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filter States
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ column: string; order: 'asc' | 'desc' } | null>(null);
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});

  const canFetch = useMemo(() => !!employeeId, [employeeId]);

  const fetchViolations = useCallback(async (params?: ViolationListParams) => {
    if (!employeeId) {
      setError('Employee ID is required');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: ViolationListParams = {
        page,
        per_page: limit,
        search,
        ...params
      };

      if (sortConfig) {
        queryParams.column = sortConfig.column;
        queryParams.sort = sortConfig.order;
      }

      // Karena ViolationListParams strict, kita akan cast ke any untuk mengirim complex filters seperti useKaryawan
      const finalParams: any = { ...queryParams };
      
      // Add date range filters logic similar to useKaryawan
       Object.entries(dateRangeFilters).forEach(([columnId, dateRange]) => {
          if (dateRange && dateRange.startDate) {
            const key = `filter_column[${columnId}][range][]`;
            if (!finalParams[key]) {
              finalParams[key] = [];
            }
            finalParams[key].push(dateRange.startDate);
            if (dateRange.endDate) {
              finalParams[key].push(dateRange.endDate);
            }
          }
        });

      // Add column filters logic
      Object.entries(columnFilters).forEach(([columnId, values]) => {
        if (values && values.length > 0) {
          values.forEach((value) => {
            const key = `filter_column[${columnId}][in][]`;
            if (!finalParams[key]) {
              finalParams[key] = [];
            }
            finalParams[key].push(value);
          });
        }
      });

      const resp = await fraudService.getViolations(employeeId, finalParams);
      
      // Handle response structure
      const responseData = resp?.data as any; // ViolationListResponseRaw
      const list = (responseData?.data as ViolationListItemRaw[]) ?? [];
      
      const mapped: ViolationItem[] = list.map((item) => ({
        id: item.id_pelanggaran,
        violation: item.jenis_pelanggaran,
        violation_date: item.tanggal_pelanggaran,
        disciplinary_name: item.jenis_tindakan,
        start_date: item.tanggal_mulai_hukuman ?? null,
        end_date: item.tanggal_selesai_hukuman ?? null,
        description: item.deskripsi_pelanggaran ?? null,
        file: item.file ?? null,
      }));
      
      setViolations(mapped);
      setTotal(responseData?.total || 0);
      
    } catch (err: any) {
      const message = err?.message || 'Failed to load violations';
      setError(message);
      addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, page, limit, search, sortConfig, dateRangeFilters, columnFilters]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1); 
  }, []);

  const handleSortChange = useCallback((columnId: string, order: 'asc' | 'desc') => {
    setSortConfig({ column: columnId, order });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
    setDateRangeFilters((prev) => ({
      ...prev,
      [columnId]: { startDate, endDate },
    }));
    setPage(1);
  }, []);

  const handleColumnFilterChange = useCallback((columnId: string, values: string[]) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
    setPage(1);
  }, []);

  const appendIfValue = (fd: FormData, key: string, value: any) => {
    if (value !== undefined && value !== null && `${value}` !== '') {
      fd.append(key, value as any);
    }
  };

  const createViolation = useCallback(
    async (payload: CreateViolationPayload): Promise<boolean> => {
      if (!employeeId) {
        addNotification({ title: 'Error', description: 'Employee ID is required', variant: 'error', hideDuration: 5000 });
        return false;
      }
      setIsSubmitting(true);
      try {
        const fd = new FormData();
        appendIfValue(fd, 'violation', payload.violation);
        appendIfValue(fd, 'violation_date', payload.violation_date);
        appendIfValue(fd, 'disciplinary_id', payload.disciplinary_id);
        appendIfValue(fd, 'start_date', payload.start_date);
        appendIfValue(fd, 'end_date', payload.end_date);
        appendIfValue(fd, 'description', payload.description);
        if (payload.file) fd.append('file', payload.file);

        const resp = await fraudService.createViolation(employeeId, fd);
        const created = resp?.data as ViolationItem;
        setViolations((prev) => [created, ...prev]);
        addNotification({ title: 'Success', description: 'Violation has been created', variant: 'success', hideDuration: 4000 });
        return true;
      } catch (err: any) {
        const message = err?.message || 'Failed to create violation';
        addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [employeeId]
  );

  const getDetail = useCallback(async (violationId: string): Promise<ViolationItem | null> => {
    try {
      const resp = await fraudService.getViolationDetail(violationId);
      const raw = resp?.data as ViolationDetailRaw;
      const data: ViolationItem = {
        id: raw.id_pelanggaran,
        violation: raw.jenis_pelanggaran,
        violation_date: raw.tanggal_pelanggaran,
        disciplinary_id: raw.jenis_tindakan_id,
        disciplinary_name: raw.jenis_tindakan,
        start_date: raw.tanggal_mulai_hukuman ?? null,
        end_date: raw.tanggal_selesai_hukuman ?? null,
        description: raw.deskripsi_pelanggaran ?? null,
        file: raw.file ?? null,
      };
      setDetail(data);
      return data;
    } catch (err: any) {
      const message = err?.message || 'Failed to get violation detail';
      addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
      return null;
    }
  }, []);

  const updateViolation = useCallback(
    async (violationId: string, payload: UpdateViolationPayload): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        const fd = new FormData();
        fd.append('_method', 'PATCH');
        appendIfValue(fd, 'violation', payload.violation);
        appendIfValue(fd, 'violation_date', payload.violation_date);
        appendIfValue(fd, 'disciplinary_id', payload.disciplinary_id);
        appendIfValue(fd, 'start_date', payload.start_date);
        appendIfValue(fd, 'end_date', payload.end_date);
        appendIfValue(fd, 'description', payload.description);
        if (payload.file) fd.append('file', payload.file);

        const resp = await fraudService.updateViolation(violationId, fd);
        const updated = resp?.data as ViolationItem;
        setViolations((prev) => prev.map((v) => (v.id === violationId ? updated : v)));
        if (detail?.id === violationId) setDetail(updated);
        addNotification({ title: 'Success', description: 'Violation has been updated', variant: 'success', hideDuration: 4000 });
        return true;
      } catch (err: any) {
        const message = err?.message || 'Failed to update violation';
        addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [detail]
  );

  const deleteViolation = useCallback(async (violationId: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await fraudService.deleteViolation(violationId);
      setViolations((prev) => prev.filter((v) => v.id !== violationId));
      if (detail?.id === violationId) setDetail(null);
      addNotification({ title: 'Success', description: 'Violation has been deleted', variant: 'success', hideDuration: 4000 });
      return true;
    } catch (err: any) {
      const message = err?.message || 'Failed to delete violation';
      addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [detail]);

  const getDisciplinaryOptions = useCallback(async (search?: string): Promise<DropdownOption[]> => {
    const data = await fraudService.getDisciplinaryDropdown(search);
    return (data || []).map((d) => ({ label: d.name_disciplinary, value: d.id }));
  }, []);

  const refresh = useCallback(async () => {
    await fetchViolations();
  }, [fetchViolations]);

  useEffect(() => {
    if (autoFetch && canFetch) {
      fetchViolations();
    }
  }, [autoFetch, canFetch, fetchViolations]);

  return {
    violations,
    detail,
    isLoading,
    error,
    isSubmitting,
    total,
    page,
    limit,
    fetchViolations,
    createViolation,
    getDetail,
    updateViolation,
    deleteViolation,
    getDisciplinaryOptions,
    refresh,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleDateRangeFilterChange,
    dateRangeFilters,
    handleColumnFilterChange,
    columnFilters,
  };
}

