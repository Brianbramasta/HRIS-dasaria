import { useState, useCallback, useEffect } from 'react';
import { 
  TableFilter,
  BusinessLineListItem,
} from '../types/organization.api.types';
import { businessLinesService } from '../services/request/business-lines.service';

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
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useBusinessLines = (): UseBusinessLinesReturn => {
  const [businessLines, setBusinessLines] = useState<BusinessLineListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchBusinessLines = useCallback(async (filter?: Partial<TableFilter>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await businessLinesService.getList({
        search: filter?.search ?? search,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
        page: filter?.page ?? page,
        pageSize: filter?.pageSize ?? pageSize,
      });
      setBusinessLines(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      
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
  }, [search, sortBy, sortOrder, page, pageSize]);

  const createBusinessLine = useCallback(async (payload: { name: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<BusinessLineListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newBusinessLine = await businessLinesService.create(payload);
      await fetchBusinessLines();
      return newBusinessLine;
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
      const updatedBusinessLine = await businessLinesService.update(id, payload);
      await fetchBusinessLines();
      return updatedBusinessLine;
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
      await businessLinesService.delete(id, payload);
      await fetchBusinessLines();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete business line');
      console.error('Error deleting business line:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchBusinessLines]);

  // Initialize data on mount
  useEffect(() => {
    fetchBusinessLines();
  }, []);

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
    
    setPage,
    setPageSize,
    setSearch,
    setSort: (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      fetchBusinessLines({ sortBy: newSortBy, sortOrder: newSortOrder });
    },
  };
};