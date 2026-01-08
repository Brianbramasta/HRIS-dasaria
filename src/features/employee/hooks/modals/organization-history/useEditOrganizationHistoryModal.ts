import { useEffect, useMemo, useState } from 'react';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';
import {
  getEmployeeCategoryDropdownOptions,
  getPositionLevelDropdownOptions,
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
  office_id?: string;
  directorate_id?: string;
  employee_category_id?: string;
  division_id?: string;
  reason?: string;
  department_id?: string;
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
  const [jobTitleOptions, setJobTitleOptions] = useState<any[]>([]);
  const [positionOptions, setPositionOptions] = useState<any[]>([]);
  const [kategoriKaryawanOptions, setKategoriKaryawanOptions] = useState<any[]>([]);
  const [positionLevelOptions, setPositionLevelOptions] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
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
        company_id: initialData.company_id,
        office_id: initialData.office_id,
        directorate_id: initialData.directorate_id,
        division_id: initialData.division_id,
        department_id: initialData.department_id,
        position_id: initialData.position_id,
        job_title_id: initialData.job_title_id,
        position_level_id: initialData.position_level_id,
        employee_category_id: initialData.employee_category_id,
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
      }
      return next;
    });
  };

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
    if (form.job_title_id && jobTitleOptions.length > 0) {
      const selectedJob = jobTitleOptions.find((j: any) => j.value === form.job_title_id);
      if (selectedJob?.grade) {
        setSelectedGrade(selectedJob.grade);
      }
    }
  }, [form.job_title_id, jobTitleOptions]);

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
    jobTitleOptions,
    positionOptions,
    kategoriKaryawanOptions,
    positionLevelOptions,
    selectedGrade,
    handleInput,
    handleFileChange,
  };
}
