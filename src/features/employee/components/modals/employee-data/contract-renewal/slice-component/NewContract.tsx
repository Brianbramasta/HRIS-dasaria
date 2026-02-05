import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import { useState, useEffect } from 'react';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';
import { getEmployeeCategoryDropdownOptions, getPositionLevelDropdownOptions, getStructuralJobDropdownOptions, getUnitDropdownByDepartmentIdOptions } from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';

interface NewContractData {
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
}

interface NewContractProps {
  data?: NewContractData;
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
}

export default function NewContract({
  data = {},
  isEditing = false,
  onChange,
}: NewContractProps) {
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

  const handleInputChange = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const kategori = await getEmployeeCategoryDropdownOptions();
        setKategoriKaryawanOptions(kategori);

        const positionLevels = await getPositionLevelDropdownOptions();
        setPositionLevelOptions(positionLevels);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  // Company search
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

  // Directorate search
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

  // Position search
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

  // Job title search
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

  // Employee category search
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

  // Position level search
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

  // Divisions when directorate changes
  useEffect(() => {
    const fetchDivisions = async () => {
      if (!data?.new_directorate_name) {
        setDivisionOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDivisionsByDirectorate(data.new_directorate_name, divisionSearch || undefined);
        setDivisionOptions((items || []).map((i: any) => ({ label: i.division_name, value: i.id })));
      } catch (error) {
        console.error('Error fetching divisions:', error);
        setDivisionOptions([]);
      }
    };
    fetchDivisions();
  }, [data?.new_directorate_name, divisionSearch]);

  // Structural jobs when job title changes
  useEffect(() => {
    const fetchStructuralJobs = async () => {
      if (!data?.new_job_title_name) {
        setJabatanStrukturalOptions([]);
        return;
      }
      try {
        const items = await getStructuralJobDropdownOptions(data.new_job_title_name);
        setJabatanStrukturalOptions(items);
      } catch (error) {
        console.error('Error fetching structural jobs:', error);
        setJabatanStrukturalOptions([]);
      }
    };
    fetchStructuralJobs();
  }, [data?.new_job_title_name]);

  // Departments when division changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!data?.new_division_name) {
        setDepartmentOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getDepartmentsByDivision(data.new_division_name, departmentSearch || undefined);
        setDepartmentOptions((items || []).map((i: any) => ({ label: i.department_name, value: i.id })));
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartmentOptions([]);
      }
    };
    fetchDepartments();
  }, [data?.new_division_name, departmentSearch]);

  // Units when department changes
  useEffect(() => {
    const fetchUnits = async () => {
      if (!data?.new_department_name) {
        setUnitOptions([]);
        return;
      }
      try {
        const items = await getUnitDropdownByDepartmentIdOptions(data.new_department_name, unitSearch || undefined);
        setUnitOptions(items);
      } catch (error) {
        console.error('Error fetching units:', error);
        setUnitOptions([]);
      }
    };
    fetchUnits();
  }, [data?.new_department_name, unitSearch]);

  // Offices when company changes
  useEffect(() => {
    const fetchOffices = async () => {
      if (!data?.new_company_name) {
        setOfficeOptions([]);
        return;
      }
      try {
        const items = await employeeMasterDataService.getOfficeDropdown(officeSearch || undefined, data.new_company_name);
        setOfficeOptions((items || []).map((i: any) => ({ label: i.office_name, value: i.id })));
      } catch (error) {
        console.error('Error fetching offices:', error);
        setOfficeOptions([]);
      }
    };
    fetchOffices();
  }, [data?.new_company_name, officeSearch]);

  // Update selected grade when job title changes
  useEffect(() => {
    const selectedJob = jobTitleOptions.find(job => job.value === data?.new_job_title_name);
    if (selectedJob?.grade) {
      setSelectedGrade(selectedJob.grade);
      handleInputChange('new_grade', selectedJob.grade);
    }
  }, [jobTitleOptions, data?.new_job_title_name]);

  return (
    <PayrollCard
      title="Kontrak Baru"
      headerColor="green"
      border={false}
    >
      <div className="space-y-6">
        {/* Row 1: Jenis Perubahan, Kategori Karyawan, Perusahaan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Jenis Perubahan"
            defaultValue={data?.new_change_type_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_change_type_name', value)}
            containerClassName="space-y-2"
            options={[
              { label: 'Pilih Jenis Perubahan', value: '' },
              { label: 'Promosi', value: 'Promosi' },
              { label: 'Demosi', value: 'Demosi' },
              { label: 'Transfer', value: 'Transfer' },
            ]}
          />
          <SelectField
            label="Kategori Karyawan"
            options={kategoriKaryawanOptions}
            defaultValue={data?.new_employee_category_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_employee_category_name', value)}
            onSearch={setEmployeeCategorySearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Perusahaan"
            options={companyOptions}
            defaultValue={data?.new_company_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_company_name', value)}
            onSearch={setCompanySearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
        </div>

        {/* Row 2: Kantor, Direktorat, Divisi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Kantor"
            options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
            defaultValue={data?.new_office_name || ''}
            disabled={!isEditing || officeOptions.length === 0}
            onChange={(value) => handleInputChange('new_office_name', value)}
            onSearch={setOfficeSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Direktorat"
            options={directorateOptions}
            defaultValue={data?.new_directorate_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_directorate_name', value)}
            onSearch={setDirectorateSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Divisi"
            options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
            defaultValue={data?.new_division_name || ''}
            disabled={!isEditing || divisionOptions.length === 0}
            onChange={(value) => handleInputChange('new_division_name', value)}
            onSearch={setDivisionSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
        </div>

        {/* Row 3: Departemen, Unit, Position */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Departemen"
            options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
            defaultValue={data?.new_department_name || ''}
            disabled={!isEditing || departmentOptions.length === 0}
            onChange={(value) => handleInputChange('new_department_name', value)}
            onSearch={setDepartmentSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Unit"
            options={unitOptions.length > 0 ? unitOptions : [{ label: 'Pilih departemen terlebih dahulu', value: '' }]}
            defaultValue={data?.new_unit_name || ''}
            disabled={!isEditing || unitOptions.length === 0}
            onChange={(value) => handleInputChange('new_unit_name', value)}
            onSearch={setUnitSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Position"
            options={positionOptions}
            defaultValue={data?.new_position_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_position_name', value)}
            onSearch={setPositionSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
        </div>

        {/* Row 4: Jabatan Kepangkatan, Jabatan Struktural, Jenjang Jabatan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Jabatan Kepangkatan"
            options={jobTitleOptions}
            defaultValue={data?.new_job_title_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_job_title_name', value)}
            onSearch={setJobTitleSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Jabatan Struktural"
            options={jabatanStrukturalOptions}
            defaultValue={data?.new_structural_position_name || ''}
            disabled={!isEditing || !data?.new_job_title_name}
            onChange={(value) => handleInputChange('new_structural_position_name', value)}
            containerClassName="space-y-2"
            placeholder="Select"
          />
          <SelectField
            label="Jenjang Jabatan"
            options={positionLevelOptions}
            defaultValue={data?.new_position_level_name || ''}
            disabled={!isEditing}
            onChange={(value) => handleInputChange('new_position_level_name', value)}
            onSearch={setPositionLevelSearch}
            containerClassName="space-y-2"
            placeholder="Select"
          />
        </div>

        {/* Row 5: Golongan, GAJI BERSIH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="Golongan"
            value={selectedGrade || data?.new_grade || ''}
            disabled
            onChange={(e) => handleInputChange('new_grade', e.target.value)}
            containerClassName="space-y-2"
          />
          <InputField
            label="GAJI BERSIH"
            type="number"
            value={data?.new_basic_salary || ''}
            disabled={!isEditing}
            onChange={(e) => handleInputChange('new_basic_salary', e.target.value)}
            containerClassName="space-y-2"
          />
        </div>

      </div>
    </PayrollCard>
  );
}
