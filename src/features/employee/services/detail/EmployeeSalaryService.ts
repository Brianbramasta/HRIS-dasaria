import { apiService } from '@/services/api';
import { TemporarySalaryQueryParams, EmployeeSalaryShowResponse } from '../../types/dto/EmployeeSalaryType';

class EmployeeSalaryService {
  private readonly basePath = '/employee-master-data/employees';

  /**
   * Get Temporary Salary
   * GET /api/employee-master-data/employees/{employee_id}/temporary-salary
   */
  async getTemporarySalary(employeeId: string, params: TemporarySalaryQueryParams): Promise<any> {
    const qs = apiService.buildQueryString(params as any);
    return apiService.get<any>(`${this.basePath}/${employeeId}/temporary-salary${qs ? `?${qs}` : ''}`);
  }

  /**
   * Update Temporary Salary
   * POST /api/employee-master-data/employees/{employee_id}/update-temporary-salary
   * _method: PATCH
   */
  async updateTemporarySalary(employeeId: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}/${employeeId}/update-temporary-salary`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Get Employee Salary Details
   * GET /api/employee-master-data/employees/{employee_id}/salaries/show
   */
  async getEmployeeSalaryShow(employeeId: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}/salaries/${employeeId}/show`);
  }
}

export const employeeSalaryService = new EmployeeSalaryService();
