/**
 * DTO Interface - Raw API response format
 * This represents the exact structure from backend API
 * Should NOT be used directly in UI components
 */

export interface EmployeeDto {
  avatar?: string | null;
  birth_date?: string;
  company?: string;
  contract_remaining?: string | null;
  department?: string;
  unit?: string | null;
  directorate?: string;
  division?: string;
  email: string;
  employee_category?: string;
  employee_data_status?: string;
  employee_id?: string;
  employment_status?: string;
  end_date?: string;
  full_name: string;
  grade?: string;
  id: string;
  job_title?: string;
  structural_job?: string;
  office?: string;
  payroll_status?: string;
  position?: string;
  position_level?: string;
  start_date?: string;
  user_access?: string | null;
}

// Interface for API pagination response
export interface EmployeeListResponseDto {
  data: EmployeeDto[];
  total: number;
  page?: number;
  limit?: number;
}
