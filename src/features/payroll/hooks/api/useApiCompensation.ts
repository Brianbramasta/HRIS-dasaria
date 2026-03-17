import { useState, useCallback } from 'react';
import { TableFilter } from '@/types/SharedType';
import {
  CompensationListItem,
  CompensationDetailResponse,
  CompensationUpdatePayload,
  CompensationCategoryOption,
} from '../../types/dto/CompensationType';
import { payrollConfigurationServices } from '../../services/PayrollConfigurationServices';
import useFilterStore from '../../../../stores/filterStore';
import { formatFilterValue } from '@/utils/formatFilterValue';


// Mapping helpers

const mapToCompensationListItem = (item: any): CompensationListItem => ({
  id: item.id,
  jobTitleName: item.job_title_name,
  structuralJobName: item.mt_structural_job_name,
  categoryCompensationId: item.category_compensation_id,
  categoryCompensation: item.category_compensation,
  amountGeneral: item.amount_general,
  amountJunior: item.amount_junior,
  amountMiddle: item.amount_middle,
  amountSenior: item.amount_senior,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    jobTitleName: 'job_title_name',
    'level-jabatan': 'job_title_name',
    structuralJobName: 'mt_structural_job_name',
    categoryCompensation: 'category_compensation',
    kategori: 'category_compensation',
    general: 'amount_general',
    junior: 'amount_junior',
    middle: 'amount_middle',
    senior: 'amount_senior',
  };
  return map[field || ''] || field || 'created_at';
};

interface UseApiCompensationReturn {
  compensations: CompensationListItem[];
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
  categories: CompensationCategoryOption[];

  // Actions
  fetchCompensations: (filter?: Partial<TableFilter>) => Promise<void>;
  updateCompensation: (id: string, payload: CompensationUpdatePayload) => Promise<CompensationListItem | null>;
  getCompensationDetail: (id: string) => Promise<CompensationDetailResponse | null>;
  fetchCategories: () => Promise<void>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiCompensation = (): UseApiCompensationReturn => {
  const [compensations, setCompensations] = useState<CompensationListItem[]>([]);
  const [categories, setCategories] = useState<CompensationCategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  // Filter value from store using the same key as DataTable title ('Kompensasi')
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters['Kompensasi']));

  const fetchCompensations = useCallback(async (filter?: Partial<TableFilter>) => {
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
      console.log(params,'params')
      
      const response = await payrollConfigurationServices.getCompensationList(params);

      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setCompensations((items || []).map(mapToCompensationListItem));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch compensations');
      console.error('Error fetching compensations:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await payrollConfigurationServices.getDropdownCompensationCategories();
      const data = (resp as any)?.data || [];
      setCategories(data.map((item: any) => ({
        id: item.id,
        name: item.name
      })));
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompensation = useCallback(async (id: string, payload: CompensationUpdatePayload): Promise<CompensationListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('compensation_category_id', payload.categoryCompensationId);
      
      if (payload.amountGeneral !== undefined && payload.amountGeneral !== null) {
        formData.append('amount_general', String(payload.amountGeneral));
      } else {
        formData.append('amount_general', '');
      }
      
      if (payload.amountJunior !== undefined && payload.amountJunior !== null) {
        formData.append('amount_junior', String(payload.amountJunior));
      } else {
        formData.append('amount_junior', '');
      }

      if (payload.amountMiddle !== undefined && payload.amountMiddle !== null) {
        formData.append('amount_middle', String(payload.amountMiddle));
      } else {
        formData.append('amount_middle', '');
      }

      if (payload.amountSenior !== undefined && payload.amountSenior !== null) {
        formData.append('amount_senior', String(payload.amountSenior));
      } else {
        formData.append('amount_senior', '');
      }

      await payrollConfigurationServices.updateCompensation(id, formData);
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update compensation');
      console.error('Error updating compensation:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCompensationDetail = useCallback(async (id: string): Promise<CompensationDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await payrollConfigurationServices.getCompensationDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      return {
        id: item.id,
        jobTitle: {
          id: item.job_title?.id,
          jobTitleName: item.job_title?.job_title_name,
          structuralJobs: Array.isArray(item.job_title?.structural_jobs) 
            ? item.job_title.structural_jobs.map((s: any) => ({
                id: s.id,
                structuralJobName: s.mt_structural_job_name
              }))
            : []
        },
        categoryCompensationId: item.category_compensation_id,
        categoryCompensation: item.category_compensation,
        amountGeneral: item.amount_general,
        amountJunior: item.amount_junior,
        amountMiddle: item.amount_middle,
        amountSenior: item.amount_senior,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting compensation detail:', err);
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
    compensations,
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
    categories,
    
    fetchCompensations,
    updateCompensation,
    getCompensationDetail,
    fetchCategories,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
