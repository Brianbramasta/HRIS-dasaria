import React from 'react';
import { ChevronLeft } from 'react-feather';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import FIleField from '@/components/shared/field/FIleField';
import SelectField from '@/components/shared/field/SelectField';
import DateField from '@/components/shared/field/DateField';
import Button from '@/components/ui/button/Button';
import { IconPlus as PlusIcon, IconHapus as TrashBinIcon } from '@/icons/components/icons';
import { formatInputCurrency, parseCurrency } from '@/utils/formatCurrency';
import { useCreateOrganizationHistory } from '@/features/employee/hooks/organization-history/useCreateOrganizationHistory';

const CreateOrganizationHistoryPage: React.FC = () => {
  const {
    navigate,
    addState,
    detailForm,
    isSubmitting,
    nonFixAllowances,
    salaryFields,
    prevSalaryFields,
    title,
    disableAll,
    infoSalaryLabel,
    isNonStaffOrMitraCategory,
    isStaffCategory,
    salaryLabel,
    diskresiOptions,
    handleInput,
    handleNIPChange,
    handleSubmit,
    addNonFixAllowance,
    removeNonFixAllowance,
    updateNonFixAllowance,
    setSalaryFields,
  } = useCreateOrganizationHistory();

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
              <SelectField
                label="NIP"
                required
                options={addState.employeeOptions.length > 0 ? addState.employeeOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={detailForm.nip || ''}
                onChange={(v) => handleNIPChange(v)}
                onSearch={addState.handleEmployeeSearch}
                placeholder="Pilih NIP"
                disabled={addState.employeeOptions.length === 0}
              />
            </div>
            <div>
              <InputField label="Pengguna" placeholder="Otomatis" value={detailForm.nama || ''} disabled />
            </div>
            <div>
              <InputField label="Kategori Karyawan" placeholder="Otomatis" value={detailForm.prev_employee_category || ''} disabled />
            </div>
            <div>
              <InputField label="Perusahaan" placeholder="Otomatis" value={detailForm.prev_company || ''} disabled />
            </div>
            <div>
              <InputField label="Kantor" placeholder="Otomatis" value={detailForm.prev_office || ''} disabled />
            </div>
            <div>
              <InputField label="Direktorat" placeholder="Otomatis" value={detailForm.prev_directorate || ''} disabled />
            </div>
            <div>
              <InputField label="Divisi" placeholder="Otomatis" value={detailForm.prev_division || ''} disabled />
            </div>
            <div>
              <InputField label="Departemen" placeholder="Otomatis" value={detailForm.prev_department || ''} disabled />
            </div>
            <div>
              <InputField label="Unit" placeholder="Otomatis" value={detailForm.prev_unit || ''} disabled />
            </div>
            <div>
              <InputField label="Posisi" placeholder="Otomatis" value={detailForm.prev_position || ''} disabled />
            </div>
            <div>
              <InputField label="Jabatan Kepangkatan" placeholder="Otomatis" value={detailForm.prev_rank_position || ''} disabled />
            </div>
            <div>
              <InputField label="Jabatan Struktural" placeholder="Otomatis" value={detailForm.prev_structural_position || ''} disabled />
            </div>
            <div>
              <InputField label="Jenjang Jabatan" placeholder="Otomatis" value={detailForm.prev_position_level || ''} disabled />
            </div>
            <div>
              <InputField label="Golongan" placeholder="Otomatis" value={detailForm.prev_golongan || ''} disabled />
            </div>
            <div>
              <InputField label={infoSalaryLabel} placeholder="Otomatis" value={formatInputCurrency(prevSalaryFields.gaji_pokok)} disabled />
            </div>
            {!isNonStaffOrMitraCategory && (
              <>
                <div>
                  <InputField label="Tunjangan Pernikahan" placeholder="Otomatis" value={formatInputCurrency(prevSalaryFields.tunjangan_pernikahan)} disabled />
                </div>
                <div>
                  <InputField label="Tunjangan Jabatan" placeholder="Otomatis" value={formatInputCurrency(prevSalaryFields.tunjangan_jabatan)} disabled />
                </div>
                <div>
                  <InputField label="Tunjangan Lama Kerja" placeholder="Otomatis" value={formatInputCurrency(prevSalaryFields.tunjangan_lama_kerja)} disabled />
                </div>
              </>
            )}
            {isStaffCategory && (
              <>
                <div className="md:col-span-1">
                  <InputField label="Jenis Tunjangan DIskresi" placeholder="Otomatis" value={detailForm.prev_tunjangan_dekresi_id ? (diskresiOptions.find(opt => opt.value === detailForm.prev_tunjangan_dekresi_id)?.label || '') : ''} disabled />
                </div>
                <div>
                  <InputField label="Nominal" placeholder="Otomatis" value={formatInputCurrency(String(detailForm.prev_tunjangan_dekresi_amount || 0))} disabled />
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <InputField label="Gaji Bersih" placeholder="Otomatis" value={formatInputCurrency(prevSalaryFields.gaji_bersih)} disabled />
            </div>
          </div>
        </PayrollCard>

        <PayrollCard title="Detail Perubahan" headerColor="green" border={false}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <SelectField
                label="Jenis Perubahan"
                required
                options={addState.changeTypeOptions.length > 0 ? addState.changeTypeOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={detailForm.change_type_id || ''}
                onChange={(v) => handleInput('change_type_id' as any, v)}
                onSearch={addState.handleEmployeeSearch}
                placeholder="Select"
                disabled={disableAll || addState.changeTypeOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Kategori Karyawan"
                required
                options={addState.kategoriKaryawanOptions.length > 0 ? addState.kategoriKaryawanOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={detailForm.employee_category_id || ''}
                onChange={(v) => handleInput('employee_category_id' as any, v)}
                onSearch={addState.handleEmployeeCategorySearch}
                placeholder="Pilih Kategori Karyawan"
                disabled={disableAll || addState.kategoriKaryawanOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Perusahaan"
                required
                options={addState.companyOptions.length > 0 ? addState.companyOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={detailForm.company_id || ''}
                onChange={(v) => handleInput('company_id' as any, v)}
                onSearch={addState.handleCompanySearch}
                placeholder="Select"
                disabled={disableAll || addState.companyOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Kantor"
                required
                options={addState.officeOptions.length > 0 ? addState.officeOptions : [{ label: 'Pilih perusahaan terlebih dahulu', value: '' }]}
                defaultValue={detailForm.office_id || ''}
                onChange={(v) => handleInput('office_id' as any, v)}
                onSearch={addState.handleOfficeSearch}
                placeholder="Select"
                disabled={disableAll || !detailForm.company_id || addState.officeOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Direktorat"
                required
                options={addState.directorateOptions.length > 0 ? addState.directorateOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={detailForm.directorate_id || ''}
                onChange={(v) => handleInput('directorate_id' as any, v)}
                onSearch={addState.handleDirectorateSearch}
                placeholder="Select"
                disabled={disableAll || addState.directorateOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Divisi"
                required
                options={addState.divisionOptions.length > 0 ? addState.divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
                defaultValue={detailForm.division_id || ''}
                onChange={(v) => handleInput('division_id' as any, v)}
                onSearch={addState.handleDivisionSearch}
                placeholder="Select"
                disabled={disableAll || !detailForm.directorate_id || addState.divisionOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Departemen"
                required
                options={addState.departmentOptions.length > 0 ? addState.departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
                defaultValue={detailForm.department_id || ''}
                onChange={(v) => handleInput('department_id' as any, v)}
                onSearch={addState.handleDepartmentSearch}
                placeholder="Select"
                disabled={disableAll || !detailForm.division_id || addState.departmentOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Posisi"
                required
                options={addState.positionOptions.length > 0 ? addState.positionOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={detailForm.position_id || ''}
                onChange={(v) => handleInput('position_id' as any, v)}
                onSearch={addState.handlePositionSearch}
                placeholder="Select"
                disabled={disableAll || addState.positionOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Jabatan Kepangkatan"
                required
                options={addState.jobTitleOptions.length > 0 ? addState.jobTitleOptions : [{ label: 'Memuat opsi...', value: '' }]}
                defaultValue={detailForm.job_title_id || ''}
                onChange={(v) => handleInput('job_title_id' as any, v)}
                onSearch={addState.handleJobTitleSearch}
                placeholder="Select"
                disabled={disableAll || addState.jobTitleOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Jabatan Struktural"
                options={addState.structuralJobOptions.length > 0 ? addState.structuralJobOptions : [{ label: 'Pilih jabatan terlebih dahulu', value: '' }]}
                defaultValue={detailForm.structural_job_id || ''}
                onChange={(v) => handleInput('structural_job_id' as any, v)}
                onSearch={addState.handleStructuralJobSearch}
                placeholder="Select"
                disabled={disableAll || !detailForm.job_title_id || addState.structuralJobOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Unit"
                options={addState.unitOptions.length > 0 ? addState.unitOptions : [{ label: 'Pilih departemen terlebih dahulu', value: '' }]}
                defaultValue={detailForm.unit_id || ''}
                onChange={(v) => handleInput('unit_id' as any, v)}
                onSearch={addState.handleUnitSearch}
                placeholder="Select"
                disabled={disableAll || !detailForm.department_id || addState.unitOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Jenjang Jabatan"
                required
                options={addState.positionLevelOptions.length > 0 ? addState.positionLevelOptions : [{ label: 'Pilih jabatan terlebih dahulu', value: '' }]}
                defaultValue={detailForm.position_level_id || ''}
                onChange={(v) => handleInput('position_level_id' as any, v)}
                onSearch={addState.handlePositionLevelSearch}
                placeholder="Select"
                disabled={disableAll || addState.positionLevelOptions.length === 0}
              />
            </div>
            <div>
              <InputField
                label="Golongan"
                placeholder="Otomatis"
                value={detailForm.golongan || ''}
                disabled
              />
            </div>
            <div>
              <DateField
                label="Efektif Date"
                required
                defaultDate={detailForm.efektif_date || ''}
                onChange={(_, dateStr) => handleInput('efektif_date' as any, dateStr)}
                disabled={disableAll}
              />
            </div>
            {!isNonStaffOrMitraCategory && (
              <>
                <div>
                  <InputField
                    label={salaryLabel}
                    type="text"
                    value={formatInputCurrency(String(salaryFields.gaji_pokok))}
                    disabled
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '');
                      setSalaryFields((p) => ({ ...p, gaji_pokok: cleaned }));
                    }}
                    containerClassName="space-y-2"
                  />
                </div>
                <div>
                  <InputField
                    label="Tunjangan Jabatan"
                    type="text"
                    value={formatInputCurrency(String(salaryFields.tunjangan_jabatan))}
                    disabled
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '');
                      setSalaryFields((p) => ({ ...p, tunjangan_jabatan: cleaned }));
                    }}
                    containerClassName="space-y-2"
                  />
                </div>
                <div>
                  <InputField
                    label="Tunjangan Lama Kerja"
                    type="text"
                    value={formatInputCurrency(String(salaryFields.tunjangan_lama_kerja))}
                    disabled
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '');
                      setSalaryFields((p) => ({ ...p, tunjangan_lama_kerja: cleaned }));
                    }}
                    containerClassName="space-y-2"
                  />
                </div>
              </>
            )}
            {!isNonStaffOrMitraCategory && (
              <div>
                <InputField
                  label="Tunjangan Pernikahan"
                  type="text"
                  value={formatInputCurrency(String(salaryFields.tunjangan_pernikahan || 0))}
                  disabled
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9]/g, '');
                    setSalaryFields((p) => ({ ...p, tunjangan_pernikahan: cleaned }));
                  }}
                  containerClassName="space-y-2"
                />
              </div>
            )}
            {isStaffCategory && (
              <div className="md:col-span-2">
                <div className="space-y-4">
                  {nonFixAllowances.map((allowance, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-6">
                        <SelectField
                          label="Jenis Tunjangan Diskresi"
                          options={diskresiOptions
                            .filter(
                              (option) =>
                                !nonFixAllowances.some(
                                  (otherAllowance, otherIndex) =>
                                    otherAllowance.id === option.value &&
                                    otherIndex !== index,
                                ),
                            )}
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
                            value={formatInputCurrency(String(allowance.amount))}
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
                type="text"
                value={formatInputCurrency(String(salaryFields.gaji_bersih || 0))}
                disabled
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  setSalaryFields((p) => ({ ...p, gaji_bersih: cleaned }));
                }}
                containerClassName="space-y-2"
              />
            </div>
            <div>
              <FIleField label="Upload Sk Perubahan" required onChange={addState.handleFileChange as any} />
            </div>
            <div>
              <FIleField label="Upload Adendum" onChange={addState.handleAdendumFileChange as any} />
            </div>
            <div className="col-span-1 md:col-span-2">
              <TextAreaField
                label="Alasan Perubahan"
                required
                placeholder="Masukkan alasan perubahan"
                value={detailForm.reason || ''}
                onChange={(e) => handleInput('reason' as any, e)}
                disabled={disableAll}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3">
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
          </div>
        </PayrollCard>
      </div>
    </div>
  );
};

export default CreateOrganizationHistoryPage;
