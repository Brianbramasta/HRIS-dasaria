import { useState, useCallback } from 'react';
import { officesService } from '../services/request/OfficesService';
import { OfficeListItem, TableFilter } from '../types/OrganizationApiTypes';
import useFilterStore from '../../../stores/filterStore';
import { toFileSummary } from '../utils/shared/index';


export const mapToOffice = (item: any): OfficeListItem => ({
  id: item.id ?? item.id ?? '',
  name: item.office_name ?? item.name ?? '',
  description: item.office_description ?? item.description ?? null,
  memoNumber: item.office_decree_number ?? item.memoNumber ?? null,
  skFile: toFileSummary(item.office_decree_file_url ?? item.office_decree_file ?? null),
  companyId: item.id_company ?? null,
  companyIds: Array.isArray(item.companies)
    ? item.companies.map((company: any) => company.id ?? company.id_company ?? null).filter(Boolean)
    : item.id_company ? [item.id_company] : [],
});

// Map UI sort field to API column
const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'office_name',
    'Nama Kantor': 'office_name',
    'Deskripsi Umum': 'office_description',
  };
  return map[field || ''] || 'office_name';
};

interface UseOfficesReturn {
  offices: OfficeListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filterValue: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;

  // Actions
  fetchOffices: (filter?: TableFilter) => Promise<void>;
  // DOK: createOffice kini mendukung multi-select perusahaan melalui companyIds
  createOffice: (payload: { companyIds: string[]; name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  // DOK: updateOffice mendukung multi-select perusahaan melalui companyIds
  updateOffice: (id: string, payload: { companyIds?: string[]; name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deleteOffice: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<void>;
  getById: (id: string) => Promise<OfficeListItem | null>;
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const filterValue = useFilterStore((s) => s.filters['Kantor'] ?? '');

  const fetchOffices = useCallback(async (filter?: TableFilter) => {
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
      const result = await officesService.getList(params);
      const payload = (result as any);
      const items = payload?.data?.data ?? [];
      const total = payload?.data?.total ?? (items?.length || 0);
      const perPage = payload?.data?.per_page ?? pageSize;
      const totalPagesCount = perPage ? Math.ceil(total / perPage) : 1;
      setOffices((items || []).map(mapToOffice));
      setTotal(total);
      setTotalPages(totalPagesCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch offices');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  // DOK: createOffice meneruskan companyIds ke service untuk company[n][id_company]
  const createOffice = useCallback(async (officeData: { companyIds: string[]; name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const created = await officesService.create(officeData as any);
      const item = (created as any).data as any;
      const newOffice = mapToOffice(item);
      setOffices(prev => [...prev, newOffice]);
      await fetchOffices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create office');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOffices]);

  // DOK: updateOffice meneruskan companyIds ke service untuk company[n][id_company]
  const updateOffice = useCallback(async (id: string, officeData: { companyIds?: string[]; name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await officesService.update(id, officeData as any);
      const item = (updated as any).data as any;
      const updatedOffice = mapToOffice(item);
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

  const getById = useCallback(async (id: string): Promise<OfficeListItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const detail = await officesService.getById(id);
      return mapToOffice(detail.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get office');
      console.error('Error getting office by id:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    offices,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    filterValue,
    search,
    sortBy,
    sortOrder,
    fetchOffices,
    createOffice,
    updateOffice,
    deleteOffice,
    getById,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
