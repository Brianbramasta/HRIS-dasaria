import { useState, useCallback, useEffect } from 'react';
import { 
  TableFilter,
  CompanyListItem,
} from '../types/organization.api.types';
import { companiesService } from '../services/request/companies.service';
import useFilterStore from '../../../stores/filterStore';

interface UseCompaniesReturn {
  companies: CompanyListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchCompanies: (filter?: Partial<TableFilter>) => Promise<void>;
  createCompany: (payload: {
    name: string;
    businessLineId: string;
    description?: string | null;
    address?: string | null;
    employeeCount?: number | null;
    postalCode?: string | null;
    email?: string | null;
    phone?: string | null;
    industry?: string | null;
    founded?: string | number | null;
    type?: string | null;
    website?: string | null;
    logoFileId?: string | null;
    memoNumber: string;
    skFileId: string;
  }) => Promise<CompanyListItem | null>;
  updateCompany: (id: string, payload: {
    name?: string;
    businessLineId?: string;
    description?: string | null;
    address?: string | null;
    employeeCount?: number | null;
    postalCode?: string | null;
    email?: string | null;
    phone?: string | null;
    industry?: string | null;
    founded?: string | number | null;
    type?: string | null;
    website?: string | null;
    logoFileId?: string | null;
    memoNumber: string;
    skFileId: string;
  }) => Promise<CompanyListItem | null>;
  deleteCompany: (id: string, payload: { memoNumber: string; skFile: File; }) => Promise<boolean>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useCompanies = (): UseCompaniesReturn => {
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const filterValue = useFilterStore((s) => s.filters['Perusahaan'] ?? '');

  const fetchCompanies = useCallback(async (filter?: Partial<TableFilter>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await companiesService.getList({
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
        page: filter?.page ?? page,
        pageSize: filter?.pageSize ?? pageSize,
      });
      
      setCompanies(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      if (response.pageSize && response.pageSize !== pageSize) setPageSize(response.pageSize);
      
      if (filter?.page) setPage(filter.page);
      if (filter?.pageSize) setPageSize(filter.pageSize);
      if (filter?.search !== undefined) setSearch(filter.search);
      if (filter?.sortBy) setSortBy(filter.sortBy);
      if (filter?.sortOrder) setSortOrder(filter.sortOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  const createCompany = useCallback(async (payload: {
    name: string;
    businessLineId: string;
    description?: string | null;
    address?: string | null;
    employeeCount?: number | null;
    postalCode?: string | null;
    email?: string | null;
    phone?: string | null;
    industry?: string | null;
    founded?: string | number | null;
    type?: string | null;
    website?: string | null;
    logoFileId?: string | null;
    memoNumber: string;
    skFileId: string;
  }): Promise<CompanyListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newCompany = await companiesService.create(payload);
      await fetchCompanies();
      return newCompany;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company');
      console.error('Error creating company:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCompanies]);

  const updateCompany = useCallback(async (id: string, payload: {
    name?: string;
    businessLineId?: string;
    description?: string | null;
    address?: string | null;
    employeeCount?: number | null;
    postalCode?: string | null;
    email?: string | null;
    phone?: string | null;
    industry?: string | null;
    founded?: string | number | null;
    type?: string | null;
    website?: string | null;
    logoFileId?: string | null;
    memoNumber: string;
    skFileId: string;
  }): Promise<CompanyListItem | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCompany = await companiesService.update(id, payload);
      await fetchCompanies();
      return updatedCompany;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company');
      console.error('Error updating company:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCompanies]);

  const deleteCompany = useCallback(async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await companiesService.delete(id, payload);
      await fetchCompanies();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company');
      console.error('Error deleting company:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCompanies]);

  useEffect(() => {
    fetchCompanies();
  }, [search, sortBy, sortOrder, page, pageSize, filterValue]);

  return {
    companies,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    
    setPage,
    setPageSize,
    setSearch,
    setSort: (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    },
  };
};
