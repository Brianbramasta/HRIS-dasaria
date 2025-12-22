import { apiService } from '../../../../services/api';

const BaseUrl = '/organizational-structure/division-master-data/';

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'division_name',
    'Nama Divisi': 'division_name',
    'Deskripsi Umum': 'division_description',
  };
  return map[field || ''] || 'division_name';
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

export const divisionsService = {
  getList: async (filter: any): Promise<any> => {
    const params = new URLSearchParams();
    if (filter.page) params.append('page', String(filter.page));
    if (filter.pageSize) params.append('per_page', String(filter.pageSize));
    if (filter.search) params.append('search', filter.search);
    appendFilters(params, filter.filter);
    if (filter.sortBy) {
      const field = toSortField(filter.sortBy);
      const order = filter.sortOrder ?? 'asc';
      params.append('sort', `${field}:${order}`);
    }
    const qs = params.toString();
    return apiService.get<any>(`${BaseUrl}divisions${qs ? `?${qs}` : ''}`);
  },

  getById: async (id: string): Promise<any> => {
    return apiService.get<any>(`${BaseUrl}divisions/${id}`);
  },

  create: async (payload: { name: string; directorateId: string; description?: string | null; memoNumber: string; skFile: File; }): Promise<any> => {
    const form = new FormData();
    form.append('division_name', payload.name);
    form.append('directorate_id', payload.directorateId);
    form.append('division_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      form.append('division_description', payload.description);
    }
    form.append('division_decree_file', payload.skFile);

    return apiService.post<any>(`${BaseUrl}divisions`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: async (id: string, payload: { name?: string; directorateId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> => {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('division_name', payload.name);
    if (payload.directorateId !== undefined) form.append('directorate_id', payload.directorateId);
    form.append('division_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      form.append('division_description', payload.description);
    }
    if (payload.skFile) form.append('division_decree_file', payload.skFile);

    return apiService.post<any>(`${BaseUrl}divisions/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<any> => {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('division_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('division_deleted_decree_file', payload.skFile);
    return apiService.post<any>(`${BaseUrl}divisions/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // Mengambil dropdown divisi untuk kebutuhan select
  getDropdown: async (search?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const qs = params.toString();
    return apiService.get<any>(`${BaseUrl}divisions-dropdown${qs ? `?${qs}` : ''}`);
  },
};
