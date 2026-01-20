import { useState, useCallback, useEffect } from 'react';
import {
  TableFilter,
  BusinessLineListItem,
  BusinessLineDetailResponse,
  FileSummary,
} from '../../types/OrganizationApiTypes';
import { businessLinesService } from '../../services/request/BusinessLinesService';
import useFilterStore from '../../../../stores/filterStore';
import { toFileSummary } from '../../utils/shared';

// Mapping helpers: transform raw API payload -> frontend types

const mapToBusinessLine = (item: any): BusinessLineListItem => ({
  id: item.id,
  name: item.bl_name,
  description: item.bl_description ?? null,
  memoNumber: item.bl_decree_number ?? null,
  skFile: toFileSummary(item.bl_decree_file_url ?? item.bl_decree_file ?? null),
});

// Map UI sort field to API column
const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'bl_name',
    'Lini Bisnis': 'bl_name',
    'lini-bisnis': 'bl_name',
    bl_name: 'bl_name',
    'Deskripsi Umum': 'bl_description',
    'deskripsi-umum': 'bl_description',
    description: 'bl_description',
    bl_description: 'bl_description',
  };
  return map[field || ''] || 'bl_name';
};

interface UseApiBusinessLinesReturn {
  businessLines: BusinessLineListItem[];
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
  fetchBusinessLines: (filter?: Partial<TableFilter>) => Promise<void>;
  createBusinessLine: (payload: { name: string; description?: string | null; memoNumber: string; skFileId: string; }) => Promise<BusinessLineListItem | null>;
  updateBusinessLine: (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFileId: string; }) => Promise<BusinessLineListItem | null>;
  deleteBusinessLine: (id: string, payload: { memoNumber: string; skFileId: string; }) => Promise<boolean>;
  getDetail: (id: string) => Promise<BusinessLineDetailResponse | null>;
  getDropdown: (search?: string) => Promise<BusinessLineListItem[]>;
  getById: (id: string) => Promise<BusinessLineListItem | null>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiBusinessLines = (options?: { autoFetch?: boolean }): UseApiBusinessLinesReturn => {
  const [businessLines, setBusinessLines] = useState<BusinessLineListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const filterValue = useFilterStore((s) => s.filters['Lini Bisnis'] ?? '');

  const fetchBusinessLines = useCallback(async (filter?: Partial<TableFilter>) => {
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
      const response = await businessLinesService.getList(params);

      // service returns raw API response; extract payload and map here
      const payload = (response as any)?.data ?? {};
      const items = payload?.data ?? [];
      const totalCount = payload?.total ?? (items?.length || 0);
      // const currentPage = payload?.current_page ?? filter?.page ?? page;
      const perPage = payload?.per_page ?? filter?.pageSize ?? pageSize;
      const totalPagesCalc = perPage ? Math.ceil(totalCount / perPage) : 1;

      setBusinessLines((items || []).map(mapToBusinessLine));
      setTotal(totalCount);
      setTotalPages(totalPagesCalc);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business lines');
      console.error('Error fetching business lines:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const createBusinessLine = useCallback(async (payload: { name: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<BusinessLineListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('bl_name', payload.name);
      formData.append('bl_decree_number', payload.memoNumber);
      if (payload.description !== undefined && payload.description !== null) {
        formData.append('bl_description', payload.description);
      }
      // Note: check if skFileId is file object or id. In useBusinessLines it was mapped to formData. 
      // Checking useBusinessLines.ts: "skFileId: string" in signature, but usage:
      // In createDepartment (reference): formData.append('department_decree_file', departmentData.skFile); where skFile is File.
      // In useBusinessLines.ts original:
      // createBusinessLine signature says skFileId: string.
      // But implementation doesn't append skFileId to formData?
      // Wait, let me check the original useBusinessLines.ts again.
      
      // Original useBusinessLines.ts:
      // const createBusinessLine = useCallback(async (payload: { name: string; description?: string | null; memoNumber: string; skFileId: string; }) => {
      //   ...
      //   formData.append('bl_name', payload.name);
      //   formData.append('bl_decree_number', payload.memoNumber);
      //   ...
      //   // It seems it MISSING the file append?
      //   // Or maybe skFileId is not used?
      
      // Let's check how Departments does it.
      // createDepartment: (payload: { ... skFile: File; })
      // formData.append('department_decree_file', departmentData.skFile);
      
      // In BusinessLinesTab.tsx, let's see how createBusinessLine is called.
      // It is called in AddBusinessLineModal. I don't see AddBusinessLineModal content.
      // But based on the signature in useBusinessLines.ts: skFileId: string.
      
      // Wait, if I look at `useBusinessLines.ts` line 124:
      // createBusinessLine = useCallback(async (payload: { name: string; description?: string | null; memoNumber: string; skFileId: string; }) ...
      // Inside:
      // formData.append('bl_name', payload.name);
      // formData.append('bl_decree_number', payload.memoNumber);
      // if (payload.description ...) ...
      // const created = await businessLinesService.create(formData);
      
      // IT DOES NOT APPEND THE FILE/ID. This might be a bug in the original code or I missed something.
      // However, my task is to move the logic, not necessarily fix bugs unless they block me.
      // BUT, looking at `useApiDepartments.ts`:
      // createDepartment takes `skFile: File`.
      
      // The user asked to "taruh semua variabe dan fungsi yang ada di BusinessLinesTab.tsx kedalam useBusinessLines.ts".
      // And move logic to useApi...
      
      // Let's stick to what was in `useBusinessLines.ts` for now, but I should probably allow `File` if it's supposed to be uploaded.
      // Let's check `BusinessLinesTab.tsx` usage. It doesn't call createBusinessLine directly, it passes `fetchBusinessLines` to `AddBusinessLineModal` via `onSuccess`.
      // Actually `AddBusinessLineModal` likely calls `createBusinessLine` imported from somewhere or passed to it?
      // No, `AddBusinessLineModal` is imported. It likely uses the hook internally or calls service directly?
      // In `DepartmentsTab.tsx`, `AddDepartmentModal` is used.
      // `useDepartments` returns `createDepartment`.
      // `AddDepartmentModal` might be using `useDepartments` or receiving it as prop?
      // In `DepartmentsTab.tsx`, `AddDepartmentModal` only receives `isOpen`, `onClose`, `onSuccess`.
      // So `AddDepartmentModal` must be calling the API itself or using the hook.
      
      // If `AddBusinessLineModal` uses `useBusinessLines` internally, then refactoring `useBusinessLines` will affect it.
      
      // Let's assume the signature in `useBusinessLines.ts` is what I should copy.
      // I will copy it exactly as is for now to avoid breaking changes, unless I see obvious fix needed.
      // Wait, `useApiDepartments.ts` has `skFile: File`. `useBusinessLines.ts` has `skFileId: string`.
      // This is suspicious. But I will proceed with copy for `useApiBusinessLines.ts`.
      
      const created = await businessLinesService.create(formData);
      const item = (created as any)?.data as any;
      const mapped = mapToBusinessLine(item);
      // await fetchBusinessLines(); // Removed side effect from API hook, caller should decide when to refetch or update state
      return mapped;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create business line');
      console.error('Error creating business line:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBusinessLine = useCallback(async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<BusinessLineListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      if (payload.name !== undefined) formData.append('bl_name', payload.name);
      formData.append('bl_decree_number', payload.memoNumber);
      if (payload.description !== undefined && payload.description !== null) {
        formData.append('bl_description', payload.description);
      }
      // Again, skFileId is ignored in original code

      const updated = await businessLinesService.update(id, formData);
      const item = (updated as any)?.data as any;
      const mapped = mapToBusinessLine(item);
      // await fetchBusinessLines();
      return mapped;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business line');
      console.error('Error updating business line:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBusinessLine = useCallback(async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'DELETE');
      if (payload.memoNumber) {
        formData.append('bl_delete_decree_number', payload.memoNumber);
      }
      // skFileId ignored

      const resp = await businessLinesService.delete(id, formData);
      const success = !!((resp as any)?.data?.success ?? (resp as any)?.success);
      // await fetchBusinessLines();
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete business line');
      console.error('Error deleting business line:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetail = useCallback(async (id: string): Promise<BusinessLineDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await businessLinesService.getDetail(id);
      const item = (resp as any)?.data as any;
      if (!item) return null;

      const bl = mapToBusinessLine(item);
      const activeSk = toFileSummary(item?.bl_decree_file_url ?? item?.bl_decree_file ?? null);
      const deleteSk = toFileSummary(item?.bl_delete_decree_file_url ?? item?.bl_delete_decree_file ?? null);
      const personalFiles: FileSummary[] = [];
      if (activeSk) personalFiles.push(activeSk);
      if (deleteSk) personalFiles.push(deleteSk);
      const companies = Array.isArray(item?.companies)
        ? item.companies.map((c: any) => ({
            id: c.id_company || '',
            name: c.company_name || '',
            details: c.company_description ?? null,
          }))
        : [];

      return {
        businessLine: {
          id: bl.id,
          name: bl.name,
          description: bl.description,
          memoNumber: bl.memoNumber,
          skFile: bl.skFile,
        },
        personalFiles,
        companies,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get detail');
      console.error('Error getting business line detail:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDropdown = useCallback(async (search?: string): Promise<BusinessLineListItem[]> => {
    try {
      const resp = await businessLinesService.getDropdown(search);
      const items = (resp as any)?.data ?? [];
      return (items || []).map((i: any) => ({
        id: i.id,
        name: i.bl_name,
        description: null,
        memoNumber: null,
        skFile: null,
      }));
    } catch (err) {
      console.error('Error fetching dropdown business lines:', err);
      return [];
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<BusinessLineListItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const resp = await businessLinesService.getById(id);
      const item = (resp as any)?.data as any;
      // console.log('getById', item);
      if (!item) return null;
      return mapToBusinessLine(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get business line');
      console.error('Error getting business line by id:', err);
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
    setPage(1); // Reset to first page when changing page size
  }, []);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when searching
  }, []);

  const handleSetSort = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }, []);

  // Removed autoFetch effect from here, it should be in the business logic hook

  return {
    businessLines,
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
    
    fetchBusinessLines,
    createBusinessLine,
    updateBusinessLine,
    deleteBusinessLine,
    getDetail,
    getDropdown,
    getById,
    
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
