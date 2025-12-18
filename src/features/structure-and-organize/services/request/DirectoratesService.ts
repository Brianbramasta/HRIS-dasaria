import { apiService } from '../../../../services/api';
import {
  PaginatedResponse,
  TableFilter,
  DirectorateListItem,
  FileSummary,
} from '../../types/OrganizationApiTypes';

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

const mapToDirectorate = (item: any): DirectorateListItem => ({
  id: item.id ?? item.id ?? '',
  name: item.directorate_name ?? item.name ?? '',
  description: item.directorate_description ?? item.description ?? null,
  memoNumber: item.directorate_decree_number ?? item.memoNumber ?? null,
  skFile: toFileSummary(item.directorate_decree_file_url ?? item.directorate_decree_file ?? null),
});

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
  getList: async (filter: TableFilter): Promise<PaginatedResponse<DirectorateListItem>> => {
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
    const result = await apiService.get<any>(`/organizational-structure/directorates${qs ? `?${qs}` : ''}`);
    const payload = (result as any);
    const items = payload?.data?.data ?? [];
    const total = payload?.data?.total ?? (items?.length || 0);
    const page = payload?.data?.current_page ?? filter.page;
    const perPage = payload?.data?.per_page ?? filter.pageSize;
    const totalPages = perPage ? Math.ceil(total / perPage) : 1;
    return {
      data: (items || []).map(mapToDirectorate),
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  },

  getDropdown: async (search?: string): Promise<DirectorateListItem[]> => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const result = await apiService.get<any>(`/organizational-structure/directorates-dropdown${qs}`);
    const items = (result as any).data as { id: string; directorate_name: string }[];
    return (items || []).map((i) => ({
      id: i.id,
      name: i.directorate_name,
      description: null,
      memoNumber: null,
      skFile: null,
    }));
  },

  create: async (payload: { name: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<DirectorateListItem> => {
    const formData = new FormData();
    formData.append('directorate_name', payload.name);
    formData.append('directorate_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('directorate_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('directorate_decree_file', payload.skFile);
    }
    const created = await apiService.post<any>(
      '/organizational-structure/directorates',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const item = (created as any).data as any;
    return mapToDirectorate(item);
  },

  update: async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<DirectorateListItem> => {
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
    const updated = await apiService.post<any>(
      `/organizational-structure/directorates/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const item = (updated as any).data as any;
    return mapToDirectorate(item);
  },

  delete: async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<{ success: true }> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('directorate_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) formData.append('directorate_deleted_decree_file', payload.skFile);
    const resp = await apiService.post<any>(
      `/organizational-structure/directorates/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return { success: !!(resp as any).success } as { success: true };
  },
};
