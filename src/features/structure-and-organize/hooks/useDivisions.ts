// Penyesuaian hooks Divisi agar sesuai kontrak API terbaru (1.7)
import { useState, useCallback, useEffect } from 'react';
import { divisionsService } from '../services/request/DivisionsService';
import { DivisionListItem, TableFilter } from '../types/OrganizationApiTypes';
import useFilterStore from '../../../stores/filterStore';

interface UseDivisionsReturn {
  divisions: DivisionListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchDivisions: (filter?: TableFilter) => Promise<void>;
  // Mengubah payload untuk menggunakan file SK (multipart/form-data)
  createDivision: (payload: { name: string; directorateId: string; description?: string | null; memoNumber: string; skFile: File; }) => Promise<void>;
  updateDivision: (id: string, payload: { name?: string; directorateId?: string; description?: string | null; memoNumber: string; skFile: File; }) => Promise<void>;
  deleteDivision: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  getDropdown: (search?: string) => Promise<DivisionListItem[]>;
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
      const response = await divisionsService.getList({
        page,
        pageSize,
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
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
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  // Menyesuaikan create agar kirim multipart sesuai kontrak API
  const createDivision = useCallback(async (divisionData: { name: string; directorateId: string; description?: string | null; memoNumber: string; skFile: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const newDivision = await divisionsService.create(divisionData);
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
      const updatedDivision = await divisionsService.update(id, divisionData);
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
  const getDropdown = useCallback(async (search?: string) => {
    return divisionsService.getDropdown(search);
  }, []);

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions, filterValue]);

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
    getDropdown,
  };
};
