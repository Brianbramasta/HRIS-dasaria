import { apiService } from '../../../../services/api';

const BaseUrl = '/organizational-structure/job-master-data/';

const toSortField = (field?: string): string => {
  const map: Record<string, string> = {
    name: 'job_title_name',
    'Nama Posisi': 'job_title_name',
    'Nama Jabatan': 'job_title_name',
    'Jabatan': 'job_title_name',
    grade: 'grade',
  };
  return map[field || ''] || 'job_title_name';
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

export const positionsService = {
  // Mengambil list jabatan dengan query sesuai kontrak API
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
    return apiService.get<any>(`${BaseUrl}job-title${qs ? `?${qs}` : ''}`);
  },

  // Dokumentasi: Mengambil dropdown jabatan sesuai pola collection 1.8
  getDropdown: async (search?: string): Promise<any> => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${BaseUrl}job-title-dropdown${qs}`);
  },

  // Dokumentasi: Mengambil detail jabatan berdasarkan ID sesuai kontrak API 1.7 (GET /organizational-structure/job-title/{id_job_title})
  detail: async (id: string): Promise<any> => {
    return apiService.get<any>(`${BaseUrl}job-title/${id}`);
  },

  // Menyimpan data jabatan (multipart/form-data)
  create: async (payload: {
    name: string;
    grade?: string | null;
    jobDescription?: string | null;
    directSubordinates?: string[];
    memoNumber: string;
    skFile: File;
  }): Promise<any> => {
    const form = new FormData();
    form.append('job_title_name', payload.name);
    if (payload.grade !== undefined && payload.grade !== null) form.append('grade', payload.grade);
    if (payload.jobDescription !== undefined && payload.jobDescription !== null) form.append('job_title_description', payload.jobDescription);
    if (payload.directSubordinates && payload.directSubordinates.length > 0) form.append('direct_subordinate', payload.directSubordinates.join(', '));
    form.append('job_title_decree_number', payload.memoNumber);
    form.append('job_title_decree_file', payload.skFile);
    return apiService.post<any>(`${BaseUrl}job-title`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  // Update data jabatan (POST + _method=PATCH)
  update: async (id: string, payload: {
    name?: string;
    grade?: string | null;
    jobDescription?: string | null;
    directSubordinates?: string[];
    memoNumber: string;
    skFile?: File | null;
  }): Promise<any> => {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('job_title_name', payload.name);
    if (payload.grade !== undefined && payload.grade !== null) form.append('grade', payload.grade);
    if (payload.jobDescription !== undefined && payload.jobDescription !== null) form.append('job_title_description', payload.jobDescription);
    if (payload.directSubordinates && payload.directSubordinates.length > 0) form.append('direct_subordinate', payload.directSubordinates.join(', '));
    form.append('job_title_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('job_title_decree_file', payload.skFile);
    return apiService.post<any>(`${BaseUrl}job-title/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  // Hapus data jabatan (POST + _method=DELETE)
  delete: async (id: string, payload: { memoNumber: string; skFile?: File; }): Promise<any> => {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('job_title_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('job_title_deleted_decree_file', payload.skFile);
    return apiService.post<any>(`${BaseUrl}job-title/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};
