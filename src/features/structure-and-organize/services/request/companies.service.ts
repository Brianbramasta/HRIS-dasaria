import { apiService } from '../../../../services/api';
import {
  PaginatedResponse,
  TableFilter,
  CompanyListItem,
  CompanyDetailResponse,
} from '../../types/organization.api.types';

const mapToCompany = (item: any): CompanyListItem => ({
  id: item.id_company ?? item.uuid_perusahaan ?? item.id ?? '',
  name: item.company_name ?? item.nama_perusahaan ?? item.name ?? '',
  description: item.company_description ?? item.deskripsi_perusahaan ?? item.description ?? null,
  businessLineId: item.id_bl ?? item.fk_uuid_lini_bisnis ?? item.businessLineId ?? null,
  businessLineName:
    item.business_line_name ?? item.businessLineName ?? item.lini_bisnis?.nama_lini_bisnis ?? null,
  memoNumber: item.company_decree_number ?? item.memoNumber ?? null,
  skFile: null,
  logo: item.logo ?? null,
});

export const companiesService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<CompanyListItem>> => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', String(filter.page));
    if (filter.pageSize) params.append('per_page', String(filter.pageSize));
    if (filter.search) params.append('filter[company_name]', filter.search);
    const qs = params.toString();
    const result = await apiService.get<any>(`/organizational-structure/companies${qs ? `?${qs}` : ''}`);
    const body = (result as any).data ?? {};
    const items = Array.isArray(body.data) ? body.data : Array.isArray(body?.data?.data) ? body.data.data : [];
    const pagination = body.pagination ?? body?.data?.pagination ?? {};
    const total = pagination.total ?? items.length ?? 0;
    const page = pagination.current_page ?? filter.page;
    const perPage = pagination.per_page ?? filter.pageSize;
    const totalPages = pagination.last_page ?? (perPage ? Math.ceil(total / perPage) : 1);
    return {
      data: (items || []).map(mapToCompany),
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  },

  getDetail: async (id: string): Promise<CompanyDetailResponse> => {
    const result = await apiService.get<any>(`/organizational-structure/companies/${id}/detail`);
    const body = (result as any).data ?? {};
    const item = body.data ?? body;
    const company = mapToCompany(item);
    return {
      company: {
        id: company.id,
        name: company.name,
        logo: company.logo ?? null,
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
        skFile: null,
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
        ? item.documents.map((d: any) => {
            return {
              fileName: d.cd_name ?? d.name ?? '',
              number: d.cd_decree_number ?? d.memoNumber ?? '',
              type: d.deleted_at ? 'archive' : 'active',
            } as any;
          })
        : [],
    };
  },

  create: async (payload: {
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
    skFile?: File | null;
  }): Promise<CompanyListItem> => {
    const formData = new FormData();
    formData.append('company_name', payload.name);
    formData.append('id_bl', payload.businessLineId);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('company_description', payload.description);
    }
    formData.append('documents[0][cd_name]', 'Dokumen');
    formData.append('documents[0][cd_decree_number]', payload.memoNumber);
    if (payload.skFile) {
      formData.append('documents[0][cd_file]', payload.skFile);
    }
    const created = await apiService.post<any>(
      '/organizational-structure/companies',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const body = (created as any).data ?? {};
    const comp = body.company ?? body.data?.company ?? body.data ?? body;
    return mapToCompany(comp);
  },

  update: async (id: string, payload: {
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
    memoNumber?: string;
    skFile?: File | null;
  }): Promise<CompanyListItem> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (payload.name !== undefined) formData.append('company_name', payload.name);
    if (payload.businessLineId !== undefined) formData.append('id_bl', payload.businessLineId);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('company_description', payload.description);
    }
    if (payload.memoNumber !== undefined || payload.skFile) {
      formData.append('documents[0][cd_name]', 'Dokumen');
      if (payload.memoNumber !== undefined) {
        formData.append('documents[0][cd_decree_number]', payload.memoNumber);
      }
      if (payload.skFile) {
        formData.append('documents[0][cd_file]', payload.skFile);
      }
    }
    const updated = await apiService.post<any>(
      `/organizational-structure/companies/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const body = (updated as any).data ?? {};
    const comp = body.company ?? body.data?.company ?? body.data ?? body;
    return mapToCompany(comp);
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('company_delete_decree_number', payload.memoNumber);
    if (payload.skFileId) formData.append('company_delete_decree_file', payload.skFileId);
    const resp = await apiService.post<any>(
      `/organizational-structure/companies/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return { success: !!(resp as any).success } as { success: true };
  },
};
