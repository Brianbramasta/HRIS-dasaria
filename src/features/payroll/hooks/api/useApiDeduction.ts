import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  DeductionListItem,
  DeductionDetailResponse,
  DeductionCreatePayload,
  DeductionUpdatePayload,
} from '../../types/dto/DeductionType';
import { deductionServices } from '../../services/DeductionServices';
import useFilterStore from '../../../../stores/filterStore';


// Mapping helpers

const mapToDeductionListItem = (item: any): DeductionListItem => ({
  id: item.id,
  deductionName: item.deduction_name,
  category: item.category,
  description: item.description,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    deductionName: 'deduction_name',
    category: 'category',
    description: 'description',
    createdAt: 'created_at',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiDeductionReturn {
  deductions: DeductionListItem[];
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
  fetchDeductions: (filter?: Partial<TableFilter>) => Promise<void>;
  createDeduction: (payload: DeductionCreatePayload) => Promise<boolean>;
  updateDeduction: (id: string, payload: DeductionUpdatePayload) => Promise<boolean>;
  deleteDeduction: (id: string) => Promise<boolean>;
  getDeductionDetail: (id: string) => Promise<DeductionDetailResponse | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiDeduction = (): UseApiDeductionReturn => {
  const [deductions, setDeductions] = useState<DeductionListItem[]>([]);
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
  const filterValue = useFilterStore((s) => (s.filters['Deduction'] ?? []).join(','));

  const fetchDeductions = useCallback(async (filter?: Partial<TableFilter>) => {
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
      // Allow passing category from filter
      if ((filter as any)?.category) {
        params.category = (filter as any).category;
      }

      if (effectiveSortBy) {
        params.column = toSortField(effectiveSortBy);
        if (effectiveSortOrder) params.sort = effectiveSortOrder;
      }
      
      const response = await deductionServices.getDeductionList(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setDeductions((items || []).map(mapToDeductionListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deductions');
      console.error('Error fetching deductions:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const createDeduction = useCallback(async (payload: DeductionCreatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('deduction_name', payload.deductionName);
      formData.append('category', payload.category);
      if (payload.description) {
          formData.append('description', payload.description);
      }
      
      await deductionServices.createDeduction(formData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deduction');
      console.error('Error creating deduction:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDeduction = useCallback(async (id: string, payload: DeductionUpdatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('deduction_name', payload.deductionName);
      formData.append('category', payload.category);
      if (payload.description) {
          formData.append('description', payload.description);
      }

      await deductionServices.updateDeduction(id, formData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deduction');
      console.error('Error updating deduction:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDeduction = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('_method', 'DELETE');

      await deductionServices.deleteDeduction(id, formData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deduction');
      console.error('Error deleting deduction:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDeductionDetail = useCallback(async (id: string): Promise<DeductionDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await deductionServices.getDeductionDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        deductionName: item.deduction_name,
        category: item.category,
        description: item.description,
        isActive: item.is_active,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting deduction detail:', err);
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
    deductions,
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
    
    fetchDeductions,
    createDeduction,
    updateDeduction,
    deleteDeduction,
    getDeductionDetail,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
