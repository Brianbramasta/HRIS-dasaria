import { useState, useCallback, useEffect } from 'react';
import { divisionService } from '../services/organization.service';
import { Division, PaginatedResponse, TableFilter } from '../types/organization.types';

interface UseDivisionsReturn {
  divisions: Division[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchDivisions: (filter?: TableFilter) => Promise<void>;
  createDivision: (division: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDivision: (id: string, division: Partial<Division>) => Promise<void>;
  deleteDivision: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useDivisions = (): UseDivisionsReturn => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchDivisions = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Division> = await divisionService.getAll({
        page,
        pageSize,
        search: filter?.search ?? search,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
      });
      
      setDivisions(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch divisions');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder]);

  const createDivision = useCallback(async (divisionData: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newDivision = await divisionService.create(divisionData);
      setDivisions(prev => [...prev, newDivision]);
      await fetchDivisions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create division');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDivisions]);

  const updateDivision = useCallback(async (id: string, divisionData: Partial<Division>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedDivision = await divisionService.update(id, divisionData);
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

  const deleteDivision = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await divisionService.delete(id);
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

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  return {
    divisions,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    fetchDivisions,
    createDivision,
    updateDivision,
    deleteDivision,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};