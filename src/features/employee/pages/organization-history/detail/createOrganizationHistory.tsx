import React from 'react';
import { ChevronLeft } from 'react-feather';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import { useApiOrganizationChange } from '@/features/employee/hooks/api/useApiOrganizationChange';
import { useEditOrganizationHistoryModal } from '@/features/employee/hooks/modals/organization-history/useEditOrganizationHistoryModal';
import { useApiPayrollPreview } from '@/features/employee/hooks/api/useApiPayrollPreview';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import DateField from '@/components/shared/field/DateField';
import FIleField from '@/components/shared/field/FIleField';
import SelectField from '@/components/shared/field/SelectField';
import Button from '@/components/ui/button/Button';
import { IconPlus as PlusIcon, IconHapus as TrashBinIcon } from '@/icons/components/icons';
import { formatCurrency, parseCurrency, formatInputCurrency } from '@/utils/formatCurrency';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { payrollPreviewService } from '@/features/employee/services/PayrollPreviewService';

const CreateOrganizationHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // API Hook
  const {
    storeOrganizationChange,
  } = useApiOrganizationChange();

  // Modal state for add mode
  const addState = useEditOrganizationHistoryModal({ isOpen: true, initialData: null });

  // Local state
  const [detailForm, setDetailForm] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nonFixAllowances, setNonFixAllowances] = useState<Array<{ id: string; amount: number }>>([{ id: '', amount: 0 }]);
  const [salaryFields, setSalaryFields] = useState({
    gaji_pokok: '',
    tunjangan_pernikahan: '',
    tunjangan_jabatan: '',
    tunjangan_lama_kerja: '',
    gaji_bersih: '',
  });

  // API Hooks
  const { nonFixAllowanceOptions, fetchNonFixAllowanceDropdown } = useApiPayrollPreview();

  // Computed values
  const title = 'Tambah Perubahan Organisasi';
  const disableAll = false;
  const currency = formatCurrency;
  const infoSalaryLabel = 'Gaji Pokok';

  // Category checks
  const isNonStaffOrMitraCategory = useMemo(() => {
    if (!detailForm.employee_category_id) return false;
    const categoryOption = addState.kategoriKaryawanOptions.find(
      (option) => String(option.value) === String(detailForm.employee_category_id),
    );
    const categoryName = categoryOption?.label?.toLowerCase();
    return (
      categoryName?.includes('mitra') ||
      categoryName?.includes('non staff') ||
      categoryName === 'non-staff'
    );
  }, [detailForm.employee_category_id, addState.kategoriKaryawanOptions]);

  const isStaffCategory = useMemo(() => {
    if (!detailForm.employee_category_id) return false;
    const categoryOption = addState.kategoriKaryawanOptions.find(
      (option) => String(option.value) === String(detailForm.employee_category_id),
    );
    const categoryName = categoryOption?.label?.toLowerCase();
    return categoryName?.includes('staff') || categoryName === 'staff';
  }, [detailForm.employee_category_id, addState.kategoriKaryawanOptions]);

  // Dynamic salary label logic
  const salaryLabel = useMemo(() => {
    const categoryOption = addState.kategoriKaryawanOptions.find(
      (option) => option.value === detailForm.employee_category_id,
    );
    const categoryName = categoryOption?.label;
    let label = 'Gaji Pokok';
    if (
      categoryName?.toLowerCase() === 'non-staff' ||
      categoryName?.toLowerCase().includes('non staff')
    )
      label = 'Uang Saku';
    if (
      categoryName?.toLowerCase() === 'mitra' ||
      categoryName?.toLowerCase().includes('mitra')
    )
      label = 'Fee';
    return label;
  }, [detailForm.employee_category_id, addState.kategoriKaryawanOptions]);

  // Mock options (should be fetched from API)
  const diskresiOptions = nonFixAllowanceOptions.map((opt: any) => ({
    label: opt.allowance_name,
    value: opt.id,
  }));

  // Fetch non-fix allowance dropdown when component renders
  useEffect(() => {
    fetchNonFixAllowanceDropdown();
  }, []);

  // Fetch non-fix allowance when staff category is selected
  useEffect(() => {
    if (isStaffCategory) {
      fetchNonFixAllowanceDropdown();
    }
  }, [isStaffCategory, fetchNonFixAllowanceDropdown]);

  // Payroll preview effect
  useEffect(() => {
    const fetchPayrollPreview = async () => {
      if (
        !detailForm.job_title_id ||
        !detailForm.position_level_id ||
        !detailForm.employee_category_id
      )
        return;

      try {
        const params = {
          job_title_id: detailForm.job_title_id,
          Position_level_id: detailForm.position_level_id,
          employee_categories_id: detailForm.employee_category_id || '',
          category: detailForm.marital_status || 'single', // default to single
          dependents: Number(detailForm.dependents) || 0,
        };

        const res = await payrollPreviewService.getPreviewPayroll(params);
        const pp = res.data;

        setSalaryFields((prev) => ({
          ...prev,
          gaji_pokok: pp.basic_salary || 0,
          tunjangan_jabatan: pp.position_allowance || 0,
          tunjangan_pernikahan: pp.marital_allowance || 0,
          tunjangan_lama_kerja: pp.length_of_service_allowance || 0,
        }));
      } catch (err) {
        console.error('Failed to fetch payroll preview', err);
      }
    };

    fetchPayrollPreview();
  }, [
    detailForm.job_title_id,
    detailForm.position_level_id,
    detailForm.employee_category_id,
    detailForm.marital_status,
    detailForm.dependents,
  ]);

  // Calculate Gaji Bersih when salary components change
  useEffect(() => {
    const totalTunjanganDiskresi = nonFixAllowances
      .filter(item => item.id && item.amount > 0)
      .reduce((total, item) => total + (item.amount || 0), 0);

    const gajiBersih =
      Number(salaryFields.gaji_pokok || 0) +
      Number(salaryFields.tunjangan_lama_kerja || 0) +
      Number(salaryFields.tunjangan_pernikahan || 0) +
      Number(salaryFields.tunjangan_jabatan || 0) +
      totalTunjanganDiskresi;

    setSalaryFields((prev) => ({ ...prev, gaji_bersih: String(gajiBersih) }));
  }, [
    salaryFields.gaji_pokok,
    salaryFields.tunjangan_lama_kerja,
    salaryFields.tunjangan_pernikahan,
    salaryFields.tunjangan_jabatan,
    nonFixAllowances,
  ]);

  // Event handlers
  const handleInput = useCallback((field: string, value: any) => {
    setDetailForm((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        employee_id: detailForm.employee_id,
        org_change_type: 'hr', // or 'recomendation'
        change_type_id: detailForm.change_type_id,
        change_type_name: detailForm.change_type_name || '',
        effective_date: detailForm.efektif_date,
        employee_category_id: detailForm.employee_category_id,
        company_id: detailForm.company_id,
        position_level_id: detailForm.position_level_id,
        office_id: detailForm.office_id,
        directorate_id: detailForm.directorate_id,
        division_id: detailForm.division_id,
        department_id: detailForm.department_id,
        job_title_id: detailForm.job_title_id,
        structural_job_id: detailForm.structural_job_id,
        position_id: detailForm.position_id,
        unit_id: detailForm.unit_id,
        non_fix_allowance: nonFixAllowances.filter(item => item.id && item.amount > 0).map(item => ({
          id: item.id,
          non_fix_allowance_id: item.id,
          allowance_name: '',
          amount: item.amount
        })),
        gaji_pokok: Number(salaryFields.gaji_pokok) || 0,
        tunjangan_pernikahan: Number(salaryFields.tunjangan_pernikahan) || 0,
        tunjangan_jabatan: Number(salaryFields.tunjangan_jabatan) || 0,
        tunjangan_lama_kerja: Number(salaryFields.tunjangan_lama_kerja) || 0,
        gaji_bersih: Number(salaryFields.gaji_bersih) || 0,
        reason: detailForm.reason,
        recommended_by: undefined,
        created_by: undefined,
      };

      const success = await storeOrganizationChange(payload);
      if (success) {
        navigate(-1);
      }
    } catch (error) {
      console.error('Error creating organization change:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [detailForm, nonFixAllowances, storeOrganizationChange, navigate, salaryFields]);

  const addNonFixAllowance = useCallback(() => {
    setNonFixAllowances(prev => [...prev, { id: '', amount: 0 }]);
  }, []);

  const removeNonFixAllowance = useCallback((index: number) => {
    setNonFixAllowances(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateNonFixAllowance = useCallback((index: number, field: string, value: any) => {
    setNonFixAllowances(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

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
                onChange={(v) => handleInput('nip' as any, v)}
                onSearch={addState.handleEmployeeSearch}
                placeholder="Pilih NIP"
                disabled={addState.employeeOptions.length === 0}
              />
            </div>
            <div>
              <InputField label="Pengguna" placeholder="Otomatis" value={detailForm.nama || ''} disabled />
            </div>
            <div>
              <InputField label="Kategori Karyawan" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Perusahaan" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Kantor" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Direktorat" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Divisi" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Departemen" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Unit" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Posisi" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Jabatan Kepangkatan" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Jabatan Struktural" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Jenjang Jabatan" placeholder="Otomatis" value="" disabled />
            </div>
            <div>
              <InputField label="Golongan" placeholder="Otomatis" value="" disabled />
            </div>

            <div>
              <InputField label={infoSalaryLabel} placeholder="Otomatis" value="" disabled />
            </div>
            {!isNonStaffOrMitraCategory && (
              <>
                <div>
                  <InputField label="Tunjangan Pernikahan" placeholder="Otomatis" value="" disabled />
                </div>
                <div>
                  <InputField label="Tunjangan Jabatan" placeholder="Otomatis" value="" disabled />
                </div>
                <div>
                  <InputField label="Tunjangan Lama Kerja" placeholder="Otomatis" value="" disabled />
                </div>
              </>
            )}
            {isStaffCategory && (
              <>
                <div className="md:col-span-1">
                  <InputField label="Jenis Tunjangan DIskresi" placeholder="Otomatis" value="" disabled />
                </div>
                <div>
                  <InputField label="Nominal" placeholder="Otomatis" value="" disabled />
                </div>
              </>
            )}
            <div className="md:col-span-2">
              <InputField label="Gaji Bersih" placeholder="Otomatis" value={currency(0)} disabled />
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
                placeholder="Select"
                disabled={addState.changeTypeOptions.length === 0}
              />
            </div>
            <div>
              <DateField
                id="effectiveDateDetail"
                label="Tanggal Efektif"
                required
                defaultDate={detailForm.efektif_date || undefined}
                placeholder="— (masih aktif)"
                onChange={(...args) => handleInput('efektif_date' as any, args[1])}
                disabled={disableAll}
              />
            </div>
            <div>
              <SelectField
                label="Kategori Karyawan"
                required
                options={addState.kategoriKaryawanOptions}
                defaultValue={detailForm.employee_category_id || ''}
                onChange={(v) => {
                  handleInput('employee_category_id', v);
                }}
                placeholder="Select"
                disabled={disableAll}
              />
            </div>
            <div>
              <SelectField
                label="Perusahaan"
                required
                options={addState.companyOptions}
                defaultValue={detailForm.company_id || ''}
                onChange={(v) => handleInput('company_id' as any, v)}
                onSearch={addState.handleCompanySearch}
                placeholder="Select"
                disabled={disableAll}
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
                disabled={disableAll || addState.officeOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Direktorat"
                required
                options={addState.directorateOptions}
                defaultValue={detailForm.directorate_id || ''}
                onChange={(v) => handleInput('directorate_id' as any, v)}
                onSearch={addState.handleDirectorateSearch}
                placeholder="Select"
                disabled={disableAll}
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
                disabled={disableAll || addState.divisionOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Departemen"
                required
                options={addState.departmentOptions.length > 0 ? addState.departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
                defaultValue={detailForm.department_id || ''}
                onChange={(v) => handleInput('department_id' as any, v)}
                placeholder="Select"
                disabled={disableAll || addState.departmentOptions.length === 0}
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
                disabled={disableAll || addState.unitOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Posisi"
                required
                options={addState.positionOptions}
                defaultValue={detailForm.position_id || ''}
                onChange={(v) => handleInput('position_id' as any, v)}
                onSearch={addState.handlePositionSearch}
                placeholder="Select"
                disabled={disableAll}
              />
            </div>
            <div>
              <SelectField
                label="Jabatan Kepangkatan"
                required
                options={addState.jobTitleOptions}
                defaultValue={detailForm.job_title_id || ''}
                onChange={(v) => handleInput('job_title_id' as any, v)}
                onSearch={addState.handleJobTitleSearch}
                placeholder="Select"
                disabled={disableAll}
              />
            </div>
            <div>
              <SelectField
                label="Jabatan Struktural"
                required
                options={addState.structuralJobOptions.length > 0 ? addState.structuralJobOptions : [{ label: 'Pilih jabatan kepangkatan terlebih dahulu', value: '' }]}
                defaultValue={detailForm.structural_job_id || ''}
                onChange={(v) => handleInput('structural_job_id' as any, v)}
                placeholder="Select"
                disabled={disableAll || addState.structuralJobOptions.length === 0}
              />
            </div>
            <div>
              <SelectField
                label="Jenjang Jabatan"
                required
                options={addState.positionLevelOptions}
                defaultValue={detailForm.position_level_id || ''}
                onChange={(v) => handleInput('position_level_id' as any, v)}
                onSearch={addState.handlePositionLevelSearch}
                placeholder="Select"
                disabled={disableAll}
              />
            </div>
            <div>
              <InputField
                label="Golongan"
                required
                value={addState.selectedGrade || detailForm?.golongan || ''}
                disabled
                placeholder="Otomatis dari Jabatan"
                onChange={() => {}}
              />
            </div>
            <div>
              <InputField
                label={salaryLabel}
                type="text"
                placeholder="Input"
                value={formatInputCurrency(String(salaryFields.gaji_pokok))}
                disabled={disableAll}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  setSalaryFields((p) => ({ ...p, gaji_pokok: cleaned }));
                }}
              />
            </div>
            {!isNonStaffOrMitraCategory && (
              <>
                <div>
                  <InputField
                    label="Tunjangan Pernikahan"
                    type="text"
                    placeholder="Input"
                    value={formatInputCurrency(String(salaryFields.tunjangan_pernikahan))}
                    disabled={disableAll}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '');
                      setSalaryFields((p) => ({ ...p, tunjangan_pernikahan: cleaned }));
                    }}
                  />
                </div>
                <div>
                  <InputField
                    label="Tunjangan Jabatan"
                    type="text"
                    placeholder="Input"
                    value={formatInputCurrency(String(salaryFields.tunjangan_jabatan))}
                    disabled={disableAll}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '');
                      setSalaryFields((p) => ({ ...p, tunjangan_jabatan: cleaned }));
                    }}
                  />
                </div>
                <div>
                  <InputField
                    label="Tunjangan Lama Kerja"
                    type="text"
                    placeholder="Input"
                    value={formatInputCurrency(String(salaryFields.tunjangan_lama_kerja))}
                    disabled={disableAll}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '');
                      setSalaryFields((p) => ({ ...p, tunjangan_lama_kerja: cleaned }));
                    }}
                  />
                </div>
              </>
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
                placeholder="Input"
                disabled={disableAll}
                value={formatInputCurrency(String(salaryFields.gaji_bersih))}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  setSalaryFields((p) => ({ ...p, gaji_bersih: cleaned }));
                }}
              />
            </div>
            <div className="col-span-1">
              <FIleField label="Upload Sk Perubahan" required onChange={addState.handleFileChange as any} />
            </div>
            <div className="col-span-1">
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
          </div>
        </PayrollCard>
      </div>
    </div>
  );
};

export default CreateOrganizationHistoryPage;