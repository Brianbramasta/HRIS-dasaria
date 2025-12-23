// Penyesuaian hooks Divisi agar sesuai kontrak API terbaru (1.7)
import { useState, useCallback, useEffect } from 'react';
import { divisionsService } from '../services/request/DivisionsService';
import { DivisionListItem, TableFilter, FileSummary } from '../types/OrganizationApiTypes';
import useFilterStore from '../../../stores/filterStore';

// Mapping helpers
const toFileSummary = (url: string | null): FileSummary | null => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1] || '';
  const ext = fileName.includes('.') ? (fileName.split('.').pop() || '') : '';
  return {
    fileName,
    fileUrl: url,
    fileType: ext,
    size: null,
  };
};

export const mapToDivision = (item: any): DivisionListItem => ({
  id: item.id ?? '',
  name: item.division_name ?? item.name ?? '',
  description: item.division_description ?? item.description ?? null,
  directorateId: item.directorate_id ?? null,
  directorateName: item.directorate_name ?? null,
  memoNumber: item.division_decree_number ?? null,
  skFile: toFileSummary(item.division_decree_file_url ?? item.division_decree_file ?? null),
});

interface UseDivisionsReturn {
  divisions: DivisionListItem[];
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
  fetchDivisions: (filter?: TableFilter) => Promise<void>;
  // Mengubah payload untuk menggunakan file SK (multipart/form-data)
  createDivision: (payload: { name: string; directorateId: string; description?: string | null; memoNumber: string; skFile: File; }) => Promise<void>;
  updateDivision: (id: string, payload: { name?: string; directorateId?: string; description?: string | null; memoNumber: string; skFile: File; }) => Promise<void>;
  deleteDivision: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<void>;
  getDropdown: (search?: string) => Promise<{ id: string; division_name: string }[]>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useDivisions = (): UseDivisionsReturn => {
  const [divisions, setDivisions] = useState<DivisionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filterValue = useFilterStore((s) => s.filters['Divisi'] ?? '');

  const fetchDivisions = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await divisionsService.getList({
        page,
        pageSize,
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
      });
      
      const payload = (result as any);
      const items = payload?.data?.data ?? [];
      const total = payload?.data?.total ?? (items?.length || 0);
      const currentPage = payload?.data?.current_page ?? page;
      const perPage = payload?.data?.per_page ?? pageSize;
      const totalPagesCount = perPage ? Math.ceil(total / perPage) : 1;
      
      setDivisions((items || []).map(mapToDivision));
      setTotal(total);
      setTotalPages(totalPagesCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch divisions');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  // Menyesuaikan create agar kirim multipart sesuai kontrak API
  const createDivision = useCallback(async (divisionData: { name: string; directorateId: string; description?: string | null; memoNumber: string; skFile: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const created = await divisionsService.create(divisionData);
      const item = (created as any).data as any;
      const newDivision = mapToDivision(item);
      setDivisions(prev => [...prev, newDivision]);
      await fetchDivisions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create division');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDivisions]);

  // Menyesuaikan update agar kirim POST + _method=PATCH multipart
  const updateDivision = useCallback(async (id: string, divisionData: { name?: string; directorateId?: string; description?: string | null; memoNumber: string; skFile: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await divisionsService.update(id, divisionData);
      const item = (updated as any).data as any;
      const updatedDivision = mapToDivision(item);
      setDivisions(prev => prev.map(division => 
        division.id === id ? updatedDivision : division
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update division');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Menyesuaikan delete agar kirim POST + _method=DELETE multipart
  const deleteDivision = useCallback(async (id: string, payload: { memoNumber: string; skFile: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      await divisionsService.delete(id, payload);
      setDivisions(prev => prev.filter(division => division.id !== id));
      await fetchDivisions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete division');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDivisions]);

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

  // Optional: menyediakan helper dropdown divisi sesuai kebutuhan form
  const getDropdown = useCallback(async (search?: string): Promise<{ id: string; division_name: string }[]> => {
    try {
      const result = await divisionsService.getDropdown(search || '');
      return result.data || [];
    } catch (err) {
      console.error('Error fetching division dropdown:', err);
      return [];
    }
  }, []);

  

  

  return {
    divisions,
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
    fetchDivisions,
    createDivision,
    updateDivision,
    deleteDivision,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
    getDropdown,
  };
};
