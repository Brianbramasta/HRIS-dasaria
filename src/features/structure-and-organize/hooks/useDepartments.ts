// Penyesuaian hooks Departemen agar sesuai kontrak API 1.7 (departments)
import { useState, useCallback, useEffect } from 'react';
import { departmentsService } from '../services/request/DepartmentsService';
import { DepartmentListItem, TableFilter } from '../types/OrganizationApiTypes';
import useFilterStore from '../../../stores/filterStore';

interface UseDepartmentsReturn {
  departments: DepartmentListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchDepartments: (filter?: TableFilter) => Promise<void>;
  createDepartment: (payload: { name: string; divisionId: string; description?: string | null; memoNumber: string; skFile: File; }) => Promise<void>;
  updateDepartment: (id: string, payload: { name?: string; divisionId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }) => Promise<void>;
  deleteDepartment: (id: string, payload: { memoNumber: string; skFile?: File; }) => Promise<void>;
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
      const response = await departmentsService.getList({
        page,
        pageSize,
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
      });
      
      setDepartments(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
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
      const newDepartment = await departmentsService.create(departmentData);
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
      const updatedDepartment = await departmentsService.update(id, departmentData);
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

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments, filterValue]);

  return {
    departments,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
