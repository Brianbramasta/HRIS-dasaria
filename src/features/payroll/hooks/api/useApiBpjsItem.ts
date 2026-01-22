import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  BpjsItemListItem,
  BpjsItemDetailResponse,
  BpjsItemUpdatePayload,
  BpjsListGrouped,
} from '../../types/dto/BpjsItemType';
import { bpjsItemServices } from '../../services/BpjsItemServices';
import useFilterStore from '../../../../stores/filterStore';

// Mapping helpers

const mapToBpjsItemListItem = (item: any): BpjsItemListItem => ({
  id: item.id,
  detailName: item.detail_name,
  category: item.category,
  type: item.type,
  companyPercentage: item.company_percentage,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    detailName: 'detail_name',
    category: 'category',
    type: 'type',
    companyPercentage: 'company_percentage',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiBpjsItemReturn {
  bpjsItems: BpjsItemListItem[];
  bpjsListGrouped: BpjsListGrouped | null;
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
  fetchBpjsItems: (filter?: Partial<TableFilter>) => Promise<void>;
  fetchBpjsListGrouped: () => Promise<void>;
  updateBpjsItem: (id: string, payload: BpjsItemUpdatePayload) => Promise<BpjsItemListItem | null>;
  getBpjsItemDetail: (id: string) => Promise<BpjsItemDetailResponse | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiBpjsItem = (): UseApiBpjsItemReturn => {
  const [bpjsItems, setBpjsItems] = useState<BpjsItemListItem[]>([]);
  const [bpjsListGrouped, setBpjsListGrouped] = useState<BpjsListGrouped | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  
  // Assuming filterStore is global and has keys for features. 
  // We use 'BpjsItem' as the key.
  const filterValue = useFilterStore((s) => s.filters['BpjsItem'] ?? '');

  const fetchBpjsItems = useCallback(async (filter?: Partial<TableFilter>) => {
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
      
      const response = await bpjsItemServices.getBpjsItems(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setBpjsItems((items || []).map(mapToBpjsItemListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch BPJS items');
      console.error('Error fetching BPJS items:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const fetchBpjsListGrouped = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bpjsItemServices.getBpjsListGrouped();
      const data = (response as any)?.data ?? {};
      setBpjsListGrouped(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch BPJS list grouped');
      console.error('Error fetching BPJS list grouped:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBpjsItem = useCallback(async (id: string, payload: BpjsItemUpdatePayload): Promise<BpjsItemListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('company_percentage', String(payload.companyPercentage));
      
      if (payload.employeePercentage !== undefined && payload.employeePercentage !== null) {
        formData.append('employee_percentage', String(payload.employeePercentage));
      }

      const response = await bpjsItemServices.updateBpjsItem(id, formData);
      const data = (response as any)?.data ?? {};
      return mapToBpjsItemListItem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update BPJS item');
      console.error('Error updating BPJS item:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBpjsItemDetail = useCallback(async (id: string): Promise<BpjsItemDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await bpjsItemServices.getBpjsItemDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        detailName: item.detail_name,
        category: item.category,
        type: item.type,
        companyPercentage: item.company_percentage,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting BPJS item detail:', err);
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
    bpjsItems,
    bpjsListGrouped,
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
    
    fetchBpjsItems,
    fetchBpjsListGrouped,
    updateBpjsItem,
    getBpjsItemDetail,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
