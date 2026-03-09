import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  MarriageAllowanceListItem,
  MarriageAllowanceDetailResponse,
  MarriageAllowanceUpdatePayload,
} from '../../../types/dto/fixed-allowance/MarriageAllowanceType';
import { marriageAllowanceServices } from '../../../services/fixed-allowance/MarriageAllowanceServices';
import useFilterStore from '../../../../../stores/filterStore';

// Mapping helpers

const mapToMarriageAllowanceListItem = (item: any): MarriageAllowanceListItem => ({
  id: item.id,
  code: item.code,
  category: item.category,
  dependents: item.dependents,
  nominalValue: item.nominal_value,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    code: 'code',
    category: 'category',
    dependents: 'dependents',
    nominalValue: 'nominal_value',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiMarriageAllowanceReturn {
  marriageAllowances: MarriageAllowanceListItem[];
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
  fetchMarriageAllowances: (filter?: Partial<TableFilter>) => Promise<void>;
  updateMarriageAllowance: (id: string, payload: MarriageAllowanceUpdatePayload) => Promise<MarriageAllowanceListItem | null>;
  getMarriageAllowanceDetail: (id: string) => Promise<MarriageAllowanceDetailResponse | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiMarriageAllowance = (): UseApiMarriageAllowanceReturn => {
  const [marriageAllowances, setMarriageAllowances] = useState<MarriageAllowanceListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  
  const filterValue = useFilterStore((s) => (s.filters['MarriageAllowance'] ?? []).join(','));

  const fetchMarriageAllowances = useCallback(async (filter?: Partial<TableFilter>) => {
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
      
      const response = await marriageAllowanceServices.getMarriageAllowanceList(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setMarriageAllowances((items || []).map(mapToMarriageAllowanceListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch marriage allowances');
      console.error('Error fetching marriage allowances:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const updateMarriageAllowance = useCallback(async (id: string, payload: MarriageAllowanceUpdatePayload): Promise<MarriageAllowanceListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (payload.nominalValue !== undefined && payload.nominalValue !== null) {
        formData.append('nominal_value', String(payload.nominalValue));
      }

      await marriageAllowanceServices.updateMarriageAllowance(id, formData);
      
      // Return a truthy value to indicate success
      return { id } as MarriageAllowanceListItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update marriage allowance');
      console.error('Error updating marriage allowance:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMarriageAllowanceDetail = useCallback(async (id: string): Promise<MarriageAllowanceDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await marriageAllowanceServices.getMarriageAllowanceDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        code: item.code,
        category: item.category,
        dependents: item.dependents,
        nominalValue: item.nominal_value,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting marriage allowance detail:', err);
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
    marriageAllowances,
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
    
    fetchMarriageAllowances,
    updateMarriageAllowance,
    getMarriageAllowanceDetail,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
