import { apiService } from '../../../../services/api';

const BaseUrl = '/organizational-structure/department-master-data/';

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'department_name',
    'Nama Departemen': 'department_name',
    'Nama Divisi': 'division_name',
  };
  return map[field || ''] || 'department_name';
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

export const departmentsService = {
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
    return apiService.get<any>(`${BaseUrl}departments${qs ? `?${qs}` : ''}`);
  },

  getById: async (id: string): Promise<any> => {
    return apiService.get<any>(`${BaseUrl}departments/${id}`);
  },

  getDropdown: async (search?: string): Promise<any> => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${BaseUrl}departments-dropdown${qs}`);
  },

  create: async (payload: { name: string; divisionId: string; description?: string | null; memoNumber: string; skFile: File; }): Promise<any> => {
    const form = new FormData();
    form.append('department_name', payload.name);
    form.append('division_id', payload.divisionId);
    form.append('department_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) form.append('department_description', payload.description);
    form.append('department_decree_file', payload.skFile);
    return apiService.post<any>(`${BaseUrl}departments`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  update: async (id: string, payload: { name?: string; divisionId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> => {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('department_name', payload.name);
    if (payload.divisionId !== undefined) form.append('division_id', payload.divisionId);
    form.append('department_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) form.append('department_description', payload.description);
    if (payload.skFile) form.append('department_decree_file', payload.skFile);
    return apiService.post<any>(`${BaseUrl}departments/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  delete: async (id: string, payload: { memoNumber: string; skFile?: File; }): Promise<any> => {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('department_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('department_deleted_decree_file', payload.skFile);
    return apiService.post<any>(`${BaseUrl}departments/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
