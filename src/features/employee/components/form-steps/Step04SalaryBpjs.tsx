import React, { useEffect, useState, useMemo } from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import InputField from '../../../../components/shared/field/InputField';
import SelectField from '../../../../components/shared/field/SelectField';
import { useAuthStore } from '../../../auth/stores/AuthStore';
import {  BPJS_STATUS_OPTIONS, BPJS_TK_STATUS_OPTIONS } from '../../utils/EmployeeMappings';
import { useStep4Data } from '../../hooks/employee-data/form/useFromStep';
import { useApiPayrollPreview } from '../../hooks/api/useApiPayrollPreview';
import { NonFixAllowancePayload, PreviewPayrollQueryParams } from '../../types/dto/PayrollPreviewType';
import Button from '@/components/ui/button/Button';
import { PlusIcon, TrashBinIcon } from '@/icons';
import { formatCurrency, parseCurrency } from '@/utils/formatCurrency';

export const Step04SalaryBpjs: React.FC = () => {
  const { formData, updateStep3 } = useFormulirKaryawanStore();
  const step3 = formData.step3;
  const step1 = formData.step1;
  const step3Employee = formData.step3Employee;

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { bankOptions } = useStep4Data(true);

  // API Hooks
  const {
    fetchPreviewPayroll,
    fetchNonFixAllowanceDropdown,
    previewData,
    nonFixAllowanceOptions,
  } = useApiPayrollPreview();
  // State for Non-Fixed Allowances
  const [nonFixAllowances, setNonFixAllowances] = useState<NonFixAllowancePayload[]>([{ id: '', amount: 0 }]);

  // Fetch Non-Fix Allowance Dropdown
  useEffect(() => {
    if (isAuthenticated) {
      fetchNonFixAllowanceDropdown();
    }
  }, [fetchNonFixAllowanceDropdown, isAuthenticated]);

  // Fetch Payroll Preview
  useEffect(() => {
    const { statusMenikah, jumlahTanggungan } = step1;
    const { jenjangJabatan, jabatan, kategoriKaryawan } = step3Employee;

    if (isAuthenticated && jenjangJabatan && jabatan && statusMenikah && jumlahTanggungan && kategoriKaryawan) {
      const params: PreviewPayrollQueryParams = {
        Position_level_id: jenjangJabatan,
        category: statusMenikah,
        dependents: Number(jumlahTanggungan),
        job_title_id: jabatan,
        employee_categories_id: kategoriKaryawan,
      };
      fetchPreviewPayroll(params);
    }
  }, [
    step1.statusMenikah,
    step1.jumlahTanggungan,
    step3Employee.jenjangJabatan,
    step3Employee.jabatan,
    step3Employee.kategoriKaryawan,
    fetchPreviewPayroll,
    isAuthenticated
  ]);

  // Calculate Net Salary Manually
  const netSalary = useMemo(() => {
    const base = previewData?.salaryAfterDeduction ?? 0;
    const additional = nonFixAllowances.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    return base + additional;
  }, [previewData?.salaryAfterDeduction, nonFixAllowances]);

  const handleChange = (field: string, value: string) => {
    updateStep3({ [field]: value } as any);
  };

  // Handlers for Non-Fix Allowances
  const addNonFixAllowance = () => {
    setNonFixAllowances([...nonFixAllowances, { id: '', amount: 0 }]);
  };

  const removeNonFixAllowance = (index: number) => {
    const newAllowances = [...nonFixAllowances];
    newAllowances.splice(index, 1);
    setNonFixAllowances(newAllowances);
  };

  const updateNonFixAllowance = (index: number, field: keyof NonFixAllowancePayload, value: any) => {
    const newAllowances = [...nonFixAllowances];
    newAllowances[index] = { ...newAllowances[index], [field]: value };
    setNonFixAllowances(newAllowances);
  };

  return (
    <div className="space-y-6">
      {/* Salary Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
          Salary
        </h4>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Bank */}
        {isAuthenticated &&  
        (<div className="grid grid-cols-1  mb-4">
            <SelectField
              label="Bank"
              options={bankOptions}
              defaultValue={step3.bank}
              onChange={(value) => handleChange('bank', value)}
              placeholder="Select"
              required
            />
          </div>)}
          {/* No. Rekening */}
          {!isAuthenticated && (
          <div>
            <SelectField
              label="Bank"
              options={bankOptions}
              defaultValue={step3.bank}
              onChange={(value) => handleChange('bank', value)}
              placeholder="Select"
              required
            />
          </div>)}

          {/* No. Rekening */}
          <div>
            <InputField
              type="number"
              id="noRekening"
              label="No. Rekening"
              placeholder="Masukkan nomor rekening"
              value={step3.noRekening}
              onChange={(e) => handleChange('noRekening', e.target.value)}
              required
            />
          </div>

          {/* Nama Akun Bank */}
          <div>
            <InputField
              id="namaAkunBank"
              label="Nama Akun Bank"
              placeholder="Masukkan nama akun"
              value={step3.namaAkunBank}
              onChange={(e) => handleChange('namaAkunBank', e.target.value)}
              required
            />
          </div>

          {/* NPWP */}
          <div>
            <InputField
              id="npwp"
              label="NPWP"
              type="number"
              placeholder="Masukkan NPWP"
              value={step3.npwp}
              onChange={(e) => handleChange('npwp', e.target.value)}
            />
          </div>

          {/* PTKP Status */}
          {isAuthenticated && (
            <div>
              <InputField
                label="PTKP Status"
                value={previewData?.ptkpStatus || '-'}
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
          )}

            {/* Gaji Pokok */}
          {isAuthenticated && (
            <div >
              <InputField
                label="Gaji Pokok"
                value={formatCurrency(previewData?.basicSalary || 0)}
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
          )}

          

          
        </div>

        {/* Tunjangan Tetap */}
        {isAuthenticated && (
          <div className="mt-6">
            <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Tunjangan Tetap</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tunjangan Jabatan"
                value={formatCurrency(previewData?.positionAllowance || 0)}
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
              <InputField
                label="Tunjangan Transport"
                value={formatCurrency(0)} 
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
                <InputField
                label="Tunjangan Lama Kerja"
                value={formatCurrency(previewData?.lengthOfServiceAllowance || 0)}
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
                <InputField
                label="Tunjangan Pernikahan"
                value={formatCurrency(previewData?.maritalAllowance || 0)}
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
              {/* BPJS Allowances */}
              {previewData?.bpjsAllowanceDetails.map((item, index) => (
                <InputField
                  key={index}
                  label={`Tunjangan ${item.item}`}
                  value={formatCurrency(item.value || 0)}
                  readonly
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        )}

        {/* Potongan Tetap */}
        {isAuthenticated && (
          <div className="mt-6">
            <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Potongan Tetap</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BPJS Deductions */}
                {previewData?.bpjsDeductionDetails.map((item, index) => (
                <InputField
                  key={index}
                  label={`Potongan ${item.item}`}
                  value={formatCurrency(item.value || 0)}
                  readonly
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tunjangan Tidak Tetap */}
        {isAuthenticated && (
          <div className="mt-6">
            <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Tunjangan Tidak Tetap</h5>
            <div className="space-y-4">
              {nonFixAllowances.map((allowance, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-6">
                    <SelectField
                      label="Jenis Tunjangan"
                      options={nonFixAllowanceOptions.map(opt => ({ value: opt.id, label: opt.allowance_name }))}
                      defaultValue={allowance.id}
                      onChange={(value) => updateNonFixAllowance(index, 'id', value)}
                      placeholder="Pilih Tunjangan Tidak Tetap"
                    />
                  </div>
                  <div className="md:col-span-6 flex items-end gap-2">
                    <div className="flex-1">
                      <InputField
                        label="Nominal"
                        value={formatCurrency(Number(allowance.amount) || 0)}
                        onChange={(e) => updateNonFixAllowance(index, 'amount', parseCurrency(e.target.value) || 0)}
                        placeholder="Rp 0"
                      />
                    </div>
                    <div className="pb-1">
                      {index === nonFixAllowances.length - 1 ? (
                        <Button
                          variant="custom"
                          className="p-2.5 rounded-lg bg-success-500 hover:bg-success-600 text-white w-11 h-11 flex items-center justify-center"
                          onClick={addNonFixAllowance}
                        >
                          <PlusIcon className="w-5 h-5" />
                        </Button>
                      ) : (
                        <Button
                          variant="custom"
                          className="p-2.5 rounded-lg bg-error-500 hover:bg-error-600 text-white w-11 h-11 flex items-center justify-center"
                          onClick={() => removeNonFixAllowance(index)}
                        >
                          <TrashBinIcon className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          
          </div>
        )}
        {/* Gaji Bersih */}
          {isAuthenticated && (
            <div>
              <InputField
                label="Gaji Bersih"
                value={formatCurrency(netSalary)}
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
          )}

      </div>

      {/* BPJS Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
          BPJS
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No. BPJS Ketenagakerjaan */}
          <div>
            <InputField
              type="number"
              id="noBpjsKetenagakerjaan"
              label="No. BPJS Ketenagakerjaan"
              placeholder="Masukkan nomor"
              value={step3.noBpjsKetenagakerjaan}
              onChange={(e) => handleChange('noBpjsKetenagakerjaan', e.target.value)}
              
            />
          </div>

          {/* Status BPJS Ketenagakerjaan */}
          <div>
            <SelectField
              label="Status BPJS Ketenagakerjaan"
              options={BPJS_TK_STATUS_OPTIONS}
              defaultValue={step3.statusBpjsKetenagakerjaan}
              onChange={(value) => handleChange('statusBpjsKetenagakerjaan', value)}
              placeholder="Select"
              
            />
          </div>

          {/* No. BPJS Kesehatan */}
          <div>
            <InputField
              type="number"
              id="noBpjsKesehatan"
              label="No. BPJS Kesehatan"
              placeholder="Masukkan nomor"
              value={step3.noBpjsKesehatan}
              onChange={(e) => handleChange('noBpjsKesehatan', e.target.value)}
              
            />
          </div>

          {/* Status BPJS Kesehatan */}
          <div>
            <SelectField
              label="Status BPJS Kesehatan"
              options={BPJS_STATUS_OPTIONS}
              defaultValue={step3.statusBpjsKesehatan}
              onChange={(value) => handleChange('statusBpjsKesehatan', value)}
              placeholder="Select"
              
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step04SalaryBpjs;

