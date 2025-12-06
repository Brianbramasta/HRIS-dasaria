// Penyesuaian hooks Jabatan agar sesuai kontrak API 1.7 (job-title)
import { useState, useCallback, useEffect } from 'react';
import { positionsService } from '../services/request/positions.service';
import { PositionListItem, TableFilter } from '../types/organization.api.types';
import useFilterStore from '../../../stores/filterStore';

interface UsePositionsReturn {
  positions: PositionListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchPositions: (filter?: TableFilter) => Promise<void>;
  createPosition: (payload: { name: string; grade?: string | null; jobDescription?: string | null; directSubordinates?: string[]; memoNumber: string; skFile: File; }) => Promise<void>;
  updatePosition: (id: string, payload: { name?: string; grade?: string | null; jobDescription?: string | null; directSubordinates?: string[]; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deletePosition: (id: string, payload: { memoNumber: string; skFile?: File; }) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const usePositions = (): UsePositionsReturn => {
  const [positions, setPositions] = useState<PositionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filterValue = useFilterStore((s) => s.filters['Jabatan'] ?? '');

  const fetchPositions = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await positionsService.getList({
        page,
        pageSize,
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
      });
      
      setPositions(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  // Create Jabatan menggunakan multipart sesuai kontrak API
  const createPosition = useCallback(async (positionData: { name: string; grade?: string | null; jobDescription?: string | null; directSubordinates?: string[]; memoNumber: string; skFile: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const newPosition = await positionsService.create(positionData);
      setPositions(prev => [...prev, newPosition]);
      await fetchPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPositions]);

  // Update Jabatan menggunakan POST + _method=PATCH multipart
  const updatePosition = useCallback(async (id: string, positionData: { name?: string; grade?: string | null; jobDescription?: string | null; directSubordinates?: string[]; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedPosition = await positionsService.update(id, positionData);
      setPositions(prev => prev.map(position => 
        position.id === id ? updatedPosition : position
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete Jabatan menggunakan POST + _method=DELETE multipart
  const deletePosition = useCallback(async (id: string, payload: { memoNumber: string; skFile?: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      await positionsService.delete(id, payload);
      setPositions(prev => prev.filter(position => position.id !== id));
      await fetchPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPositions]);

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
    fetchPositions();
  }, [fetchPositions, filterValue]);

  return {
    positions,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
