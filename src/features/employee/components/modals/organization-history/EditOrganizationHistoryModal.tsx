import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import InputField from '@/components/form/input/InputField';
import FileInput from '@/components/form/input/FileInput';
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
  
  // Helper fields for display
  golongan?: string;
  nip?: string;
};

interface Props {
  isOpen: boolean;
  initialData?: any | null; // Allow flexible input from API
  onClose: () => void;
  onSubmit: (data: OrganizationChangeForm) => void;
  submitting?: boolean;
  hideSkFileUpload?: boolean;
}

const JENIS_PERUBAHAN_OPTIONS = [
  { label: 'Rotasi', value: 'Rotasi' },
  { label: 'Mutasi', value: 'Mutasi' },
  { label: 'Promosi', value: 'Promosi' },
  { label: 'Demosi', value: 'Demosi' },
];

const EditRiwayatOrganisasiModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false, hideSkFileUpload = false }) => {
  const [form, setForm] = useState<OrganizationChangeForm>({});
  const title = useMemo(() => 'Perubahan Organisasi', []);
  const { changeTypeOptions, fetchChangeTypeOptions, employeeOptions, fetchEmployeeOptions } = useOrganizationChange({ autoFetch: false });

  // Dropdown States
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [officeOptions, setOfficeOptions] = useState<any[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<any[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<any[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = useState<any[]>([]);
  const [positionOptions, setPositionOptions] = useState<any[]>([]);
  const [kategoriKaryawanOptions, setKategoriKaryawanOptions] = useState<any[]>([]);
  const [positionLevelOptions, setPositionLevelOptions] = useState<any[]>([]);
  
  // Derived state
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  // Initialize form with data
  useEffect(() => {
    if (initialData && isOpen) {
      // Map API response to form
      const mappedData: OrganizationChangeForm = {
        id: initialData.id,
        employee_id: initialData.employee_id || initialData.idKaryawan, // Handle variations
        nama: initialData.name || initialData.nama,
        nip: initialData.nip || initialData.idKaryawan,
        change_type_id: initialData.change_type_id, // Ensure API sends ID or map name to ID if needed. For now assuming ID is used or name matches if select uses string. 
        // Note: JENIS_PERUBAHAN_OPTIONS uses values like 'Rotasi'. If API returns UUID for change_type, we need to handle that. 
        // The user example shows "change_type_id": "...", "change_type_name": "Promosi". 
        // If we want to use the ID for the dropdown, we need to fetch change types from API or use the name if the dropdown is static.
        // For now, I'll assume we might need to use the name or ID. The user provided static options for Change Type in previous code.
        // But in the prompt, user shows "change_type_id". 
        // Let's assume for now we use the ID if we have dynamic options, or map name if static.
        // Since I don't have a "getChangeTypes" API, I will stick to static options for now OR check if I should use ID.
        // Wait, the user prompt showed "change_type_id": "5d2ce8a2...". This implies it's a dynamic list from DB.
        // However, I don't see a `getChangeTypeDropdown` in the services I read. 
        // I will stick to the static list for "Jenis Perubahan" but map the value carefully.
        // Actually, let's just put `change_type_id` in the form. If the dropdown expects specific values, we might have a mismatch.
        // Given the instructions focused on "Perusahaan, Direktorat, Divisi, Departemen, Position, Jabatan, Jenjang Jabatan, Golongan, Kategori Karyawan", I will focus on making THOSE dynamic.
        // "Jenis Perubahan" was not in the list of dropdowns to "sesuaikan rulenya".
        
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
        
        // Handle reset logic for dependent fields
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

  // Fetch Initial Options
  useEffect(() => {
    if (!isOpen) return;

    const fetchInitialData = async () => {
      try {
        const [
            kategori,
            positionLevels,
            companies,
            directorates,
            positions,
            jobTitles
        ] = await Promise.all([
            getEmployeeCategoryDropdownOptions(),
            getPositionLevelDropdownOptions(),
            employeeMasterDataService.getCompanyDropdown(),
            employeeMasterDataService.getDirectorateDropdown(),
            employeeMasterDataService.getPositionDropdown(),
            employeeMasterDataService.getJobTitleDropdown()
        ]);

        setKategoriKaryawanOptions(kategori);
        setPositionLevelOptions(positionLevels);
        setCompanyOptions((companies || []).map((i: any) => ({ label: i.company_name, value: i.id })));
        setDirectorateOptions((directorates || []).map((i: any) => ({ label: i.directorate_name, value: i.id })));
        setPositionOptions((positions || []).map((i: any) => ({ label: i.position_name, value: i.id })));
        setJobTitleOptions((jobTitles || []).map((i: any) => ({ label: i.job_title_name, value: i.id, grade: i.grade })));

      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [isOpen]);

  // Fetch Dependent Options: Office
  useEffect(() => {
    const fetchOffices = async () => {
        if (!form.company_id) {
            setOfficeOptions([]);
            return;
        }
        try {
            const items = await employeeMasterDataService.getOfficeDropdown(undefined, form.company_id);
            setOfficeOptions((items || []).map((i: any) => ({ label: i.office_name, value: i.id })));
        } catch (error) {
            console.error('Error fetching offices:', error);
            setOfficeOptions([]);
        }
    };
    fetchOffices();
  }, [form.company_id]);

  // Fetch Dependent Options: Division
  useEffect(() => {
    const fetchDivisions = async () => {
        if (!form.directorate_id) {
            setDivisionOptions([]);
            return;
        }
        try {
            const items = await employeeMasterDataService.getDivisionsByDirectorate(form.directorate_id);
            setDivisionOptions((items || []).map((i: any) => ({ label: i.division_name, value: i.id })));
        } catch (error) {
            console.error('Error fetching divisions:', error);
            setDivisionOptions([]);
        }
    };
    fetchDivisions();
  }, [form.directorate_id]);

  // Fetch Dependent Options: Department
  useEffect(() => {
    const fetchDepartments = async () => {
        if (!form.division_id) {
            setDepartmentOptions([]);
            return;
        }
        try {
            const items = await employeeMasterDataService.getDepartmentsByDivision(form.division_id);
            setDepartmentOptions((items || []).map((i: any) => ({ label: i.department_name, value: i.id })));
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartmentOptions([]);
        }
    };
    fetchDepartments();
  }, [form.division_id]);
  
  // Set Grade if Job Title is already selected (e.g. from initial data)
  useEffect(() => {
      if (form.job_title_id && jobTitleOptions.length > 0) {
          const selectedJob = jobTitleOptions.find((j: any) => j.value === form.job_title_id);
          if (selectedJob?.grade) {
              setSelectedGrade(selectedJob.grade);
          }
      }
  }, [form.job_title_id, jobTitleOptions]);


  const content = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label>NIP</Label>
            <Select
                options={employeeOptions.length > 0 ? employeeOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={form.nip || ''}
                onChange={(v) => handleInput('nip', v)}
                placeholder="Pilih NIP"
                disabled={employeeOptions.length === 0}
            />
          </div>
          <div>
            <Label>Jenis Perubahan</Label>
            <Select 
                options={changeTypeOptions.length > 0 ? changeTypeOptions : [{ label: 'Memuat opsi...', value: '' }]} 
                defaultValue={form.change_type_id || ''} 
                onChange={(v) => handleInput('change_type_id', v)} 
                placeholder="Select"
                disabled={changeTypeOptions.length === 0}
            />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <Select options={companyOptions} defaultValue={form.company_id || ''} onChange={(v) => handleInput('company_id', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Direktorat</Label>
            <Select options={directorateOptions} defaultValue={form.directorate_id || ''} onChange={(v) => handleInput('directorate_id', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Departemen</Label>
            <Select 
                options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]} 
                defaultValue={form.department_id || ''} 
                onChange={(v) => handleInput('department_id', v)} 
                placeholder="Select"
                disabled={departmentOptions.length === 0}
            />
          </div>
          <div>
            <Label>Jabatan</Label>
            <Select options={jobTitleOptions} defaultValue={form.job_title_id || ''} onChange={(v) => handleInput('job_title_id', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Golongan</Label>
            <InputField value={selectedGrade || form.golongan || ''} disabled placeholder="Otomatis dari Jabatan" onChange={() => {}} />
          </div>
          <div>
            <Label>Alasan Perubahan</Label>
            <InputField placeholder="Masukkan alasan perubahan" value={form.reason || ''} onChange={(e) => handleInput('reason', e.target.value)} />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Label>Nama</Label>
            <InputField placeholder="Masukkan nama" value={form.nama || ''} disabled onChange={(e) => handleInput('nama', e.target.value)} />
          </div>
          <div>
            <DatePicker
              id="effectiveDatePicker"
              label="Tanggal Efektif"
              defaultDate={form.efektif_date || undefined}
              placeholder="— (masih aktif)"
              onChange={(...args) => handleInput('efektif_date', args[1])}
            />
          </div>
          <div>
            <Label>Kantor</Label>
            <Select 
                options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]} 
                defaultValue={form.office_id || ''} 
                onChange={(v) => handleInput('office_id', v)} 
                placeholder="Select"
                disabled={officeOptions.length === 0}
            />
          </div>
          <div>
            <Label>Divisi</Label>
            <Select 
                options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]} 
                defaultValue={form.division_id || ''} 
                onChange={(v) => handleInput('division_id', v)} 
                placeholder="Select"
                disabled={divisionOptions.length === 0}
            />
          </div>
          <div>
            <Label>Position</Label>
            <Select options={positionOptions} defaultValue={form.position_id || ''} onChange={(v) => handleInput('position_id', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Jenjang Jabatan</Label>
            <Select options={positionLevelOptions} defaultValue={form.position_level_id || ''} onChange={(v) => handleInput('position_level_id', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Kategori Karyawan</Label>
            <Select options={kategoriKaryawanOptions} defaultValue={form.employee_category_id || ''} onChange={(v) => handleInput('employee_category_id', v)} placeholder="Select" />
          </div>
          {!hideSkFileUpload && (
            <div>
              <Label>Unggah file Sk</Label>
              <FileInput onChange={handleFileChange} />
              {form.decree_file && <p className="text-xs text-gray-500 mt-1">File saat ini: {form.decree_file}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => {
        onSubmit(form);
      }}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
      confirmTitleButton="Simpan Perubahan"
    />
  );
};

export default EditRiwayatOrganisasiModal;

