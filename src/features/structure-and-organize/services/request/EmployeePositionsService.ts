import { apiService } from '../../../../services/api';

class EmployeePositionsService {
  private readonly basePath = '/organizational-structure/position-master-data/';

  /**
   * Get Positions List
   * @param filter - Filter parameters
   * @returns Promise dengan data posisi
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}positions${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Position Detail
   * Ambil detail Posisi (GET /organizational-structure/positions/{id_position})
   * @param id - Position ID
   * @returns Promise dengan detail posisi
   */
  async detail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}positions/${id}/show`);
  }

  /**
   * Create Position
   * Dokumentasi: Create Posisi - kirim File untuk position_decree_file (multipart/form-data)
   * @param form - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async create(form: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}positions`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Update Position
   * Dokumentasi: Update Posisi - kirim File untuk position_decree_file (POST + _method=PATCH, multipart)
   * @param id - Position ID
   * @param form - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async update(id: string, form: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}positions/${id}/update`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Delete Position
   * Delete Posisi (POST + _method=DELETE, multipart)
   * @param id - Position ID
   * @param form - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async delete(id: string, form: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}positions/${id}/delete`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
}

export const employeePositionsService = new EmployeePositionsService();
