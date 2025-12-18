import { apiService } from '../../../../services/api';
import {
  PaginatedResponse,
  TableFilter,
  EmployeePositionListItem,
  FileSummary,
} from '../../types/OrganizationApiTypes';

// Penyesuaian besar: service Posisi Pegawai diselaraskan dengan kontrak API Posisi
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

// Mapping respons API ke tipe frontend EmployeePositionListItem
const mapToEmployeePosition = (item: any): EmployeePositionListItem => ({
  id: item.id ?? item.id ?? '',
  name: item.position_name ?? item.name ?? '',
  positionId: item.job_title_id ?? item.positionId ?? null,
  positionName: item.job_title_name ?? item.positionName ?? null,
  directorateId: item.directorate_id ?? item.directorateId ?? null,
  directorateName: item.directorate_name ?? item.directorateName ?? null,
  divisionId: item.division_id ?? item.divisionId ?? null,
  divisionName: item.division_name ?? item.divisionName ?? null,
  departmentId: item.department_id ?? item.departmentId ?? null,
  departmentName: item.department_name ?? item.departmentName ?? null,
  description: item.position_description ?? item.description ?? null,
  startDate: item.start_date ?? item.startDate ?? null,
  endDate: item.end_date ?? item.endDate ?? null,
  memoNumber: item.position_decree_number ?? item.memoNumber ?? null,
  skFile: toFileSummary(item.position_decree_file_url ?? item.position_decree_file ?? null),
});

// Konversi nama kolom sort dari UI ke field API Posisi
const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'position_name',
    'Nama Posisi': 'position_name',
    'Nama Jabatan': 'job_title_name',
    Jabatan: 'job_title_name',
  };
  return map[field || ''] || 'position_name';
};

// Tambahkan filter[] sesuai kontrak API
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

// Dokumentasi: Service Posisi Pegawai - kirim File asli untuk field position_decree_file pada create/update
export const employeePositionsService = {
  // Ambil list Posisi sesuai kontrak API Posisi (GET /organizational-structure/positions)
  getList: async (filter: TableFilter): Promise<PaginatedResponse<EmployeePositionListItem>> => {
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
    const result = await apiService.get<any>(`/organizational-structure/positions${qs ? `?${qs}` : ''}`);
    const payload = (result as any);
    const topData = payload?.data;
    const items = Array.isArray(topData)
      ? topData
      : Array.isArray(topData?.data)
        ? topData.data
        : Array.isArray(payload?.data?.data)
          ? payload.data.data
          : [];
    const pagination = payload?.pagination ?? (Array.isArray(topData) ? undefined : topData) ?? {};
    const total = pagination?.total ?? items.length ?? 0;
    const page = pagination?.current_page ?? filter.page ?? 1;
    const perPage = pagination?.per_page ?? filter.pageSize ?? items.length;
    const totalPages = pagination?.last_page ?? (perPage ? Math.ceil(total / perPage) : 1);
    return {
      data: (items || []).map(mapToEmployeePosition),
      total,
      page,
      pageSize: perPage,
      totalPages,
    };
  },

  // Ambil detail Posisi (GET /organizational-structure/positions/{id_position})
  detail: async (id: string): Promise<EmployeePositionListItem> => {
    const result = await apiService.get<any>(`/organizational-structure/positions/${id}`);
    const body = (result as any).data ?? {};
    const item = Array.isArray(body?.data) ? body.data?.[0] : (body.data ?? body);
    return mapToEmployeePosition(item);
  },

  // Dokumentasi: Create Posisi - kirim File untuk position_decree_file (multipart/form-data)
  create: async (payload: {
    name: string;
    positionId: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }): Promise<EmployeePositionListItem> => {
    const form = new FormData();
    form.append('position_name', payload.name);
    form.append('job_title_id', payload.positionId);
    if (payload.directorateId) form.append('directorate_id', payload.directorateId);
    if (payload.divisionId) form.append('division_id', payload.divisionId);
    if (payload.departmentId) form.append('department_id', payload.departmentId);
    if (payload.memoNumber) form.append('position_decree_number', payload.memoNumber);
    // Dokumentasi: kirim File asli (bukan string id/path)
    if (payload.skFile) form.append('position_decree_file', payload.skFile);
    const created = await apiService.post<any>(
      '/organizational-structure/positions',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const body = (created as any).data ?? {};
    const item = body?.data ?? body;
    return mapToEmployeePosition(item);
  },

  // Dokumentasi: Update Posisi - kirim File untuk position_decree_file (POST + _method=PATCH, multipart)
  update: async (id: string, payload: {
    name?: string;
    positionId?: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    description?: string;
    skFile?: File | null;
  }): Promise<EmployeePositionListItem> => {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('position_name', payload.name);
    if (payload.positionId !== undefined) form.append('job_title_id', payload.positionId);
    if (payload.directorateId !== undefined && payload.directorateId !== null) form.append('directorate_id', payload.directorateId);
    if (payload.divisionId !== undefined && payload.divisionId !== null) form.append('division_id', payload.divisionId);
    if (payload.departmentId !== undefined && payload.departmentId !== null) form.append('department_id', payload.departmentId);
    if (payload.memoNumber) form.append('position_decree_number', payload.memoNumber);
    if (payload.description !== undefined) form.append('position_description', payload.description);
    // Dokumentasi: kirim File asli bila tersedia
    if (payload.skFile) form.append('position_decree_file', payload.skFile);
    const updated = await apiService.post<any>(
      `/organizational-structure/positions/${id}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const body = (updated as any).data ?? {};
    const item = body?.data ?? body;
    return mapToEmployeePosition(item);
  },

  // Delete Posisi (POST + _method=DELETE, multipart)
  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('position_deleted_decree_number', payload.memoNumber);
    if (payload.skFileId) form.append('position_deleted_decree_file', payload.skFileId);
    const resp = await apiService.post<any>(
      `/organizational-structure/positions/${id}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    const body = (resp as any)?.data ?? {};
    const status = body?.meta?.status ?? (resp as any)?.status ?? 200;
    return { success: status === 200 } as { success: true };
  },
};
