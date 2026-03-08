import React from 'react';
import InputField from '../../../../components/shared/field/InputField';
import SelectField from '../../../../components/shared/field/SelectField';
import {  BPJS_STATUS_OPTIONS, BPJS_TK_STATUS_OPTIONS } from '../../utils/EmployeeMappings';
import { useStep4Data } from '../../hooks/employee-data/form/useFromStep';
import { IconPlus as PlusIcon, IconHapus as TrashBinIcon } from '@/icons/components/icons';
import { formatCurrency, parseCurrency } from '@/utils/formatCurrency';

export const Step04SalaryBpjs: React.FC = () => {
  const {
    bankOptions,
    categoriKaryawanOptions,
    bpjsHealthTypeOptions,
    step3,
    isAuthenticated,
    previewData,
    nonFixAllowanceOptions,
    nonFixAllowances,
    netSalary,
    handleChange,
    addNonFixAllowance,
    removeNonFixAllowance,
    updateNonFixAllowance,
    step3Employee
  } = useStep4Data(true);

  // Get category label based on ID
  const getCategoryLabel = () => {
    if (!step3Employee?.kategoriKaryawan || !categoriKaryawanOptions?.length) return null;
    const category = categoriKaryawanOptions.find((opt: any) => opt.value === step3Employee.kategoriKaryawan);
    return category?.label || null;
  };

  // Get salary label based on employee category
  const getSalaryLabel = () => {
    const categoryLabel = getCategoryLabel();
    if (categoryLabel === 'Non-Staff') return 'Uang Saku';
    if (categoryLabel === 'Mitra') return 'Fee';
    return 'Gaji Pokok';
  };

  // Get dynamic options for Status BPJS Kesehatan based on Tipe BPJS Kesehatan
  const getBpjsKesehatanStatusOptions = () => {
    if (step3.tipeBpjsKesehatan === '8de18fc0-137e-4b0c-bda2-56e0835e5577') { // Mandiri ID
      return [{ label: 'Tidak Aktif', value: 'Tidak Aktif' }];
    }
    return BPJS_STATUS_OPTIONS; // PBI can choose Aktif or Tidak Aktif
  };

  // Handle field changes with auto-setting logic
  const handleFieldChange = (field: string, value: any) => {
    // Auto-set Status BPJS Kesehatan when Tipe BPJS Kesehatan changes
    if (field === 'tipeBpjsKesehatan') {
      if (value === '8de18fc0-137e-4b0c-bda2-56e0835e5577') { // Mandiri ID
        handleChange('statusBpjsKesehatan', 'Tidak Aktif');
      } else if (value === 'b0383713-d651-4233-824b-1ff6b13dcd6b') { // PBI ID
        // Auto-set to Aktif when PBI is selected
        handleChange('statusBpjsKesehatan', 'Aktif');
      }
    }
    
    // Auto-set Status BPJS Ketenagakerjaan to Aktif when No. BPJS Ketenagakerjaan is filled
    if (field === 'noBpjsKetenagakerjaan' && value) {
      handleChange('statusBpjsKetenagakerjaan', 'Aktif');
    }
    
    handleChange(field, value);
  };

  return (
    <div className="space-y-6">
      {/* Salary Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
          Gaji
        </h4>
        <h6 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Informasi Penggajian</h6>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
             {/* Bank */}
        {isAuthenticated &&  
        (<div className="grid grid-cols-1  mb-4">
            <SelectField
              label="Bank"
              options={bankOptions}
              defaultValue={step3.bank}
              onChange={(value) => handleChange('bank', value)}
              placeholder="Pilih"
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
              placeholder="Pilih"
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
          {isAuthenticated && getCategoryLabel() === 'Staff' && (
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
                label={getSalaryLabel()}
                value={formatCurrency(previewData?.basicSalary || 0 )}
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
          )}

          

          
        </div>

        {/* Tunjangan Tetap */}
         {isAuthenticated && getCategoryLabel()=='Staff' && (
          <div className="mt-6">
            <h6 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Tunjangan Tetap</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tunjangan Jabatan"
                value={formatCurrency(previewData?.positionAllowance || 0)}
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
              {/* <InputField
                label="Tunjangan Transport"
                value={formatCurrency(0)} 
                readonly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              /> */}
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
              {previewData?.bpjsAllowanceDetails.map((item: any, index: number) => (
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
        {/* {isAuthenticated && (
          <div className="mt-6">
            <h6 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Potongan Tetap</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                {/* BPJS Deductions */}
                {/* {previewData?.bpjsDeductionDetails.map((item: any, index: number) => (
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
        )} */}

        {/* Tunjangan Tidak Tetap */}
        {isAuthenticated && getCategoryLabel() === 'Staff' && (
          <div className="mt-6">
            <h6 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Tunjangan Tidak Tetap</h6>
            <div className="space-y-4">
              {nonFixAllowances.map((allowance, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-6">
                    <SelectField
                      label="Jenis Tunjangan"
                      options={nonFixAllowanceOptions
                        .map((opt: any) => ({ value: opt.id, label: opt.allowance_name }))
                        .filter(option => 
                          !nonFixAllowances.some((otherAllowance, otherIndex) => 
                            otherAllowance.id === option.value && otherIndex !== index
                          )
                        )
                      }
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
                    <div className="">
                      {index === nonFixAllowances.length - 1 ? (
                        <button
                          className="p-2.5 rounded-lg bg-success-500 hover:bg-success-600 text-white w-11 h-11 flex items-center justify-center"
                          onClick={addNonFixAllowance}
                        >
                          <PlusIcon  />
                        </button>
                      ) : (
                        <button
                          className="p-2.5 rounded-lg bg-error-500 hover:bg-error-600 text-white w-11 h-11 flex items-center justify-center"
                          onClick={() => removeNonFixAllowance(index)}
                        >
                          <TrashBinIcon color='white' />
                        </button>
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
              <h6 className="text-md font-medium text-gray-700 dark:text-gray-300 mt-3  mb-2">Total Gaji Sementara</h6>
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
              onChange={(e) => handleFieldChange('noBpjsKetenagakerjaan', e.target.value)}
              
            />
          </div>

          {/* Status BPJS Ketenagakerjaan */}
          <div>
            <SelectField
              label="Status BPJS Ketenagakerjaan"
              options={BPJS_TK_STATUS_OPTIONS}
              defaultValue={step3.statusBpjsKetenagakerjaan}
              onChange={(value) => handleChange('statusBpjsKetenagakerjaan', value)}
              placeholder="Pilih"
              
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

          {/* Tipe BPJS Kesehatan */}
          <div>
            <SelectField
              label="Tipe BPJS Kesehatan (Mandiri/PBI)"
              options={bpjsHealthTypeOptions}
              defaultValue={step3.tipeBpjsKesehatan}
              onChange={(value) => handleFieldChange('tipeBpjsKesehatan', value)}
              placeholder="Pilih"
              
            />
          </div>

          {/* Status BPJS Kesehatan */}
          <div>
            <SelectField
              label="Status BPJS Kesehatan"
              options={getBpjsKesehatanStatusOptions()}
              defaultValue={step3.statusBpjsKesehatan}
              onChange={(value) => handleChange('statusBpjsKesehatan', value)}
              placeholder="Pilih"
              
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step04SalaryBpjs;

