import { useState, useCallback, useEffect } from 'react';
import { 
  Company, 
  // PaginatedResponse, 
  TableFilter 
} from '../types/organization.types';
import { companyService } from '../services/organization.service';

interface UseCompaniesReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Actions
  fetchCompanies: (filter?: Partial<TableFilter>) => Promise<void>;
  createCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Company | null>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Search & Filter
  setSearch: (search: string) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export const useCompanies = (): UseCompaniesReturn => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchCompanies = useCallback(async (filter?: Partial<TableFilter>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await companyService.getAll({
        search: filter?.search ?? search,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
        page: filter?.page ?? page,
        pageSize: filter?.pageSize ?? pageSize,
      });
      
      setCompanies(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      
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
  }, [search, sortBy, sortOrder, page, pageSize]);

  const createCompany = useCallback(async (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newCompany = await companyService.create(company);
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

  const updateCompany = useCallback(async (id: string, company: Partial<Company>): Promise<Company | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCompany = await companyService.update(id, company);
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

  const deleteCompany = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await companyService.delete(id);
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

  // Initialize data on mount
  useEffect(() => {
    fetchCompanies();
  }, []);

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
      fetchCompanies({ sortBy: newSortBy, sortOrder: newSortOrder });
    },
  };
};