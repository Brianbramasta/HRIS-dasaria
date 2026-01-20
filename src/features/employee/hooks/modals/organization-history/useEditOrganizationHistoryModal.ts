import { useCallback, useEffect, useMemo, useState } from 'react';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';
import {
  getEmployeeCategoryDropdownOptions,
  getPositionLevelDropdownOptions,
  getStructuralJobDropdownOptions,
  getUnitDropdownByDepartmentIdOptions,
} from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';
import { useOrganizationChange } from '@/features/employee/hooks/organization-history/useOrganizationChange';

export type OrganizationChangeForm = {
  id?: string;
  employee_id?: string;
  nama?: string;
  change_type_id?: string;
  efektif_date?: string;
  company_id?: string;
  job_title_id?: string;
  structural_job_id?: string;
  office_id?: string;
  directorate_id?: string;
  employee_category_id?: string;
  division_id?: string;
  reason?: string;
  department_id?: string;
   unit_id?: string;
  position_id?: string;
  position_level_id?: string;
  skFile?: File | null;
  decree_file?: string;
  golongan?: string;
  nip?: string;
};

type Params = {
  isOpen: boolean;
  initialData?: any | null;
};

export function useEditOrganizationHistoryModal({ isOpen, initialData }: Params) {
  const [form, setForm] = useState<OrganizationChangeForm>({});
  const title = useMemo(() => 'Perubahan Organisasi', []);
  const { changeTypeOptions, fetchChangeTypeOptions, employeeOptions, fetchEmployeeOptions } = useOrganizationChange({ autoFetch: false });

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
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [employeeSearch, setEmployeeSearch] = useState<string>('');
  const [companySearch, setCompanySearch] = useState<string>('');
  const [officeSearch, setOfficeSearch] = useState<string>('');
  const [directorateSearch, setDirectorateSearch] = useState<string>('');
  const [divisionSearch, setDivisionSearch] = useState<string>('');
  const [unitSearch, setUnitSearch] = useState<string>('');
  const [jobTitleSearch, setJobTitleSearch] = useState<string>('');
  const [positionSearch, setPositionSearch] = useState<string>('');
  const [positionLevelSearch, setPositionLevelSearch] = useState<string>('');
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData && isOpen) {
      const mappedData: OrganizationChangeForm = {
        id: initialData.id,
        employee_id: initialData.employee_id || initialData.idKaryawan,
        nama: initialData.name || initialData.nama,
        nip: initialData.nip || initialData.idKaryawan,
        change_type_id: initialData.change_type_id,
        efektif_date: initialData.efektif_date || initialData.tanggalEfektif,
        company_id: initialData.new_company_id || initialData.company_id,
        office_id: initialData.new_office_id || initialData.office_id,
        directorate_id: initialData.new_directorate_id || initialData.directorate_id,
        division_id: initialData.new_division_id || initialData.division_id,
        department_id: initialData.new_department_id || initialData.department_id,
        unit_id: initialData.new_unit_id || initialData.unit_id,
        position_id: initialData.new_position_id || initialData.position_id,
        job_title_id: initialData.new_job_title_id || initialData.job_title_id,
        structural_job_id: initialData.new_structural_job_id || initialData.structural_job_id,
        position_level_id: initialData.new_position_level_id || initialData.position_level_id,
        employee_category_id: initialData.new_employee_category_id || initialData.employee_category_id,
        reason: initialData.reason || initialData.alasanPerubahan,
        decree_file: initialData.decree_file,
      };
      setForm(mappedData);
    } else if (isOpen) {
      setForm({});
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    fetchChangeTypeOptions();
    fetchEmployeeOptions();
  }, [isOpen, fetchChangeTypeOptions, fetchEmployeeOptions]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(() => {
      fetchEmployeeOptions(employeeSearch || undefined);
    }, 400);
    return () => clearTimeout(handler);
  }, [employeeSearch, isOpen, fetchEmployeeOptions]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getCompanyDropdown(companySearch || undefined);
        setCompanyOptions((items || []).map((i: any) => ({ label: i.company_name, value: i.id })));
      } catch {
        setCompanyOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [companySearch, isOpen]);

  useEffect(() => {
    if (!isOpen || !form.company_id) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getOfficeDropdown(officeSearch || undefined, form.company_id);
        setOfficeOptions((items || []).map((i: any) => ({ label: i.office_name, value: i.id })));
      } catch {
        setOfficeOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [officeSearch, isOpen, form.company_id]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getDirectorateDropdown(directorateSearch || undefined);
        setDirectorateOptions((items || []).map((i: any) => ({ label: i.directorate_name, value: i.id })));
      } catch {
        setDirectorateOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [directorateSearch, isOpen]);

  useEffect(() => {
    if (!isOpen || !form.directorate_id) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(form.directorate_id as string, divisionSearch || undefined);
        setDivisionOptions((items || []).map((i: any) => ({ label: i.division_name, value: i.id })));
      } catch {
        setDivisionOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [divisionSearch, isOpen, form.directorate_id]);

  useEffect(() => {
    if (!isOpen || !form.department_id) return;
    const handler = setTimeout(async () => {
      try {
        const items = await getUnitDropdownByDepartmentIdOptions(form.department_id, unitSearch || undefined);
        setUnitOptions(items);
      } catch {
        setUnitOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [unitSearch, isOpen, form.department_id]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getJobTitleDropdown(jobTitleSearch || undefined);
        setJobTitleOptions((items || []).map((i: any) => ({ label: i.job_title_name, value: i.id, grade: i.grade })));
      } catch {
        setJobTitleOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [jobTitleSearch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await employeeMasterDataService.getPositionDropdown(positionSearch || undefined);
        setPositionOptions((items || []).map((i: any) => ({ label: i.position_name, value: i.id })));
      } catch {
        setPositionOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionSearch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await getPositionLevelDropdownOptions(positionLevelSearch || undefined);
        setPositionLevelOptions(items);
      } catch {
        setPositionLevelOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionLevelSearch, isOpen]);

  const handleInput = (key: keyof OrganizationChangeForm, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'company_id') {
        next.office_id = '';
      }
      if (key === 'directorate_id') {
        next.division_id = '';
        next.department_id = '';
      }
      if (key === 'division_id') {
        next.department_id = '';
        next.unit_id = '';
      }
      if (key === 'department_id') {
        next.unit_id = '';
      }
      if (key === 'nip') {
        const selectedEmp = employeeOptions.find((e: any) => e.value === value);
        if (selectedEmp) {
          next.employee_id = selectedEmp.value;
          next.nama = selectedEmp.name;
        } else {
          next.employee_id = '';
          next.nama = '';
        }
      }
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

  const handleEmployeeSearch = useCallback((query: string) => {
    setEmployeeSearch(query);
  }, []);

  const handleCompanySearch = useCallback((query: string) => {
    setCompanySearch(query);
  }, []);

  const handleOfficeSearch = useCallback((query: string) => {
    setOfficeSearch(query);
  }, []);

  const handleDirectorateSearch = useCallback((query: string) => {
    setDirectorateSearch(query);
  }, []);

  const handleDivisionSearch = useCallback((query: string) => {
    setDivisionSearch(query);
  }, []);

  const handleUnitSearch = useCallback((query: string) => {
    setUnitSearch(query);
  }, []);

  const handleJobTitleSearch = useCallback((query: string) => {
    setJobTitleSearch(query);
  }, []);

  const handlePositionSearch = useCallback((query: string) => {
    setPositionSearch(query);
  }, []);

  const handlePositionLevelSearch = useCallback((query: string) => {
    setPositionLevelSearch(query);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, skFile: file }));
  };

  useEffect(() => {
    if (!isOpen) return;
    const fetchInitialData = async () => {
      try {
        const [kategori, positionLevels, companies, directorates, positions, jobTitles] = await Promise.all([
          getEmployeeCategoryDropdownOptions(),
          getPositionLevelDropdownOptions(),
          employeeMasterDataService.getCompanyDropdown(),
          employeeMasterDataService.getDirectorateDropdown(),
          employeeMasterDataService.getPositionDropdown(),
          employeeMasterDataService.getJobTitleDropdown(),
        ]);
        setKategoriKaryawanOptions(kategori);
        setPositionLevelOptions(positionLevels);
        setCompanyOptions((companies || []).map((i: any) => ({ label: i.company_name, value: i.id })));
        setDirectorateOptions((directorates || []).map((i: any) => ({ label: i.directorate_name, value: i.id })));
        setPositionOptions((positions || []).map((i: any) => ({ label: i.position_name, value: i.id })));
        setJobTitleOptions((jobTitles || []).map((i: any) => ({ label: i.job_title_name, value: i.id, grade: i.grade })));
      } catch {
        // ignore
      }
    };
    fetchInitialData();
  }, [isOpen]);

  useEffect(() => {
    const fetchOffices = async () => {
      if (!form.company_id) {
        setOfficeOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getOfficeDropdown(undefined, form.company_id);
        setOfficeOptions((items || []).map((i: any) => ({ label: i.office_name, value: i.id })));
      } catch {
        setOfficeOptions([]);
      }
    };
    fetchOffices();
  }, [form.company_id]);

  useEffect(() => {
    const fetchDivisions = async () => {
      if (!form.directorate_id) {
        setDivisionOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(form.directorate_id);
        setDivisionOptions((items || []).map((i: any) => ({ label: i.division_name, value: i.id })));
      } catch {
        setDivisionOptions([]);
      }
    };
    fetchDivisions();
  }, [form.directorate_id]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!form.division_id) {
        setDepartmentOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDepartmentsByDivision(form.division_id);
        setDepartmentOptions((items || []).map((i: any) => ({ label: i.department_name, value: i.id })));
      } catch {
        setDepartmentOptions([]);
      }
    };
    fetchDepartments();
  }, [form.division_id]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!form.department_id) {
        setUnitOptions([]);
        return;
      }
      try {
        const items = await getUnitDropdownByDepartmentIdOptions(form.department_id);
        setUnitOptions(items);
      } catch {
        setUnitOptions([]);
      }
    };
    fetchUnits();
  }, [form.department_id]);

  useEffect(() => {
    if (form.job_title_id && jobTitleOptions.length > 0) {
      const selectedJob = jobTitleOptions.find((j: any) => j.value === form.job_title_id);
      if (selectedJob?.grade) {
        setSelectedGrade(selectedJob.grade);
      }
    }
  }, [form.job_title_id, jobTitleOptions]);

  useEffect(() => {
    const fetchStructuralJobs = async () => {
      if (!form.job_title_id) {
        setStructuralJobOptions([]);
        return;
      }
      try {
        const items = await getStructuralJobDropdownOptions(form.job_title_id);
        setStructuralJobOptions(items);
      } catch {
        setStructuralJobOptions([]);
      }
    };
    fetchStructuralJobs();
  }, [form.job_title_id]);

  return {
    title,
    form,
    isEditMode,
    changeTypeOptions,
    employeeOptions,
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
    selectedGrade,
    handleInput,
    handleFileChange,
    handleEmployeeSearch,
    handleCompanySearch,
    handleOfficeSearch,
    handleDirectorateSearch,
    handleDivisionSearch,
    handleUnitSearch,
    handleJobTitleSearch,
    handlePositionSearch,
    handlePositionLevelSearch,
  };
}
