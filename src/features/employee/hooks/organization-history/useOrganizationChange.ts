import { useCallback, useEffect, useMemo, useState } from 'react';
import { addNotification } from '@/stores/notificationStore';
import {
  organizationChangeService,
  type OrganizationChangeItem,
  type CreateOrganizationChangePayload,
  type UpdateOrganizationChangePayload,
  type OrganizationChangeListItemRaw,
  type OrganizationChangeDetailRaw,
  type OrganizationChangeListParams,
} from '../../services/OrganizationChangeService';

export interface UseOrganizationChangeOptions {
  autoFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
}

export interface UseOrganizationChangeReturn {
  organizationChanges: OrganizationChangeItem[];
  rowsWithStatus: (OrganizationChangeItem & { statusPerubahan: string })[];
  detail: OrganizationChangeDetailRaw | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  changeTypeOptions: { label: string; value: string }[];
  employeeOptions: { label: string; value: string; name: string }[];
  total: number;
  page: number;
  limit: number;
  fetchOrganizationChanges: (employeeId?: string | null, params?: OrganizationChangeListParams) => Promise<void>;
  createOrganizationChange: (leadEmployeeId?: string | null, payload?: CreateOrganizationChangePayload) => Promise<boolean>;
  getDetail: (id: string) => Promise<OrganizationChangeDetailRaw | null>;
  updateOrganizationChange: (id: string, payload: UpdateOrganizationChangePayload) => Promise<boolean>;
  refresh: () => Promise<void>;
  fetchChangeTypeOptions: () => Promise<void>;
  fetchEmployeeOptions: (search?: string) => Promise<void>;
  handleSearchChange: (search: string) => void;
  handleSortChange: (columnId: string, order: 'asc' | 'desc') => void;
  handlePageChange: (newPage: number) => void;
  handleRowsPerPageChange: (newLimit: number) => void;
  handleDateRangeFilterChange: (columnId: string, startDate: string, endDate: string | null) => void;
  dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;
  handleColumnFilterChange: (columnId: string, values: string[]) => void;
  columnFilters: Record<string, string[]>;
}

