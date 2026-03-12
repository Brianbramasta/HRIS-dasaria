import { useState, useCallback, useEffect } from 'react';
import { directoratesService } from '../../services/request/DirectoratesService';
import { DirectorateListItem, TableFilter } from '../../types/OrganizationApiTypes';
import useFilterStore from '../../../../stores/filterStore';
import { toFileSummary } from '../../utils/shared/toFileSummary';
import { loadPageFilters } from '../../../../stores/filterStore';

// Mapping helpers

export const mapToDirectorate = (item: any): DirectorateListItem => ({
  id: item.id ?? item.id ?? '',
  name: item.directorate_name ?? item.name ?? '',
  description: item.directorate_description ?? item.description ?? null,
  memoNumber: item.directorate_decree_number ?? item.memoNumber ?? null,
  skFile: toFileSummary(item.directorate_decree_file_url ?? item.directorate_decree_file ?? null),
});

// Map UI sort field to API column
const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'directorate_name',
    'Nama Direktorat': 'directorate_name',
    'direktorat-name': 'directorate_name',
    directorate_name: 'directorate_name',
    'Deskripsi Umum': 'directorate_description',
    'deskripsi-umum': 'directorate_description',
    description: 'directorate_description',
    directorate_description: 'directorate_description',
  };
  return map[field || ''] || 'directorate_name';
};

interface UseDirectoratesReturn {
  directorates: DirectorateListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filterValue: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;

  // Actions
  fetchDirectorates: (filter?: TableFilter) => Promise<void>;
  createDirectorate: (payload: { name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  updateDirectorate: (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deleteDirectorate: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<void>;
  getDropdown: (search?: string) => Promise<{ id: string; directorate_name: string }[]>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc'  ) => void;
}

export const useApiDirectorates = (): UseDirectoratesReturn => {
  const [directorates, setDirectorates] = useState<DirectorateListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const filterValue = useFilterStore((s) => (s.filters['Direktorat'] ?? []).join(','));

  const fetchDirectorates = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const effectivePage = filter?.page ?? page;
      const effectivePageSize = filter?.pageSize ?? pageSize;
      const effectiveSearch = filter?.search ?? search;
      const effectiveSortBy = filter?.sortBy ?? sortBy;
      const effectiveSortOrder = filter?.sortOrder ?? sortOrder;
      
      // Get individual filter terms from localStorage instead of comma-separated string
      const pageKey = '/structure-and-organize/directorates'; // Current page path
      const { terms } = loadPageFilters(pageKey);
      const effectiveFilter = filter?.filter ?? (terms.length > 0 ? terms : filterValue);
      
      const params: any = { page: effectivePage, per_page: effectivePageSize };
      if (effectiveSearch) params.search = effectiveSearch;
      if (effectiveFilter) params.filter = effectiveFilter;
      if (effectiveSortBy) {
        params.column = toSortField(effectiveSortBy);
        if (effectiveSortOrder) params.sort = effectiveSortOrder;
      }
      const result = await directoratesService.getList(params);
      
      const payload = (result as any);
      const items = payload?.data?.data ?? [];
      const total = payload?.data?.total ?? (items?.length || 0);
      const perPage = payload?.data?.per_page ?? pageSize;
      const totalPagesCount = perPage ? Math.ceil(total / perPage) : 1;
      
      setDirectorates((items || []).map(mapToDirectorate));
      setTotal(total);
      setTotalPages(totalPagesCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch directorates');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  // Auto-fetch when search, page, pageSize, sort, or filter changes
  useEffect(() => {
    fetchDirectorates();
  }, [fetchDirectorates]);

  const createDirectorate = useCallback(async (directorateData: { name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('directorate_name', directorateData.name);
      formData.append('directorate_decree_number', directorateData.memoNumber);
      if (directorateData.description !== undefined && directorateData.description !== null) {
        formData.append('directorate_description', directorateData.description);
      }
      if (directorateData.skFile) {
        formData.append('directorate_decree_file', directorateData.skFile);
      }

      const created = await directoratesService.create(formData);
      const item = (created as any).data as any;
      const newDirectorate = mapToDirectorate(item);
      setDirectorates(prev => [...prev, newDirectorate]);
      await fetchDirectorates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create directorate');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDirectorates]);

  const updateDirectorate = useCallback(async (id: string, directorateData: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      if (directorateData.name !== undefined) formData.append('directorate_name', directorateData.name);
      formData.append('directorate_decree_number', directorateData.memoNumber);
      if (directorateData.description !== undefined && directorateData.description !== null) {
        formData.append('directorate_description', directorateData.description);
      }
      if (directorateData.skFile) {
        formData.append('directorate_decree_file', directorateData.skFile);
      }

      const updated = await directoratesService.update(id, formData);
      const item = (updated as any).data as any;
      const updatedDirectorate = mapToDirectorate(item);
      setDirectorates(prev => prev.map(directorate => 
        directorate.id === id ? updatedDirectorate : directorate
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update directorate');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDirectorate = useCallback(async (id: string, payload: { memoNumber: string; skFile: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('_method', 'DELETE');
      if (payload.memoNumber) formData.append('directorate_deleted_decree_number', payload.memoNumber);
      if (payload.skFile) formData.append('directorate_deleted_decree_file', payload.skFile);

      await directoratesService.delete(id, formData);
      setDirectorates(prev => prev.filter(directorate => directorate.id !== id));
      await fetchDirectorates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete directorate');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDirectorates]);

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

  const getDropdown = useCallback(async (search?: string): Promise<{ id: string; directorate_name: string }[]> => {
    try {
      const result = await directoratesService.getDropdown(search || '');
      return result.data || [];
    } catch (err) {
      console.error('Error fetching directorate dropdown:', err);
      return [];
    }
  }, []);

  return {
    directorates,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    filterValue,
    search,
    sortBy,
    sortOrder,

    fetchDirectorates,
    createDirectorate,
    updateDirectorate,
    deleteDirectorate,
    getDropdown,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
