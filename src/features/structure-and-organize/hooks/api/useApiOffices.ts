import { useState, useCallback, useEffect } from 'react';
import { officesService } from '../../services/request/OfficesService';
import { OfficeListItem, TableFilter } from '../../types/OrganizationApiTypes';
import useFilterStore from '../../../../stores/filterStore';
import { toFileSummary } from '../../utils/shared/toFileSummary';
import { formatFilterValue } from '@/utils/formatFilterValue';

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
    'nama-kantor': 'office_name',
    office_name: 'office_name',
    'Deskripsi Umum': 'office_description',
    'deskripsi-umum': 'office_description',
    description: 'office_description',
    office_description: 'office_description',
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
  createOffice: (payload: { companyIds: string[]; name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  updateOffice: (id: string, payload: { companyIds?: string[]; name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deleteOffice: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<void>;
  getById: (id: string) => Promise<OfficeListItem | null>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useApiOffices = (): UseOfficesReturn => {
  const [offices, setOffices] = useState<OfficeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const filterValue = formatFilterValue(useFilterStore((s) => s.filters[s.resetKey]));

  const fetchOffices = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    try {
      const effectivePage = filter?.page ?? page;
      const effectivePageSize = filter?.pageSize ?? pageSize;
      const effectiveSearch = filter?.search ?? search;
      const effectiveSortBy = filter?.sortBy ?? sortBy;
      const effectiveSortOrder = filter?.sortOrder ?? sortOrder;
      const effectiveFilter = filter?.filter ?? filterValue;
      const params: any = { page: effectivePage, per_page: effectivePageSize };
      if (effectiveSearch) params.search = effectiveSearch;
      if (effectiveFilter) params.filter = effectiveFilter;
      if (effectiveSortBy) {
        params.column = toSortField(effectiveSortBy);
        if (effectiveSortOrder) params.sort = effectiveSortOrder;
      }
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

  // Auto-fetch when search, page, pageSize, sort, or filter changes
  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  // DOK: createOffice meneruskan companyIds ke service untuk company[n][id_company]
  const createOffice = useCallback(async (officeData: { companyIds: string[]; name: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('office_name', officeData.name);
      
      // Handle company IDs
      const ids = Array.isArray(officeData.companyIds) && officeData.companyIds.length > 0
        ? officeData.companyIds
        : [];
        
      // DOK: Sesuai api.contract.kantor.md, gunakan company[n][company_id] untuk multi-select perusahaan
      ids.forEach((id, index) => formData.append(`company[${index}][company_id]`, id));
      
      formData.append('office_decree_number', officeData.memoNumber);
      
      if (officeData.description !== undefined && officeData.description !== null) {
        formData.append('office_description', officeData.description);
      }
      
      if (officeData.skFile) {
        formData.append('office_decree_file', officeData.skFile);
      }

      const created = await officesService.create(formData);
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
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      if (officeData.name !== undefined) formData.append('office_name', officeData.name);
      
      // DOK: PATCH Kantor menggunakan company[n][id_company] untuk multi-select perusahaan
      if (Array.isArray(officeData.companyIds) && officeData.companyIds.length > 0) {
        officeData.companyIds.forEach((companyId, index) => formData.append(`company[${index}][company_id]`, companyId));
      }
      
      formData.append('office_decree_number', officeData.memoNumber);
      
      if (officeData.description !== undefined && officeData.description !== null) {
        formData.append('office_description', officeData.description);
      }
      
      if (officeData.skFile) {
        formData.append('office_decree_file', officeData.skFile);
      }

      const updated = await officesService.update(id, formData);
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
      const formData = new FormData();
      formData.append('_method', 'DELETE');
      if (payload.memoNumber) formData.append('office_delete_decree_number', payload.memoNumber);
      if (payload.skFile) formData.append('office_delete_decree_file', payload.skFile);

      await officesService.delete(id, formData);
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
