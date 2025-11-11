import React from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import Input from '../../../../components/ui/input/Input';
import Select from '../../../../components/ui/select/Select';

const BANK_OPTIONS = [
  { label: 'Bank Mandiri', value: 'mandiri' },
  { label: 'Bank BCA', value: 'bca' },
  { label: 'Bank BNI', value: 'bni' },
  { label: 'Bank BTN', value: 'btn' },
  { label: 'Bank CIMB Niaga', value: 'cimb' },
  { label: 'Bank Danamon', value: 'danamon' },
  { label: 'Lainnya', value: 'lainnya' },
];

const BPJS_STATUS_OPTIONS = [
  { label: 'Mandiri', value: 'mandiri' },
  { label: 'PBI', value: 'pbi' },
];

export const Step3SalaryBpjs: React.FC = () => {
  const { formData, updateStep3 } = useFormulirKaryawanStore();
  const step3 = formData.step3;

  const handleChange = (field: string, value: string) => {
    updateStep3({ [field]: value } as any);
  };

  return (
    <div className="space-y-6">
      {/* Salary Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Salary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank */}
          <Select
            label="Bank"
            options={BANK_OPTIONS}
            value={step3.bank}
            onChange={(e) => handleChange('bank', e.target.value)}
            placeholder="Select"
            required
          />

          {/* Nama Akun Bank */}
          <Input
            label="Nama Akun Bank"
            placeholder="Masukkan nama akun"
            value={step3.namaAkunBank}
            onChange={(e) => handleChange('namaAkunBank', e.target.value)}
            required
          />

          {/* No. Rekening */}
          <Input
            label="No. Rekening"
            placeholder="Masukkan nomor rekening"
            value={step3.noRekening}
            onChange={(e) => handleChange('noRekening', e.target.value)}
            required
          />

          {/* NPWP */}
          <Input
            label="NPWP"
            placeholder="Masukkan NPWP"
            value={step3.npwp}
            onChange={(e) => handleChange('npwp', e.target.value)}
            required
          />
        </div>
      </div>

      {/* BPJS Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          BPJS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No. BPJS Kesehatan */}
          <Input
            label="No. BPJS Kesehatan"
            placeholder="Masukkan nomor"
            value={step3.noBpjsKesehatan}
            onChange={(e) => handleChange('noBpjsKesehatan', e.target.value)}
            required
          />

          {/* Status BPJS Kesehatan */}
          <Select
            label="Status BPJS Kesehatan (Mandiri/PBI)"
            options={BPJS_STATUS_OPTIONS}
            value={step3.statusBpjsKesehatan}
            onChange={(e) => handleChange('statusBpjsKesehatan', e.target.value)}
            placeholder="Select"
            required
          />

          {/* No. BPJS Ketenagakerjaan */}
          <Input
            label="No. BPJS Ketenagakerjaan"
            placeholder="Masukkan nomor"
            value={step3.noBpjsKetenagakerjaan}
            onChange={(e) => handleChange('noBpjsKetenagakerjaan', e.target.value)}
            required
          />

          {/* Status BPJS Ketenagakerjaan */}
          <Select
            label="Status BPJS Ketenagakerjaan"
            options={BPJS_STATUS_OPTIONS}
            value={step3.statusBpjsKetenagakerjaan}
            onChange={(e) => handleChange('statusBpjsKetenagakerjaan', e.target.value)}
            placeholder="Select"
            required
          />

          {/* Nominal BPJS TK */}
          <div className="md:col-span-2">
            <Input
              label="Nominal BPJS TK/Nominal BPJS KS"
              placeholder="Masukkan nominal"
              value={step3.nominalBpjsTk}
              onChange={(e) => handleChange('nominalBpjsTk', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3SalaryBpjs;
