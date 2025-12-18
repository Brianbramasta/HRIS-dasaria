import { apiService } from '../../../../services/api';
import {
  PaginatedResponse,
  TableFilter,
  BusinessLineListItem,
  BusinessLineDetailResponse,
  FileSummary,
} from '../../types/OrganizationApiTypes';

const BaseUrl = '/organizational-structure/business-master-data/business-lines';

const toFileSummary = (url: string | null): FileSummary | null => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1] || '';
  const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';
  return {
    fileName,
    fileUrl: url,
    fileType: ext,
    size: null,
  };
};

const mapToBusinessLine = (item: any): BusinessLineListItem => ({
  id: item.id,
  name: item.bl_name,
  description: item.bl_description ?? null,
  memoNumber: item.bl_decree_number ?? null,
  skFile: toFileSummary(item.bl_decree_file_url ?? item.bl_decree_file ?? null),
});

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'bl_name',
    'Lini Bisnis': 'bl_name',
    'Deskripsi Umum': 'bl_description',
  };
  return map[field || ''] || 'bl_name';
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

export const businessLinesService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<BusinessLineListItem>> => {
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
    const result = await apiService.get<any>(`${BaseUrl}${qs ? `?${qs}` : ''}`);
    const payload = (result as any);
    const items = payload?.data?.data ?? [];
    const total = payload?.data?.total ?? (items?.length || 0);
    const page = payload?.data?.current_page ?? filter.page;
    const perPage = payload?.data?.per_page ?? filter.pageSize;
    const totalPages = perPage ? Math.ceil(total / perPage) : 1;
    console.log('Business lines list:', { total, page, pageSize: perPage, totalPages });
    return {
      data: (items || []).map(mapToBusinessLine),
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  },

  getDropdown: async (search?: string): Promise<BusinessLineListItem[]> => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const result = await apiService.get<any>(`${BaseUrl}${qs}`);
    const items = (result as any).data as { id: string; bl_name: string }[];
    return (items || []).map((i) => ({
      id: i.id,
      name: i.bl_name,
      description: null,
      memoNumber: null,
      skFile: null,
    }));
  },

  getDetail: async (id: string): Promise<BusinessLineDetailResponse> => {
    const result = await apiService.get<any>(`${BaseUrl}/${id}/detail`);
    const item = (result as any).data as any;
    const bl = mapToBusinessLine(item);
    const activeSk = toFileSummary(item?.bl_decree_file_url ?? item?.bl_decree_file ?? null);
    const deleteSk = toFileSummary(item?.bl_delete_decree_file_url ?? item?.bl_delete_decree_file ?? null);
    const personalFiles: FileSummary[] = [];
    if (activeSk) personalFiles.push(activeSk);
    if (deleteSk) personalFiles.push(deleteSk);
    const companies = Array.isArray(item?.companies)
      ? item.companies.map((c: any) => ({
          id: c.id_company || '',
          name: c.company_name || '',
          details: c.company_description ?? null,
        }))
      : [];
    return {
      businessLine: {
        id: bl.id,
        name: bl.name,
        description: bl.description,
        memoNumber: bl.memoNumber,
        skFile: bl.skFile,
      },
      personalFiles,
      companies,
    };
  },

  getById: async (id: string): Promise<BusinessLineListItem> => {
    const result = await apiService.get<any>(`${BaseUrl}/${id}`);
    const item = (result as any).data as any;
    return mapToBusinessLine(item);
  },

  create: async (payload: { name: string; description?: string | null; memoNumber: string; skFile?: File; }): Promise<BusinessLineListItem> => {
    const formData = new FormData();
    formData.append('bl_name', payload.name);
    formData.append('bl_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('bl_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('bl_decree_file', payload.skFile);
    }
    const created = await apiService.post<any>(`${BaseUrl}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    const item = (created as any).data as any;
    return mapToBusinessLine(item);
  },

  update: async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<BusinessLineListItem> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (payload.name !== undefined) formData.append('bl_name', payload.name);
    formData.append('bl_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('bl_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('bl_decree_file', payload.skFile);
    }
    const updated = await apiService.post<any>(`${BaseUrl}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    const item = (updated as any).data as any;
    return mapToBusinessLine(item);
  },

  delete: async (id: string, payload: { memoNumber: string; skFile?: File; }): Promise<{ success: true }> => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('bl_delete_decree_number', payload.memoNumber);
    if (payload.skFile) {
      formData.append('bl_delete_decree_file', payload.skFile);
    }
    const resp = await apiService.post<any>(`${BaseUrl}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return { success: !!(resp as any).success } as { success: true };
  },
};
