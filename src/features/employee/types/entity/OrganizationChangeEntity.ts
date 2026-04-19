/**
 * Entity Interface - Clean internal application format
 * This is what the application uses internally
 * No API-specific fields or naming conventions
 */

export interface OrganizationChangeEntity {
  // Core Identity
  id: number;
  
  // Employee Information
  employee_id: string;
  employee_name: string;
  
  // Change Details
  change_type_name: string;
  effective_date: string;
  status: string;
  category: string;
  
  // Additional computed fields
  status_perubahan: string;
}

export interface OrganizationChangeDetailEntity {
  // Core Identity
  id: string;
  
  // Employee Information
  employee_id: string;
  employee_name: string;
  marital_status: string;
  dependents: number;
  reason_change: string;
  
  // Documents
  decree_file?: string | null;
  adendum_file?: string | null;
  
  // Position Details
  previous_position: PositionDetailEntity;
  new_position: PositionDetailEntity;
  
  // Metadata
  recommended_by?: string | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PositionDetailEntity {
  // Employee Category
  employee_category: string;
  employee_category_id: string;
  
  // Company Structure
  company: string;
  company_id?: string;
  office: string;
  office_id?: string;
  directorate: string;
  directorate_id?: string;
  division: string;
  division_id?: string;
  department: string;
  department_id?: string;
  unit: string;
  unit_id?: string;
  
  // Position Details
  position: string;
  position_id?: string;
  rank_position: string;
  rank_position_id?: string;
  structural_position: string;
  structural_position_id?: string;
  position_level: string;
  position_level_id?: string;
  
  // Compensation
  base_salary: number;
  marriage_allowance: number;
  position_allowance: number;
  tenure_allowance: number;
  grade: string;
  non_fix_allowance: NonFixAllowanceItemEntity[];
  take_home_pay: number;
  
  // Effective Date
  effective_date: string;
}

export interface NonFixAllowanceItemEntity {
  id: string;
  amount: number;
  allowance_name: string;
}

export interface EmployeeOrganizationChangeHistoryEntity {
  id: number;
  employee_id: string;
  employee_name: string;
  change_type_name: string;
  effective_date: string;
  status: string;
  category: string;
}
