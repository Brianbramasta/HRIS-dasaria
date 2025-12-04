import { apiService } from '../../../../services/api';
import {
  PaginatedResponse,
  TableFilter,
  OfficeListItem,
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

const mapToOffice = (item: any): OfficeListItem => ({
  id: item.id_office ?? item.id ?? '',
  name: item.office_name ?? item.name ?? '',
  description: item.office_description ?? item.description ?? null,
  memoNumber: item.office_decree_number ?? item.memoNumber ?? null,
  skFile: toFileSummary(item.office_decree_file_url ?? item.office_decree_file ?? null),
  companyId: item.id_company ?? null,
});

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
  getList: async (filter: TableFilter): Promise<PaginatedResponse<OfficeListItem>> => {
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
    const result = await apiService.get<any>(`/organizational-structure/offices${qs ? `?${qs}` : ''}`);
    const payload = (result as any);
    const items = payload?.data?.data ?? [];
    const total = payload?.data?.total ?? (items?.length || 0);
    const page = payload?.data?.current_page ?? filter.page;
    const perPage = payload?.data?.per_page ?? filter.pageSize;
    const totalPages = perPage ? Math.ceil(total / perPage) : 1;
    return {
      data: (items || []).map(mapToOffice),
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  },

  getById: async (id: string): Promise<OfficeListItem> => {
    const result = await apiService.get<any>(`/organizational-structure/offices/${id}`);
    const body = (result as any)?.data ?? {};
    const item = body?.data ?? body;
    const office = mapToOffice(item);
    const comps = Array.isArray(item?.companies) ? item.companies : [];
    const ids = comps.map((c: any) => c?.id_company ?? c?.pivot?.id_company).filter(Boolean);
    const cid = ids.length > 0 ? ids[0] : null;
    return { ...office, companyId: cid, companyIds: ids };
  },

  create: async (payload: {
    companyId?: string;
    companyIds?: string[];
    name: string;
    description?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }): Promise<OfficeListItem> => {
    const formData = new FormData();
    formData.append('office_name', payload.name);
    const ids = Array.isArray(payload.companyIds) && payload.companyIds.length > 0
      ? payload.companyIds
      : (payload.companyId ? [payload.companyId] : []);
    if (ids.length > 1) {
      ids.forEach((id) => formData.append('id_company[]', id));
    } else if (ids.length === 1) {
      formData.append('id_company', ids[0]);
    }
    formData.append('office_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('office_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('office_decree_file', payload.skFile);
    }
    const created = await apiService.post<any>(
      '/organizational-structure/offices',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const item = (created as any).data as any;
    return mapToOffice(item);
  },

  update: async (id: string, payload: {
    companyId?: string;
    companyIds?: string[];
    name?: string;
    description?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }): Promise<OfficeListItem> => {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (payload.name !== undefined) formData.append('office_name', payload.name);
    if (Array.isArray(payload.companyIds) && payload.companyIds.length > 0) {
      payload.companyIds.forEach((id) => formData.append('id_company[]', id));
    } else if (payload.companyId !== undefined) {
      formData.append('id_company', payload.companyId);
    }
    formData.append('office_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('office_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('office_decree_file', payload.skFile);
    }
    const updated = await apiService.post<any>(
      `/organizational-structure/offices/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const item = (updated as any).data as any;
    return mapToOffice(item);
  },

  delete: async (id: string, payload: { memoNumber: string; skFile: File; }): Promise<{ success: true }> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('office_delete_decree_number', payload.memoNumber);
    if (payload.skFile) formData.append('office_delete_decree_file', payload.skFile);
    const resp = await apiService.post<any>(
      `/organizational-structure/offices/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const body = (resp as any)?.data ?? {};
    const status = body?.meta?.status ?? (resp as any)?.status ?? 200;
    return { success: status === 200 } as { success: true };
  },
};
