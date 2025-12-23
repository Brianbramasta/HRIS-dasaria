import { useState, useCallback } from 'react';
import { employeePositionsService } from '../services/request/EmployeePositionsService';
import { EmployeePositionListItem, TableFilter } from '../types/OrganizationApiTypes';
import useFilterStore from '../../../stores/filterStore';
import { toFileSummary } from '../utils/shared/toFileSummary';

// Mapping helpers

export const mapToEmployeePosition = (item: any): EmployeePositionListItem => ({
  id: item.id ?? item.id ?? '',
  name: item.position_name ?? item.name ?? '',
  positionId: item.job_title_id ?? item.positionId ?? null,
  positionName: item.job_title_name ?? item.positionName ?? null,
  directorateId: item.directorate_id ?? item.directorateId ?? null,
  directorateName: item.directorate_name ?? item.directorateName ?? null,
  divisionId: item.division_id ?? item.divisionId ?? null,
  divisionName: item.division_name ?? item.divisionName ?? null,
  departmentId: item.department_id ?? item.departmentId ?? null,
  departmentName: item.department_name ?? item.departmentName ?? null,
  description: item.position_description ?? item.description ?? null,
  startDate: item.start_date ?? item.startDate ?? null,
  endDate: item.end_date ?? item.endDate ?? null,
  memoNumber: item.position_decree_number ?? item.memoNumber ?? null,
  skFile: toFileSummary(item.position_decree_file_url ?? item.position_decree_file ?? null),
});

// Map UI sort field to API column
const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'position_name',
    'Nama Posisi': 'position_name',
    'Nama Jabatan': 'job_title_name',
    Jabatan: 'job_title_name',
  };
  return map[field || ''] || 'position_name';
};

interface UseEmployeePositionsReturn {
  employeePositions: EmployeePositionListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  // Dokumentasi: izinkan Partial agar page memanggil dengan subset filter
  fetchEmployeePositions: (filter?: Partial<TableFilter>) => Promise<void>;
  createEmployeePosition: (payload: {
    name: string;
    positionId: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }) => Promise<void>;
  updateEmployeePosition: (id: string, payload: {
    name?: string;
    positionId?: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }) => Promise<void>;
  deleteEmployeePosition: (id: string, payload: { memoNumber: string; skFileId: string; }) => Promise<void>;
  detail: (id: string) => Promise<EmployeePositionListItem | null>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

// Penyesuaian besar: hooks Posisi Pegawai disesuaikan untuk pagination eksternal DataTable
export const useEmployeePositions = (): UseEmployeePositionsReturn => {
  const [employeePositions, setEmployeePositions] = useState<EmployeePositionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  // Dokumentasi: set default sort 'Nama Posisi' dan hindari auto-fetch berulang
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filterValue = useFilterStore((s) => s.filters['Posisi Pegawai'] ?? '');

  // Dokumentasi: menerima Partial<TableFilter>, kombinasikan dengan state lokal
  const fetchEmployeePositions = useCallback(async (filter?: Partial<TableFilter>) => {
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
      const result = await employeePositionsService.getList(params);
      
      const payload = (result as any);
      const topData = payload?.data;
      const items = Array.isArray(topData)
        ? topData
        : Array.isArray(topData?.data)
          ? topData.data
          : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];
      const pagination = payload?.pagination ?? (Array.isArray(topData) ? undefined : topData) ?? {};
      const total = pagination?.total ?? items.length ?? 0;
      // const currentPage = pagination?.current_page ?? filter?.page ?? page ?? 1;
      const perPage = pagination?.per_page ?? filter?.pageSize ?? pageSize ?? items.length;
      const totalPagesCount = pagination?.last_page ?? (perPage ? Math.ceil(total / perPage) : 1);
      
      setEmployeePositions((items || []).map(mapToEmployeePosition));
      setTotal(total);
      setTotalPages(totalPagesCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee positions');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  // Dokumentasi: createEmployeePosition - kirim File asli via service
  const createEmployeePosition = useCallback(async (employeePositionData: {
    name: string;
    positionId: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const created = await employeePositionsService.create(employeePositionData);
      const body = (created as any).data ?? {};
      const item = body?.data ?? body;
      const newEmployeePosition = mapToEmployeePosition(item);
      setEmployeePositions(prev => [...prev, newEmployeePosition]);
      await fetchEmployeePositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue, fetchEmployeePositions]);

  // Dokumentasi: updateEmployeePosition - kirim File asli via service
  const updateEmployeePosition = useCallback(async (id: string, employeePositionData: {
    name?: string;
    positionId?: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await employeePositionsService.update(id, employeePositionData);
      const body = (updated as any).data ?? {};
      const item = body?.data ?? body;
      const updatedEmployeePosition = mapToEmployeePosition(item);
      setEmployeePositions(prev => prev.map(employeePosition => 
        employeePosition.id === id ? updatedEmployeePosition : employeePosition
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmployeePosition = useCallback(async (id: string, payload: { memoNumber: string; skFileId: string; }) => {
    setLoading(true);
    setError(null);
    
    try {
      await employeePositionsService.delete(id, payload);
      setEmployeePositions(prev => prev.filter(employeePosition => employeePosition.id !== id));
      await fetchEmployeePositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEmployeePositions]);

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

  const detail = useCallback(async (id: string): Promise<EmployeePositionListItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await employeePositionsService.detail(id);
      return mapToEmployeePosition(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get employee position detail');
      console.error('Error getting employee position detail:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Dokumentasi: tidak auto-fetch di hook agar initial fetch di Page hanya terjadi sekali
  // (Page memanggil fetchEmployeePositions() saat mount sehingga sort default hanya berjalan sekali)

  return {
    employeePositions,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    fetchEmployeePositions,
    createEmployeePosition,
    updateEmployeePosition,
    deleteEmployeePosition,
    detail,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
