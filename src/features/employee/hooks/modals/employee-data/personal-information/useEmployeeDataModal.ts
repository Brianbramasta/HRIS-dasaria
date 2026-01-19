import { useCallback, useEffect, useMemo, useState } from 'react';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';
import { getStructuralJobDropdownOptions } from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';

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
  structural_job_id?: string;
  golongan?: string;
  unit_id?: string;
};

type Params = {
  isOpen: boolean;
  initialData?: EmployeeDataForm | null;
};

export function useEmployeeDataModal({ isOpen, initialData }: Params) {
  const [form, setForm] = useState<EmployeeDataForm>({});
  const title = useMemo(() => 'Edit Data Karyawan', []);
  
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<any[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [unitOptions, setUnitOptions] = useState<any[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = useState<any[]>([]);
  const [positionOptions, setPositionOptions] = useState<any[]>([]);
  const [structuralJobOptions, setStructuralJobOptions] = useState<any[]>([]);
  const [kategoriKaryawanOptions, setKategoriKaryawanOptions] = useState<any[]>([]);
  const [positionLevelOptions, setPositionLevelOptions] = useState<any[]>([]);
  const [employeeStatusOptions, setEmployeeStatusOptions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  const [companySearch, setCompanySearch] = useState<string>('');
  const [officeSearch, setOfficeSearch] = useState<string>('');
  const [directorateSearch, setDirectorateSearch] = useState<string>('');
  const [divisionSearch, setDivisionSearch] = useState<string>('');
  const [departmentSearch, setDepartmentSearch] = useState<string>('');
  const [unitSearch, setUnitSearch] = useState<string>('');
  const [jobTitleSearch, setJobTitleSearch] = useState<string>('');
  const [positionSearch, setPositionSearch] = useState<string>('');
  const [positionLevelSearch, setPositionLevelSearch] = useState<string>('');
  const [employeeCategorySearch, setEmployeeCategorySearch] = useState<string>('');

  useEffect(() => {
    if (isOpen && initialData) {
      setForm(initialData);
    }
  }, [initialData, isOpen]);

  // Initial Fetch (Independent Dropdowns)
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchInitial = async () => {
      try {
        const [status] = await Promise.all([
          employeeMasterDataService.getEmployeeStatusDropdown(),
        ]);
        setEmployeeStatusOptions((status || []).map((i: any) => ({ label: i.name, value: i.id })));
      } catch (e) {
        setEmployeeStatusOptions([]);
      }
    };
    fetchInitial();
  }, [isOpen]);

  // Debounced Search Effects
  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getCompanyDropdown(companySearch || undefined);
        setCompanyOptions((items || []).map((i: any) => ({ label: i.company_name, value: i.id })));
      } catch { setCompanyOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [companySearch, isOpen]);

  useEffect(() => {
    if (!isOpen || !form.company_id) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getOfficeDropdown(officeSearch || undefined, form.company_id);
        setOfficeOptions((items || []).map((i: any) => ({ label: i.office_name, value: i.id })));
      } catch { setOfficeOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [officeSearch, isOpen, form.company_id]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getDirectorateDropdown(directorateSearch || undefined);
        setDirectorateOptions((items || []).map((i: any) => ({ label: i.directorate_name, value: i.id })));
      } catch { setDirectorateOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [directorateSearch, isOpen]);

  useEffect(() => {
    const directorateId = form.directorate_id;
    if (!isOpen || !directorateId) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(directorateId, divisionSearch || undefined);
        setDivisionOptions((items || []).map((i: any) => ({ label: i.division_name, value: i.id })));
      } catch { setDivisionOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [divisionSearch, isOpen, form.directorate_id]);

  useEffect(() => {
    const divisionId = form.division_id;
    if (!isOpen || !divisionId) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getDepartmentsByDivision(divisionId, departmentSearch || undefined);
        setDepartmentOptions((items || []).map((i: any) => ({ label: i.department_name, value: i.id })));
      } catch { setDepartmentOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [departmentSearch, isOpen, form.division_id]);

  useEffect(() => {
    const departmentId = form.department_id;
    if (!isOpen || !departmentId) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getUnitDropdownByDepartmentId(departmentId, unitSearch || undefined);
        setUnitOptions((items || []).map((i: any) => ({ label: i.name, value: i.id })));
      } catch { setUnitOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [unitSearch, isOpen, form.department_id]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getJobTitleDropdown(jobTitleSearch || undefined);
        setJobTitleOptions((items || []).map((i: any) => ({ label: i.job_title_name, value: i.id, grade: i.grade })));
      } catch { setJobTitleOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [jobTitleSearch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getPositionDropdown(positionSearch || undefined);
        setPositionOptions((items || []).map((i: any) => ({ label: i.position_name, value: i.id })));
      } catch { setPositionOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionSearch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getPositionLevelDropdown(positionLevelSearch || undefined);
        setPositionLevelOptions((items || []).map((i: any) => ({ label: i.position_level_name, value: i.id })));
      } catch { setPositionLevelOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionLevelSearch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getEmployeeCategoryDropdown(employeeCategorySearch || undefined);
        setKategoriKaryawanOptions((items || []).map((i: any) => ({ label: i.name, value: i.id })));
      } catch { setKategoriKaryawanOptions([]); }
    }, 400);
    return () => clearTimeout(handler);
  }, [employeeCategorySearch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const jobTitleId = form.job_title_id;
    if (!jobTitleId) {
      setStructuralJobOptions([]);
      return;
    }
    const fetchStructuralJobs = async () => {
      try {
        const items = await getStructuralJobDropdownOptions(jobTitleId);
        setStructuralJobOptions(items);
      } catch (error) {
        setStructuralJobOptions([]);
      }
    };
    fetchStructuralJobs();
  }, [isOpen, form.job_title_id]);

  useEffect(() => {
    if (form.job_title_id && jobTitleOptions.length > 0) {
      const selectedJob = jobTitleOptions.find((j: any) => j.value === form.job_title_id);
      if (selectedJob?.grade) {
        setSelectedGrade(selectedJob.grade);
      }
    }
  }, [form.job_title_id, jobTitleOptions]);

  const handleInput = (key: keyof EmployeeDataForm, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      
      // Reset logic
      if (key === 'company_id') { next.office_id = ''; }
      if (key === 'directorate_id') { next.division_id = ''; next.department_id = ''; next.unit_id = ''; }
      if (key === 'division_id') { next.department_id = ''; next.unit_id = ''; }
      if (key === 'department_id') { next.unit_id = ''; }
      
      if (key === 'job_title_id') {
        const selectedJob = jobTitleOptions.find((j: any) => j.value === value);
        if (selectedJob?.grade) {
          setSelectedGrade(selectedJob.grade);
          next.golongan = selectedJob.grade;
        } else {
          setSelectedGrade('');
          next.golongan = '';
        }
        next.structural_job_id = '';
      }
      return next;
    });
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
      'unit_id',
      'position_id',
      'job_title_id',
      'position_level_id',
      'employee_category_id',
      'structural_job_id',
    ];
    const missingRequired = requiredKeys.some((k) => {
      const v = (base as any)?.[k];
      return v === undefined || v === null || v === '';
    });
    return base?.employment_status === 'Aktif' || allEmpty || !missingRequired;
  }, [initialData]);

  const handleCompanySearch = useCallback((q: string) => setCompanySearch(q), []);
  const handleOfficeSearch = useCallback((q: string) => setOfficeSearch(q), []);
  const handleDirectorateSearch = useCallback((q: string) => setDirectorateSearch(q), []);
  const handleDivisionSearch = useCallback((q: string) => setDivisionSearch(q), []);
  const handleDepartmentSearch = useCallback((q: string) => setDepartmentSearch(q), []);
  const handleUnitSearch = useCallback((q: string) => setUnitSearch(q), []);
  const handleJobTitleSearch = useCallback((q: string) => setJobTitleSearch(q), []);
  const handlePositionSearch = useCallback((q: string) => setPositionSearch(q), []);
  const handlePositionLevelSearch = useCallback((q: string) => setPositionLevelSearch(q), []);
  const handleEmployeeCategorySearch = useCallback((q: string) => setEmployeeCategorySearch(q), []);

  return {
    title,
    form,
    companyOptions,
    officeOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    unitOptions,
    jobTitleOptions,
    positionOptions,
    structuralJobOptions,
    kategoriKaryawanOptions,
    positionLevelOptions,
    employeeStatusOptions,
    selectedGrade,
    handleInput,
    isDisabledField,
    handleCompanySearch,
    handleOfficeSearch,
    handleDirectorateSearch,
    handleDivisionSearch,
    handleDepartmentSearch,
    handleUnitSearch,
    handleJobTitleSearch,
    handlePositionSearch,
    handlePositionLevelSearch,
    handleEmployeeCategorySearch,
  };
}

