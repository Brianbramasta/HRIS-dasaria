import { apiService } from '../../../services/api';
import { 
  BusinessLine, 
  Company, 
  Office, 
  Directorate, 
  Division, 
  Department, 
  Position, 
  EmployeePosition,
  PaginatedResponse,
  TableFilter
} from '../types/organization.types';

// Helper function to build query params
const buildQueryParams = (filter: TableFilter) => {
  const params = new URLSearchParams();
  
  if (filter.search) params.append('q', filter.search);
  if (filter.sortBy) params.append('_sort', filter.sortBy);
  if (filter.sortOrder) params.append('_order', filter.sortOrder);
  if (filter.page) params.append('_page', filter.page.toString());
  if (filter.pageSize) params.append('_limit', filter.pageSize.toString());
  
  return params.toString();
};

// Business Lines API
export const businessLineService = {
  getAll: async (filter: TableFilter): Promise<PaginatedResponse<BusinessLine>> => {
    const queryParams = buildQueryParams(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiService.get<any>(`/business-lines?${queryParams}`);
    const total = response.data.length;
    
    return {
      data: response.data,
      total: parseInt(total),
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(total / filter.pageSize),
    };
  },

  getById: async (id: string): Promise<BusinessLine> => {
    const response = await apiService.get<BusinessLine>(`/business-lines/${id}`);
    return response.data;
  },

  create: async (businessLine: Omit<BusinessLine, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessLine> => {
    const response = await apiService.post<BusinessLine>('/business-lines', {
      ...businessLine,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, businessLine: Partial<BusinessLine>): Promise<BusinessLine> => {
    const response = await apiService.patch<BusinessLine>(`/business-lines/${id}`, {
      ...businessLine,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/business-lines/${id}`);
  },
};

// Companies API

export const companyService = {
  getAll: async (filter: TableFilter): Promise<PaginatedResponse<Company>> => {
    const queryParams = buildQueryParams(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiService.get<any>(`/companies?${queryParams}`);
    const total = response.data.length;
    
    return {
      data: response.data,
      total: parseInt(total),
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(total / filter.pageSize),
    };
  },

  getById: async (id: string): Promise<Company> => {
    const response = await apiService.get<Company>(`/companies/${id}`);
    return response.data;
  },

  create: async (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> => {
    const response = await apiService.post<Company>('/companies', {
      ...company,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, company: Partial<Company>): Promise<Company> => {
    const response = await apiService.patch<Company>(`/companies/${id}`, {
      ...company,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/companies/${id}`);
  },
};

// Update remaining services
// Offices API
export const officeService = {
  getAll: async (filter: TableFilter): Promise<PaginatedResponse<Office>> => {
    const queryParams = buildQueryParams(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiService.get<any>(`/offices?${queryParams}`);
    const total = response.data.length;
    
    return {
      data: response.data,
      total: parseInt(total),
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(total / filter.pageSize),
    };
  },

  getById: async (id: string): Promise<Office> => {
    const response = await apiService.get<Office>(`/offices/${id}`);
    return response.data;
  },

  getByCompanyId: async (companyId: string): Promise<Office[]> => {
    const response = await apiService.get<Office[]>(`/offices?companyId=${companyId}`);
    return response.data;
  },

  create: async (office: Omit<Office, 'id' | 'createdAt' | 'updatedAt'>): Promise<Office> => {
    const response = await apiService.post<Office>('/offices', {
      ...office,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, office: Partial<Office>): Promise<Office> => {
    const response = await apiService.patch<Office>(`/offices/${id}`, {
      ...office,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/offices/${id}`);
  },
};

// Directorates API
export const directorateService = {
  getAll: async (filter: TableFilter): Promise<PaginatedResponse<Directorate>> => {
    const queryParams = buildQueryParams(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiService.get<any>(`/directorates?${queryParams}`);
    const total = response.data.length;
    
    return {
      data: response.data,
      total: parseInt(total),
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(total / filter.pageSize),
    };
  },

  getById: async (id: string): Promise<Directorate> => {
    const response = await apiService.get<Directorate>(`/directorates/${id}`);
    return response.data;
  },

  create: async (directorate: Omit<Directorate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Directorate> => {
    const response = await apiService.post<Directorate>('/directorates', {
      ...directorate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, directorate: Partial<Directorate>): Promise<Directorate> => {
    const response = await apiService.patch<Directorate>(`/directorates/${id}`, {
      ...directorate,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/directorates/${id}`);
  },
};

// Divisions API
export const divisionService = {
  getAll: async (filter: TableFilter): Promise<PaginatedResponse<Division>> => {
    const queryParams = buildQueryParams(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiService.get<any>(`/divisions?${queryParams}`);
    const total = response.data.length;
    
    return {
      data: response.data,
      total: parseInt(total),
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(total / filter.pageSize),
    };
  },

  getById: async (id: string): Promise<Division> => {
    const response = await apiService.get<Division>(`/divisions/${id}`);
    return response.data;
  },

  create: async (division: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>): Promise<Division> => {
    const response = await apiService.post<Division>('/divisions', {
      ...division,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, division: Partial<Division>): Promise<Division> => {
    const response = await apiService.patch<Division>(`/divisions/${id}`, {
      ...division,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/divisions/${id}`);
  },
};

// Departments API
export const departmentService = {
  getAll: async (filter: TableFilter): Promise<PaginatedResponse<Department>> => {
    const queryParams = buildQueryParams(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiService.get<any>(`/departments?${queryParams}`);
    const total = response.data.length;
    
    return {
      data: response.data,
      total: parseInt(total),
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(total / filter.pageSize),
    };
  },

  getById: async (id: string): Promise<Department> => {
    const response = await apiService.get<Department>(`/departments/${id}`);
    return response.data;
  },

  create: async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
    const response = await apiService.post<Department>('/departments', {
      ...department,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, department: Partial<Department>): Promise<Department> => {
    const response = await apiService.patch<Department>(`/departments/${id}`, {
      ...department,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/departments/${id}`);
  },
};

// Positions API
export const positionService = {
  getAll: async (filter: TableFilter): Promise<PaginatedResponse<Position>> => {
    const queryParams = buildQueryParams(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiService.get<any>(`/positions?${queryParams}`);
    const total = response.data.length;
    
    return {
      data: response.data,
      total: parseInt(total),
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(total / filter.pageSize),
    };
  },

  getById: async (id: string): Promise<Position> => {
    const response = await apiService.get<Position>(`/positions/${id}`);
    return response.data;
  },

  create: async (position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>): Promise<Position> => {
    const response = await apiService.post<Position>('/positions', {
      ...position,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, position: Partial<Position>): Promise<Position> => {
    const response = await apiService.patch<Position>(`/positions/${id}`, {
      ...position,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/positions/${id}`);
  },
};

// Employee Positions API
export const employeePositionService = {
  getAll: async (filter: TableFilter): Promise<PaginatedResponse<EmployeePosition>> => {
    const queryParams = buildQueryParams(filter);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiService.get<any>(`/employee-positions?${queryParams}`);
    const total = response.data.length;
    
    return {
      data: response.data,
      total: parseInt(total),
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages: Math.ceil(total / filter.pageSize),
    };
  },

  getById: async (id: string): Promise<EmployeePosition> => {
    const response = await apiService.get<EmployeePosition>(`/employee-positions/${id}`);
    return response.data;
  },

  create: async (employeePosition: Omit<EmployeePosition, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmployeePosition> => {
    const response = await apiService.post<EmployeePosition>('/employee-positions', {
      ...employeePosition,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  update: async (id: string, employeePosition: Partial<EmployeePosition>): Promise<EmployeePosition> => {
    const response = await apiService.patch<EmployeePosition>(`/employee-positions/${id}`, {
      ...employeePosition,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/employee-positions/${id}`);
  },
};