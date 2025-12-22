import { useState, useCallback, useEffect } from 'react';
import { directoratesService } from '../services/request/DirectoratesService';
import { DirectorateListItem, TableFilter, FileSummary } from '../types/OrganizationApiTypes';
import useFilterStore from '../../../stores/filterStore';
import { addNotification } from '../../../stores/notificationStore';
import { formatUrlFile } from '../../../utils/formatUrlFile';
import type { DirectorateRow } from '../types/OrganizationTableTypes';

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

const mapToDirectorate = (item: any): DirectorateListItem => ({
  id: item.id ?? item.id ?? '',
  name: item.directorate_name ?? item.name ?? '',
  description: item.directorate_description ?? item.description ?? null,
  memoNumber: item.directorate_decree_number ?? item.memoNumber ?? null,
  skFile: toFileSummary(item.directorate_decree_file_url ?? item.directorate_decree_file ?? null),
});

interface UseDirectoratesReturn {
  directorates: DirectorateListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rows: DirectorateRow[];
  
  // Actions
  fetchDirectorates: (filter?: TableFilter) => Promise<void>;
  createDirectorate: (payload: { name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  updateDirectorate: (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deleteDirectorate: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc'  ) => void;
  exportToCSV: (filename: string) => void;
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
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
  const filterValue = useFilterStore((s) => s.filters['Direktorat'] ?? '');

  // Map directorates to table rows
  const rows: DirectorateRow[] = (directorates || []).map((d, idx) => ({
    no: idx + 1,
    'direktorat-name': d.name ?? '—',
    'deskripsi-umum': d.description ?? '—',
    'file-sk-dan-memo': d.skFile ?? '-',
    fileUrl: d.skFile?.fileUrl ?? null,
    raw: d,
  }));

  const fetchDirectorates = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await directoratesService.getList({
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
      
      setDirectorates((items || []).map(mapToDirectorate));
      setTotal(total);
      setTotalPages(totalPagesCount);
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
      const created = await directoratesService.create(directorateData);
      const item = (created as any).data as any;
      const newDirectorate = mapToDirectorate(item);
      setDirectorates(prev => [...prev, newDirectorate]);
      await fetchDirectorates();
      addNotification({
        description: 'Direktorat berhasil ditambahkan',
        variant: 'success',
        hideDuration: 4000,
        title: 'Direktorat ditambahkan',
      });
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
      const updated = await directoratesService.update(id, directorateData);
      const item = (updated as any).data as any;
      const updatedDirectorate = mapToDirectorate(item);
      setDirectorates(prev => prev.map(directorate => 
        directorate.id === id ? updatedDirectorate : directorate
      ));
      addNotification({
        description: 'Direktorat berhasil diupdate',
        variant: 'success',
        hideDuration: 4000,
        title: 'Direktorat diupdate',
      });
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
      addNotification({
        description: 'Direktorat berhasil dihapus',
        variant: 'success',
        hideDuration: 4000,
        title: 'Direktorat dihapus',
      });
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

  // Export directorates to CSV
  const exportToCSV = useCallback((filename: string) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]).filter(key => key !== 'raw' && key !== 'fileUrl');
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [rows]);

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
    rows,
    fetchDirectorates,
    createDirectorate,
    updateDirectorate,
    deleteDirectorate,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
    exportToCSV,
  };
};
