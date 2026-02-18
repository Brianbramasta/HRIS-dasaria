import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import useOrganizationHistoryDetail from '@/features/employee/hooks/organization-history/useOrganizationHistoryDetail';
import { useEditOrganizationHistoryModal } from '@/features/employee/hooks/modals/organization-history/useEditOrganizationHistoryModal';
import { useOrganizationChange } from '@/features/employee/hooks/organization-history/useOrganizationChange';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import DateField from '@/components/shared/field/DateField';
import FIleField from '@/components/shared/field/FIleField';
import SelectField from '@/components/shared/field/SelectField';
import MultiSelectField from '@/components/shared/field/MultiSelectField';
import Button from '@/components/ui/button/Button';
import { IconPlus as PlusIcon, IconHapus as TrashBinIcon } from '@/icons/components/icons';
import { formatCurrency, parseCurrency } from '@/utils/formatCurrency';

const DetailOrganizationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const mode = searchParams.get('mode') || '';
  const isAddMode = mode === 'add' || !id;

  const [nonFixAllowances, setNonFixAllowances] = useState<Array<{ id: string; amount: number }>>([{ id: '', amount: 0 }]);
  const [salaryFields, setSalaryFields] = useState({
    gaji_pokok: '',
    tunjangan_pernikahan: '',
    tunjangan_jabatan: '',
    tunjangan_lama_kerja: '',
    gaji_bersih: '',
  });

  useEffect(() => {}, []);

  const detailState = useOrganizationHistoryDetail({ id });

  const {
    createOrganizationChange,
    isSubmitting,
  } = useOrganizationChange({ autoFetch: false });

  const addState = useEditOrganizationHistoryModal({ isOpen: isAddMode, initialData: null });

  const title = useMemo(() => {
    return isAddMode ? 'Tambah Organisasi' : detailState.title;
  }, [isAddMode, detailState.title]);

  const form = isAddMode ? addState.form : detailState.form;
  const currentEmployee = isAddMode ? addState.currentEmployee : detailState.currentEmployee;
  const displayForm = isAddMode ? null : detailState.displayForm;
  const handleInput = isAddMode ? addState.handleInput : detailState.handleInput;

  const disableAll = !isAddMode;

  const currency = (val?: number) =>
    val ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val) : '';

  const diskresiOptions = useMemo(
    () => [
      { label: 'Tunjangan Profesional', value: 'tunjangan_profesional' },
      { label: 'Tunjangan Tidak Tetap', value: 'tunjangan_tidak_tetap' },
    ],
    []
  );

  const diskresiOptionsMulti = useMemo(
    () => diskresiOptions.map((o) => ({ value: o.value, text: o.label })),
    [diskresiOptions]
  );

  const getCategoryLabel = useMemo(() => {
    if (isAddMode) {
      if (!(form as any)?.employee_category_id || !addState.kategoriKaryawanOptions?.length) return null;
      const selected = addState.kategoriKaryawanOptions.find((opt: any) => opt.value === (form as any).employee_category_id);
      return selected?.label || null;
    }
    return (displayForm as any)?.employee_category_name || null;
  }, [isAddMode, form, addState.kategoriKaryawanOptions, displayForm]);

  const isStaffCategory = getCategoryLabel === 'Staff';
  const isStaffCurrentEmployee = (currentEmployee as any)?.employee_category === 'Staff';

  const addNonFixAllowance = () => {
    setNonFixAllowances((prev) => [...prev, { id: '', amount: 0 }]);
  };

  const removeNonFixAllowance = (index: number) => {
    setNonFixAllowances((prev) => prev.filter((_v, i) => i !== index));
  };

  const updateNonFixAllowance = (index: number, key: 'id' | 'amount', value: any) => {
    setNonFixAllowances((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const handleSubmit = async () => {
    if (!isAddMode) return;
    const payload = {
      employee_id: form?.employee_id || '',
      change_type_id: form?.change_type_id || '',
      efektif_date: form?.efektif_date || '',
      reason: form?.reason || '',
      company_id: form?.company_id || '',
      office_id: form?.office_id || '',
      directorate_id: form?.directorate_id || '',
      division_id: form?.division_id || '',
      department_id: form?.department_id || '',
      job_title_id: form?.job_title_id || '',
      structural_job_id: form?.structural_job_id || '',
      position_id: form?.position_id || '',
      position_level_id: form?.position_level_id || '',
      employee_category_id: form?.employee_category_id || '',
      unit_id: form?.unit_id || '',
      decree_file: form?.skFile ?? null,
      approved_by: 'di approve manual tanpa login ',
      recommended_by: 'di approve manual tanpa login ',
    };
    const ok = await createOrganizationChange(null, payload as any);
    if (ok) navigate(-1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>
      <div className='grid grid-cols-2'>
        <PayrollCard title="Informasi Karyawan" headerColor="slate" border={false}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              {isAddMode ? (
                <SelectField
                  label="NIP"
                  required
                  options={addState.employeeOptions.length > 0 ? addState.employeeOptions : [{ label: 'Memuat opsi...', value: '' }]}
                  defaultValue={form.nip || ''}
                  onChange={(v) => handleInput('nip' as any, v)}
                  onSearch={addState.handleEmployeeSearch}
                  placeholder="Pilih NIP"
                  disabled={addState.employeeOptions.length === 0}
                />
              ) : (
                <InputField label="NIP" required value={form.nip || ''} disabled placeholder="Pilih NIP" onChange={() => {}} />
              )}
            </div>
            <div>
              <InputField label="Pengguna" placeholder="Otomatis" value={currentEmployee?.full_name || form.nama || ''} disabled />
            </div>
            <div>
              <InputField label="Kategori Karyawan" placeholder="Otomatis" value={currentEmployee?.employee_category || ''} disabled />
            </div>
            <div>
              <InputField label="Perusahaan" placeholder="Otomatis" value={currentEmployee?.company_name || ''} disabled />
            </div>
            <div>
              <InputField label="Kantor" placeholder="Otomatis" value={currentEmployee?.office_name || ''} disabled />
            </div>
            <div>
              <InputField label="Direktorat" placeholder="Otomatis" value={currentEmployee?.directorate_name || ''} disabled />
            </div>
            <div>
              <InputField label="Divisi" placeholder="Otomatis" value={currentEmployee?.division_name || ''} disabled />
            </div>
            <div>
              <InputField label="Departemen" placeholder="Otomatis" value={currentEmployee?.department_name || ''} disabled />
            </div>
            <div>
              <InputField label="Unit" placeholder="Otomatis" value={currentEmployee?.unit || ''} disabled />
            </div>
            <div>
              <InputField label="Posisi" placeholder="Otomatis" value={currentEmployee?.position_name || ''} disabled />
            </div>
            <div>
              <InputField label="Jabatan Kepangkatan" placeholder="Otomatis" value={currentEmployee?.job_title_name || ''} disabled />
            </div>
            <div>
              <InputField label="Jabatan Struktural" placeholder="Otomatis" value={currentEmployee?.structural_job || ''} disabled />
            </div>
            <div>
              <InputField label="Jenjang Jabatan" placeholder="Otomatis" value={currentEmployee?.position_level || ''} disabled />
            </div>
            <div>
              <InputField label="Golongan" placeholder="Otomatis" value={currentEmployee?.grade || ''} disabled />
            </div>
            <div>
              <InputField label="Gaji Bersih" placeholder="Otomatis" value={currency(form.previous_salary)} disabled />
            </div>
            <div>
              <InputField label="Gaji  Pokok" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Tunjangan Pernikahan" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Tunjangan Jabatan" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Tunjangan Lama Kerja" placeholder="Otomatis" value="" disabled />
            </div>
            {isStaffCurrentEmployee && (
              <>
                <div className="md:col-span-2">
                  <MultiSelectField
                    label="Jenis Tunjangan DIskresi"
                    options={diskresiOptionsMulti}
                    defaultSelected={[]}
                    onChange={() => {}}
                    disabled
                  />
                </div>
                <div>
                  <InputField label="Nominal" placeholder="Otomatis" value="" disabled />
                </div>
              </>
            )}
          </div>
        </PayrollCard>

      <PayrollCard title="Detail Perubahan" headerColor="green" border={false}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            {isAddMode ? (
              <SelectField
                label="Jenis Perubahan"
                required
                options={addState.changeTypeOptions.length > 0 ? addState.changeTypeOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={form.change_type_id || ''}
                onChange={(v) => handleInput('change_type_id' as any, v)}
                placeholder="Select"
                disabled={addState.changeTypeOptions.length === 0}
              />
            ) : (
              <InputField label="Jenis Perubahan" required value={(displayForm as any)?.change_type_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <DateField
                id="effectiveDateDetail"
                label="Tanggal Efektif"
                required
                defaultDate={form.efektif_date || undefined}
                placeholder="— (masih aktif)"
                onChange={(...args) => handleInput('efektif_date' as any, args[1])}
                disabled={disableAll}
              />
            ) : (
              <InputField id="effectiveDateDetail" label="Tanggal Efektif" required value={form.efektif_date || ''} placeholder="— (masih aktif)" onChange={() => {}} disabled />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Kategori Karyawan"
                required
                options={addState.kategoriKaryawanOptions}
                defaultValue={form.employee_category_id || ''}
                onChange={(v) => handleInput('employee_category_id' as any, v)}
                placeholder="Select"
                disabled={disableAll}
              />
            ) : (
              <InputField label="Kategori Karyawan" required value={(displayForm as any)?.employee_category_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Perusahaan"
                required
                options={addState.companyOptions}
                defaultValue={form.company_id || ''}
                onChange={(v) => handleInput('company_id' as any, v)}
                onSearch={addState.handleCompanySearch}
                placeholder="Select"
                disabled={disableAll}
              />
            ) : (
              <InputField label="Perusahaan" required value={(displayForm as any)?.company_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Kantor"
                required
                options={addState.officeOptions.length > 0 ? addState.officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
                defaultValue={form.office_id || ''}
                onChange={(v) => handleInput('office_id' as any, v)}
                onSearch={addState.handleOfficeSearch}
                placeholder="Select"
                disabled={disableAll || addState.officeOptions.length === 0}
              />
            ) : (
              <InputField label="Kantor" required value={(displayForm as any)?.office_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Direktorat"
                required
                options={addState.directorateOptions}
                defaultValue={form.directorate_id || ''}
                onChange={(v) => handleInput('directorate_id' as any, v)}
                onSearch={addState.handleDirectorateSearch}
                placeholder="Select"
                disabled={disableAll}
              />
            ) : (
              <InputField label="Direktorat" required value={(displayForm as any)?.directorate_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Divisi"
                required
                options={addState.divisionOptions.length > 0 ? addState.divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
                defaultValue={form.division_id || ''}
                onChange={(v) => handleInput('division_id' as any, v)}
                onSearch={addState.handleDivisionSearch}
                placeholder="Select"
                disabled={disableAll || addState.divisionOptions.length === 0}
              />
            ) : (
              <InputField label="Divisi" required value={(displayForm as any)?.division_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Departemen"
                required
                options={addState.departmentOptions.length > 0 ? addState.departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
                defaultValue={form.department_id || ''}
                onChange={(v) => handleInput('department_id' as any, v)}
                placeholder="Select"
                disabled={disableAll || addState.departmentOptions.length === 0}
              />
            ) : (
              <InputField label="Departemen" required value={(displayForm as any)?.department_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Unit"
                options={addState.unitOptions.length > 0 ? addState.unitOptions : [{ label: 'Pilih departemen terlebih dahulu', value: '' }]}
                defaultValue={form.unit_id || ''}
                onChange={(v) => handleInput('unit_id' as any, v)}
                onSearch={addState.handleUnitSearch}
                placeholder="Select"
                disabled={disableAll || addState.unitOptions.length === 0}
              />
            ) : (
              <InputField label="Unit" value={(displayForm as any)?.unit_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Posisi"
                required
                options={addState.positionOptions}
                defaultValue={form.position_id || ''}
                onChange={(v) => handleInput('position_id' as any, v)}
                onSearch={addState.handlePositionSearch}
                placeholder="Select"
                disabled={disableAll}
              />
            ) : (
              <InputField label="Posisi" required value={(displayForm as any)?.position_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Jabatan Kepangkatan"
                required
                options={addState.jobTitleOptions}
                defaultValue={form.job_title_id || ''}
                onChange={(v) => handleInput('job_title_id' as any, v)}
                onSearch={addState.handleJobTitleSearch}
                placeholder="Select"
                disabled={disableAll}
              />
            ) : (
              <InputField label="Jabatan Kepangkatan" required value={(displayForm as any)?.job_title_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Jabatan Struktural"
                required
                options={addState.structuralJobOptions.length > 0 ? addState.structuralJobOptions : [{ label: 'Pilih jabatan kepangkatan terlebih dahulu', value: '' }]}
                defaultValue={form.structural_job_id || ''}
                onChange={(v) => handleInput('structural_job_id' as any, v)}
                placeholder="Select"
                disabled={disableAll || addState.structuralJobOptions.length === 0}
              />
            ) : (
              <InputField label="Jabatan Struktural" required value={(displayForm as any)?.structural_job_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            {isAddMode ? (
              <SelectField
                label="Jenjang Jabatan"
                required
                options={addState.positionLevelOptions}
                defaultValue={form.position_level_id || ''}
                onChange={(v) => handleInput('position_level_id' as any, v)}
                onSearch={addState.handlePositionLevelSearch}
                placeholder="Select"
                disabled={disableAll}
              />
            ) : (
              <InputField label="Jenjang Jabatan" required value={(displayForm as any)?.position_level_name || ''} disabled placeholder="Select" onChange={() => {}} />
            )}
          </div>
          <div>
            <InputField
              label="Golongan"
              required
              value={isAddMode ? addState.selectedGrade || (form as any)?.golongan || '' : (displayForm as any)?.golongan || ''}
              disabled
              placeholder="Otomatis dari Jabatan"
              onChange={() => {}}
            />
          </div>
          <div>
            <InputField label="Gaji Pokok" placeholder="Input" value={salaryFields.gaji_pokok} disabled={disableAll} onChange={(e) => setSalaryFields((p) => ({ ...p, gaji_pokok: (e as any)?.target?.value ?? (e as any) }))} />
          </div>
          <div>
            <InputField label="Tunjangan Pernikahan" placeholder="Input" value={salaryFields.tunjangan_pernikahan} disabled={disableAll} onChange={(e) => setSalaryFields((p) => ({ ...p, tunjangan_pernikahan: (e as any)?.target?.value ?? (e as any) }))} />
          </div>
          <div>
            <InputField label="Tunjangan Jabatan" placeholder="Input" value={salaryFields.tunjangan_jabatan} disabled={disableAll} onChange={(e) => setSalaryFields((p) => ({ ...p, tunjangan_jabatan: (e as any)?.target?.value ?? (e as any) }))} />
          </div>
          <div>
            <InputField label="Tunjangan Lama Kerja" placeholder="Input" value={salaryFields.tunjangan_lama_kerja} disabled={disableAll} onChange={(e) => setSalaryFields((p) => ({ ...p, tunjangan_lama_kerja: (e as any)?.target?.value ?? (e as any) }))} />
          </div>
          {isStaffCategory && (
            <div className="md:col-span-2">
              <div className="space-y-4">
                {nonFixAllowances.map((allowance, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6">
                      <SelectField
                        label="Jenis Tunjangan Diskresi"
                        options={diskresiOptions}
                        defaultValue={allowance.id}
                        onChange={(value) => updateNonFixAllowance(index, 'id', value)}
                        placeholder="Pilih Tunjangan Tidak Tetap"
                        disabled={disableAll}
                      />
                    </div>
                    <div className="md:col-span-6 flex items-end gap-2">
                      <div className="flex-1">
                        <InputField
                          label="Nominal"
                          value={formatCurrency(Number(allowance.amount) || 0)}
                          onChange={(e) => updateNonFixAllowance(index, 'amount', parseCurrency(e.target.value) || 0)}
                          placeholder="Rp 0"
                          disabled={disableAll}
                        />
                      </div>
                      <div>
                        {!disableAll && (index === nonFixAllowances.length - 1 ? (
                          <button
                            className="p-2.5 rounded-lg bg-success-500 hover:bg-success-600 text-white w-11 h-11 flex items-center justify-center"
                            onClick={addNonFixAllowance}
                            type="button"
                          >
                            <PlusIcon />
                          </button>
                        ) : (
                          <button
                            className="p-2.5 rounded-lg bg-error-500 hover:bg-error-600 text-white w-11 h-11 flex items-center justify-center"
                            onClick={() => removeNonFixAllowance(index)}
                            type="button"
                          >
                            <TrashBinIcon color="white" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="md:col-span-2">
            <InputField
              label="Gaji Bersih"
              placeholder={isAddMode ? 'Input' : 'Otomatis'}
              disabled={disableAll}
              value={isAddMode ? salaryFields.gaji_bersih : currency(form.new_salary)}
              onChange={(e) => setSalaryFields((p) => ({ ...p, gaji_bersih: (e as any)?.target?.value ?? (e as any) }))}
            />
          </div>
          {isAddMode && (
            <div className="col-span-1 md:col-span-2">
              <FIleField label="Upload Sk Perubahan" required onChange={addState.handleFileChange as any} />
            </div>
          )}
          <div className="col-span-1 md:col-span-2">
            {/* <InputField label="Sk Perubahan" placeholder="Otomatis" disabled value={form.decree_file || ''} /> */}
            {!isAddMode && (
              <InputField label="Sk Perubahan" placeholder="Otomatis" disabled value={form.decree_file || ''} onChange={() => {}} />
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <TextAreaField
              label="Alasan Perubahan"
              required
              placeholder="Masukkan alasan perubahan"
              value={form.reason || ''}
              onChange={(e) => handleInput('reason' as any, e)}
              disabled={disableAll}
              rows={4}
            />
          </div>
          {isAddMode && (
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                Batal
              </Button>
              <Button
                variant="custom"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                onClick={handleSubmit}
                disabled={!!isSubmitting}
              >
                Simpan
              </Button>
            </div>
          )}
        </div>
      </PayrollCard>
      </div>
   
    </div>
  );
};

export default DetailOrganizationHistoryPage;
