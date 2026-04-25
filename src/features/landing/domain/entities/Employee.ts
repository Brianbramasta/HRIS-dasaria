export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'terminated';
  salary: number;
  manager_id?: string;
  address: {
    street: string;
    city: string;
    province: string;
    postal_code: string;
  };
}

export interface EmployeeRepository {
  GetAll(): Promise<Employee[]>;
  GetById(id: string): Promise<Employee | null>;
  Create(employee: Omit<Employee, 'id'>): Promise<Employee>;
  Update(id: string, employee: Partial<Employee>): Promise<Employee>;
  Delete(id: string): Promise<void>;
}
