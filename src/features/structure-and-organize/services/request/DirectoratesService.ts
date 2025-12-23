import { apiService } from '../../../../services/api';

const BaseUrl = '/organizational-structure/directorate-master-data/';

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'directorate_name',
    'Nama Direktorat': 'directorate_name',
    'Deskripsi Umum': 'directorate_description',
  };
  return map[field || ''] || 'directorate_name';
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

export const directoratesService = {
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
    return apiService.get<any>(`${BaseUrl}directorates${qs ? `?${qs}` : ''}`);
  },

  getDropdown: async (search?: string): Promise<any> => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${BaseUrl}directorates-dropdown${qs}`);
  },

  create: async (payload: { name: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> => {
    const formData = new FormData();
    formData.append('directorate_name', payload.name);
    formData.append('directorate_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('directorate_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('directorate_decree_file', payload.skFile);
    }
    return apiService.post<any>(
      `${BaseUrl}directorates`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  update: async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> => {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (payload.name !== undefined) formData.append('directorate_name', payload.name);
    formData.append('directorate_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('directorate_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('directorate_decree_file', payload.skFile);
    }
    return apiService.post<any>(
      `${BaseUrl}directorates/${id}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  delete: async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<any> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('directorate_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) formData.append('directorate_deleted_decree_file', payload.skFile);
    return apiService.post<any>(
      `${BaseUrl}directorates/${id}/delete`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
};