export function useOrganizationChange({
  autoFetch = true,
  initialPage = 1,
  initialLimit = 10,
}: UseOrganizationChangeOptions = {}): UseOrganizationChangeReturn {
  const [organizationChanges, setOrganizationChanges] = useState<OrganizationChangeItem[]>([]);
  const [detail, setDetail] = useState<OrganizationChangeDetailRaw | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [changeTypeOptions, setChangeTypeOptions] = useState<{ label: string; value: string }[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<{ label: string; value: string; name: string }[]>([]);

  // Pagination & Filter States
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ column: string; order: 'asc' | 'desc' } | null>(null);
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});

  const fetchOrganizationChanges = useCallback(
    async (employeeId?: string | null, params?: OrganizationChangeListParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams: OrganizationChangeListParams = {
          page,
          per_page: limit,
          search,
          ...params,
        };

        if (sortConfig) {
          queryParams.column = sortConfig.column;
          queryParams.sort = sortConfig.order;
        }

        // Karena OrganizationChangeListParams strict, kita akan cast ke any untuk mengirim complex filters
        const finalParams: any = { ...queryParams };

        // Add date range filters logic
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

        const leadId = employeeId ?? '';
        const resp = await organizationChangeService.getOrganizationChanges(leadId, finalParams);
        //console.log('resp', resp);
        // Handle response structure
        const responseData = resp?.data as any; // OrganizationChangeListResponseRaw
        const list = (responseData?.data as OrganizationChangeListItemRaw[]) ?? [];

        const mapped: OrganizationChangeItem[] = list.map((item) => ({
          id: item.id,
          employee_id: item.employee_id,
          full_name: item.employee_name,
          change_type: item.change_type_name || '-', // Since there's no jenis_perubahan field in the new response
          effective_date: item.new_position.effective_date,
          reason: item.reason_change,
          old_company: item.previous_position.company,
          new_company: item.new_position.company,
          old_directorate: item.previous_position.directorate,
          new_directorate: item.new_position.directorate,
          old_division: item.previous_position.division,
          new_division: item.new_position.division,
          old_department: item.previous_position.department,
          new_department: item.new_position.department,
          old_unit: item.previous_position.unit,
          new_unit: item.new_position.unit,
          old_position: item.previous_position.position,
          new_position: item.new_position.position,
          old_job_title: item.previous_position.position,
          new_job_title: item.new_position.position,
          old_structural_job_title: item.previous_position.structural_position ?? null,
          new_structural_job_title: item.new_position.structural_position ?? null,
          old_position_level: item.previous_position.position_level,
          new_position_level: item.new_position.position_level,
          old_employee_category: item.previous_position.employee_category,
          new_employee_category: item.new_position.employee_category,
          status: 'Approved', // Default status since it's not in the new response
          decree_file: item.decree_file,
        }));

        setOrganizationChanges(mapped);
        setTotal(responseData?.total || 0);
      } catch (err: any) {
        const message = err?.message || 'Failed to load organization changes';
        setError(message);
        addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
      } finally {
        setIsLoading(false);
      }
    },
    [page, limit, search, sortConfig, dateRangeFilters, columnFilters]
  );

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

  const createOrganizationChange = useCallback(
    async (leadEmployeeId?: string | null, payload?: CreateOrganizationChangePayload): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        const fd = new FormData();
        appendIfValue(fd, 'employee_id', payload?.employee_id);
        appendIfValue(fd, 'change_type_id', payload?.change_type_id);
        appendIfValue(fd, 'efektif_date', payload?.efektif_date);
        appendIfValue(fd, 'reason', payload?.reason);
        appendIfValue(fd, 'company_id', payload?.company_id);
        appendIfValue(fd, 'office_id', payload?.office_id);
        appendIfValue(fd, 'directorate_id', payload?.directorate_id);
        appendIfValue(fd, 'division_id', payload?.division_id);
        appendIfValue(fd, 'department_id', payload?.department_id);
        appendIfValue(fd, 'job_title_id', payload?.job_title_id);
        appendIfValue(fd, 'structural_job_id', payload?.structural_job_id);
        appendIfValue(fd, 'position_id', payload?.position_id);
        appendIfValue(fd, 'position_level_id', payload?.position_level_id);
        appendIfValue(fd, 'employee_category_id', payload?.employee_category_id);
        appendIfValue(fd, 'approved_by', payload?.approved_by);
        appendIfValue(fd, 'recommended_by', payload?.recommended_by);
        appendIfValue(fd, 'unit_id', payload?.unit_id);
        if (payload?.decree_file) fd.append('decree_file', payload?.decree_file);

        await organizationChangeService.storeOrganizationChange(leadEmployeeId ?? null, fd);
        // addNotification({
        //   title: 'Success',
        //   description: 'Organization change has been created',
        //   variant: 'success',
        //   hideDuration: 4000,
        // });
        return true;
      } catch (err: any) {
        const message = err?.message || 'Failed to create organization change';
        addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const getDetail = useCallback(async (id: string): Promise<OrganizationChangeDetailRaw | null> => {
    try {
      const resp = await organizationChangeService.getOrganizationChangeDetail(id);
      const data = resp?.data as OrganizationChangeDetailRaw;
      setDetail(data);
      return data;
    } catch (err: any) {
      const message = err?.message || 'Failed to get organization change detail';
      addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
      return null;
    }
  }, []);

  const updateOrganizationChange = useCallback(
    async (id: string, payload: UpdateOrganizationChangePayload): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        const fd = new FormData();
        fd.append('_method', 'PATCH');
        if (payload?.decree_file) fd.append('decree_file', payload?.decree_file);

        const resp = await organizationChangeService.updateOrganizationChange(id, fd);
        const updated = resp?.data as OrganizationChangeDetailRaw;
        
        if (detail?.id === id) setDetail(updated);
        
        // addNotification({
        //   title: 'Success',
        //   description: 'Organization change has been updated',
        //   variant: 'success',
        //   hideDuration: 4000,
        // });
        return true;
      } catch (err: any) {
        const message = err?.message || 'Failed to update organization change';

        //console.log('error', err);
        addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [detail]
  );

  const fetchChangeTypeOptions = useCallback(async () => {
    try {
      const resp = await organizationChangeService.getChangeTypeDropdown();
      const data = (resp as any)?.data ?? [];
      const mapped = data.map((i: any) => ({ label: i.name, value: i.id }));
      setChangeTypeOptions(mapped);
    } catch (err: any) {
      const message = err?.message || 'Failed to load change types';
      addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
      setChangeTypeOptions([]);
    }
  }, []);

  const fetchEmployeeOptions = useCallback(async (searchTerm?: string) => {
    try {
        
      const resp = await organizationChangeService.getAllEmployeeDropdown(searchTerm);
      const data = (resp as any)?.data ?? [];
    // need to recheck   
      const mapped = data.map((i: any) => ({
        label: `${i.id} - ${i.full_name}`,
        value: i.id,
        name: i.full_name,
      }));
      setEmployeeOptions(mapped);
    } catch (err: any) {
      const message = err?.message || 'Failed to load employees';
      addNotification({ title: 'Error', description: message, variant: 'error', hideDuration: 5000 });
      setEmployeeOptions([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchOrganizationChanges();
  }, [fetchOrganizationChanges]);

  useEffect(() => {
    if (autoFetch) {
      fetchOrganizationChanges();
    }
  }, [autoFetch, fetchOrganizationChanges]);

  const rowsWithStatus = useMemo(
    () => organizationChanges.map((r) => ({ ...r, statusPerubahan: r.status || 'Draft' })),
    [organizationChanges]
  );

  return {
    organizationChanges,
    rowsWithStatus,
    detail,
    isLoading,
    error,
    isSubmitting,
    changeTypeOptions,
    employeeOptions,
    total,
    page,
    limit,
    fetchOrganizationChanges,
    createOrganizationChange,
    getDetail,
    updateOrganizationChange,
    refresh,
    fetchChangeTypeOptions,
    fetchEmployeeOptions,
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
