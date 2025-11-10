import { useState, useCallback, useEffect } from 'react';
import { directorateService } from '../services/organization.service';
import { Directorate, PaginatedResponse, TableFilter } from '../types/organization.types';

interface UseDirectoratesReturn {
  directorates: Directorate[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchDirectorates: (filter?: TableFilter) => Promise<void>;
  createDirectorate: (directorate: Omit<Directorate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDirectorate: (id: string, directorate: Partial<Directorate>) => Promise<void>;
  deleteDirectorate: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useDirectorates = (): UseDirectoratesReturn => {
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchDirectorates = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Directorate> = await directorateService.getAll({
        page,
        pageSize,
        search: filter?.search ?? search,
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
  }, [page, pageSize, search, sortBy, sortOrder]);

  const createDirectorate = useCallback(async (directorateData: Omit<Directorate, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newDirectorate = await directorateService.create(directorateData);
      setDirectorates(prev => [...prev, newDirectorate]);
      await fetchDirectorates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create directorate');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDirectorates]);

  const updateDirectorate = useCallback(async (id: string, directorateData: Partial<Directorate>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedDirectorate = await directorateService.update(id, directorateData);
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

  const deleteDirectorate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await directorateService.delete(id);
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
  }, [fetchDirectorates]);

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