import { apiService } from '../../../../services/api';

class OfficesService {
  private readonly basePath = '/organizational-structure/office-master-data/';

  /**
   * Get Offices List
   * @param filter - Filter parameters
   * @returns Promise dengan data kantor
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}offices${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Office by ID
   * @param id - Office ID
   * @returns Promise dengan data kantor
   */
  async getById(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}offices/${id}/show`);
  }

  /**
   * Create Office
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async create(formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}offices`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Update Office
   * @param id - Office ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async update(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}offices/${id}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Delete Office
   * @param id - Office ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async delete(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}offices/${id}/delete`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
}

export const officesService = new OfficesService();
