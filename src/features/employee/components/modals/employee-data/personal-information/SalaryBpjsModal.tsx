import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

export type SalaryBpjsForm = {
  gaji?: string;
  noRekening?: string;
  npwp?: string;
  bank?: string;
  namaAkunBank?: string;
  ptkpStatus?: string;
  noBpjsTK?: string;
  statusBpjsTK?: string;
  noBpjsKS?: string;
  statusBpjsKS?: string;
  nominalBpjsTK?: string;
};

interface Props {
  isOpen: boolean;
  initialData?: SalaryBpjsForm | null;
  onClose: () => void;
  onSubmit: (data: SalaryBpjsForm) => void;
  submitting?: boolean;
}

const BANK_OPTIONS = [
  { label: 'BCA', value: 'BCA' },
  { label: 'Mandiri', value: 'Mandiri' },
  { label: 'BNI', value: 'BNI' },
  { label: 'BTN', value: 'BTN' },
];

const STATUS_BPJS_OPTIONS = [
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Nonaktif', value: 'Nonaktif' },
];

const STATUS_BPJS_KS_OPTIONS = [
  { label: 'Mandiri', value: 'Mandiri' },
  { label: 'PBI', value: 'PBI' },
];

const PTKP_OPTIONS = [
  { label: 'TK/0', value: 'TK/0' },
  { label: 'K/0', value: 'K/0' },
  { label: 'K/1', value: 'K/1' },
  { label: 'K/2', value: 'K/2' },
  { label: 'K/3', value: 'K/3' },
];

const SalaryBpjsModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<SalaryBpjsForm>({});
  const title = useMemo(() => 'Edit Salary & BPJS', []);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, isOpen]);

  const handleInput = (key: keyof SalaryBpjsForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const content = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold">Salary</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* <div>
            <Label>Gaji</Label>
            <InputField value={form.gaji || ''} onChange={(e) => handleInput('gaji', e.target.value)} />
          </div> */}
          <div className="md:col-span-2">
            <Label>Bank</Label>
            <Select options={BANK_OPTIONS} defaultValue={form.bank || ''} onChange={(v) => handleInput('bank', v)} placeholder="Select" />
          </div>
          <div>
            <Label>No. Rekening</Label>
            <InputField value={form.noRekening || ''} onChange={(e) => handleInput('noRekening', e.target.value)} />
          </div>
          <div>
            <Label>Nama Akun Bank</Label>
            <InputField value={form.namaAkunBank || ''} onChange={(e) => handleInput('namaAkunBank', e.target.value)} />
          </div>
          <div>
            <Label>NPWP</Label>
            <InputField value={form.npwp || ''} onChange={(e) => handleInput('npwp', e.target.value)} />
          </div>
          <div>
            <Label>PTKP Status</Label>
            <Select options={PTKP_OPTIONS} defaultValue={form.ptkpStatus || ''} onChange={(v) => handleInput('ptkpStatus', v)} placeholder="Select" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold">BPJS</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>No. BPJS Ketenagakerjaan</Label>
            <InputField value={form.noBpjsTK || ''} onChange={(e) => handleInput('noBpjsTK', e.target.value)} />
          </div>
          <div>
            <Label>Status BPJS Ketenagakerjaan</Label>
            <Select options={STATUS_BPJS_OPTIONS} defaultValue={form.statusBpjsTK || ''} onChange={(v) => handleInput('statusBpjsTK', v)} placeholder="Select" />
          </div>
          <div>
            <Label>No. BPJS Kesehatan</Label>
            <InputField value={form.noBpjsKS || ''} onChange={(e) => handleInput('noBpjsKS', e.target.value)} />
          </div>
          <div>
            <Label>Status BPJS Kesehatan (Mandiri/PBI)</Label>
            <Select options={STATUS_BPJS_KS_OPTIONS} defaultValue={form.statusBpjsKS || ''} onChange={(v) => handleInput('statusBpjsKS', v)} placeholder="Select" />
          </div>
          {/* <div>
            <Label>Nominal BPJS TK</Label>
            <InputField value={form.nominalBpjsTK || ''} onChange={(e) => handleInput('nominalBpjsTK', e.target.value)} />
          </div> */}
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
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default SalaryBpjsModal;