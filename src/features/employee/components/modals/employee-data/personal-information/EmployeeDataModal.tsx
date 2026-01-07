import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import { STATUS_PAYROLL_OPTIONS } from '@/features/employee/utils/EmployeeMappings';
import { useStep3Data } from '@/features/employee/hooks/employee-data/form/useFromStep';
import { employeeMasterDataService } from '@/features/employee/services/EmployeeMasterData.service';
import { formatDateToIndonesian } from '@/utils/formatDate';

// Dokumentasi: Menyesuaikan penamaan field form dengan payload API update-employment-position
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

interface Props {
  isOpen: boolean;
  initialData?: EmployeeDataForm | null;
  onClose: () => void;
  onSubmit: (data: EmployeeDataForm) => void;
  submitting?: boolean;
}

const EmployeeDataModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<EmployeeDataForm>({});
  const title = useMemo(() => 'Edit Data Karyawan', []);
  const [officeDropdown, setOfficeDropdown] = useState<any[]>([]);
  const [divisionDropdown, setDivisionDropdown] = useState<any[]>([]);
  const [departmentDropdown, setDepartmentDropdown] = useState<any[]>([]);

  // Fetch dropdown options dari API menggunakan hook yang sama seperti Step03
  // Pass isOpen untuk hanya fetch ketika modal dibuka
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

  // Effect untuk fetch office, divisions, departments based on initialData
  useEffect(() => {
    if (!isOpen || !initialData) return;

    const fetchDependentOptions = async () => {
      try {
        // Fetch offices jika ada company_id
        if (initialData.company_id) {
          const offices = await employeeMasterDataService.getOfficeDropdown(undefined, initialData.company_id);
          setOfficeDropdown((offices || []).map((i: any) => ({ label: i.office_name, value: i.id })));
        }

        // Fetch divisions jika ada directorate_id
        if (initialData.directorate_id) {
          const divisions = await employeeMasterDataService.getDivisionsByDirectorate(initialData.directorate_id);
          setDivisionDropdown((divisions || []).map((i: any) => ({ label: i.division_name, value: i.id })));
        }

        // Fetch departments jika ada division_id
        if (initialData.division_id) {
          const departments = await employeeMasterDataService.getDepartmentsByDivision(initialData.division_id);
          setDepartmentDropdown((departments || []).map((i: any) => ({ label: i.department_name, value: i.id })));
        }
      } catch (error) {
        console.error('Error fetching dependent options:', error);
      }
    };

    fetchDependentOptions();
  }, [isOpen, initialData, initialData?.company_id, initialData?.directorate_id, initialData?.division_id]);

  const handleInput = (key: keyof EmployeeDataForm, value: any) => {
    console.log('test input',key, value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Dokumentasi: Field dinonaktifkan bila data awal aktif ATAU data awal kosong/tidak lengkap (required belum terisi)
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
      // 'payroll_status',
    ];
    const missingRequired = requiredKeys.some((k) => {
      const v = (base as any)?.[k];
      return v === undefined || v === null || v === '';
    });
    console.log('isDisabledField 1', base?.employment_status, allEmpty, missingRequired);
    return base?.employment_status === 'Aktif' || allEmpty || !missingRequired;
  }, [initialData]);
  console.log('isDisabledField', isDisabledField);


  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <h4 className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</h4>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Kategori Karyawan</Label>
            <Select
              options={kategoriKaryawanOptions}
              defaultValue={form.employee_category_id || ''}
              onChange={(v) => {
                handleInput('employee_category_id', v);
                const selectedCategory = kategoriKaryawanOptions.find((opt: any) => opt.value === v);
                if (selectedCategory) {
                  const label = selectedCategory.label;
                  if (['Staff', 'Mitra'].includes(label)) {
                    const statusEvaluasi = employeeStatusOptions.find((opt: any) => opt.label === 'Evaluasi');
                    if (statusEvaluasi) handleInput('employment_status_id', statusEvaluasi.value);
                  } else if (label === 'Non-Staff') {
                    const statusAktif = employeeStatusOptions.find((opt: any) => opt.label === 'Aktif');
                    if (statusAktif) handleInput('employment_status_id', statusAktif.value);
                  }
                }
              }}
              placeholder="Select"
              disabled={isDisabledField}
            />
          </div>
          <div>
            <Label>Status Karyawan</Label>
            <Select
              options={employeeStatusOptions}
              defaultValue={form.employment_status_id || ''}
              onChange={(v) => handleInput('employment_status_id', v)}
              placeholder="Select"
              disabled={true}
            />
          </div>
          <div>
            <DatePicker
              id="joinDatePicker"
              label="Tanggal Masuk"
              defaultDate={formatDateToIndonesian(form.start_date as string) || undefined}
              placeholder="Pilih tanggal"
              onChange={(...args) => handleInput('start_date', args[1])}
              disabled={isDisabledField}
            />
          </div>
          <div>
            <DatePicker
              id="endDatePicker"
              label="Tanggal Akhir"
              defaultDate={formatDateToIndonesian(form.end_date as string) || undefined}
              placeholder="— (masih aktif)"
              onChange={(...args) => handleInput('end_date', args[1])}
              disabled={isDisabledField}
            />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <Select
              options={companyOptions}
              defaultValue={form.company_id || ''}
              onChange={(v) => handleInput('company_id', v)}
              placeholder="Select"
              disabled={isDisabledField}
            />
          </div>
          <div>
            <Label>Kantor</Label>
            <Select
              options={officeDropdown.length > 0 ? officeDropdown : officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
              defaultValue={form.office_id || ''}
              onChange={(v) => handleInput('office_id', v)}
              disabled={officeDropdown.length === 0 && officeOptions.length === 0 || isDisabledField}
              placeholder="Select"
            />
          </div>
          <div>
            <Label>Direktorat</Label>
            <Select
              options={directorateOptions}
              defaultValue={form.directorate_id || ''}
              onChange={(v) => handleInput('directorate_id', v)}
              placeholder="Select"
              disabled={isDisabledField}
            />
          </div>
          
        </div>

        <div className="space-y-4">
          <div>
            <Label>Divisi</Label>
            <Select
              options={divisionDropdown.length > 0 ? divisionDropdown : divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
              defaultValue={form.division_id || ''}
              onChange={(v) => handleInput('division_id', v)}
              disabled={divisionDropdown.length === 0 && divisionOptions.length === 0 || isDisabledField}
              placeholder="Select"
            />
          </div>
          <div>
            <Label>Departemen</Label>
            <Select
              options={departmentDropdown.length > 0 ? departmentDropdown : departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
              defaultValue={form.department_id || ''}
              onChange={(v) => handleInput('department_id', v)}
              disabled={departmentDropdown.length === 0 && departmentOptions.length === 0 || isDisabledField}
              placeholder="Select"
            />
          </div>
          <div>
            <Label>Position</Label>
            <Select
              options={positionOptions}
              defaultValue={form.position_id || ''}
              onChange={(v) => handleInput('position_id', v)}
              placeholder="Select"
              disabled={isDisabledField}
            />
          </div>
          <div>
            <Label>Jabatan</Label>
            <Select
              options={jobTitleOptions}
              defaultValue={form.job_title_id || ''}
              onChange={(v) => handleInput('job_title_id', v)}
              placeholder="Select"
              disabled={isDisabledField}
            />
          </div>
          <div>
            <Label>Jenjang Jabatan</Label>
            <Select
              options={positionLevelOptions}
              defaultValue={form.position_level_id || ''}
              onChange={(v) => handleInput('position_level_id', v)}
              placeholder="Select"
              disabled={isDisabledField}
            />
          </div>
          <div>
            <Label>Golongan</Label>
            <InputField
              type="text"
              value={selectedGrade || form.golongan || ''}
              placeholder="Otomatis dari Jabatan"
              disabled={isDisabledField}
              onChange={() => {}}
            />
          </div>
          <div>
            <Label>Status PayRoll</Label>
            <Select
              options={STATUS_PAYROLL_OPTIONS}
              defaultValue={form.payroll_status || ''}
              onChange={(v) => handleInput('payroll_status', v)}
              placeholder="Select"
              disabled={isDisabledField}
            />
          </div>
          
        </div>
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => {
        // console.log('test submit', form);
        // return
        onSubmit(form);
      }}
      isSubmit={!isDisabledField}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default EmployeeDataModal;
