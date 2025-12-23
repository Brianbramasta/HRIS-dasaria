import { apiService } from '../../../../services/api';

const BaseUrl = '/organizational-structure/position-master-data/';

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
  getList: async (filter: any): Promise<any> => {
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
    return apiService.get<any>(`${BaseUrl}positions${qs ? `?${qs}` : ''}`);
  },

  // Ambil detail Posisi (GET /organizational-structure/positions/{id_position})
  detail: async (id: string): Promise<any> => {
    return apiService.get<any>(`${BaseUrl}positions/${id}/show`);
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
  }): Promise<any> => {
    const form = new FormData();
    form.append('position_name', payload.name);
    form.append('job_title_id', payload.positionId);
    if (payload.directorateId) form.append('directorate_id', payload.directorateId);
    if (payload.divisionId) form.append('division_id', payload.divisionId);
    if (payload.departmentId) form.append('department_id', payload.departmentId);
    if (payload.memoNumber) form.append('position_decree_number', payload.memoNumber);
    // Dokumentasi: kirim File asli (bukan string id/path)
    if (payload.skFile) form.append('position_decree_file', payload.skFile);
    return apiService.post<any>(
      `${BaseUrl}positions`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
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
  }): Promise<any> => {
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
    return apiService.post<any>(
      `${BaseUrl}positions/${id}/update`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  // Delete Posisi (POST + _method=DELETE, multipart)
  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<any> => {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('position_deleted_decree_number', payload.memoNumber);
    if (payload.skFileId) form.append('position_deleted_decree_file', payload.skFileId);
    return apiService.post<any>(
      `${BaseUrl}positions/${id}/delete`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
};
