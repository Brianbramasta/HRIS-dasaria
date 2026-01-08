import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import InputField from '@/components/form/input/InputField';
import FileInput from '@/components/form/input/FileInput';
import {
  useEditOrganizationHistoryModal,
  OrganizationChangeForm,
} from '@/features/employee/hooks/modals/organization-history/useEditOrganizationHistoryModal';

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
            <Label>NIP</Label>
            <Select
                options={employeeOptions.length > 0 ? employeeOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={form.nip || ''}
                onChange={(v) => handleInput('nip', v)}
                placeholder="Pilih NIP"
                disabled={isEditMode || employeeOptions.length === 0}
            />
          </div>
          <div>
            <Label>Jenis Perubahan</Label>
            <Select 
                options={changeTypeOptions.length > 0 ? changeTypeOptions : [{ label: 'Memuat opsi...', value: '' }]} 
                defaultValue={form.change_type_id || ''} 
                onChange={(v) => handleInput('change_type_id', v)} 
                placeholder="Select"
                disabled={isEditMode || changeTypeOptions.length === 0}
            />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <Select options={companyOptions} defaultValue={form.company_id || ''} onChange={(v) => handleInput('company_id', v)} placeholder="Select" disabled={isEditMode} />
          </div>
          <div>
            <Label>Direktorat</Label>
            <Select options={directorateOptions} defaultValue={form.directorate_id || ''} onChange={(v) => handleInput('directorate_id', v)} placeholder="Select" disabled={isEditMode} />
          </div>
          <div>
            <Label>Departemen</Label>
            <Select 
                options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]} 
                defaultValue={form.department_id || ''} 
                onChange={(v) => handleInput('department_id', v)} 
                placeholder="Select"
                disabled={isEditMode || departmentOptions.length === 0}
            />
          </div>
          <div>
            <Label>Jabatan</Label>
            <Select options={jobTitleOptions} defaultValue={form.job_title_id || ''} onChange={(v) => handleInput('job_title_id', v)} placeholder="Select" disabled={isEditMode} />
          </div>
          <div>
            <Label>Golongan</Label>
            <InputField value={selectedGrade || form.golongan || ''} disabled placeholder="Otomatis dari Jabatan" onChange={() => {}} />
          </div>
          <div>
            <Label>Alasan Perubahan</Label>
            <InputField placeholder="Masukkan alasan perubahan" value={form.reason || ''} onChange={(e) => handleInput('reason', e.target.value)} disabled={isEditMode} />
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
              disabled={isEditMode}
            />
          </div>
          <div>
            <Label>Kantor</Label>
            <Select 
                options={officeOptions.length > 0 ? officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]} 
                defaultValue={form.office_id || ''} 
                onChange={(v) => handleInput('office_id', v)} 
                placeholder="Select"
                disabled={isEditMode || officeOptions.length === 0}
            />
          </div>
          <div>
            <Label>Divisi</Label>
            <Select 
                options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]} 
                defaultValue={form.division_id || ''} 
                onChange={(v) => handleInput('division_id', v)} 
                placeholder="Select"
                disabled={isEditMode || divisionOptions.length === 0}
            />
          </div>
          <div>
            <Label>Position</Label>
            <Select options={positionOptions} defaultValue={form.position_id || ''} onChange={(v) => handleInput('position_id', v)} placeholder="Select" disabled={isEditMode} />
          </div>
          <div>
            <Label>Jenjang Jabatan</Label>
            <Select options={positionLevelOptions} defaultValue={form.position_level_id || ''} onChange={(v) => handleInput('position_level_id', v)} placeholder="Select" disabled={isEditMode} />
          </div>
          <div>
            <Label>Kategori Karyawan</Label>
            <Select options={kategoriKaryawanOptions} defaultValue={form.employee_category_id || ''} onChange={(v) => handleInput('employee_category_id', v)} placeholder="Select" disabled={isEditMode} />
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

