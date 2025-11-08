import { useState, useCallback, useEffect } from 'react';
import { departmentService } from '../services/organization.service';
import { Department, PaginatedResponse, TableFilter } from '../types/organization.types';

interface UseDepartmentsReturn {
  departments: Department[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchDepartments: (filter?: TableFilter) => Promise<void>;
  createDepartment: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDepartment: (id: string, department: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useDepartments = (): UseDepartmentsReturn => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchDepartments = useCallback(async (filter?: TableFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Department> = await departmentService.getAll({
        page,
        pageSize,
        search: filter?.search ?? search,
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
  }, [page, pageSize, search, sortBy, sortOrder]);

  const createDepartment = useCallback(async (departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newDepartment = await departmentService.create(departmentData);
      setDepartments(prev => [...prev, newDepartment]);
      await fetchDepartments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create department');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDepartments]);

  const updateDepartment = useCallback(async (id: string, departmentData: Partial<Department>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedDepartment = await departmentService.update(id, departmentData);
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

  const deleteDepartment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await departmentService.delete(id);
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
  }, [fetchDepartments]);

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