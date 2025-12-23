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
   * @param payload - Data untuk membuat posisi
   * @returns Promise dengan response API
   */
  async create(payload: {
    name: string;
    positionId: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }): Promise<any> {
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
      `${this.basePath}positions`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Update Position
   * Dokumentasi: Update Posisi - kirim File untuk position_decree_file (POST + _method=PATCH, multipart)
   * @param id - Position ID
   * @param payload - Data untuk update posisi
   * @returns Promise dengan response API
   */
  async update(id: string, payload: {
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
  }): Promise<any> {
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
      `${this.basePath}positions/${id}/update`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Delete Position
   * Delete Posisi (POST + _method=DELETE, multipart)
   * @param id - Position ID
   * @param payload - Memo number dan file ID untuk delete
   * @returns Promise dengan response API
   */
  async delete(id: string, payload: { memoNumber: string; skFileId: string; }): Promise<any> {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('position_deleted_decree_number', payload.memoNumber);
    if (payload.skFileId) form.append('position_deleted_decree_file', payload.skFileId);
    return apiService.post<any>(
      `${this.basePath}positions/${id}/delete`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
}

export const employeePositionsService = new EmployeePositionsService();
