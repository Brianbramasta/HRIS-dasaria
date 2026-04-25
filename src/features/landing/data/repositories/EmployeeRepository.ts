import { Employee, EmployeeRepository } from '../../domain/entities/Employee';
import { MapToEmployee, MapToEmployeeDTO } from '../models/EmployeeModel';
import {
  FetchEmployees,
  FetchEmployeeById,
  CreateEmployee as CreateEmployeeService,
  UpdateEmployee as UpdateEmployeeService,
  DeleteEmployee as DeleteEmployeeService,
} from '../services/EmployeeService';

export const EmployeeRepositoryImpl: EmployeeRepository = {
  GetAll: async (): Promise<Employee[]> => {
    const employeeDTOs = await FetchEmployees();
    return employeeDTOs.map(MapToEmployee);
  },

  GetById: async (id: string): Promise<Employee | null> => {
    const employeeDTO = await FetchEmployeeById(id);
    return employeeDTO ? MapToEmployee(employeeDTO) : null;
  },

  Create: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    const employeeDTO = MapToEmployeeDTO(employee as Employee);
    const { id, ...employeeWithoutId } = employeeDTO;
    const createdEmployeeDTO = await CreateEmployeeService(employeeWithoutId);
    return MapToEmployee(createdEmployeeDTO);
  },

  Update: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const employeeDTO = MapToEmployeeDTO(employee as Employee);
    const updatedEmployeeDTO = await UpdateEmployeeService(id, employeeDTO);
    return MapToEmployee(updatedEmployeeDTO);
  },

  Delete: async (id: string): Promise<void> => {
    await DeleteEmployeeService(id);
  },
};
