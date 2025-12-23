import { apiService } from '../../../../services/api';

class DirectoratesService {
  private readonly basePath = '/organizational-structure/directorate-master-data/';

  /**
   * Get Directorates List
   * @param filter - Filter parameters
   * @returns Promise dengan data direktorat
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}directorates${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Directorates Dropdown
   * @param search - Optional search query untuk filter
   * @returns Promise dengan data direktorat untuk dropdown
   */
  async getDropdown(search?: string): Promise<any> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${this.basePath}directorates-dropdown${qs}`);
  }

  /**
   * Create Directorate
   * @param payload - Data untuk membuat direktorat
   * @returns Promise dengan response API
   */
  async create(payload: { name: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> {
    const formData = new FormData();
    formData.append('directorate_name', payload.name);
    formData.append('directorate_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('directorate_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('directorate_decree_file', payload.skFile);
    }
    return apiService.post<any>(
      `${this.basePath}directorates`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Update Directorate
   * @param id - Directorate ID
   * @param payload - Data untuk update direktorat
   * @returns Promise dengan response API
   */
  async update(id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (payload.name !== undefined) formData.append('directorate_name', payload.name);
    formData.append('directorate_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('directorate_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('directorate_decree_file', payload.skFile);
    }
    return apiService.post<any>(
      `${this.basePath}directorates/${id}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Delete Directorate
   * @param id - Directorate ID
   * @param payload - Memo number dan file untuk delete
   * @returns Promise dengan response API
   */
  async delete(id: string, payload: { memoNumber: string; skFile: File; }): Promise<any> {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('directorate_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) formData.append('directorate_deleted_decree_file', payload.skFile);
    return apiService.post<any>(
      `${this.basePath}directorates/${id}/delete`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
}

export const directoratesService = new DirectoratesService();
