import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import SelectField from '@/components/shared/field/SelectField';
import InputField from '@/components/shared/field/InputField';
// import DateField from '@/components/shared/field/DateField';
import { STATUS_PAYROLL_OPTIONS } from '@/features/employee/utils/EmployeeMappings';
// import { formatDateToIndonesian } from '@/utils/formatDate';
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
    structuralJobOptions,
    unitOptions,
    selectedGrade,
    handleInput,
    isDisabledField,
    visibleFields,
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
  } = useEmployeeDataModal({ isOpen, initialData });


  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <p className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Baris 1 */}
        <div>
          <SelectField
            label="Kategori Karyawan"
            htmlFor="employeeCategorySelect"
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
            onSearch={handleEmployeeCategorySearch}
            placeholder="Select"
            disabled={isDisabledField}
            required
          />
        </div>
        <div>
          <SelectField
            label="Status Karyawan"
            htmlFor="employmentStatusSelect"
            options={employeeStatusOptions}
            defaultValue={form.employment_status_id || ''}
            onChange={(v) => handleInput('employment_status_id', v)}
            placeholder="Select"
            disabled={true}
            required
          />
        </div>

        {/* Baris 2 */}
        <div>
          <SelectField
            label="Jabatan Kepangkatan"
            htmlFor="jobTitleSelect"
            options={jobTitleOptions}
            defaultValue={form.job_title_id || ''}
            onChange={(v) => handleInput('job_title_id', v)}
            onSearch={handleJobTitleSearch}
            placeholder="Select"
            disabled={isDisabledField}
            required
          />
        </div>
        <div>
          <SelectField
            label="Jabatan Struktural"
            htmlFor="structuralJobSelect"
            options={structuralJobOptions}
            defaultValue={form.structural_job_id || ''}
            onChange={(v) => handleInput('structural_job_id', v)}
            placeholder="Select"
            disabled={!form.job_title_id || isDisabledField}
            required
          />
        </div>

        {/* Baris 3 */}
        <div>
          <SelectField
            label="Perusahaan"
            htmlFor="companySelect"
            options={companyOptions}
            defaultValue={form.company_id || ''}
            onChange={(v) => handleInput('company_id', v)}
            onSearch={handleCompanySearch}
            placeholder="Select"
            disabled={isDisabledField}
            required
          />
        </div>
        <div>
          <SelectField
            label="Kantor"
            htmlFor="officeSelectRight"
            options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
            defaultValue={form.office_id || ''}
            onChange={(v) => handleInput('office_id', v)}
            onSearch={handleOfficeSearch}
            disabled={officeOptions.length === 0 || isDisabledField}
            placeholder="Select"
            required
          />
        </div>

        {/* Baris 4 (Conditional) */}
        {visibleFields.direktorat && (
          <div>
            <SelectField
              label="Direktorat"
              htmlFor="directorateSelect"
              options={directorateOptions}
              defaultValue={form.directorate_id || ''}
              onChange={(v) => handleInput('directorate_id', v)}
              onSearch={handleDirectorateSearch}
              placeholder="Select"
              disabled={isDisabledField}
              required
            />
          </div>
        )}
        {visibleFields.divisi && (
          <div>
            <SelectField
              label="Divisi"
              htmlFor="divisionSelect"
              options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
              defaultValue={form.division_id || ''}
              onChange={(v) => handleInput('division_id', v)}
              onSearch={handleDivisionSearch}
              disabled={divisionOptions.length === 0 || isDisabledField}
              placeholder="Select"
              required
            />
          </div>
        )}

        {/* Baris 5 (Conditional) */}
        {visibleFields.departemen && (
          <div>
            <SelectField
              label="Departemen"
              htmlFor="departmentSelectLeft"
              options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
              defaultValue={form.department_id || ''}
              onChange={(v) => handleInput('department_id', v)}
              onSearch={handleDepartmentSearch}
              disabled={departmentOptions.length === 0 || isDisabledField}
              placeholder="Select"
              required
            />
          </div>
        )}
        {visibleFields.unit && (
          <div>
            <SelectField
              label="Unit"
              htmlFor="unitSelect"
              options={unitOptions.length > 0 ? unitOptions : [{ label: 'Pilih departemen terlebih dahulu', value: '' }]}
              defaultValue={form.unit_id || ''}
              onChange={(v) => handleInput('unit_id', v)}
              onSearch={handleUnitSearch}
              placeholder="Select"
              disabled={unitOptions.length === 0 || isDisabledField}
              required
            />
          </div>
        )}

        {/* Baris 6 */}
        <div>
          <SelectField
            label="Jenjang Jabatan"
            htmlFor="positionLevelSelect"
            options={positionLevelOptions}
            defaultValue={form.position_level_id || ''}
            onChange={(v) => handleInput('position_level_id', v)}
            onSearch={handlePositionLevelSearch}
            placeholder="Select"
            disabled={isDisabledField}
            required
          />
        </div>
        {visibleFields.position && (
          <div>
            <SelectField
              label="Position"
              htmlFor="positionSelect"
              options={positionOptions}
              defaultValue={form.position_id || ''}
              onChange={(v) => handleInput('position_id', v)}
              onSearch={handlePositionSearch}
              placeholder="Select"
              disabled={isDisabledField}
              required
            />
          </div>
        )}

        {/* Baris 7 */}
        <div>
          <SelectField
            label="Status PayRoll"
            htmlFor="payrollStatusSelect"
            options={STATUS_PAYROLL_OPTIONS}
            defaultValue={form.payroll_status || ''}
            onChange={(v) => handleInput('payroll_status', v)}
            placeholder="Select"
            disabled={isDisabledField}
            required
          />
        </div>
        <div>
          <InputField
            label="Golongan"
            id="golonganInput"
            type="text"
            value={selectedGrade || form.golongan || ''}
            placeholder="Otomatis dari Jabatan"
            disabled={true}
            onChange={() => {}}
            required
          />
        </div>

        {/* Commented out fields preserved if needed */}
        {/* <div>
          <DateField
            id="joinDatePicker"
            label="Tanggal Masuk"
            defaultDate={formatDateToIndonesian(form.start_date as string) || undefined}
            placeholder="Pilih tanggal"
            onChange={(...args) => handleInput('start_date', args[1])}
            disabled={isDisabledField}
            required
          />
        </div>
        <div>
          <DateField
            id="endDatePickerRight"
            label="Tanggal Akhir"
            defaultDate={formatDateToIndonesian(form.end_date as string) || undefined}
            placeholder="(masih aktif)"
            onChange={(...args) => handleInput('end_date', args[1])}
            disabled={isDisabledField}
            required
          />
        </div> */}
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => {
        // const requiredKeys: Array<keyof EmployeeDataForm> = [
        //   'employment_status_id',
        //   'start_date',
        //   'company_id',
        //   'office_id',
        //   'directorate_id',
        //   'division_id',
        //   'department_id',
        //   'position_id',
        //   'job_title_id',
        //   'position_level_id',
        //   'employee_category_id',
        //   'payroll_status',
        // ];
        // const isValid = requiredKeys.every((k) => {
        //   const v = (form as any)?.[k];
        //   if (typeof v === 'string') return v.trim() !== '';
        //   return v !== null && v !== undefined;
        // });
        // if (!isValid) {
        //   alert('Semua form wajib diisi.');
        //   return;
        // }
        onSubmit(form);
      }}
      isSubmit={!isDisabledField}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default EmployeeDataModal;
