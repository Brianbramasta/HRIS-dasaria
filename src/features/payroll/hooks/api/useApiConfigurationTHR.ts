import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  ConfigurationTHRListItem,
  ConfigurationTHRDetailResponse,
  ConfigurationTHRUpdatePayload,
  ConfigurationTHRUpdateStatusPayload,
} from '../../types/dto/ConfigurationTHRType';
import { configurationTHRServices } from '../../services/ConfigurationTHRServices';

// Mapping helpers
const mapToConfigurationTHRListItem = (item: any): ConfigurationTHRListItem => ({
  id: item.id,
  lengthOfService: item.length_of_service,
  description: item.description,
});

interface UseApiConfigurationTHRReturn {
  configurations: ConfigurationTHRListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;

  // Actions
  fetchConfigurationTHR: (filter?: Partial<TableFilter>) => Promise<void>;
  updateConfigurationTHR: (id: string, payload: ConfigurationTHRUpdatePayload) => Promise<ConfigurationTHRListItem | null>;
  updateStatusConfigurationTHR: (payload: ConfigurationTHRUpdateStatusPayload) => Promise<boolean>;
  getConfigurationTHRDetail: (id: string) => Promise<ConfigurationTHRDetailResponse | null>;

  // Pagination & Filter
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiConfigurationTHR = (): UseApiConfigurationTHRReturn => {
  const [configurations, setConfigurations] = useState<ConfigurationTHRListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const fetchConfigurationTHR = useCallback(async (filter?: Partial<TableFilter>) => {
    setLoading(true);
    setError(null);

    try {
      const effectivePage = filter?.page ?? page;
      const effectivePageSize = filter?.pageSize ?? pageSize;
      const effectiveSearch = filter?.search ?? search;
      const effectiveSortBy = filter?.sortBy ?? sortBy;
      const effectiveSortOrder = filter?.sortOrder ?? sortOrder;

      const params: any = { page: effectivePage, per_page: effectivePageSize };
      if (effectiveSearch) params.search = effectiveSearch;
      if (effectiveSortBy) {
        params.column = effectiveSortBy; // Assuming API accepts column name directly
        if (effectiveSortOrder) params.sort = effectiveSortOrder;
      }

      const response = await configurationTHRServices.getConfigurationTHRList(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setConfigurations((items || []).map(mapToConfigurationTHRListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);

      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch configuration THR');
      console.error('Error fetching configuration THR:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize]);

  const updateConfigurationTHR = useCallback(async (id: string, payload: ConfigurationTHRUpdatePayload): Promise<ConfigurationTHRListItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('length_of_service', payload.lengthOfService);
      if (payload.description) {
        formData.append('description', payload.description);
      }

      await configurationTHRServices.updateConfigurationTHR(id, formData);
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration THR');
      console.error('Error updating configuration THR:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatusConfigurationTHR = useCallback(async (payload: ConfigurationTHRUpdateStatusPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('is_active', payload.isActive ? '1' : '0');

      await configurationTHRServices.updateStatusConfigurationTHR(formData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status configuration THR');
      console.error('Error updating status configuration THR:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getConfigurationTHRDetail = useCallback(async (id: string): Promise<ConfigurationTHRDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await configurationTHRServices.getConfigurationTHRDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        lengthOfService: item.length_of_service,
        description: item.description,
        isActive: item.is_active === 1 || item.is_active === '1' || item.is_active === true,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting configuration THR detail:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  }, []);

  const handleSetSort = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);

  return {
    configurations,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    search,
    sortBy,
    sortOrder,

    fetchConfigurationTHR,
    updateConfigurationTHR,
    updateStatusConfigurationTHR,
    getConfigurationTHRDetail,

    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
