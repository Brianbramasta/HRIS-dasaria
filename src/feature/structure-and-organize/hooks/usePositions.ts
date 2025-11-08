import { useState, useCallback, useEffect } from 'react';
import { positionService } from '../services/organization.service';
import { Position, PaginatedResponse, TableFilter } from '../types/organization.types';

interface UsePositionsReturn {
  positions: Position[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchPositions: (filter?: TableFilter) => Promise<void>;
  createPosition: (position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePosition: (id: string, position: Partial<Position>) => Promise<void>;
  deletePosition: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const usePositions = (): UsePositionsReturn => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchPositions = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Position> = await positionService.getAll({
        page,
        pageSize,
        search: filter?.search ?? search,
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
  }, [page, pageSize, search, sortBy, sortOrder]);

  const createPosition = useCallback(async (positionData: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newPosition = await positionService.create(positionData);
      setPositions(prev => [...prev, newPosition]);
      await fetchPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPositions]);

  const updatePosition = useCallback(async (id: string, positionData: Partial<Position>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedPosition = await positionService.update(id, positionData);
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

  const deletePosition = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await positionService.delete(id);
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
  }, [fetchPositions]);

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