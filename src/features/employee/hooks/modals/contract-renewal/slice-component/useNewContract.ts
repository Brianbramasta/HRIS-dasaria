import { useState, useEffect, useCallback, useMemo } from 'react';
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
    // Salary components
    new_gaji_pokok?: string | number;
    new_tunjangan_pernikahan?: string | number;
    new_tunjangan_jabatan?: string | number;
    new_tunjangan_lama_kerja?: string | number;
    new_tunjangan_diskresi?: Array<{ id: string; amount: number }>;
    new_gaji_bersih?: string | number;
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
  const [diskresiOptions] = useState<any[]>([]);
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

  // Category checking logic
  const isNonStaffOrMitraCategory = useMemo(() => {
    // Find category name from ID using kategoriKaryawanOptions
    const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.new_employee_category_name);
    const categoryName = categoryOption?.label?.toLowerCase();
    const result = categoryName?.includes('mitra') || categoryName?.includes('non staff') || categoryName === 'non-staff';
    console.log('🔍 isNonStaffOrMitraCategory changed:', { categoryId: data?.new_employee_category_name, categoryName, result });
    return result;
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  const isStaffCategory = useMemo(() => {
    // Find category name from ID using kategoriKaryawanOptions
    const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.new_employee_category_name);
    const categoryName = categoryOption?.label?.toLowerCase();
    const result = categoryName?.includes('staff') || categoryName === 'staff';
    return result;
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  // Dynamic salary label logic
  const salaryLabel = useMemo(() => {
    // Find category name from ID using kategoriKaryawanOptions
    const categoryOption = kategoriKaryawanOptions.find(option => option.value === data?.new_employee_category_name);
    const categoryName = categoryOption?.label;
    let label = 'Gaji Pokok';
    if (categoryName?.toLowerCase() === 'non-staff' || categoryName?.toLowerCase().includes('non staff')) label = 'Uang Saku';
    if (categoryName?.toLowerCase() === 'mitra' || categoryName?.toLowerCase().includes('mitra')) label = 'Fee';
    return label;
  }, [data?.new_employee_category_name, kategoriKaryawanOptions]);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      if (onChange) {
        onChange(field, value);
      }
    },
    [onChange]
  );

  const addNonFixAllowance = useCallback(() => {
    const currentDiskresi = data?.new_tunjangan_diskresi || [];
    const newDiskresi = [...currentDiskresi, { id: '', amount: 0 }];
    handleInputChange('new_tunjangan_diskresi', newDiskresi);
  }, [data?.new_tunjangan_diskresi, handleInputChange]);

  const removeNonFixAllowance = useCallback(
    (index: number) => {
      const currentDiskresi = data?.new_tunjangan_diskresi || [];
      const newDiskresi = currentDiskresi.filter((_, i) => i !== index);
      handleInputChange('new_tunjangan_diskresi', newDiskresi);
    },
    [data?.new_tunjangan_diskresi, handleInputChange]
  );

  const updateNonFixAllowance = useCallback(
    (index: number, field: 'id' | 'amount', value: any) => {
      const currentDiskresi = data?.new_tunjangan_diskresi || [];
      const newDiskresi = currentDiskresi.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      handleInputChange('new_tunjangan_diskresi', newDiskresi);
    },
    [data?.new_tunjangan_diskresi, handleInputChange]
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
    diskresiOptions,
    isNonStaffOrMitraCategory,
    isStaffCategory,
    salaryLabel,
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
    addNonFixAllowance,
    removeNonFixAllowance,
    updateNonFixAllowance,
  };
}
