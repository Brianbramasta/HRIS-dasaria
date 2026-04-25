import { Employee } from '../../domain/entities/Employee';

export interface EmployeeDTO {
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
  address_street: string;
  address_city: string;
  address_province: string;
  address_postal_code: string;
}

export const MapToEmployee = (dto: EmployeeDTO): Employee => {
  return {
    id: dto.id,
    employee_id: dto.employee_id,
    first_name: dto.first_name,
    last_name: dto.last_name,
    email: dto.email,
    phone: dto.phone,
    department: dto.department,
    position: dto.position,
    hire_date: dto.hire_date,
    status: dto.status,
    salary: dto.salary,
    manager_id: dto.manager_id,
    address: {
      street: dto.address_street,
      city: dto.address_city,
      province: dto.address_province,
      postal_code: dto.address_postal_code,
    },
  };
};

export const MapToEmployeeDTO = (employee: Employee): EmployeeDTO => {
  return {
    id: employee.id,
    employee_id: employee.employee_id,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    position: employee.position,
    hire_date: employee.hire_date,
    status: employee.status,
    salary: employee.salary,
    manager_id: employee.manager_id,
    address_street: employee.address.street,
    address_city: employee.address.city,
    address_province: employee.address.province,
    address_postal_code: employee.address.postal_code,
  };
};
