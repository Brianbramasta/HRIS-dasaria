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

  getDetail: async (id: string): Promise<BusinessLineDetailResponse> => {
    const result = await apiService.get<{ data: BusinessLineApiItem }>(`/lini-bisnis/${id}`);
    const item = (result as any).data as BusinessLineApiItem;
    const bl = mapToBusinessLine(item);
    return {
      businessLine: {
        id: bl.id,
        name: bl.name,
        description: bl.description,
        memoNumber: bl.memoNumber,
        skFile: bl.skFile,
      },
      personalFiles: [],
      companies: [],
    };
  },

  create: async (payload: { name: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<BusinessLineListItem> => {
    const body: Record<string, any> = {
      nama_lini_bisnis: payload.name,
      no_sk_lini_bisnis: payload.memoNumber,
      deskripsi_lini_bisnis: payload.description ?? null,
      file_url_sk_lini_bisnis: payload.skFileId,
    };
    const created = await apiService.post<{ data: BusinessLineApiItem }>(`/lini-bisnis/store`, body);
    const item = (created as any).data as BusinessLineApiItem;
    return mapToBusinessLine(item);
  },

  update: async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<BusinessLineListItem> => {
    const body: Record<string, any> = {
      nama_lini_bisnis: payload.name,
      no_sk_lini_bisnis: payload.memoNumber,
      deskripsi_lini_bisnis: payload.description ?? null,
      file_url_sk_lini_bisnis: payload.skFileId,
    };
    const updated = await apiService.post<{ data: BusinessLineApiItem }>(`/lini-bisnis/${id}/update`, body);
    const item = (updated as any).data as BusinessLineApiItem;
    return mapToBusinessLine(item);
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const body: Record<string, any> = {
      no_sk_hapus_lini_bisnis: payload.memoNumber,
      file_url_sk_hapus_lini_bisnis: payload.skFileId,
    };
    const resp = await apiService.post<{ data: null; success: boolean }>(`/lini-bisnis/${id}/delete`, body);
    return { success: !!(resp as any).success } as { success: true };
  },
};
