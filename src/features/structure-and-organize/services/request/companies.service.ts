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
    item.business_line_name ?? item.businessLineName ?? item.lini_bisnis?.nama_lini_bisnis ?? item.bl_name ?? null,
  memoNumber: item.company_decree_number ?? item.memoNumber ?? null,
  skFile: null,
  logo: item.logo ?? null,
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'company_name',
    'Nama Perusahaan': 'company_name',
    'Deskripsi Umum': 'company_description',
    'Lini Bisnis': 'business_line_name',
  };
  return map[field || ''] || 'company_name';
};

const appendFilters = (params: URLSearchParams, filter?: string | string[]) => {
  if (!filter) return;
  const values = Array.isArray(filter)
    ? filter
    : String(filter)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
  values.forEach((v) => params.append('filter[]', v));
};

export const companiesService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<CompanyListItem>> => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', String(filter.page));
    if (filter.pageSize) params.append('per_page', String(filter.pageSize));
    if (filter.search) params.append('search', filter.search);
    appendFilters(params, filter.filter);
    if (filter.sortBy && filter.sortOrder) {
      params.append('column', toSortField(filter.sortBy));
      params.append('sort', filter.sortOrder);
    }
    const qs = params.toString();
    const result = await apiService.get<any>(`/organizational-structure/companies${qs ? `?${qs}` : ''}`);
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
    const page = pagination?.current_page ?? filter.page ?? 1;
    const perPage = pagination?.per_page ?? filter.pageSize ?? items.length;
    const totalPages = pagination?.last_page ?? (perPage ? Math.ceil(total / perPage) : 1);

    console.log('data1', items);
    console.log('mapToCompany1', mapToCompany);
    return {
      data: (items || []).map(mapToCompany),
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  },

  getDropdown: async (): Promise<Array<{ id: string; name: string }>> => {
    const result = await apiService.get<any>(`/organizational-structure/companies-dropdown`);
    const body = (result as any)?.data ?? {};
    const items = Array.isArray(body)
      ? body
      : Array.isArray(body?.data)
        ? body.data
        : Array.isArray((result as any)?.data?.data)
          ? (result as any).data.data
          : [];
    return (items || []).map((it: any) => ({
      id: it.id_company ?? it.uuid_perusahaan ?? it.id ?? '',
      name: it.company_name ?? it.nama_perusahaan ?? it.name ?? '',
    }));
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

  create: async (payload: any): Promise<CompanyListItem> => {
    const formData = new FormData();
    formData.append('company_name', payload.name);
    formData.append('id_bl', payload.businessLineId);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('company_description', payload.description);
    }
    const docs: Array<{ name: string; number: string; file: File }> = Array.isArray(payload.documents)
      ? payload.documents
      : [];
    if (docs.length > 0) {
      docs.forEach((d, i) => {
        formData.append(`documents[${i}][cd_name]`, d.name);
        formData.append(`documents[${i}][cd_decree_number]`, d.number);
        formData.append(`documents[${i}][cd_file]`, d.file);
      });
    } else {
      if (payload.memoNumber) formData.append('documents[0][cd_decree_number]', payload.memoNumber);
      formData.append('documents[0][cd_name]', payload.documentName || 'Dokumen');
      if (payload.skFile) {
        formData.append('documents[0][cd_file]', payload.skFile);
      }
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

  delete: async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<{ success: true }> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('company_delete_decree_number', payload.memoNumber);
    if (payload.skFile) formData.append('company_delete_decree_file', payload.skFile);
    const resp = await apiService.post<any>(
      `/organizational-structure/companies/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const body = (resp as any)?.data ?? {};
    const status = body?.meta?.status ?? (resp as any)?.status ?? 200;
    return { success: status === 200 } as { success: true };
  },
};
