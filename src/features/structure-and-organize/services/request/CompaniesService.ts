import { apiService } from '../../../../services/api';

class CompaniesService {
  private readonly basePath = '/organizational-structure/company-master-data/';

  /**
   * Get Companies List
   * @param filter - Filter parameters
   * @returns Promise dengan data perusahaan
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}companies${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Companies Dropdown
   * @returns Promise dengan data perusahaan untuk dropdown
   */
  async getDropdown(): Promise<any> {
    return apiService.get<any>(`${this.basePath}companies-dropdown`);
  }

  /**
   * Get Company Detail
   * @param id - Company ID
   * @returns Promise dengan detail perusahaan
   */
  async getDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}companies/${id}/detail`);
  }

  /**
   * Create Company
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async create(formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}companies`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Update Company
   * @param id - Company ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async update(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}companies/${id}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Update Company Detail by UUID
   * Dokumentasi: Update data perusahaan by UUID sesuai kontrak API (PATCH)
   * @param id - Company ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async updateDetailByUuid(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}companies/${id}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Delete Company
   * @param id - Company ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async delete(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}companies/${id}/delete`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Add Company Documents
   * Dokumentasi: Menambahkan dokumen perusahaan sesuai kontrak API
   * @param id - Company ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async addDocuments(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}companies/${id}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Delete Company Documents
   * Dokumentasi: Menghapus dokumen perusahaan sesuai kontrak API
   * @param id - Company ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async deleteDocuments(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(
      `${this.basePath}companies/${id}/deletedocuments`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
}

export const companiesService = new CompaniesService();
