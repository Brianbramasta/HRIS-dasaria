import { EmployeeDto } from '../types/dto/EmployeeDto';
import { EmployeeEntity } from '../types/entity/EmployeeEntity';

/**
 * Model layer for transforming API data to internal application format
 * Following clean architecture principles - this is the ONLY place where API transformation happens
 */

export class EmployeeModel {
  /**
   * Transform API response data to Entity interface
   * @param dto - Raw data from API (EmployeeDto)
   * @returns Transformed data in internal Entity format
   */
  static transformFromApi(dto: EmployeeDto): EmployeeEntity {
    return {
      // Core Identity
      id: dto.employee_id || dto.id || '',
      full_name: dto.full_name,
      email: dto.email,
      avatar: dto.avatar || undefined,
      
      // Personal Information
      birth_date: dto.birth_date,
      
      // Position & Organization
      position: dto.position || '',
      job_title: dto.job_title || '',
      structural_job: dto.structural_job || '',
      position_level: dto.position_level || '',
      grade: dto.grade || '',
      
      // Company & Structure
      company: dto.company || '',
      office: dto.office || '',
      department: dto.department || '',
      unit: dto.unit ?? null,
      division: dto.division || '',
      directorate: dto.directorate || '',
      
      // Employment Details
      start_date: dto.start_date || '',
      end_date: dto.end_date,
      employment_status: dto.employment_status,
      payroll_status: dto.payroll_status || '-',
      employee_data_status: dto.employee_data_status,
      employee_category: dto.employee_category,
      contract_remaining: dto.contract_remaining || null,
      
      // Access & Permissions
      user_access: dto.user_access || undefined,
    };
  }

  /**
   * Transform array of API data to array of Entity
   * @param dtoList - Array of raw data from API
   * @returns Array of transformed data in internal Entity format
   */
  static transformListFromApi(dtoList: EmployeeDto[]): EmployeeEntity[] {
    return dtoList.map(item => this.transformFromApi(item));
  }
}
