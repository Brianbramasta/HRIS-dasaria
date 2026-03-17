import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  RefDeductionListItem,
  RefDeductionDetailResponse,
  RefDeductionUpdatePayload,
} from '../../types/dto/RefDeductionType';
import { refDeductionServices } from '../../services/RefDeductionServices';
import useFilterStore from '../../../../stores/filterStore';
import { formatFilterValue } from '@/utils/formatFilterValue';

// Mapping helpers

const mapToRefDeductionListItem = (item: any): RefDeductionListItem => ({
  id: item.id,
  referenceName: item.reference_name,
  category: item.category,
  nominalValue: item.nominal_value,
  description: item.description,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    referenceName: 'reference_name',
    category: 'category',
    nominalValue: 'nominal_value',
    description: 'description',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiRefDeductionReturn {
  refDeductions: RefDeductionListItem[];
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
  fetchRefDeductions: (filter?: Partial<TableFilter>) => Promise<void>;
  updateRefDeduction: (id: string, payload: RefDeductionUpdatePayload) => Promise<RefDeductionListItem | null>;
  getRefDeductionDetail: (id: string) => Promise<RefDeductionDetailResponse | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiRefDeduction = (): UseApiRefDeductionReturn => {
  const [refDeductions, setRefDeductions] = useState<RefDeductionListItem[]>([]);
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
  // Using 'RefDeduction' as filter key, similar to 'Compensation'
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters['Acuan Potongan']));

  const fetchRefDeductions = useCallback(async (filter?: Partial<TableFilter>) => {
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
      
      const response = await refDeductionServices.getRefDeductionList(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setRefDeductions((items || []).map(mapToRefDeductionListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ref deductions');
      console.error('Error fetching ref deductions:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const updateRefDeduction = useCallback(async (id: string, payload: RefDeductionUpdatePayload): Promise<RefDeductionListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (payload.nominalValue !== undefined && payload.nominalValue !== null) {
        formData.append('nominal_value', String(payload.nominalValue));
      } else {
        formData.append('nominal_value', '');
      }

      if (payload.description !== undefined && payload.description !== null) {
        formData.append('description', payload.description);
      } else {
        formData.append('description', '');
      }

      await refDeductionServices.updateRefDeduction(id, formData);
      
      // Returning null as per pattern in useApiCompensation, implying caller might need to refetch
      return null; 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ref deduction');
      console.error('Error updating ref deduction:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRefDeductionDetail = useCallback(async (id: string): Promise<RefDeductionDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await refDeductionServices.getRefDeductionDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        referenceName: item.reference_name,
        category: item.category,
        nominalValue: item.nominal_value,
        description: item.description,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting ref deduction detail:', err);
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
    refDeductions,
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
    
    fetchRefDeductions,
    updateRefDeduction,
    getRefDeductionDetail,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
