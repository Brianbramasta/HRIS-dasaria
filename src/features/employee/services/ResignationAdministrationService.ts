import { apiService } from '@/services/api';
import {
  ApiResponse,
  ResignationAdministrationListResponse,
  ResignationAdministrationDetailResult,
  AdministrationPopupResult,
  DocumentTypeItem,
} from '../types/dto/ResignationType';

class ResignationAdministrationService {
  private readonly basePath = '/employee-master-data/resignation/request-administration';

  async getPopup(nip: string): Promise<ApiResponse<AdministrationPopupResult>> {
    return apiService.get<AdministrationPopupResult>(`${this.basePath}/${nip}/popup`);
  }

  async store(formData: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/store`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async getIndex(params?: any): Promise<ApiResponse<ResignationAdministrationListResponse>> {
    return apiService.get<ResignationAdministrationListResponse>(`${this.basePath}/index`, { params });
  }

  async getDetail(id: string): Promise<ApiResponse<ResignationAdministrationDetailResult>> {
    return apiService.get<ResignationAdministrationDetailResult>(`${this.basePath}/${id}/show`);
  }

  async uploadDocuments(id: string, formData: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/${id}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async submit(id: string): Promise<ApiResponse<any>> {
    const form = new FormData();
    form.append('_method', 'PATCH');
    return apiService.post<any>(`${this.basePath}/${id}/submit`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async getDocumentTypes(): Promise<ApiResponse<DocumentTypeItem[]>> {
    return apiService.get<DocumentTypeItem[]>('/employee-master-data/resignation/dropdown-type-file');
  }
}

export const resignationAdministrationService = new ResignationAdministrationService();
export default resignationAdministrationService;
