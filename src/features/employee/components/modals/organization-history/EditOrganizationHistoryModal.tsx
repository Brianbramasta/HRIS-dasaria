import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import PayrollCard from '@/features/payroll/components/cards/Cards';

import {
  useEditOrganizationHistoryModal,
  OrganizationChangeForm,
} from '@/features/employee/hooks/modals/organization-history/useEditOrganizationHistoryModal';
import SelectField from '@/components/shared/field/SelectField';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import DateField from '@/components/shared/field/DateField';
import FIleField from '@/components/shared/field/FIleField';

interface Props {
  isOpen: boolean;
  initialData?: any | null; // Allow flexible input from API
  onClose: () => void;
  onSubmit: (data: OrganizationChangeForm) => void;
  submitting?: boolean;
  hideSkFileUpload?: boolean;
}

const EditRiwayatOrganisasiModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false, hideSkFileUpload = false }) => {
  const {
    title,
    form,
    isEditMode,
    currentEmployee,
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
  } = useEditOrganizationHistoryModal({ isOpen, initialData });


  const content = (
    <div className="space-y-8">
      {/* Informasi Karyawan Section */}
      <PayrollCard
        title="Informasi Karyawan"
        headerColor="slate"
        border={false}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <SelectField
              label="NIP"
              required
              options={employeeOptions.length > 0 ? employeeOptions : [{ label: 'Memuat opsi...', value: '' }]}
              defaultValue={form.nip || ''}
              onChange={(v) => handleInput('nip', v)}
              onSearch={handleEmployeeSearch}
              placeholder="Pilih NIP"
              // comment sementara
              // disabled={isEditMode || employeeOptions.length === 0}
            />
          </div>
          <div>
            <InputField
              label="Pengguna"
              placeholder="Otomatis"
              value={currentEmployee?.full_name || form.nama || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Kategori Karyawan"
              placeholder="Otomatis"
              value={currentEmployee?.employee_category || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Perusahaan"
              placeholder="Otomatis"
              value={currentEmployee?.company_name || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Kantor"
              placeholder="Otomatis"
              value={currentEmployee?.office_name || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Direktorat"
              placeholder="Otomatis"
              value={currentEmployee?.directorate_name || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Divisi"
              placeholder="Otomatis"
              value={currentEmployee?.division_name || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Departemen"
              placeholder="Otomatis"
              value={currentEmployee?.department_name || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Unit"
              placeholder="Otomatis"
              value={currentEmployee?.unit || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Posisi"
              placeholder="Otomatis"
              value={currentEmployee?.position_name || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Jabatan Kepangkatan"
              placeholder="Otomatis"
              value={currentEmployee?.job_title_name || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Jabatan Struktural"
              placeholder="Otomatis"
              value={currentEmployee?.structural_job || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Jenjang Jabatan"
              placeholder="Otomatis"
              value={currentEmployee?.position_level || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Golongan"
              placeholder="Otomatis"
              value={currentEmployee?.grade || ''}
              disabled
            />
          </div>
          <div>
            <InputField
              label="Gaji Bersih"
              placeholder="Otomatis"
              value=""
              disabled
            />
          </div>
        </div>
      </PayrollCard>

      {/* Detail Perubahan Section - Only visible when NIP/Employee is selected */}
      {(form.nip || form.employee_id) && (
        <PayrollCard
          title="Detail Perubahan"
          headerColor="green"
          border={false}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <SelectField
                label="Jenis Perubahan"
                required
                options={changeTypeOptions.length > 0 ? changeTypeOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={form.change_type_id || ''}
                onChange={(v) => handleInput('change_type_id', v)}
                placeholder="Select"
                disabled={isEditMode || changeTypeOptions.length === 0}
              />
            </div>
            <div>
              <DateField
                id="effectiveDatePicker"
                label="Tanggal Efektif"
                required
                defaultDate={form.efektif_date || undefined}
                placeholder="— (masih aktif)"
                onChange={(...args) => handleInput('efektif_date', args[1])}
                disabled={isEditMode}
              />
            </div>
            <div>
              <SelectField
                label="Kategori Karyawan"
                required
                options={kategoriKaryawanOptions}
                defaultValue={form.employee_category_id || ''}
                onChange={(v) => handleInput('employee_category_id', v)}
                placeholder="Select"
                disabled={isEditMode}
              />
            </div>
            <div>
              <SelectField
                label="Perusahaan"
                required
                options={companyOptions}
                defaultValue={form.company_id || ''}
                onChange={(v) => handleInput('company_id', v)}
                onSearch={handleCompanySearch}
                placeholder="Select"
                disabled={isEditMode}
              />
            </div>
            <div>
              <SelectField
                label="Kantor"
                required
                options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
                defaultValue={form.office_id || ''}
                onChange={(v) => handleInput('office_id', v)}
                onSearch={handleOfficeSearch}
                placeholder="Select"
                disabled={isEditMode || officeOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Direktorat"
                required
                options={directorateOptions}
                defaultValue={form.directorate_id || ''}
                onChange={(v) => handleInput('directorate_id', v)}
                onSearch={handleDirectorateSearch}
                placeholder="Select"
                disabled={isEditMode}
              />
            </div>
            <div>
              <SelectField
                label="Divisi"
                required
                options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
                defaultValue={form.division_id || ''}
                onChange={(v) => handleInput('division_id', v)}
                onSearch={handleDivisionSearch}
                placeholder="Select"
                disabled={isEditMode || divisionOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Departemen"
                required
                options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
                defaultValue={form.department_id || ''}
                onChange={(v) => handleInput('department_id', v)}
                placeholder="Select"
                disabled={isEditMode || departmentOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Unit"
                options={unitOptions.length > 0 ? unitOptions : [{ label: 'Pilih departemen terlebih dahulu', value: '' }]}
                defaultValue={form.unit_id || ''}
                onChange={(v) => handleInput('unit_id', v)}
                onSearch={handleUnitSearch}
                placeholder="Select"
                disabled={isEditMode || unitOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Posisi"
                required
                options={positionOptions}
                defaultValue={form.position_id || ''}
                onChange={(v) => handleInput('position_id', v)}
                onSearch={handlePositionSearch}
                placeholder="Select"
                disabled={isEditMode}
              />
            </div>
            <div>
              <SelectField
                label="Jabatan Kepangkatan"
                required
                options={jobTitleOptions}
                defaultValue={form.job_title_id || ''}
                onChange={(v) => handleInput('job_title_id', v)}
                onSearch={handleJobTitleSearch}
                placeholder="Select"
                disabled={isEditMode}
              />
            </div>
            <div>
              <SelectField
                label="Jabatan Struktural"
                required
                options={structuralJobOptions.length > 0 ? structuralJobOptions : [{ label: 'Pilih jabatan kepangkatan terlebih dahulu', value: '' }]}
                defaultValue={form.structural_job_id || ''}
                onChange={(v) => handleInput('structural_job_id', v)}
                placeholder="Select"
                disabled={isEditMode || structuralJobOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Jenjang Jabatan"
                required
                options={positionLevelOptions}
                defaultValue={form.position_level_id || ''}
                onChange={(v) => handleInput('position_level_id', v)}
                onSearch={handlePositionLevelSearch}
                placeholder="Select"
                disabled={isEditMode}
              />
            </div>
            <div>
              <InputField
                label="Golongan"
                required
                value={selectedGrade || form.golongan || ''}
                disabled
                placeholder="Otomatis dari Jabatan"
                onChange={() => {}}
              />
            </div>
            <div>
              <InputField
                label="Gaji Bersih"
                placeholder="Input"
                disabled={true}
                value=""
              />
            </div>
            {!hideSkFileUpload && (
              <div className="col-span-1 md:col-span-3">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-3">
                        <FIleField
                          label="Upload file Sk"
                          required
                          onChange={handleFileChange}
                        />
                        {/* {form.decree_file && <p className="text-xs text-gray-500 mt-1">File saat ini: {form.decree_file}</p>} */}
                    </div>
                 </div>
              </div>
            )}
             <div className="col-span-1 md:col-span-3">
                <TextAreaField
                  label="Alasan Perubahan"
                  required
                  placeholder="Masukkan alasan perubahan"
                  value={form.reason || ''}
                  onChange={(e) => handleInput('reason', e)}
                  disabled={isEditMode}
                  rows={4}
                />
            </div>
          </div>
        </PayrollCard>
      )}
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

