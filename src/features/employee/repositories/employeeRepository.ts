import { EmployeeEntity } from '../types/entity/EmployeeEntity';
import { EmployeeListParams } from '../types/dto/EmployeeType';
import { EmployeeModel } from '../models/EmployeeModel';
import employeeMasterDataService from '../services/EmployeeMasterData.service';

/**
 * Repository Layer - Pusat Utama Data Employee
 * 
 * Tanggung Jawab:
 * - Ambil data dari Service
 * - Gunakan Model untuk mapping
 * - Return data yang sudah siap pakai
 * - Error handling dan response validation
 */

export const employeeRepository = {
  /**
   * Get employees list with pagination and filtering
   * @param params - Query parameters for filtering, sorting, and pagination
   * @returns Promise with transformed employee data
   */
  async getEmployees(params?: EmployeeListParams): Promise<{
    data: EmployeeEntity[];
    total: number;
  }> {
    try {
      const response = await employeeMasterDataService.getEmployees(params);
      
      if (response && response.meta?.status === 200 && response.data) {
        const apiResponse = response.data;
        
        // Transform API data to Entity using Model
        const transformedData = EmployeeModel.transformListFromApi(apiResponse.data);
        
        return {
          data: transformedData,
          total: apiResponse.total || 0,
        };
      } else {
        throw new Error('Gagal memuat data karyawan');
      }
    } catch (error) {
      // Re-throw error untuk ditangani di hook
      throw error;
    }
  },

  /**
   * Create new employee
   * @param formData - Employee data in FormData format
   * @returns Promise with API response
   */
  async createEmployee(formData: FormData): Promise<any> {
    try {
      const response = await employeeMasterDataService.createEmployee(formData);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal membuat karyawan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update existing employee
   * @param id - Employee ID
   * @param formData - Updated employee data in FormData format
   * @returns Promise with API response
   */
  async updateEmployee(id: string, formData: FormData): Promise<any> {
    try {
      const response = await employeeMasterDataService.updateEmployee(id, formData);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal memperbarui karyawan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete employee
   * @param id - Employee ID
   * @returns Promise with API response
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      const response = await employeeMasterDataService.deleteEmployee(id);
      
      if (response && response.meta.status === 200) {
        // Success
        return;
      } else {
        throw new Error(response?.meta?.message || 'Gagal menghapus karyawan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get employee detail
   * @param id - Employee ID
   * @returns Promise with employee detail
   */
  async getEmployeeDetail(id: string): Promise<any> {
    try {
      const response = await employeeMasterDataService.getEmployeeDetailPersonal(id);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error('Gagal memuat detail karyawan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get dropdown data for various employee fields
   */
  async getCompanyDropdown(search?: string) {
    return employeeMasterDataService.getCompanyDropdown(search);
  },

  async getOfficeDropdown(search?: string, idCompany?: string) {
    return employeeMasterDataService.getOfficeDropdown(search, idCompany);
  },

  async getDirectorateDropdown(search?: string) {
    return employeeMasterDataService.getDirectorateDropdown(search);
  },

  async getDivisionsByDirectorate(idDirectorate: string, search?: string) {
    return employeeMasterDataService.getDivisionsByDirectorate(idDirectorate, search);
  },

  async getDepartmentsByDivision(idDivision: string, search?: string) {
    return employeeMasterDataService.getDepartmentsByDivision(idDivision, search);
  },

  async getJobTitleDropdown(search?: string) {
    return employeeMasterDataService.getJobTitleDropdown(search);
  },

  async getPositionDropdown(search?: string) {
    return employeeMasterDataService.getPositionDropdown(search);
  },

  async getEmployeeStatusDropdown(search?: string) {
    return employeeMasterDataService.getEmployeeStatusDropdown(search);
  },

  async getUnitDropdownByDepartmentId(departmentId?: string, search?: string) {
    return employeeMasterDataService.getUnitDropdownByDepartmentId(departmentId, search);
  },

  async getStructuralJobDropdown(idJabatanKepangkatan?: string) {
    return employeeMasterDataService.getStructuralJobDropdown(idJabatanKepangkatan);
  },

  async checkActiveEmployee(payload: { email: string; national_id: string }) {
    return employeeMasterDataService.checkActiveEmployee(payload);
  },
};

export default employeeRepository;
