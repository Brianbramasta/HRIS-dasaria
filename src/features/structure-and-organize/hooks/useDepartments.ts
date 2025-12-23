// Penyesuaian hooks Departemen agar sesuai kontrak API 1.7 (departments)
import { useState, useCallback, useEffect } from 'react';
import { departmentsService } from '../services/request/DepartmentsService';
import { DepartmentListItem, TableFilter, FileSummary } from '../types/OrganizationApiTypes';
import useFilterStore from '../../../stores/filterStore';

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

export const mapToDepartment = (item: any): DepartmentListItem => ({
  id: item.id ?? item.id ?? '',
  name: item.department_name ?? item.name ?? '',
  description: item.department_description ?? item.description ?? null,
  divisionId: item.division_id ?? null,
  divisionName: item.division_name ?? null,
  memoNumber: item.department_decree_number ?? null,
  skFile: toFileSummary(item.department_decree_file_url ?? item.department_decree_file ?? null),
});

interface UseDepartmentsReturn {
  departments: DepartmentListItem[];
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
  fetchDepartments: (filter?: TableFilter) => Promise<void>;
  createDepartment: (payload: { name: string; divisionId: string; description?: string | null; memoNumber: string; skFile: File; }) => Promise<void>;
  updateDepartment: (id: string, payload: { name?: string; divisionId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deleteDepartment: (id: string, payload: { memoNumber: string; skFile?: File; }) => Promise<void>;
  getById: (id: string) => Promise<DepartmentListItem | null>;
  getDropdown: (search?: string) => Promise<{ id: string; department_name: string }[]>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useDepartments = (): UseDepartmentsReturn => {
  const [departments, setDepartments] = useState<DepartmentListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filterValue = useFilterStore((s) => s.filters['Departemen'] ?? '');

  const fetchDepartments = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await departmentsService.getList({
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
      
      setDepartments((items || []).map(mapToDepartment));
      setTotal(total);
      setTotalPages(totalPagesCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sortBy, sortOrder, filterValue]);

  // Create Departemen menggunakan multipart sesuai kontrak API
  const createDepartment = useCallback(async (departmentData: { name: string; divisionId: string; description?: string | null; memoNumber: string; skFile: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const created = await departmentsService.create(departmentData);
      const item = (created as any).data as any;
      const newDepartment = mapToDepartment(item);
      setDepartments(prev => [...prev, newDepartment]);
      await fetchDepartments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create department');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDepartments]);

  // Update Departemen menggunakan POST + _method=PATCH multipart
  const updateDepartment = useCallback(async (id: string, departmentData: { name?: string; divisionId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await departmentsService.update(id, departmentData);
      const item = (updated as any).data as any;
      const updatedDepartment = mapToDepartment(item);
      setDepartments(prev => prev.map(department => 
        department.id === id ? updatedDepartment : department
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update department');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete Departemen menggunakan POST + _method=DELETE multipart
  const deleteDepartment = useCallback(async (id: string, payload: { memoNumber: string; skFile?: File; }) => {
    setLoading(true);
    setError(null);
    
    try {
      await departmentsService.delete(id, payload);
      setDepartments(prev => prev.filter(department => department.id !== id));
      await fetchDepartments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete department');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDepartments]);

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

  const getById = useCallback(async (id: string): Promise<DepartmentListItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const detail = await departmentsService.getById(id);
      return mapToDepartment(detail.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get department');
      console.error('Error getting department by id:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDropdown = useCallback(async (search?: string): Promise<{ id: string; department_name: string }[]> => {
    try {
      const result = await departmentsService.getDropdown(search || '');
      return result.data || [];
    } catch (err) {
      console.error('Error fetching department dropdown:', err);
      return [];
    }
  }, []);

  

  return {
    departments,
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
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getById,
    getDropdown,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
