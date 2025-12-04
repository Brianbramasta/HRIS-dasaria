import { useState, useCallback, useEffect } from 'react';
import { directoratesService } from '../services/request/directorates.service';
import { DirectorateListItem, TableFilter } from '../types/organization.api.types';
import useFilterStore from '../../../stores/filterStore';

interface UseDirectoratesReturn {
  directorates: DirectorateListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchDirectorates: (filter?: TableFilter) => Promise<void>;
  createDirectorate: (payload: { name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  updateDirectorate: (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deleteDirectorate: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc' ) => void;
}

export const useDirectorates = (): UseDirectoratesReturn => {
  const [directorates, setDirectorates] = useState<DirectorateListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filterValue = useFilterStore((s) => s.filters['Direktorat'] ?? '');

  const fetchDirectorates = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await directoratesService.getList({
        page,
        pageSize,
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
      });
      
      setDirectorates(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch directorates');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  const createDirectorate = useCallback(async (directorateData: { name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const newDirectorate = await directoratesService.create(directorateData);
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
      const updatedDirectorate = await directoratesService.update(id, directorateData);
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
      await directoratesService.delete(id, payload);
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

  useEffect(() => {
    fetchDirectorates();
  }, [fetchDirectorates, filterValue]);

  return {
    directorates,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    fetchDirectorates,
    createDirectorate,
    updateDirectorate,
    deleteDirectorate,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
