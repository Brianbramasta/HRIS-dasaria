import { apiService } from '../../../../services/api';
import {
  PaginatedResponse,
  TableFilter,
  DepartmentListItem,
  FileSummary,
} from '../../types/organization.api.types';

// Penyesuaian service Departemen sesuai kontrak API 1.7 (departments)
const toFileSummary = (url: string | null): FileSummary | null => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1] || '';
  const ext = fileName.includes('.') ? (fileName.split('.').pop() || '') : '';
  return {
    fileName,
    fileUrl: url,
    fileType: ext,
    size: null,
  };
};

const mapToDepartment = (item: any): DepartmentListItem => ({
  id: item.id_department ?? item.id ?? '',
  name: item.department_name ?? item.name ?? '',
  description: item.department_description ?? item.description ?? null,
  divisionId: item.id_division ?? null,
  divisionName: item.division_name ?? null,
  memoNumber: item.department_decree_number ?? null,
  skFile: toFileSummary(item.department_decree_file_url ?? item.department_decree_file ?? null),
});

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
  // Mengambil list departemen dengan query sesuai kontrak API
  getList: async (filter: TableFilter): Promise<PaginatedResponse<DepartmentListItem>> => {
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
    const result = await apiService.get<any>(`/organizational-structure/departments${qs ? `?${qs}` : ''}`);
    const payload = (result as any);
    const items = payload?.data?.data ?? [];
    const total = payload?.data?.total ?? (items?.length || 0);
    const page = payload?.data?.current_page ?? filter.page;
    const perPage = payload?.data?.per_page ?? filter.pageSize;
    const totalPages = perPage ? Math.ceil(total / perPage) : 1;
    return {
      data: (items || []).map(mapToDepartment),
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  },

  // Menyimpan data departemen (multipart/form-data)
  create: async (payload: { name: string; divisionId: string; description?: string | null; memoNumber: string; skFile: File; }): Promise<DepartmentListItem> => {
    const form = new FormData();
    form.append('department_name', payload.name);
    form.append('id_division', payload.divisionId);
    form.append('department_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) form.append('department_description', payload.description);
    form.append('department_decree_file', payload.skFile);
    const created = await apiService.post<any>('/organizational-structure/departments', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    const item = (created as any).data as any;
    return mapToDepartment(item);
  },

  // Update data departemen (POST + _method=PATCH)
  update: async (id: string, payload: { name?: string; divisionId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<DepartmentListItem> => {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('department_name', payload.name);
    if (payload.divisionId !== undefined) form.append('id_division', payload.divisionId);
    form.append('department_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) form.append('department_description', payload.description);
    if (payload.skFile) form.append('department_decree_file', payload.skFile);
    const updated = await apiService.post<any>(`/organizational-structure/departments/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    const item = (updated as any).data as any;
    return mapToDepartment(item);
  },

  // Hapus data departemen (POST + _method=DELETE)
  delete: async (id: string, payload: { memoNumber: string; skFile?: File; }): Promise<{ success: true }> => {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('department_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('department_deleted_decree_file', payload.skFile);
    const resp = await apiService.post<any>(`/organizational-structure/departments/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    return { success: !!(resp as any).success } as { success: true };
  },
};
