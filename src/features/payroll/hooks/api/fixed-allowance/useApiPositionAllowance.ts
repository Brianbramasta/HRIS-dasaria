import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  PositionAllowanceListItem,
  PositionAllowanceDetailResponse,
  PositionAllowanceUpdatePayload,
  BpjsItemDetail,
} from '../../../types/dto/fixed-allowance/PositionAllowanceType';
import { positionAllowanceServices } from '../../../services/fixed-allowance/PositionAllowanceServices';
import useFilterStore from '../../../../../stores/filterStore';
import { formatFilterValue } from '@/utils/formatFilterValue';

// Mapping helpers
const mapToPositionAllowanceListItem = (item: any): PositionAllowanceListItem => ({
  id: item.id,
  jobTitleName: item.job_title_name,
  percentageValue: item.percentage_value,
  nominalValue: item.nominal_value,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    jobTitleName: 'job_title_name',
    percentageValue: 'percentage_value',
    nominalValue: 'nominal_value',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiPositionAllowanceReturn {
  positionAllowances: PositionAllowanceListItem[];
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
  fetchPositionAllowances: (filter?: Partial<TableFilter>) => Promise<void>;
  updatePositionAllowance: (id: string, payload: PositionAllowanceUpdatePayload) => Promise<boolean>;
  getPositionAllowanceDetail: (id: string) => Promise<PositionAllowanceDetailResponse | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiPositionAllowance = (): UseApiPositionAllowanceReturn => {
  const [positionAllowances, setPositionAllowances] = useState<PositionAllowanceListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters['PositionAllowance']));

  const fetchPositionAllowances = useCallback(async (filter?: Partial<TableFilter>) => {
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
      
      const response = await positionAllowanceServices.getPositionAllowanceList(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setPositionAllowances((items || []).map(mapToPositionAllowanceListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch position allowances');
      console.error('Error fetching position allowances:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const updatePositionAllowance = useCallback(async (id: string, payload: PositionAllowanceUpdatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      formData.append('job_level_id', payload.jobLevelId);
      
      if (payload.percentage_value !== undefined && payload.percentage_value !== null) {
        formData.append('percentage_value', String(payload.percentage_value));
      }
      
      if (payload.nominal_value !== undefined && payload.nominal_value !== null) {
        formData.append('nominal_value', String(payload.nominal_value));
      }

      if (Array.isArray(payload.positionAllowanceBpjs)) {
        payload.positionAllowanceBpjs.forEach((item, index) => {
          formData.append(`position_allowance_bpjs[${index}][bpjs_item_id]`, item.bpjs_item_id);
          formData.append(`position_allowance_bpjs[${index}][is_active]`, String(item.is_active));
        });
      }

      await positionAllowanceServices.updatePositionAllowance(id, formData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update position allowance');
      console.error('Error updating position allowance:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPositionAllowanceDetail = useCallback(async (id: string): Promise<PositionAllowanceDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await positionAllowanceServices.getPositionAllowanceDetail(id);
      const data = (resp as any)?.data as any;
      if (!data) return null;

      const fixedAllowance = data.fixed_allowance || {};
      const bpjsItemsRaw = data.bpjs_items || {};
      
      const bpjsItems: Record<string, BpjsItemDetail[]> = {};
      
      Object.keys(bpjsItemsRaw).forEach((key) => {
        const items = bpjsItemsRaw[key];
        if (Array.isArray(items)) {
          bpjsItems[key] = items.map((item: any) => ({
            id: item.id,
            detailName: item.detail_name,
            type: item.type,
            isActive: item.is_active,
          }));
        }
      });

      return {
        fixed_allowance: {
          id: fixedAllowance.id,
          job_title_id: fixedAllowance.job_title_id,
          job_title_name: fixedAllowance.job_title_name,
          percentage_value: fixedAllowance.percentage_value,
          nominal_value: fixedAllowance.nominal_value,
        },
        bpjs_items: bpjsItems,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting position allowance detail:', err);
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
    positionAllowances,
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
    
    fetchPositionAllowances,
    updatePositionAllowance,
    getPositionAllowanceDetail,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
