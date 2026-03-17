import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  FeeListItem,
  FeeDetailResponse,
  FeeUpdatePayload,
} from '../../../types/dto/fixed-allowance/FeeType';
import { feeServices } from '../../../services/fixed-allowance/FeeServices';
import useFilterStore from '../../../../../stores/filterStore';
import { formatFilterValue } from '@/utils/formatFilterValue';

// Mapping helpers
const mapToFeeListItem = (item: any): FeeListItem => ({
  id: item.id,
  name: item.name,
  amount: item.amount,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'name',
    amount: 'amount',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiFeeReturn {
  fees: FeeListItem[];
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
  fetchFees: (filter?: Partial<TableFilter>) => Promise<void>;
  updateFee: (id: string, payload: FeeUpdatePayload) => Promise<boolean>;
  getFeeDetail: (id: string) => Promise<FeeDetailResponse | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiFee = (): UseApiFeeReturn => {
  const [fees, setFees] = useState<FeeListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters['Fee']));

  const fetchFees = useCallback(async (filter?: Partial<TableFilter>) => {
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
      
      const response = await feeServices.getFeeList(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setFees((items || []).map(mapToFeeListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fees');
      console.error('Error fetching fees:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const updateFee = useCallback(async (id: string, payload: FeeUpdatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (payload.amount !== undefined && payload.amount !== null) {
        formData.append('amount', String(payload.amount));
      }

      await feeServices.updateFee(id, formData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update fee');
      console.error('Error updating fee:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeeDetail = useCallback(async (id: string): Promise<FeeDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await feeServices.getFeeDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        name: item.name,
        amount: item.amount,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting fee detail:', err);
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
    fees,
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
    
    fetchFees,
    updateFee,
    getFeeDetail,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
