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

  async create(form: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}job-title`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async update(id: string, form: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}job-title/${id}/update`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  async delete(id: string, form: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}job-title/${id}/delete`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const positionsService = new PositionsService();
