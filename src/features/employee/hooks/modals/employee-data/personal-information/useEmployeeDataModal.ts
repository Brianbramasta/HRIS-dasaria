import { useEffect, useMemo, useState } from 'react';
import { useStep3Data } from '@/features/employee/hooks/employee-data/form/useFromStep';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';

export type EmployeeDataForm = {
  employment_status?: string;
  employment_status_id?: string;
  department_id?: string;
  position_id?: string;
  job_title_id?: string;
  company_id?: string;
  office_id?: string;
  directorate_id?: string;
  division_id?: string;
  position_level_id?: string;
  payroll_status?: string;
  employee_category_id?: string;
  start_date?: string;
  end_date?: string;
  golongan?: string;
};

type Params = {
  isOpen: boolean;
  initialData?: EmployeeDataForm | null;
};

export function useEmployeeDataModal({ isOpen, initialData }: Params) {
  const [form, setForm] = useState<EmployeeDataForm>({});
  const title = useMemo(() => 'Edit Data Karyawan', []);
  const [officeDropdown, setOfficeDropdown] = useState<any[]>([]);
  const [divisionDropdown, setDivisionDropdown] = useState<any[]>([]);
  const [departmentDropdown, setDepartmentDropdown] = useState<any[]>([]);

  const {
    companyOptions,
    officeOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    jobTitleOptions,
    positionOptions,
    kategoriKaryawanOptions,
    positionLevelOptions,
    employeeStatusOptions,
    selectedGrade,
  } = useStep3Data(isOpen);

  useEffect(() => {
    if (isOpen && initialData) {
      setForm(initialData);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen || !initialData) return;
    const fetchDependentOptions = async () => {
      try {
        if (initialData.company_id) {
          const offices = await employeeMasterDataService.getOfficeDropdown(undefined, initialData.company_id);
          setOfficeDropdown((offices || []).map((i: any) => ({ label: i.office_name, value: i.id })));
        }
        if (initialData.directorate_id) {
          const divisions = await employeeMasterDataService.getDivisionsByDirectorate(initialData.directorate_id);
          setDivisionDropdown((divisions || []).map((i: any) => ({ label: i.division_name, value: i.id })));
        }
        if (initialData.division_id) {
          const departments = await employeeMasterDataService.getDepartmentsByDivision(initialData.division_id);
          setDepartmentDropdown((departments || []).map((i: any) => ({ label: i.department_name, value: i.id })));
        }
      } catch (error) {
      }
    };
    fetchDependentOptions();
  }, [isOpen, initialData, initialData?.company_id, initialData?.directorate_id, initialData?.division_id]);

  const handleInput = (key: keyof EmployeeDataForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isDisabledField = useMemo(() => {
    const base = initialData || {};
    const values = Object.values(base || {});
    const allEmpty = values.length === 0 || values.every((v) => v === undefined || v === null || v === '');
    const requiredKeys: Array<keyof EmployeeDataForm> = [
      'employment_status_id',
      'start_date',
      'company_id',
      'office_id',
      'directorate_id',
      'division_id',
      'department_id',
      'position_id',
      'job_title_id',
      'position_level_id',
      'employee_category_id',
    ];
    const missingRequired = requiredKeys.some((k) => {
      const v = (base as any)?.[k];
      return v === undefined || v === null || v === '';
    });
    return base?.employment_status === 'Aktif' || allEmpty || !missingRequired;
  }, [initialData]);

  return {
    title,
    form,
    officeDropdown,
    divisionDropdown,
    departmentDropdown,
    companyOptions,
    officeOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    jobTitleOptions,
    positionOptions,
    kategoriKaryawanOptions,
    positionLevelOptions,
    employeeStatusOptions,
    selectedGrade,
    handleInput,
    isDisabledField,
  };
}
