import React from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import Input from '../../../../components/form/input/InputField';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';
import { useAuthStore } from '../../../auth/stores/AuthStore';
import { usePTKPDropdown } from '../../hooks/employee-data/form/useFromStep';
import {  BPJS_STATUS_OPTIONS, BPJS_TK_STATUS_OPTIONS } from '../../utils/EmployeeMappings';
import { useStep4Data } from '../../hooks/employee-data/form/useFromStep';



export const Step04SalaryBpjs: React.FC = () => {
  const { formData, updateStep3 } = useFormulirKaryawanStore();
  const step3 = formData.step3;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { ptkpOptions, loading, fetchPTKPOptions } = usePTKPDropdown(true);
  const { bankOptions } = useStep4Data(true);

  const handleChange = (field: string, value: string) => {
    updateStep3({ [field]: value } as any);
  };

  return (
    <div className="space-y-6">
      {/* Salary Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
          Salary
        </h4>
        <div>
          {/* Bank */}
        {isAuthenticated &&  
        (<div className="grid grid-cols-1 mb-4">
            <Label>Bank</Label>
            <Select
              options={bankOptions}
              defaultValue={step3.bank}
              onChange={(value) => handleChange('bank', value)}
              placeholder="Select"
              required
            />
          </div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No. Rekening */}
          {!isAuthenticated && (
          <div>
            <Label>Bank</Label>
            <Select
              options={bankOptions}
              defaultValue={step3.bank}
              onChange={(value) => handleChange('bank', value)}
              placeholder="Select"
              required
            />
          </div>)}

          {/* No. Rekening */}
          <div>
            <Label htmlFor="noRekening">No. Rekening</Label>
            <Input
              type='number'
              id="noRekening"
              placeholder="Masukkan nomor rekening"
              value={step3.noRekening}
              onChange={(e) => handleChange('noRekening', e.target.value)}
              required
            />
          </div>

          {/* Nama Akun Bank */}
          <div>
            <Label htmlFor="namaAkunBank">Nama Akun Bank</Label>
            <Input
              id="namaAkunBank"
              placeholder="Masukkan nama akun"
              value={step3.namaAkunBank}
              onChange={(e) => handleChange('namaAkunBank', e.target.value)}
              required
            />
          </div>

          {/* NPWP */}
          <div>
            <Label htmlFor="npwp">NPWP</Label>
            <Input
              id="npwp"
              type='number'
              placeholder="Masukkan NPWP"
              value={step3.npwp}
              onChange={(e) => handleChange('npwp', e.target.value)}
              required
            />
          </div>

          {/* PTKP Status */}
          {isAuthenticated && (
            <div>
              <Label htmlFor="ptkpStatus">PTKP Status</Label>
              <Select
                options={ptkpOptions}
                defaultValue={step3.ptkpStatus as any}
                onChange={(value) => handleChange('ptkpStatus', value)}
                placeholder={loading ? "Loading..." : "Select PTKP Status"}
                required
                onSearch={(query) => fetchPTKPOptions(query)}
              />
            </div>
          )}
        </div>
      </div>

      {/* BPJS Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
          BPJS
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No. BPJS Ketenagakerjaan */}
          <div>
            <Label htmlFor="noBpjsKetenagakerjaan">No. BPJS Ketenagakerjaan</Label>
            <Input
              type='number'
              id="noBpjsKetenagakerjaan"
              placeholder="Masukkan nomor"
              value={step3.noBpjsKetenagakerjaan}
              onChange={(e) => handleChange('noBpjsKetenagakerjaan', e.target.value)}
              required
            />
          </div>

          {/* Status BPJS Ketenagakerjaan */}
          <div>
            <Label>Status BPJS Ketenagakerjaan</Label>
            <Select
              options={BPJS_TK_STATUS_OPTIONS}
              defaultValue={step3.statusBpjsKetenagakerjaan}
              onChange={(value) => handleChange('statusBpjsKetenagakerjaan', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* No. BPJS Kesehatan */}
          <div>
            <Label htmlFor="noBpjsKesehatan">No. BPJS Kesehatan</Label>
            <Input
            type='number'
              id="noBpjsKesehatan"
              placeholder="Masukkan nomor"
              value={step3.noBpjsKesehatan}
              onChange={(e) => handleChange('noBpjsKesehatan', e.target.value)}
              required
            />
          </div>

          {/* Status BPJS Kesehatan */}
          <div>
            <Label>Status BPJS Kesehatan</Label>
            <Select
              options={BPJS_STATUS_OPTIONS}
              defaultValue={step3.statusBpjsKesehatan}
              onChange={(value) => handleChange('statusBpjsKesehatan', value)}
              placeholder="Select"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step04SalaryBpjs;
