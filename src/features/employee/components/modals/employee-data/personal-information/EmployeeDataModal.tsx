import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import { STATUS_PAYROLL_OPTIONS } from '@/features/employee/utils/EmployeeMappings';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { useEmployeeDataModal, EmployeeDataForm } from '@/features/employee/hooks/modals/employee-data/personal-information/useEmployeeDataModal';
export type { EmployeeDataForm };

// Dokumentasi: Menyesuaikan penamaan field form dengan payload API update-employment-position
interface Props {
  isOpen: boolean;
  initialData?: EmployeeDataForm | null;
  onClose: () => void;
  onSubmit: (data: EmployeeDataForm) => void;
  submitting?: boolean;
}

const EmployeeDataModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const {
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
  } = useEmployeeDataModal({ isOpen, initialData });


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
        onSubmit(form);
      }}
      isSubmit={!isDisabledField}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default EmployeeDataModal;
