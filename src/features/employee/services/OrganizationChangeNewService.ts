import { apiService } from '@/services/api';
import {
  ApiResponse,
  OrganizationChangeListResponse,
  OrganizationChangeDetail,
  StoreOrganizationChangePayload,
  StoreOrganizationChangeResponse,
  UploadDocumentPayload,
  UploadDocumentResponse,
  EmployeeDetailResponse,
  OrganizationChangeQueryParams,
} from '../types/dto/OrganizationChangeType';

class OrganizationChangeNewService {
  private readonly basePath = '/employee-master-data/organization-changes';

  /**
   * Get List Perubahan Organisasi
   * GET /api/employee-master-data/organization-changes
   */
  async getOrganizationChanges(params?: OrganizationChangeQueryParams): Promise<ApiResponse<OrganizationChangeListResponse>> {
    return apiService.get<OrganizationChangeListResponse>(this.basePath, { params });
  }

  /**
   * Get Detail Perubahan Organisasi
   * GET /api/employee-master-data/organization-changes/{changeId}/show
   */
  async getOrganizationChangeDetail(changeId: string): Promise<ApiResponse<OrganizationChangeDetail>> {
    return apiService.get<OrganizationChangeDetail>(`${this.basePath}/${changeId}/show`);
  }

  /**
   * Get Perubahan Organisasi by Employee
   * GET /api/employee-master-data/organization-changes/employee/{employeeId}/show
   */
  async getOrganizationChangesByEmployee(employeeId: string): Promise<ApiResponse<EmployeeDetailResponse>> {
    return apiService.get<EmployeeDetailResponse>(`${this.basePath}/employee/${employeeId}/show`);
  }

  /**
   * Store Perubahan Organisasi
   * POST /api/employee-master-data/organization-changes
   */
  async storeOrganizationChange(payload: StoreOrganizationChangePayload): Promise<ApiResponse<StoreOrganizationChangeResponse>> {
    const formData = new FormData();
    
    // Add all string fields
    Object.keys(payload).forEach(key => {
      const value = payload[key as keyof StoreOrganizationChangePayload];
      if (value !== undefined && value !== null) {
        if (key === 'non_fix_allowance' && Array.isArray(value)) {
          // Handle non_fix_allowance array
          value.forEach((item, index) => {
            formData.append(`non_fix_allowance[${index}][non_fix_allowance_id]`, item.non_fix_allowance_id || item.id);
            formData.append(`non_fix_allowance[${index}][amount]`, item.amount.toString());
          });
        } else if (value instanceof File) {
          // Handle file uploads
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          // Handle string values
          formData.append(key, value as string);
        }
      }
    });

    return apiService.post<StoreOrganizationChangeResponse>(this.basePath, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Upload Dokumen Perubahan Organisasi
   * POST /api/employee-master-data/organization-changes/{changeId}/upload-doc
   */
  async uploadDocument(changeId: string, payload: UploadDocumentPayload): Promise<ApiResponse<UploadDocumentResponse>> {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    
    if (payload.decree_file) {
      formData.append('decree_file', payload.decree_file);
    }
    
    if (payload.adendum_file) {
      formData.append('adendum_file', payload.adendum_file);
    }

    return apiService.post<UploadDocumentResponse>(`${this.basePath}/${changeId}/upload-doc`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const organizationChangeNewService = new OrganizationChangeNewService();
export default organizationChangeNewService;
