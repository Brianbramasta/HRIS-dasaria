// Service: Employee Contract Data
import apiService, { ApiResponse } from '../../../../services/api';
import {
  ContractData,
  CreateContractPayload,
  CreateContractResponse,
  ContractStatusDropdownItem,
  // ContractHistoryItem, 
  // ContractSummary
} from '../../types/dto/ContractType';

class ContractService {
  private readonly basePath = 'employee-master-data/employees';

  /**
   * Get Contract Data - Mendapatkan data kontrak karyawan
   * @param employeeId - ID karyawan
   * @returns Promise dengan data kontrak dan riwayat
   */
  async getContractData(employeeId: string): Promise<ApiResponse<ContractData>> {
    return apiService.get<ContractData>(`${this.basePath}/${employeeId}/data-kontrak`);
  }

  // edit
  // /api/employee-master-data/employees/{id}/update-contract/{contractId}
  async updateContract(
    employeeId: string,
    contractId: string,
    payload: FormData
  ): Promise<ApiResponse<CreateContractResponse>> {
    console.log('ContractService.updateContract payload:', payload);
    payload.append('_method', 'PATCH');
    console.log('ContractService.updateContract payload 2:', payload);

    return apiService.post<CreateContractResponse>(
      `${this.basePath}/${employeeId}/update-contract/${contractId}`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }
  // /api/employee-master-data/employees/{id}/contract-for-edit
  async getContractForEdit(employeeId: string): Promise<ApiResponse<ContractData>> {
    return apiService.get<ContractData>(`${this.basePath}/${employeeId}/contract-for-edit`);
  }

   /**
   * Dropdown: Status Kontrak
   * @param search - Optional search query untuk filter status kontrak
   * @returns Promise dengan array status kontrak
   */
  async getContractStatusDropdown(search?: string): Promise<ContractStatusDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<ContractStatusDropdownItem[]>(`${this.basePath}/contract-status-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

   // /api/employee-master-data/contract-end-status-dropdown
  async getContractEndStatusDropdown(search?: string): Promise<any[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<any[]>(`${this.basePath}/contract-end-status-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }
  /**
   * Create Contract - Membuat kontrak baru untuk karyawan
   * @param employeeId - ID karyawan
   * @param payload - Data kontrak baru
   * @returns Promise dengan response API
   */
  async createContract(
    employeeId: string,
    payload: CreateContractPayload
  ): Promise<ApiResponse<CreateContractResponse>> {
    // const formData = new FormData();
    // formData.append('contract_status_id', payload.contract_status.toString());
    // formData.append('last_contract_signed_date', payload.last_contract_signed_date);
    // formData.append('end_date', payload.end_date);
    // formData.append('contract_type', payload.contract_type.toString());
    // formData.append('contract_number', payload.contract_number);
    // formData.append('file_contract', payload.file_contract);
    

    return apiService.post<CreateContractResponse>(
      `${this.basePath}/${employeeId}/kontrak`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  // /api/employee-master-data/employees/contract-type-dropdown
  /**
   * Dropdown: Jenis Kontrak
   * @param search - Optional search query untuk filter jenis kontrak
   * @returns Promise dengan array jenis kontrak
   */
  async getContractTypeDropdown(search?: string): Promise<any[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<any[]>(`${this.basePath}/contract-type-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }
}

export const contractService = new ContractService();
export default contractService;
