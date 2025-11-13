import React from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import Input from '../../../../components/form/input/InputField';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';

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
          <div>
            <Label>Bank</Label>
            <Select
              options={BANK_OPTIONS}
              defaultValue={step3.bank}
              onChange={(value) => handleChange('bank', value)}
              placeholder="Select"
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

          {/* No. Rekening */}
          <div>
            <Label htmlFor="noRekening">No. Rekening</Label>
            <Input
              id="noRekening"
              placeholder="Masukkan nomor rekening"
              value={step3.noRekening}
              onChange={(e) => handleChange('noRekening', e.target.value)}
              required
            />
          </div>

          {/* NPWP */}
          <div>
            <Label htmlFor="npwp">NPWP</Label>
            <Input
              id="npwp"
              placeholder="Masukkan NPWP"
              value={step3.npwp}
              onChange={(e) => handleChange('npwp', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* BPJS Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          BPJS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No. BPJS Kesehatan */}
          <div>
            <Label htmlFor="noBpjsKesehatan">No. BPJS Kesehatan</Label>
            <Input
              id="noBpjsKesehatan"
              placeholder="Masukkan nomor"
              value={step3.noBpjsKesehatan}
              onChange={(e) => handleChange('noBpjsKesehatan', e.target.value)}
              required
            />
          </div>

          {/* Status BPJS Kesehatan */}
          <div>
            <Label>Status BPJS Kesehatan (Mandiri/PBI)</Label>
            <Select
              options={BPJS_STATUS_OPTIONS}
              defaultValue={step3.statusBpjsKesehatan}
              onChange={(value) => handleChange('statusBpjsKesehatan', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* No. BPJS Ketenagakerjaan */}
          <div>
            <Label htmlFor="noBpjsKetenagakerjaan">No. BPJS Ketenagakerjaan</Label>
            <Input
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
              options={BPJS_STATUS_OPTIONS}
              defaultValue={step3.statusBpjsKetenagakerjaan}
              onChange={(value) => handleChange('statusBpjsKetenagakerjaan', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Nominal BPJS TK */}
          <div className="md:col-span-2">
            <Label htmlFor="nominalBpjsTk">Nominal BPJS TK/Nominal BPJS KS</Label>
            <Input
              id="nominalBpjsTk"
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
