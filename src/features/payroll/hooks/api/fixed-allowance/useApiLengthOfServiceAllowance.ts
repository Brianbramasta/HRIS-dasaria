import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  LengthOfServiceAllowanceListItem,
  LengthOfServiceAllowanceDetailResponse,
  LengthOfServiceAllowanceUpdatePayload,
  LengthOfServiceAllowanceApiItem,
} from '../../../types/dto/fixed-allowance/LengthOfServiceAllowanceType';
import { lengthOfServiceAllowanceServices } from '../../../services/fixed-allowance/LengthOfServiceAllowanceServices';
import useFilterStore from '../../../../../stores/filterStore';

// Mapping helpers
const mapToListItem = (item: LengthOfServiceAllowanceApiItem): LengthOfServiceAllowanceListItem => ({
  id: item.id,
  lengthOfService: item.length_of_service,
  nominalValue: item.nominal_value,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    lengthOfService: 'length_of_service',
    nominalValue: 'nominal_value',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiLengthOfServiceAllowanceReturn {
  items: LengthOfServiceAllowanceListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;
  filterValue: string;

  // Actions
  fetchItems: (filter?: Partial<TableFilter>) => Promise<void>;
  updateItem: (id: string, payload: LengthOfServiceAllowanceUpdatePayload) => Promise<LengthOfServiceAllowanceListItem | null>;
  getItemDetail: (id: string) => Promise<LengthOfServiceAllowanceDetailResponse | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiLengthOfServiceAllowance = (): UseApiLengthOfServiceAllowanceReturn => {
  const [items, setItems] = useState<LengthOfServiceAllowanceListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  
  // Assuming filterStore is global. Key used: 'LengthOfServiceAllowance' (can be adjusted)
  const filterValue = useFilterStore((s) => (s.filters['LengthOfServiceAllowance'] ?? []).join(','));

  const fetchItems = useCallback(async (filter?: Partial<TableFilter>) => {
    setLoading(true);
    setError(null);
    
    try {
      const effectivePage = filter?.page ?? page;
      const effectivePageSize = filter?.pageSize ?? pageSize;
      const effectiveSearch = filter?.search ?? search;
      const effectiveSortBy = filter?.sortBy ?? sortBy;
      const effectiveSortOrder = filter?.sortOrder ?? sortOrder;
      const effectiveFilter = filter?.filter ?? filterValue;
      
      const params: any = { page: effectivePage, per_page: effectivePageSize };
      if (effectiveSearch) params.search = effectiveSearch;
      if (effectiveFilter) params.filter = effectiveFilter;
      if (effectiveSortBy) {
        params.column = toSortField(effectiveSortBy);
        if (effectiveSortOrder) params.sort = effectiveSortOrder;
      }
      
      const response = await lengthOfServiceAllowanceServices.getList(params);

      const payload = (response as any)?.data ?? {};
      const dataItems = payload?.data ?? [];
      const totalCount = payload?.total ?? (dataItems?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setItems((dataItems || []).map(mapToListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      console.error('Error fetching length of service allowances:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const updateItem = useCallback(async (id: string, payload: LengthOfServiceAllowanceUpdatePayload): Promise<LengthOfServiceAllowanceListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('nominal_value', String(payload.nominalValue));

      await lengthOfServiceAllowanceServices.update(id, formData);
      
      // We might need to refetch to get updated list
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      console.error('Error updating length of service allowance:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getItemDetail = useCallback(async (id: string): Promise<LengthOfServiceAllowanceDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await lengthOfServiceAllowanceServices.getDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        lengthOfService: item.length_of_service,
        nominalValue: item.nominal_value,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting length of service allowance detail:', err);
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
    items,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    search,
    sortBy,
    sortOrder,
    filterValue,
    
    fetchItems,
    updateItem,
    getItemDetail,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
