import { EmployeeDTO } from '../models/EmployeeModel';

const dummyEmployees: EmployeeDTO[] = [
  {
    id: '1',
    employee_id: 'EMP001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@company.com',
    phone: '+6281234567890',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    hire_date: '2020-01-15',
    status: 'active',
    salary: 15000000,
    manager_id: '2',
    address_street: 'Jl. Sudirman No. 123',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12345',
  },
  {
    id: '2',
    employee_id: 'EMP002',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+6281234567891',
    department: 'Engineering',
    position: 'Engineering Manager',
    hire_date: '2019-03-20',
    status: 'active',
    salary: 25000000,
    address_street: 'Jl. Thamrin No. 456',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12346',
  },
  {
    id: '3',
    employee_id: 'EMP003',
    first_name: 'Michael',
    last_name: 'Johnson',
    email: 'michael.johnson@company.com',
    phone: '+6281234567892',
    department: 'Human Resources',
    position: 'HR Specialist',
    hire_date: '2021-06-10',
    status: 'active',
    salary: 12000000,
    manager_id: '4',
    address_street: 'Jl. Gatot Subroto No. 789',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12347',
  },
  {
    id: '4',
    employee_id: 'EMP004',
    first_name: 'Sarah',
    last_name: 'Williams',
    email: 'sarah.williams@company.com',
    phone: '+6281234567893',
    department: 'Human Resources',
    position: 'HR Manager',
    hire_date: '2018-09-05',
    status: 'active',
    salary: 20000000,
    address_street: 'Jl. Rasuna Said No. 321',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12348',
  },
  {
    id: '5',
    employee_id: 'EMP005',
    first_name: 'David',
    last_name: 'Brown',
    email: 'david.brown@company.com',
    phone: '+6281234567894',
    department: 'Finance',
    position: 'Financial Analyst',
    hire_date: '2022-02-28',
    status: 'active',
    salary: 13000000,
    manager_id: '6',
    address_street: 'Jl. MH Thamrin No. 654',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12349',
  },
  {
    id: '6',
    employee_id: 'EMP006',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+6281234567895',
    department: 'Finance',
    position: 'Finance Manager',
    hire_date: '2017-11-15',
    status: 'active',
    salary: 22000000,
    address_street: 'Jl. Sudirman No. 987',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12350',
  },
  {
    id: '7',
    employee_id: 'EMP007',
    first_name: 'Robert',
    last_name: 'Miller',
    email: 'robert.miller@company.com',
    phone: '+6281234567896',
    department: 'Marketing',
    position: 'Marketing Coordinator',
    hire_date: '2023-04-12',
    status: 'active',
    salary: 10000000,
    manager_id: '8',
    address_street: 'Jl. Gatot Subroto No. 159',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12351',
  },
  {
    id: '8',
    employee_id: 'EMP008',
    first_name: 'Lisa',
    last_name: 'Wilson',
    email: 'lisa.wilson@company.com',
    phone: '+6281234567897',
    department: 'Marketing',
    position: 'Marketing Manager',
    hire_date: '2019-07-22',
    status: 'active',
    salary: 18000000,
    address_street: 'Jl. Rasuna Said No. 753',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12352',
  },
  {
    id: '9',
    employee_id: 'EMP009',
    first_name: 'James',
    last_name: 'Taylor',
    email: 'james.taylor@company.com',
    phone: '+6281234567898',
    department: 'Operations',
    position: 'Operations Supervisor',
    hire_date: '2020-10-30',
    status: 'inactive',
    salary: 14000000,
    manager_id: '10',
    address_street: 'Jl. MH Thamrin No. 852',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12353',
  },
  {
    id: '10',
    employee_id: 'EMP010',
    first_name: 'Patricia',
    last_name: 'Anderson',
    email: 'patricia.anderson@company.com',
    phone: '+6281234567899',
    department: 'Operations',
    position: 'Operations Manager',
    hire_date: '2016-05-18',
    status: 'active',
    salary: 21000000,
    address_street: 'Jl. Sudirman No. 456',
    address_city: 'Jakarta',
    address_province: 'DKI Jakarta',
    address_postal_code: '12354',
  },
];

export const FetchEmployees = async (): Promise<EmployeeDTO[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return dummyEmployees;
};

export const FetchEmployeeById = async (id: string): Promise<EmployeeDTO | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return dummyEmployees.find(emp => emp.id === id) || null;
};

export const CreateEmployee = async (employee: Omit<EmployeeDTO, 'id'>): Promise<EmployeeDTO> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newEmployee: EmployeeDTO = {
    ...employee,
    id: (dummyEmployees.length + 1).toString(),
  };
  dummyEmployees.push(newEmployee);
  return newEmployee;
};

export const UpdateEmployee = async (id: string, updates: Partial<EmployeeDTO>): Promise<EmployeeDTO> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyEmployees.findIndex(emp => emp.id === id);
  if (index === -1) {
    throw new Error('Employee not found');
  }
  dummyEmployees[index] = { ...dummyEmployees[index], ...updates };
  return dummyEmployees[index];
};

export const DeleteEmployee = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = dummyEmployees.findIndex(emp => emp.id === id);
  if (index === -1) {
    throw new Error('Employee not found');
  }
  dummyEmployees.splice(index, 1);
};
