export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessLine extends BaseEntity {
  name: string;
  description: string;
  skFile?: string;
  memoFile?: string;
}

export interface Company extends BaseEntity {
  name: string;
  description: string;
  businessLineId: string;
  businessLine?: BusinessLine;
  details: string;
}

export interface Office extends BaseEntity {
  name: string;
  description: string;
  skFile?: string;
  memoFile?: string;
}

export interface Directorate extends BaseEntity {
  name: string;
  description: string;
  skFile?: string;
  memoFile?: string;
}

export interface Division extends BaseEntity {
  name: string;
  description: string;
  directorateId: string;
  directorate?: Directorate;
  skFile?: string;
  memoFile?: string;
}

export interface Department extends BaseEntity {
  name: string;
  skFile?: string;
  memoFile?: string;
  divisionId: string;
  division?: Division;
}

export interface Position extends BaseEntity {
  name: string;
  grade: string;
  jobDescription: string;
  directSubordinates: string[];
  skFile?: string;
  memoFile?: string;
}

export interface EmployeePosition extends BaseEntity {
  name: string;
  positionId: string;
  position?: Position;
  directorateId: string;
  directorate?: Directorate;
  divisionId: string;
  division?: Division;
  departmentId: string;
  department?: Department;
  skFile?: string;
  memoFile?: string;
}

export type OrganizationEntity = 
  | BusinessLine 
  | Company 
  | Office 
  | Directorate 
  | Division 
  | Department 
  | Position 
  | EmployeePosition;

export interface OrganizationState {
  businessLines: BusinessLine[];
  companies: Company[];
  offices: Office[];
  directorates: Directorate[];
  divisions: Division[];
  departments: Department[];
  positions: Position[];
  employeePositions: EmployeePosition[];
  loading: boolean;
  error: string | null;
}

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface TableFilter {
  search: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}