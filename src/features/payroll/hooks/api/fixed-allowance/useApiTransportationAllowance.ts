import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  TransportationAllowanceListItem,
  TransportationAllowanceDetailResponse,
  TransportationAllowanceUpdatePayload,
} from '../../../types/dto/fixed-allowance/TransportationAllowanceType';
import { transportationAllowanceServices } from '../../../services/fixed-allowance/TransportationAllowanceServices';
import useFilterStore from '../../../../../stores/filterStore';

// Mapping helpers
const mapToTransportationAllowanceListItem = (item: any): TransportationAllowanceListItem => ({
  id: item.id,
  nameTransportation: item.name_transportation,
  categoryId: item.category_id,
  categoryName: item.category_name,
  nominalValue: item.nominal_value,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    nameTransportation: 'name_transportation',
    categoryName: 'category_name',
    nominalValue: 'nominal_value',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiTransportationAllowanceReturn {
  transportationAllowances: TransportationAllowanceListItem[];
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
  fetchTransportationAllowances: (filter?: Partial<TableFilter>) => Promise<void>;
  updateTransportationAllowance: (id: string, payload: TransportationAllowanceUpdatePayload) => Promise<boolean>;
  getTransportationAllowanceDetail: (id: string) => Promise<TransportationAllowanceDetailResponse | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiTransportationAllowance = (): UseApiTransportationAllowanceReturn => {
  const [transportationAllowances, setTransportationAllowances] = useState<TransportationAllowanceListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  
  const filterValue = useFilterStore((s) => s.filters['TransportationAllowance'] ?? '');

  const fetchTransportationAllowances = useCallback(async (filter?: Partial<TableFilter>) => {
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
      
      const response = await transportationAllowanceServices.getTransportationAllowanceList(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setTransportationAllowances((items || []).map(mapToTransportationAllowanceListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transportation allowances');
      console.error('Error fetching transportation allowances:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const updateTransportationAllowance = useCallback(async (id: string, payload: TransportationAllowanceUpdatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (payload.nominalValue !== undefined && payload.nominalValue !== null) {
        formData.append('nominal_value', String(payload.nominalValue));
      }

      await transportationAllowanceServices.updateTransportationAllowance(id, formData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transportation allowance');
      console.error('Error updating transportation allowance:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransportationAllowanceDetail = useCallback(async (id: string): Promise<TransportationAllowanceDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await transportationAllowanceServices.getTransportationAllowanceDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        nameTransportation: item.name_transportation,
        categoryName: item.category_name,
        nominalValue: item.nominal_value,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting transportation allowance detail:', err);
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
    transportationAllowances,
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
    
    fetchTransportationAllowances,
    updateTransportationAllowance,
    getTransportationAllowanceDetail,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
