import { useState, useCallback, useEffect } from 'react';
import { officesService } from '../services/request/offices.service';
import { OfficeListItem, TableFilter } from '../types/organization.api.types';
import useFilterStore from '../../../stores/filterStore';

interface UseOfficesReturn {
  offices: OfficeListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchOffices: (filter?: TableFilter) => Promise<void>;
  createOffice: (payload: { companyId: string; name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  updateOffice: (id: string, payload: { companyId?: string; name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deleteOffice: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useOffices = (): UseOfficesReturn => {
  const [offices, setOffices] = useState<OfficeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filterValue = useFilterStore((s) => s.filters['Office'] ?? '');

  const fetchOffices = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await officesService.getList({
        page,
        pageSize,
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
      });
      
      setOffices(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch offices');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  const createOffice = useCallback(async (officeData: { companyId: string; name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const newOffice = await officesService.create(officeData);
      setOffices(prev => [...prev, newOffice]);
      await fetchOffices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create office');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOffices]);

  const updateOffice = useCallback(async (id: string, officeData: { companyId?: string; name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedOffice = await officesService.update(id, officeData);
      setOffices(prev => prev.map(office => 
        office.id === id ? updatedOffice : office
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update office');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOffice = useCallback(async (id: string, payload: { memoNumber: string; skFile: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      await officesService.delete(id, payload);
      setOffices(prev => prev.filter(office => office.id !== id));
      await fetchOffices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete office');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOffices]);

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
    fetchOffices();
  }, [fetchOffices, filterValue]);

  return {
    offices,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    fetchOffices,
    createOffice,
    updateOffice,
    deleteOffice,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
