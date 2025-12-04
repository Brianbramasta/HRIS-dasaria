import { apiService } from '../../../../services/api';
import {
  PaginatedResponse,
  TableFilter,
  DivisionListItem,
  FileSummary,
} from '../../types/organization.api.types';

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

const mapToDivision = (item: any): DivisionListItem => ({
  id: item.id_division ?? item.id ?? '',
  name: item.division_name ?? item.name ?? '',
  description: item.division_description ?? item.description ?? null,
  directorateId: item.id_directorate ?? null,
  directorateName: item.directorate_name ?? null,
  memoNumber: item.division_decree_number ?? null,
  skFile: toFileSummary(item.division_decree_file_url ?? item.division_decree_file ?? null),
});

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
  getList: async (filter: TableFilter): Promise<PaginatedResponse<DivisionListItem>> => {
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
    const result = await apiService.get<any>(`/organizational-structure/divisions${qs ? `?${qs}` : ''}`);
    const payload = (result as any);
    const items = payload?.data?.data ?? [];
    const total = payload?.data?.total ?? (items?.length || 0);
    const page = payload?.data?.current_page ?? filter.page;
    const perPage = payload?.data?.per_page ?? filter.pageSize;
    const totalPages = perPage ? Math.ceil(total / perPage) : 1;
    return {
      data: (items || []).map(mapToDivision),
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  },

  getById: async (id: string): Promise<DivisionListItem> => {
    const result = await apiService.get<any>(`/organizational-structure/divisions/${id}`);
    const item = (result as any).data as any;
    return mapToDivision(item);
  },

  create: async (payload: { name: string; directorateId: string; description?: string | null; memoNumber: string; skFile: File; }): Promise<DivisionListItem> => {
    const form = new FormData();
    form.append('division_name', payload.name);
    form.append('id_directorate', payload.directorateId);
    form.append('division_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      form.append('division_description', payload.description);
    }
    form.append('division_decree_file', payload.skFile);

    const created = await apiService.post<any>('/organizational-structure/divisions', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const item = (created as any).data as any;
    return mapToDivision(item);
  },

  update: async (id: string, payload: { name?: string; directorateId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<DivisionListItem> => {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('division_name', payload.name);
    if (payload.directorateId !== undefined) form.append('id_directorate', payload.directorateId);
    form.append('division_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      form.append('division_description', payload.description);
    }
    if (payload.skFile) form.append('division_decree_file', payload.skFile);

    const updated = await apiService.post<any>(`/organizational-structure/divisions/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const item = (updated as any).data as any;
    return mapToDivision(item);
  },

  delete: async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<{ success: true }> => {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('division_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('division_deleted_decree_file', payload.skFile);
    const resp = await apiService.post<any>(`/organizational-structure/divisions/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: !!(resp as any).success } as { success: true };
  },
};
