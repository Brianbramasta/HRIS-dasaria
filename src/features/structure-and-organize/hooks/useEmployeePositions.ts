import { useState, useCallback } from 'react';
import { employeePositionsService } from '../services/request/employeePositions.service';
import { EmployeePositionListItem, TableFilter } from '../types/organization.api.types';
import useFilterStore from '../../../stores/filterStore';

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
      // Dokumentasi: dukung override page & pageSize dari parameter agar event eksternal tidak membaca state lama
      const response = await employeePositionsService.getList({
        page: filter?.page ?? page,
        pageSize: filter?.pageSize ?? pageSize,
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
      });
      
      setEmployeePositions(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
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
      const newEmployeePosition = await employeePositionsService.create(employeePositionData);
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
      const updatedEmployeePosition = await employeePositionsService.update(id, employeePositionData);
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
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
  };
};
