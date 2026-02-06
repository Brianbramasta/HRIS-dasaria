import { useState, useEffect, useCallback } from 'react';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';
import { useApiContractExtension } from '@/features/employee/hooks/api/useApiContractExtension';
import {
  getEmployeeCategoryDropdownOptions,
  getPositionLevelDropdownOptions,
  getStructuralJobDropdownOptions,
  getUnitDropdownByDepartmentIdOptions,
} from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';

type Params = {
  data?: {
    new_change_type_id?: string;
    new_change_type_name?: string;
    new_employee_category_name?: string;
    new_company_name?: string;
    new_office_name?: string;
    new_directorate_name?: string;
    new_division_name?: string;
    new_department_name?: string;
    new_unit_name?: string;
    new_position_name?: string;
    new_job_title_name?: string;
    new_structural_position_name?: string;
    new_position_level_name?: string;
    new_grade?: string;
    new_basic_salary?: string | number;
    new_contract_document?: string;
  };
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
};

export function useNewContract({ data = {}, isEditing = false, onChange }: Params) {
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<any[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = useState<any[]>([]);
  const [positionOptions, setPositionOptions] = useState<any[]>([]);
  const [kategoriKaryawanOptions, setKategoriKaryawanOptions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [positionLevelOptions, setPositionLevelOptions] = useState<any[]>([]);
  const [jabatanStrukturalOptions, setJabatanStrukturalOptions] = useState<any[]>([]);
  const [unitOptions, setUnitOptions] = useState<any[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [officeSearch, setOfficeSearch] = useState('');
  const [directorateSearch, setDirectorateSearch] = useState('');
  const [divisionSearch, setDivisionSearch] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');
  const [jobTitleSearch, setJobTitleSearch] = useState('');
  const [positionSearch, setPositionSearch] = useState('');
  const [positionLevelSearch, setPositionLevelSearch] = useState('');
  const [employeeCategorySearch, setEmployeeCategorySearch] = useState('');

  const { changeTypeOptions, fetchChangeTypes } = useApiContractExtension();

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      if (onChange) {
        onChange(field, value);
      }
    },
    [onChange]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        fetchChangeTypes();
        const kategori = await getEmployeeCategoryDropdownOptions();
        setKategoriKaryawanOptions(kategori);
        const positionLevels = await getPositionLevelDropdownOptions();
        setPositionLevelOptions(positionLevels);
      } catch {
        setKategoriKaryawanOptions([]);
        setPositionLevelOptions([]);
      }
    };
    fetchInitialData();
  }, [fetchChangeTypes]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const companies = await employeeMasterDataService.getCompanyDropdown(companySearch || undefined);
        setCompanyOptions((companies || []).map((i: any) => ({ label: i.company_name, value: i.id })));
      } catch {
        setCompanyOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [companySearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const directorates = await employeeMasterDataService.getDirectorateDropdown(directorateSearch || undefined);
        setDirectorateOptions((directorates || []).map((i: any) => ({ label: i.directorate_name, value: i.id })));
      } catch {
        setDirectorateOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [directorateSearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const positions = await employeeMasterDataService.getPositionDropdown(positionSearch || undefined);
        setPositionOptions((positions || []).map((i: any) => ({ label: i.position_name, value: i.id })));
      } catch {
        setPositionOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionSearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const jobTitles = await employeeMasterDataService.getJobTitleDropdown(jobTitleSearch || undefined);
        setJobTitleOptions((jobTitles || []).map((i: any) => ({ label: i.job_title_name, value: i.id, grade: i.grade })));
      } catch {
        setJobTitleOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [jobTitleSearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const kategori = await getEmployeeCategoryDropdownOptions(employeeCategorySearch || undefined);
        setKategoriKaryawanOptions(kategori);
      } catch {
        setKategoriKaryawanOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [employeeCategorySearch]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const positionLevels = await getPositionLevelDropdownOptions(positionLevelSearch || undefined);
        setPositionLevelOptions(positionLevels);
      } catch {
        setPositionLevelOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [positionLevelSearch]);

  useEffect(() => {
    const fetchDivisions = async () => {
      if (!data?.new_directorate_name) {
        setDivisionOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(data.new_directorate_name, divisionSearch || undefined);
        setDivisionOptions((items || []).map((i: any) => ({ label: i.division_name, value: i.id })));
      } catch {
        setDivisionOptions([]);
      }
    };
    fetchDivisions();
  }, [data?.new_directorate_name, divisionSearch]);

  useEffect(() => {
    const fetchStructuralJobs = async () => {
      if (!data?.new_job_title_name) {
        setJabatanStrukturalOptions([]);
        return;
      }
      try {
        const items = await getStructuralJobDropdownOptions(data.new_job_title_name);
        setJabatanStrukturalOptions(items);
      } catch {
        setJabatanStrukturalOptions([]);
      }
    };
    fetchStructuralJobs();
  }, [data?.new_job_title_name]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!data?.new_division_name) {
        setDepartmentOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDepartmentsByDivision(data.new_division_name, departmentSearch || undefined);
        setDepartmentOptions((items || []).map((i: any) => ({ label: i.department_name, value: i.id })));
      } catch {
        setDepartmentOptions([]);
      }
    };
    fetchDepartments();
  }, [data?.new_division_name, departmentSearch]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!data?.new_department_name) {
        setUnitOptions([]);
        return;
      }
      try {
        const items = await getUnitDropdownByDepartmentIdOptions(data.new_department_name, unitSearch || undefined);
        setUnitOptions(items);
      } catch {
        setUnitOptions([]);
      }
    };
    fetchUnits();
  }, [data?.new_department_name, unitSearch]);

  useEffect(() => {
    const fetchOffices = async () => {
      if (!data?.new_company_name) {
        setOfficeOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getOfficeDropdown(officeSearch || undefined, data.new_company_name);
        setOfficeOptions((items || []).map((i: any) => ({ label: i.office_name, value: i.id })));
      } catch {
        setOfficeOptions([]);
      }
    };
    fetchOffices();
  }, [data?.new_company_name, officeSearch]);

  useEffect(() => {
    const selectedJob = jobTitleOptions.find((job) => job.value === data?.new_job_title_name);
    if (selectedJob?.grade) {
      setSelectedGrade(selectedJob.grade);
      handleInputChange('new_grade', selectedJob.grade);
    }
  }, [jobTitleOptions, data?.new_job_title_name, handleInputChange]);

  return {
    isEditing,
    data,
    changeTypeOptions,
    companyOptions,
    officeOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    jobTitleOptions,
    positionOptions,
    kategoriKaryawanOptions,
    selectedGrade,
    positionLevelOptions,
    jabatanStrukturalOptions,
    unitOptions,
    setCompanySearch,
    setOfficeSearch,
    setDirectorateSearch,
    setDivisionSearch,
    setDepartmentSearch,
    setUnitSearch,
    setJobTitleSearch,
    setPositionSearch,
    setPositionLevelSearch,
    setEmployeeCategorySearch,
    handleInputChange,
  };
}
