import React from 'react';
import { UseEmployees } from '../hooks/UseEmployees';
import EmployeeTable from '../components/EmployeeTable';

const LandingPage: React.FC = () => {
  const {
    employees,
    loading,
    error,
    deleteEmployee,
  } = UseEmployees();

  const handleDeleteEmployee = async (employee: any) => {
    if (window.confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      await deleteEmployee(employee.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
              <p className="mt-2 text-gray-600">
                Welcome to the HRIS Employee Landing Page. This is a clean architecture template with dummy data.
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800">{error}</div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Employee List</h2>
                <div className="text-sm text-gray-500">
                  Total Employees: {employees.length}
                </div>
              </div>
            </div>

            <EmployeeTable
              employees={employees}
              loading={loading}
              onDelete={handleDeleteEmployee}
            />
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Template</h2>
            <div className="prose text-gray-600">
              <p>
                This landing page demonstrates a clean architecture implementation following the domain-data-presentation pattern:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li><strong>Domain Layer:</strong> Contains business entities and usecases</li>
                <li><strong>Data Layer:</strong> Handles data services, models, and repositories</li>
                <li><strong>Presentation Layer:</strong> Manages UI components, pages, and hooks</li>
              </ul>
              <p className="mt-4">
                The structure follows feature-based organization with proper dependency injection and separation of concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
