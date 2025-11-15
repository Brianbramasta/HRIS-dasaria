// Types yang mengikuti kontrak API Structure & Organize

export interface FileSummary {
  fileName: string;
  fileUrl: string;
  fileType: string;
  size: string | number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TableFilter {
  search: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

// List item types
export interface BusinessLineListItem {
  id: string;
  name: string;
  description: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface CompanyListItem {
  id: string;
  name: string;
  description: string | null;
  businessLineId: string | null;
  businessLineName: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface OfficeListItem {
  id: string;
  name: string;
  description: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface DirectorateListItem {
  id: string;
  name: string;
  description: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface DivisionListItem {
  id: string;
  name: string;
  description: string | null;
  directorateId: string | null;
  directorateName: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface DepartmentListItem {
  id: string;
  name: string;
  description: string | null;
  divisionId: string | null;
  divisionName: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

export interface PositionListItem {
  id: string;
  name: string;
  grade: string | null;
  jobDescription: string | null;
  directSubordinates: string[];
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
  startDate: string | null;
  endDate: string | null;
  memoNumber: string | null;
  skFile: FileSummary | null;
}

// Detail response types
export interface BusinessLineDetailResponse {
  businessLine: {
    id: string;
    name: string;
    description: string | null;
    memoNumber: string | null;
    skFile: FileSummary | null;
  };
  personalFiles: FileSummary[];
  companies: { id: string; name: string; details: string | null }[];
}

export interface CompanyDetailResponse {
  company: {
    id: string;
    name: string;
    logo: FileSummary | null;
    businessLineName: string | null;
    description: string | null;
    address: string | null;
    employeeCount: number | null;
    postalCode: string | null;
    email: string | null;
    phone: string | null;
    industry: string | null;
    founded: string | number | null;
    type: string | null;
    website: string | null;
    createdAt: string | null;
    memoNumber: string | null;
    skFile: FileSummary | null;
  };
  branches: { id: string; name: string; address: string | null; employeeCount: number | null }[];
  documents: FileSummary[];
}