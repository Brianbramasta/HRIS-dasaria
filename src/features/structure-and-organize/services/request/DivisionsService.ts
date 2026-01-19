import { apiService } from '../../../../services/api';

class DivisionsService {
  private readonly basePath = '/organizational-structure/division-master-data/';

  /**
   * Get Divisions List
   * @param filter - Filter parameters
   * @returns Promise dengan data divisi
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}divisions${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Division by ID
   * @param id - Division ID
   * @returns Promise dengan data divisi
   */
  async getById(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}divisions/${id}/show`);
  }

  /**
   * Create Division
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async create(formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}divisions`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Update Division
   * @param id - Division ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async update(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}divisions/${id}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Delete Division
   * @param id - Division ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async delete(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}divisions/${id}/delete`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Get Divisions Dropdown
   * Mengambil dropdown divisi untuk kebutuhan select
   * @param search - Optional search query untuk filter
   * @returns Promise dengan data divisi untuk dropdown
   */
  async getDropdown(search?: string): Promise<any> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const qs = params.toString();
    return apiService.get<any>(`${this.basePath}divisions-dropdown${qs ? `?${qs}` : ''}`);
  }
}

export const divisionsService = new DivisionsService();
