import { apiService } from '../../../../services/api';

const BaseUrl = '/organizational-structure/business-master-data/';

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

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'bl_name',
    'Lini Bisnis': 'bl_name',
    'Deskripsi Umum': 'bl_description',
  };
  return map[field || ''] || 'bl_name';
};

export const businessLinesService = {
  // Returns the raw API response. Mapping is handled by caller (hooks) per architecture rules.
  getList: async (filter: any): Promise<any> => {
    const params = new URLSearchParams();
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.pageSize) params.append('per_page', String(filter.pageSize));
    if (filter?.search) params.append('search', filter.search);
    appendFilters(params, filter?.filter);
    if (filter?.sortBy && filter?.sortOrder) {
      params.append('column', toSortField(filter.sortBy));
      params.append('sort', filter.sortOrder);
    }
    const qs = params.toString();
    return apiService.get<any>(`${BaseUrl}business-lines${qs ? `?${qs}` : ''}`);
  },

  getDropdown: async (search?: string): Promise<any> => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${BaseUrl}business-lines-dropdown${qs}`);
  },

  getDetail: async (id: string): Promise<any> => {
    return apiService.get<any>(`${BaseUrl}business-lines/${id}/detail`);
  },

  getById: async (id: string): Promise<any> => {
    return apiService.get<any>(`${BaseUrl}business-lines/${id}/show`);
  },

  create: async (payload: { name: string; description?: string | null; memoNumber: string; skFile?: File | undefined; }): Promise<any> => {
    const formData = new FormData();
    formData.append('bl_name', payload.name);
    formData.append('bl_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('bl_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('bl_decree_file', payload.skFile);
    }
    return apiService.post<any>(`${BaseUrl}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  update: async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (payload.name !== undefined) formData.append('bl_name', payload.name);
    formData.append('bl_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('bl_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('bl_decree_file', payload.skFile as File);
    }
    return apiService.post<any>(`${BaseUrl}business-lines${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  delete: async (id: string, payload: { memoNumber: string; skFile?: File | undefined; }): Promise<any> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('bl_delete_decree_number', payload.memoNumber);
    if (payload.skFile) {
      formData.append('bl_delete_decree_file', payload.skFile as File);
    }
    return apiService.post<any>(`${BaseUrl}business-lines${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
