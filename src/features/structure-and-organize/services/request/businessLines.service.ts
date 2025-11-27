import { apiService } from '../../../../services/api';
import { buildQueryParams } from '../query';
import {
  PaginatedResponse,
  TableFilter,
  BusinessLineListItem,
  BusinessLineDetailResponse,
  BusinessLineApiItem,
  ApiPagination,
  FileSummary,
} from '../../types/organization.api.types';

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

const mapToBusinessLine = (item: BusinessLineApiItem): BusinessLineListItem => ({
  id: item.uuid_lini_bisnis,
  name: item.nama_lini_bisnis,
  description: item.deskripsi_lini_bisnis,
  memoNumber: item.no_sk_lini_bisnis,
  skFile: toFileSummary(item.file_url_sk_lini_bisnis),
});

export const businessLinesService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<BusinessLineListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<{ data: BusinessLineApiItem[]; pagination: ApiPagination }>(`/lini-bisnis?${queryParams}`);
    const data = (result as any).data as BusinessLineApiItem[];
    const pagination = (result as any).pagination as ApiPagination;
    return {
      data: (data || []).map(mapToBusinessLine),
      total: pagination?.total ?? (data?.length || 0),
      page: pagination?.current_page ?? filter.page,
      pageSize: pagination?.per_page ?? filter.pageSize,
      totalPages: pagination?.last_page ?? 1,
    };
  },

  getDropdown: async (): Promise<BusinessLineListItem[]> => {
    const result = await apiService.get<{ data: { uuid_lini_bisnis: string; nama_lini_bisnis: string }[] }>(`/dropdown-lini-bisnis`);
    const items = (result as any).data as { uuid_lini_bisnis: string; nama_lini_bisnis: string }[];
    return (items || []).map((i) => ({
      id: i.uuid_lini_bisnis,
      name: i.nama_lini_bisnis,
      description: null,
      memoNumber: null,
      skFile: null,
    }));
  },

  getDetail: async (id: string): Promise<BusinessLineDetailResponse> => {
    const result = await apiService.get<{ data: BusinessLineApiItem & { perusahaan?: any[] } }>(`/lini-bisnis/${id}/detail`);
    const item = (result as any).data as BusinessLineApiItem & { perusahaan?: any[] };
    const bl = mapToBusinessLine(item);
    const activeSk = toFileSummary(item.file_url_sk_lini_bisnis);
    const deleteSk = toFileSummary(item.file_url_sk_hapus_lini_bisnis);
    const personalFiles: FileSummary[] = [];
    if (activeSk) personalFiles.push(activeSk);
    if (deleteSk) personalFiles.push(deleteSk);
    const companies = Array.isArray(item.perusahaan)
      ? item.perusahaan.map((c: any) => ({
          id: c.uuid_perusahaan || c.id || '',
          name: c.nama_perusahaan || c.name || '',
          details: c.deskripsi_perusahaan || c.details || null,
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
    const result = await apiService.get<{ data: BusinessLineApiItem }>(`/lini-bisnis/${id}`);
    const item = (result as any).data as BusinessLineApiItem;
    return mapToBusinessLine(item);
  },

  create: async (payload: { name: string; description?: string | null; memoNumber: string; skFile?: File; }): Promise<BusinessLineListItem> => {
    const formData = new FormData();
    formData.append('nama_lini_bisnis', payload.name);
    formData.append('no_sk_lini_bisnis', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('deskripsi_lini_bisnis', payload.description);
    }
    if (payload.skFile) {
      formData.append('file_url_sk_lini_bisnis', payload.skFile);
    }
    const created = await apiService.post<{ data: BusinessLineApiItem }>(`/lini-bisnis/store`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    const item = (created as any).data as BusinessLineApiItem;
    return mapToBusinessLine(item);
  },

  update: async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<BusinessLineListItem> => {
    const formData = new FormData();
    if (payload.name !== undefined) formData.append('nama_lini_bisnis', payload.name);
    formData.append('no_sk_lini_bisnis', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('deskripsi_lini_bisnis', payload.description);
    }
    if (payload.skFile) {
      formData.append('file_url_sk_lini_bisnis', payload.skFile);
    }
    const updated = await apiService.post<{ data: BusinessLineApiItem }>(`/lini-bisnis/${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    const item = (updated as any).data as BusinessLineApiItem;
    return mapToBusinessLine(item);
  },

  delete: async (id: string, payload: { memoNumber: string; skFile?: File; }): Promise<{ success: true }> => {
    const formData = new FormData();
    formData.append('no_sk_hapus_lini_bisnis', payload.memoNumber);
    if (payload.skFile) {
      formData.append('file_url_sk_hapus_lini_bisnis', payload.skFile);
    }
    const resp = await apiService.post<{ data: null; success: boolean }>(`/lini-bisnis/${id}/delete`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return { success: !!(resp as any).success } as { success: true };
  },
};
