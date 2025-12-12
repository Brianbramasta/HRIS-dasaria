// Service: Employee Master Data – Create Karyawan sesuai kontrak API karyawan
import apiService, { ApiResponse } from '../../../services/api';

class EmployeeMasterDataService {
  private readonly basePath = 'employee-master-data';

  // createEmployee: kirim FormData ke endpoint employees (multipart/form-data)
  async createEmployee(payload: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/employees`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const employeeMasterDataService = new EmployeeMasterDataService();
export default employeeMasterDataService;

