import { FileSummary } from '../../../../types/SharedType';

// API Response DTOs for Employee Positions
export interface EmployeePositionResponse {
  id: string;
  position_name: string;
  job_title_id: string;
  job_title_name: string;
  structural_job_id: string;
  mt_structural_job_name: string;
  directorate_id: string;
  directorate_name: string;
  division_id: string;
  division_name: string;
  department_id: string;
  department_name: string;
  unit_id: string;
  unit_name: string;
  position_description: string;
  position_decree_file: string;
}

export interface EmployeePositionsListResponse {
  current_page: number;
  data: EmployeePositionResponse[];
  per_page: number;
  to: number;
  total: number;
}

export interface EmployeePositionsMetaResponse {
  status: number;
  message: string;
}

export interface EmployeePositionsApiResponse {
  meta: EmployeePositionsMetaResponse;
  data: EmployeePositionsListResponse;
}

export interface PositionListItem {
  id: string;
  name: string;
  grade: string | null;
  jobDescription: string | null;
  structuralJobs: string[];
  structuralJobIds?: (string | null)[];
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface EmployeePositionListItem {
  id: string;
  name: string;
  positionId: string | null;
  positionName: string | null;
  directorateId: string | null;
  directorateName: string | null;
  divisionId: string | null;
  divisionName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  unitId?: string | null;
  unitName: string | null;
  structuralJobId?: string | null;
  structuralJobName: string | null;
  // Dokumentasi: tambahkan field deskripsi mengikuti mapping service
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}
