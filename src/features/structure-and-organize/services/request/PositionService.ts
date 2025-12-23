import { apiService } from '../../../../services/api';

class PositionsService {
  private readonly basePath = '/organizational-structure/job-master-data/';

  /**
   * Get Job Titles List
   * Mengambil list jabatan dengan query sesuai kontrak API
   * @param filter - Filter parameters
   * @returns Promise dengan data jabatan
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}job-title${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Job Titles Dropdown
   * Dokumentasi: Mengambil dropdown jabatan sesuai pola collection 1.8
   * @param search - Optional search query untuk filter
   * @returns Promise dengan data jabatan untuk dropdown
   */
  async getDropdown(search?: string): Promise<any> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${this.basePath}job-title-dropdown${qs}`);
  }

  /**
   * Get Job Title Detail
   * Dokumentasi: Mengambil detail jabatan berdasarkan ID sesuai kontrak API 1.7 (GET /organizational-structure/job-title/{id_job_title})
   * @param id - Job title ID
   * @returns Promise dengan detail jabatan
   */
  async detail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}job-title/${id}/show`);
  }

  /**
   * Create Job Title
   * Menyimpan data jabatan (multipart/form-data)
   * @param payload - Data untuk membuat jabatan
   * @returns Promise dengan response API
   */
  async create(payload: {
    name: string;
    grade?: string | null;
    jobDescription?: string | null;
    directSubordinates?: string[];
    memoNumber: string;
    skFile: File;
  }): Promise<any> {
    const form = new FormData();
    form.append('job_title_name', payload.name);
    if (payload.grade !== undefined && payload.grade !== null) form.append('grade', payload.grade);
    if (payload.jobDescription !== undefined && payload.jobDescription !== null) form.append('job_title_description', payload.jobDescription);
    if (payload.directSubordinates && payload.directSubordinates.length > 0) form.append('direct_subordinate', payload.directSubordinates.join(', '));
    form.append('job_title_decree_number', payload.memoNumber);
    form.append('job_title_decree_file', payload.skFile);
    return apiService.post<any>(`${this.basePath}job-title`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Update Job Title
   * Update data jabatan (POST + _method=PATCH)
   * @param id - Job title ID
   * @param payload - Data untuk update jabatan
   * @returns Promise dengan response API
   */
  async update(id: string, payload: {
    name?: string;
    grade?: string | null;
    jobDescription?: string | null;
    directSubordinates?: string[];
    memoNumber: string;
    skFile?: File | null;
  }): Promise<any> {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('job_title_name', payload.name);
    if (payload.grade !== undefined && payload.grade !== null) form.append('grade', payload.grade);
    if (payload.jobDescription !== undefined && payload.jobDescription !== null) form.append('job_title_description', payload.jobDescription);
    if (payload.directSubordinates && payload.directSubordinates.length > 0) form.append('direct_subordinate', payload.directSubordinates.join(', '));
    form.append('job_title_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('job_title_decree_file', payload.skFile);
    return apiService.post<any>(`${this.basePath}job-title/${id}/update`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Delete Job Title
   * Hapus data jabatan (POST + _method=DELETE)
   * @param id - Job title ID
   * @param payload - Memo number dan file untuk delete
   * @returns Promise dengan response API
   */
  async delete(id: string, payload: { memoNumber: string; skFile?: File; }): Promise<any> {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('job_title_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('job_title_deleted_decree_file', payload.skFile);
    return apiService.post<any>(`${this.basePath}job-title/${id}/delete`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const positionsService = new PositionsService();
