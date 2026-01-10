import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import FileInput from '@/components/form/input/FileInput';
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
  } = useEditOrganizationHistoryModal({ isOpen, initialData });


  const content = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <SelectField
                label="NIP"
                required
                options={employeeOptions.length > 0 ? employeeOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={form.nip || ''}
                onChange={(v) => handleInput('nip', v)}
                placeholder="Pilih NIP"
                disabled={isEditMode || employeeOptions.length === 0}
            />
          </div>
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
            <SelectField 
                label="Perusahaan"
                required
                options={companyOptions} 
                defaultValue={form.company_id || ''} 
                onChange={(v) => handleInput('company_id', v)} 
                placeholder="Select" 
                disabled={isEditMode} 
            />
          </div>
          <div>
            <SelectField 
                label="Direktorat"
                required
                options={directorateOptions} 
                defaultValue={form.directorate_id || ''} 
                onChange={(v) => handleInput('directorate_id', v)} 
                placeholder="Select" 
                disabled={isEditMode} 
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
                label="Jabatan"
                required
                options={jobTitleOptions} 
                defaultValue={form.job_title_id || ''} 
                onChange={(v) => handleInput('job_title_id', v)} 
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
            <TextAreaField 
                label="Alasan Perubahan"
                required
                placeholder="Masukkan alasan perubahan" 
                value={form.reason || ''} 
                onChange={(e) => handleInput('reason', e)} 
                disabled={isEditMode} 
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <InputField 
                label="Nama"
                required
                placeholder="Masukkan nama" 
                value={form.nama || ''} 
                disabled 
                onChange={(e) => handleInput('nama', e.target.value)} 
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
                label="Kantor"
                required
                options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]} 
                defaultValue={form.office_id || ''} 
                onChange={(v) => handleInput('office_id', v)} 
                placeholder="Select"
                disabled={isEditMode || officeOptions.length === 0}
            />
          </div>
          <div>
            <SelectField 
                label="Divisi"
                required
                options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]} 
                defaultValue={form.division_id || ''} 
                onChange={(v) => handleInput('division_id', v)} 
                placeholder="Select"
                disabled={isEditMode || divisionOptions.length === 0}
            />
          </div>
          <div>
            <SelectField 
                label="Position"
                required
                options={positionOptions} 
                defaultValue={form.position_id || ''} 
                onChange={(v) => handleInput('position_id', v)} 
                placeholder="Select" 
                disabled={isEditMode} 
            />
          </div>
          <div>
            <SelectField 
                label="Jenjang Jabatan"
                required
                options={positionLevelOptions} 
                defaultValue={form.position_level_id || ''} 
                onChange={(v) => handleInput('position_level_id', v)} 
                placeholder="Select" 
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
          {!hideSkFileUpload && (
            <div>
              <FIleField 
                label="Unggah file Sk"
                required
                onChange={handleFileChange}
                // isLabel={false}
              />
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

