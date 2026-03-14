import { apiService } from '@/services/api';
import {
  ApiResponse,
  ContractExtensionListResponse,
  ContractExtensionDetailResult,
  ExtensionStatusItem,
  EmployeesNearContractEndResponse,
  UpdateContractResponse,
  ProcessContractExtensionResponse,
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
   * Get Karyawan Akan Habis Kontrak
   * GET /api/employee-master-data/contract-extensions/employees-near-contract-end
   */
  async getEmployeesNearContractEnd(): Promise<ApiResponse<EmployeesNearContractEndResponse>> {
    return apiService.get<EmployeesNearContractEndResponse>(`${this.basePath}/employees-near-contract-end`);
  }

  /**
   * Get Dropdown Extension Status
   * GET /api/employee-master-data/contract-extensions/dropdown-extension-status
   */
  async getExtensionStatuses(): Promise<ApiResponse<ExtensionStatusItem[]>> {
    return apiService.get<ExtensionStatusItem[]>(`${this.basePath}/dropdown-extension-status`);
  }

  /**
   * Get Detail Perpanjangan Kontrak
   * GET /api/employee-master-data/contract-extensions/{id}/detail
   */
  async getContractExtensionDetail(id: string): Promise<ApiResponse<ContractExtensionDetailResult>> {
    return apiService.get<ContractExtensionDetailResult>(`${this.basePath}/${id}/detail`);
  }

  /**
   * Update Perpanjangan Kontrak
   * POST /api/employee-master-data/contract-extensions/{id}/update-contract
   */
  async updateContract(id: string, formData: FormData): Promise<ApiResponse<UpdateContractResponse>> {
    return apiService.post<UpdateContractResponse>(`${this.basePath}/${id}/update-contract`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Proses Perpanjangan Kontrak
   * PATCH /api/employee-master-data/contract-extensions/{id}/process
   */
  async processContractExtension(id: string): Promise<ApiResponse<ProcessContractExtensionResponse>> {
    return apiService.patch<ProcessContractExtensionResponse>(`${this.basePath}/${id}/process`);
  }
}

export const contractExtensionsService = new ContractExtensionsService();
