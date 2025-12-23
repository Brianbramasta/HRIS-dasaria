import { useState, useCallback, useEffect } from 'react';
import { 
  TableFilter,
  CompanyListItem,
  FileSummary,
  CompanyDetailResponse,
} from '../types/OrganizationApiTypes';
import { companiesService } from '../services/request/CompaniesService';
import useFilterStore from '../../../stores/filterStore';

// Mapping helpers
const toFileSummary = (url: string | null): FileSummary | null => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1] || '';
  const ext = fileName.includes('.') ? (fileName.split('.').pop() || '') : '';
  return { fileName, fileUrl: url, fileType: ext, size: null };
};

const mapToCompany = (item: any): CompanyListItem => ({
  id: item.id ?? item.uuid_perusahaan ?? item.id ?? '',
  name: item.company_name ?? item.nama_perusahaan ?? item.name ?? '',
  description: item.company_description ?? item.deskripsi_perusahaan ?? item.description ?? null,
  businessLineId: item.id_bl ?? item.fk_uuid_lini_bisnis ?? item.businessLineId ?? null,
  businessLineName:
    item.business_line_name ?? item.businessLineName ?? item.lini_bisnis?.nama_lini_bisnis ?? item.bl_name ?? item.business_line?.bl_name ?? null,
  memoNumber: item.company_decree_number ?? item.memoNumber ?? null,
  skFile: toFileSummary(item.company_decree_file_url ?? item.company_decree_file ?? null),
  logo: item.logo ?? null,
});

export const mapToCompanyDetail = (result: any): CompanyDetailResponse => {
  const body = (result as any).data ?? {};
  const item = body.data ?? body;
  const company = mapToCompany(item);
  return {
    company: {
      id: company.id,
      name: company.name,
      logo: company.logo ?? null,
      businessLineId: company.businessLineId ?? null,
      businessLineName: company.businessLineName ?? null,
      description: company.description,
      address: item.address ?? null,
      employeeCount: item.total_employees ?? item.employee_count ?? item.employees ?? null,
      postalCode: item.postal_code ?? item.postal ?? null,
      email: item.email ?? null,
      phone: item.phone ?? null,
      industry: item.industry ?? null,
      founded: item.founded_year ?? null,
      type: item.company_type ?? item.type ?? null,
      website: item.website ?? null,
      createdAt: item.created_at ?? null,
      memoNumber: company.memoNumber ?? null,
      skFile: company.skFile ?? null,
    },
    branches: Array.isArray(item.offices)
      ? item.offices.map((o: any) => ({
          id: o.id_office ?? o.id ?? '',
          name: o.office_name ?? o.name ?? '',
          address: o.address ?? null,
          employeeCount: o.office_employee_count ?? o.employee_count ?? null,
        }))
      : [],
    documents: Array.isArray(item.documents)
      ? item.documents.map((d: any) => ({
          id: d.id?? '',
          fileName: d.cd_name ?? d.name ?? '',
          number: d.cd_decree_number ?? d.memoNumber ?? '',
          type: d.deleted_at ? 'archive' : 'active',
          fileUrl: d.cd_file ?? d.url ?? d.link ?? null,
        }))
      : [],
  };
};

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
      const result = await companiesService.getList({
        search: filter?.search ?? search,
        filter: filter?.filter ?? filterValue,
        sortBy: filter?.sortBy ?? sortBy,
        sortOrder: filter?.sortOrder ?? sortOrder,
        page: filter?.page ?? page,
        pageSize: filter?.pageSize ?? pageSize,
      });
      
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
      const currentPage = pagination?.current_page ?? filter?.page ?? page ?? 1;
      const perPage = pagination?.per_page ?? filter?.pageSize ?? pageSize ?? items.length;
      const totalPages = pagination?.last_page ?? (perPage ? Math.ceil(total / perPage) : 1);
      
      setCompanies((items || []).map(mapToCompany));
      setTotal(total);
      setTotalPages(totalPages);
      if (perPage !== pageSize) setPageSize(perPage);
      
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
      const created = await companiesService.create(payload);
      const body = (created as any).data ?? {};
      const comp = body.company ?? body.data?.company ?? body.data ?? body;
      const newCompany = mapToCompany(comp);
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
      const updated = await companiesService.update(id, payload);
      const body = (updated as any).data ?? {};
      const comp = body.company ?? body.data?.company ?? body.data ?? body;
      const updatedCompany = mapToCompany(comp);
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
      const resp = await companiesService.delete(id, payload);
      const body = (resp as any)?.data ?? {};
      const status = body?.meta?.status ?? (resp as any)?.status ?? 200;
      const success = status === 200;
      if (success) {
        await fetchCompanies();
      }
      return success;
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
  }, [search, sortBy, sortOrder, page, pageSize, filterValue, fetchCompanies]);

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
