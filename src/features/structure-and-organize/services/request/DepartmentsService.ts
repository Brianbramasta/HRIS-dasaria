import { apiService } from '../../../../services/api';

class DepartmentsService {
  private readonly basePath = '/organizational-structure/department-master-data/';

  /**
   * Get Departments List
   * @param filter - Filter parameters
   * @returns Promise dengan data departemen
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}departments${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Department by ID
   * @param id - Department ID
   * @returns Promise dengan data departemen
   */
  async getById(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}departments/${id}/show`);
  }

  /**
   * Get Departments Dropdown
   * @param search - Optional search query untuk filter
   * @returns Promise dengan data departemen untuk dropdown
   */
  async getDropdown(search?: string): Promise<any> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${this.basePath}departments-dropdown${qs}`);
  }

  /**
   * Create Department
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async create(formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}departments`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Update Department
   * @param id - Department ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async update(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}departments/${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Delete Department
   * @param id - Department ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async delete(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}departments/${id}/delete`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const departmentsService = new DepartmentsService();
