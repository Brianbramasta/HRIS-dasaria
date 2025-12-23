// Penyesuaian hooks Jabatan agar sesuai kontrak API 1.7 (job-title)
import { useState, useCallback } from 'react';
import { positionsService } from '../services/request/PositionService';
import { PositionListItem, TableFilter } from '../types/OrganizationApiTypes';
import useFilterStore from '../../../stores/filterStore';
import { toFileSummary } from '../utils/shared/index';


export const mapToPosition = (item: any): PositionListItem => ({
  id: item.id ?? item.id ?? '',
  name: item.job_title_name ?? item.name ?? '',
  grade: item.grade ?? null,
  jobDescription: item.job_title_description ?? item.description ?? null,
  directSubordinates: typeof item.direct_subordinate === 'string'
    ? item.direct_subordinate.split(',').map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(item.direct_subordinate) ? item.direct_subordinate : [],
  memoNumber: item.job_title_decree_number ?? null,
  skFile: toFileSummary(item.job_title_decree_file_url ?? item.job_title_decree_file ?? null),
});

// Map UI sort field to API column
const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'job_title_name',
    'Nama Posisi': 'job_title_name',
    'Nama Jabatan': 'job_title_name',
    'Jabatan': 'job_title_name',
    grade: 'grade',
  };
  return map[field || ''] || 'job_title_name';
};

interface UsePositionsReturn {
  positions: PositionListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filterValue: string;

  // Actions
  fetchPositions: (filter?: TableFilter) => Promise<void>;
  createPosition: (payload: { name: string; grade?: string | null; jobDescription?: string | null; directSubordinates?: string[]; memoNumber: string; skFile: File; }) => Promise<void>;
  updatePosition: (id: string, payload: { name?: string; grade?: string | null; jobDescription?: string | null; directSubordinates?: string[]; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deletePosition: (id: string, payload: { memoNumber: string; skFile?: File; }) => Promise<void>;
  detail: (id: string) => Promise<PositionListItem | null>;
  getDropdown: (search?: string) => Promise<{ id: string; job_title_name: string }[]>;
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
      const params = {
        page: filter?.page ?? page,
        per_page: filter?.pageSize ?? pageSize,
        search: filter?.search ?? search,
        column: filter?.sortBy ? toSortField(filter.sortBy) : toSortField(sortBy),
        sort: filter?.sortOrder ?? sortOrder ?? undefined,
        filter: filter?.filter ?? filterValue,
      };
      const result = await positionsService.getList(params);
      
      const payload = (result as any);
      const items = payload?.data?.data ?? [];
      const total = payload?.data?.total ?? (items?.length || 0);
      // const currentPage = payload?.data?.current_page ?? page;
      const perPage = payload?.data?.per_page ?? pageSize;
      const totalPagesCount = perPage ? Math.ceil(total / perPage) : 1;
      
      setPositions((items || []).map(mapToPosition));
      setTotal(total);
      setTotalPages(totalPagesCount);
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
      const created = await positionsService.create(positionData);
      const item = (created as any).data as any;
      const newPosition = mapToPosition(item);
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
      const updated = await positionsService.update(id, positionData);
      const item = (updated as any).data as any;
      const updatedPosition = mapToPosition(item);
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

  const detail = useCallback(async (id: string): Promise<PositionListItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await positionsService.detail(id);
      return mapToPosition(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get position detail');
      console.error('Error getting position detail:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDropdown = useCallback(async (search?: string): Promise<{ id: string; job_title_name: string }[]> => {
    try {
      const result = await positionsService.getDropdown(search || '');
      return result.data || [];
    } catch (err) {
      console.error('Error fetching position dropdown:', err);
      return [];
    }
  }, []);

  

  return {
    positions,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    search,
    sortBy,
    sortOrder,
    filterValue,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
    detail,
    getDropdown,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
