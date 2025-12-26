// Service: Employee Contract Data
import apiService, { ApiResponse } from '../../../../services/api';

// Response Types
export interface ContractSummary {
  status_kontrak: string;
  ttd_kontrak_terakhir: string;
  berakhir_kontrak: string;
  jenis_kontrak: string;
  lama_bekerja: string;
  sisa_kontrak: string;
  kontrak_ke: number;
  status_berakhir: string;
  kontrak_aktif?: string;
  contract_status_id?: string;
  contract_status_name?: string;
  contract_end_status_id?: string;
  contract_end_status_name?: string;
}

export interface ContractHistoryItem {
  id: string;
  employee_id: string;
  contract_number: string;
  contract_type: string;
  contract_status: string;
  last_contract_signed_date: string;
  end_date: string;
  file_contract: string;
  note: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ContractData {
  summary: ContractSummary;
  contracts: ContractHistoryItem[];
}

// Request Types
export interface CreateContractPayload {
  contract_status: number; // 1=active, 2=inactive, 3=probation, 4=resigned
  last_contract_signed_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  contract_type: number; // 1=PKWT, 2=PKWTT
  contract_number: string;
  file_contract: File;
}

export interface CreateContractResponse {
  employee_id: string;
  contract_status: number;
  last_contract_signed_date: string;
  end_date: string;
  contract_type: number;
  contract_number: string;
  file_contract: string;
  id: string;
  updated_at: string;
  created_at: string;
}

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
   * Create Contract - Membuat kontrak baru untuk karyawan
   * @param employeeId - ID karyawan
   * @param payload - Data kontrak baru
   * @returns Promise dengan response API
   */
  async createContract(
    employeeId: string,
    payload: CreateContractPayload
  ): Promise<ApiResponse<CreateContractResponse>> {
    const formData = new FormData();
    formData.append('contract_status', payload.contract_status.toString());
    formData.append('last_contract_signed_date', payload.last_contract_signed_date);
    formData.append('end_date', payload.end_date);
    formData.append('contract_type', payload.contract_type.toString());
    formData.append('contract_number', payload.contract_number);
    formData.append('file_contract', payload.file_contract);

    return apiService.post<CreateContractResponse>(
      `${this.basePath}/${employeeId}/kontrak`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }
}

export const contractService = new ContractService();
export default contractService;
