import { apiService } from '../../../../services/api';

const BaseUrl = '/organizational-structure/office-master-data/';

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'office_name',
    'Nama Kantor': 'office_name',
    'Deskripsi Umum': 'office_description',
  };
  return map[field || ''] || 'office_name';
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

export const officesService = {
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
    return apiService.get<any>(`${BaseUrl}offices${qs ? `?${qs}` : ''}`);
  },

  getById: async (id: string): Promise<any> => {
    return apiService.get<any>(`${BaseUrl}offices/${id}/show`);
  },

  create: async (payload: {
    companyId?: string;
    companyIds?: string[];
    name: string;
    description?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }): Promise<any> => {
    const formData = new FormData();
    formData.append('office_name', payload.name);
    const ids = Array.isArray(payload.companyIds) && payload.companyIds.length > 0
      ? payload.companyIds
      : (payload.companyId ? [payload.companyId] : []);
    // DOK: Sesuai api.contract.kantor.md, gunakan company[n][company_id] untuk multi-select perusahaan
    ids.forEach((id, index) => formData.append(`company[${index}][company_id]`, id));
    formData.append('office_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('office_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('office_decree_file', payload.skFile);
    }
    return apiService.post<any>(
      `${BaseUrl}offices`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  update: async (id: string, payload: {
    companyId?: string;
    companyIds?: string[];
    name?: string;
    description?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }): Promise<any> => {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (payload.name !== undefined) formData.append('office_name', payload.name);
    // DOK: PATCH Kantor menggunakan company[n][id_company] untuk multi-select perusahaan
    if (Array.isArray(payload.companyIds) && payload.companyIds.length > 0) {
      payload.companyIds.forEach((id, index) => formData.append(`company[${index}][company_id]`, id));
    } else if (payload.companyId !== undefined) {
      formData.append(`company[0][company_id]`, payload.companyId);
    }
    formData.append('office_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('office_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('office_decree_file', payload.skFile);
    }
    return apiService.post<any>(
      `${BaseUrl}offices/${id}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  delete: async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<any> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('office_delete_decree_number', payload.memoNumber);
    if (payload.skFile) formData.append('office_delete_decree_file', payload.skFile);
    return apiService.post<any>(
      `${BaseUrl}offices/${id}/delete`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
};
