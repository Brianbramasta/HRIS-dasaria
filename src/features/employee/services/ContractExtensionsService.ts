import { apiService } from '@/services/api';
import {
  ApiResponse,
  ContractExtensionListResponse,
  ContractExtensionDetailResult,
  ExtensionStatusItem,
} from '../types/dto/ContractExtensionType';

class ContractExtensionsService {
  private readonly basePath = '/employee-master-data/contract-extensions';

  /**
   * Get List Perpanjangan Kontrak
   * GET /api/employee-master-data/contract-extensions/index
   */
  async getContractExtensions(params?: any): Promise<ApiResponse<ContractExtensionListResponse>> {
    return apiService.get<ContractExtensionListResponse>(`${this.basePath}/index`, { params });
  }

  /**
   * Get Detail Perpanjangan Kontrak
   * GET /api/employee-master-data/contract-extensions/{id}/detail
   */
  async getContractExtensionDetail(id: string): Promise<ApiResponse<ContractExtensionDetailResult>> {
    return apiService.get<ContractExtensionDetailResult>(`${this.basePath}/${id}/detail`);
  }

  /**
   * Get Dropdown Extension Status
   * GET /api/employee-master-data/contract-extensions/dropdown-extension-status
   */
  async getExtensionStatuses(): Promise<ApiResponse<ExtensionStatusItem[]>> {
    return apiService.get<ExtensionStatusItem[]>(`${this.basePath}/dropdown-extension-status`);
  }

  /**
   * Process Request Decision (Update)
   * POST /api/employee-master-data/contract-extensions/{id}/process-request-decision
   */
  async processRequestDecision(id: string, formData: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/${id}/process-request-decision`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const contractExtensionsService = new ContractExtensionsService();
