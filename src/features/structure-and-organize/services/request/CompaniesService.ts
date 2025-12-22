import { apiService } from '../../../../services/api';

const BaseUrl = '/organizational-structure/company-master-data/companies';

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
  getList: async (filter: any): Promise<any> => {
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
    return apiService.get<any>(`${BaseUrl}${qs ? `?${qs}` : ''}`);
  },

  getDropdown: async (): Promise<any> => {
    return apiService.get<any>(`/organizational-structure/companies-dropdown`);
  },

  getDetail: async (id: string): Promise<any> => {
    return apiService.get<any>(`${BaseUrl}/${id}/detail`);
  },

  create: async (payload: any): Promise<any> => {
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
      `${BaseUrl}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return created;
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
  }): Promise<any> => {
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
      `${BaseUrl}/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return updated;
  },

  // Dokumentasi singkat: Update data perusahaan by UUID sesuai kontrak API (PATCH)
  updateDetailByUuid: async (
    id: string,
    payload: {
      address?: string | null;
      postal_code?: string | null;
      email?: string | null;
      phone?: string | null;
      industry?: string | null;
      founded_year?: number | null;
      company_type?: string | null;
      website?: string | null;
      logo?: File | null;
      name?: string | null;
      description?: string | null;
      id_bl?: string | null;
    }
  ): Promise<any> => {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (payload.address !== undefined && payload.address !== null) formData.append('address', payload.address);
    if (payload.postal_code !== undefined && payload.postal_code !== null) formData.append('postal_code', payload.postal_code);
    if (payload.email !== undefined && payload.email !== null) formData.append('email', payload.email);
    if (payload.phone !== undefined && payload.phone !== null) formData.append('phone', payload.phone);
    if (payload.industry !== undefined && payload.industry !== null) formData.append('industry', payload.industry);
    if (payload.founded_year !== undefined && payload.founded_year !== null) formData.append('founded_year', String(payload.founded_year));
    if (payload.company_type !== undefined && payload.company_type !== null) formData.append('company_type', payload.company_type);
    if (payload.website !== undefined && payload.website !== null) formData.append('website', payload.website);
    if (payload.logo) formData.append('logo', payload.logo);
    if (payload.name !== undefined && payload.name !== null) formData.append('name', payload.name);
    if (payload.description !== undefined && payload.description !== null) formData.append('description', payload.description);
    if (payload.id_bl !== undefined && payload.id_bl !== null) formData.append('id_bl', payload.id_bl);
    
    const updated = await apiService.post<any>(
      `${BaseUrl}/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return updated;
  },

  delete: async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<any> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('company_delete_decree_number', payload.memoNumber);
    if (payload.skFile) formData.append('company_delete_decree_file', payload.skFile);
    const resp = await apiService.post<any>(
      `${BaseUrl}/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return resp;
  },

  // Dokumentasi: Menambahkan dokumen perusahaan sesuai kontrak API
  addDocuments: async (
    id: string,
    documents: Array<{ name: string; number: string; file: File }>
  ): Promise<any> => {
    const formData = new FormData();
    (documents || []).forEach((d, i) => {
      formData.append(`documents[${i}][cd_name]`, d.name);
      formData.append(`documents[${i}][cd_decree_number]`, d.number);
      formData.append(`documents[${i}][cd_file]`, d.file);
    });
    const created = await apiService.post<any>(
      `${BaseUrl}/${id}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return created;
  },

  // Dokumentasi: Menghapus dokumen perusahaan sesuai kontrak API
  deleteDocuments: async (
    id: string,
    payload: { memoNumber: string; skFile: File }
  ): Promise<any> => {
    const formData = new FormData();
    if (payload.memoNumber) formData.append('cd_deleted_decree', payload.memoNumber);
    if (payload.skFile) formData.append('cd_deleted_decree_file', payload.skFile);
    const resp = await apiService.post<any>(
      `${BaseUrl}/${id}/deletedocuments`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return resp;
  },
};
