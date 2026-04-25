import { useState, useEffect } from 'react';
import { Employee } from '../../domain/entities/Employee';
import { GetEmployees, GetEmployeeById, CreateEmployee, UpdateEmployee, DeleteEmployee } from '../../domain/usecases/GetEmployees';
import { EmployeeRepositoryImpl } from '../../data/repositories/EmployeeRepository';

export const UseEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const getEmployeesUseCase = GetEmployees(EmployeeRepositoryImpl);
      const result = await getEmployeesUseCase();
      setEmployees(result);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeById = async (id: string): Promise<Employee | null> => {
    setLoading(true);
    setError(null);
    try {
      const getEmployeeByIdUseCase = GetEmployeeById(EmployeeRepositoryImpl);
      const result = await getEmployeeByIdUseCase(id);
      return result;
    } catch (err) {
      setError('Failed to fetch employee');
      console.error('Error fetching employee:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
    setLoading(true);
    setError(null);
    try {
      const createEmployeeUseCase = CreateEmployee(EmployeeRepositoryImpl);
      const result = await createEmployeeUseCase(employee);
      await getAllEmployees(); // Refresh the list
      return result;
    } catch (err) {
      setError('Failed to create employee');
      console.error('Error creating employee:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee | null> => {
    setLoading(true);
    setError(null);
    try {
      const updateEmployeeUseCase = UpdateEmployee(EmployeeRepositoryImpl);
      const result = await updateEmployeeUseCase(id, employee);
      await getAllEmployees(); // Refresh the list
      return result;
    } catch (err) {
      setError('Failed to update employee');
      console.error('Error updating employee:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const deleteEmployeeUseCase = DeleteEmployee(EmployeeRepositoryImpl);
      await deleteEmployeeUseCase(id);
      await getAllEmployees(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to delete employee');
      console.error('Error deleting employee:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  return {
    employees,
    loading,
    error,
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
