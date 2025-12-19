import { useState, useCallback, useEffect } from 'react';
import {
  TableFilter,
  BusinessLineListItem,
  BusinessLineDetailResponse,
  FileSummary,
} from '../../types/OrganizationApiTypes';
import { businessLinesService } from '../../services/request/BusinessLinesService';
import useFilterStore from '../../../../stores/filterStore';

// Mapping helpers: transform raw API payload -> frontend types
const toFileSummary = (url: string | null): FileSummary | null => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1] || '';
  const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';
  return {
    fileName,
    fileUrl: url,
    fileType: ext,
    size: null,
  };
};

const mapToBusinessLine = (item: any): BusinessLineListItem => ({
  id: item.id,
  name: item.bl_name,
  description: item.bl_description ?? null,
  memoNumber: item.bl_decree_number ?? null,
  skFile: toFileSummary(item.bl_decree_file_url ?? item.bl_decree_file ?? null),
});

interface UseBusinessLinesReturn {
  businessLines: BusinessLineListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
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

export const useBusinessLines = (options?: { autoFetch?: boolean }): UseBusinessLinesReturn => {
  const [businessLines, setBusinessLines] = useState<BusinessLineListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const filterValue = useFilterStore((s) => s.filters['Lini Bisnis'] ?? '');

  const fetchBusinessLines = useCallback(async (filter?: Partial<TableFilter>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await businessLinesService.getList({
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
        page: filter?.page ?? page,
        pageSize: filter?.pageSize ?? pageSize,
      });

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
      const created = await businessLinesService.create(payload);
      const item = (created as any)?.data as any;
      const mapped = mapToBusinessLine(item);
      await fetchBusinessLines();
      return mapped;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create business line');
      console.error('Error creating business line:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchBusinessLines]);

  const updateBusinessLine = useCallback(async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<BusinessLineListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await businessLinesService.update(id, payload);
      const item = (updated as any)?.data as any;
      const mapped = mapToBusinessLine(item);
      await fetchBusinessLines();
      return mapped;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business line');
      console.error('Error updating business line:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchBusinessLines]);

  const deleteBusinessLine = useCallback(async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const resp = await businessLinesService.delete(id, payload);
      // service returns raw response; success flag may be in resp.data.success or resp.success
      const success = !!((resp as any)?.data?.success ?? (resp as any)?.success);
      await fetchBusinessLines();
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete business line');
      console.error('Error deleting business line:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchBusinessLines]);

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

  const autoFetch = options?.autoFetch ?? true;
  useEffect(() => {
    if (autoFetch) {
      fetchBusinessLines();
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue, autoFetch, fetchBusinessLines]);
  

  return {
    businessLines,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    
    fetchBusinessLines,
    createBusinessLine,
    updateBusinessLine,
    deleteBusinessLine,
    getDetail,
    getDropdown,
    getById,
    
    setPage,
    setPageSize,
    setSearch,
    setSort: (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    },
  };
};
