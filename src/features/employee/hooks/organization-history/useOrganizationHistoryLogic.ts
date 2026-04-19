import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useFilterStore from '@/stores/filterStore';
import { formatFilterValue } from '@/utils/formatFilterValue';
import { useApiOrganizationChange } from '@/features/employee/hooks/api/useApiOrganizationChange';

export const useOrganizationHistoryLogic = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});
  
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters['OrganizationHistory']));
  
  const {
    organizationChanges: data,
    loading,
    pagination,
    fetchOrganizationChanges,
  } = useApiOrganizationChange();

  // Fetch data with default (all categories) on mount
  useEffect(() => {
    fetchOrganizationChanges({});
  }, [fetchOrganizationChanges]);

  // Helper function to build query params
  const buildQueryParams = useCallback((baseParams: any = {}) => {
    const queryParams: any = {};

    if (baseParams?.search) queryParams.search = baseParams.search;
    if (baseParams?.column) queryParams.column = baseParams.column;
    if (baseParams?.sort) queryParams.sort = baseParams.sort;
    if (baseParams?.page) queryParams.page = baseParams.page;
    if (baseParams?.per_page) queryParams.per_page = baseParams.per_page;

    const filterParam = filterValue;
    if (filterParam) {
      queryParams.filter = Array.isArray(filterParam) ? filterParam : [filterParam];
    }

    // Add column filters - format: filter_column[column_name][in][]=value
    Object.entries(columnFilters).forEach(([columnId, values]) => {
      if (values && values.length > 0) {
        values.forEach((value) => {
          const key = `filter_column[${columnId === 'statusPerubahan' ? 'org_change_status' : columnId}][in][]`;
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

    return queryParams;
  }, [columnFilters, dateRangeFilters, filterValue]);

  // Event handlers
  const handleSearchChange = useCallback((searchValue: string) => {
    const params = buildQueryParams({ search: searchValue, page: 1 });
    fetchOrganizationChanges(params);
  }, [fetchOrganizationChanges, buildQueryParams]);

  const handleSortChange = useCallback((columnId: string, order: 'asc' | 'desc') => {
    const params = buildQueryParams({ sort: order, column: columnId, page: 1 });
    fetchOrganizationChanges(params);
  }, [fetchOrganizationChanges, buildQueryParams]);

  const handlePageChange = useCallback((page: number) => {
    const params = buildQueryParams({ page });
    fetchOrganizationChanges(params);
  }, [fetchOrganizationChanges, buildQueryParams]);

  const handleRowsPerPageChange = useCallback((perPage: number) => {
    const params = buildQueryParams({ per_page: perPage, page: 1 });
    fetchOrganizationChanges(params);
  }, [fetchOrganizationChanges, buildQueryParams]);

  const handleColumnFilterChange = useCallback((columnId: string, values: string[]) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnId]: values
    }));
  }, []);

  const handleDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
    setDateRangeFilters(prev => ({
      ...prev,
      [columnId]: { startDate, endDate }
    }));
  }, []);

  // Refetch data when filters change
  useEffect(() => {
    const params = buildQueryParams({ page: 1 });
    fetchOrganizationChanges(params);
  }, [columnFilters, dateRangeFilters, filterValue, buildQueryParams, fetchOrganizationChanges]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  const handleDropdownClose = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleNavigateToHR = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/organization-history');
  }, [navigate]);

  const handleNavigateToAtasan = useCallback(() => {
    setIsDropdownOpen(false);
    navigate('/organization-history/atasan');
  }, [navigate]);

  // Data is already transformed with statusPerubahan in Model layer
  const rowsWithStatus = useMemo(() => {
    // Ensure data is an array
    return Array.isArray(data) ? data : [];
  }, [data]);

  return {
    // State
    isDropdownOpen,
    columnFilters,
    dateRangeFilters,
    data,
    loading,
    pagination,
    rowsWithStatus,
    
    // Handlers
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnFilterChange,
    handleDateRangeFilterChange,
    handleDropdownToggle,
    handleDropdownClose,
    handleNavigateToHR,
    handleNavigateToAtasan,
  };
};
