import { Employee, EmployeeRepository } from '../entities/Employee';

export const GetEmployees = (repository: EmployeeRepository) => {
  return async (): Promise<Employee[]> => {
    return await repository.GetAll();
  };
};

export const GetEmployeeById = (repository: EmployeeRepository) => {
  return async (id: string): Promise<Employee | null> => {
    return await repository.GetById(id);
  };
};

export const CreateEmployee = (repository: EmployeeRepository) => {
  return async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    return await repository.Create(employee);
  };
};

export const UpdateEmployee = (repository: EmployeeRepository) => {
  return async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    return await repository.Update(id, employee);
  };
};

export const DeleteEmployee = (repository: EmployeeRepository) => {
  return async (id: string): Promise<void> => {
    return await repository.Delete(id);
  };
};
