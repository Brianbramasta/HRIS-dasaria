import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/features/structure-and-organize/components/modals/shared/field/FileInput';

export type ContractEntry = {
  id?: number;
  namaLengkap: string;
  statusKontrak: string;
  lamaBekerja: string; // contoh: "3 Tahun"
  ttdKontrakTerakhir: string; // yyyy-MM-dd
  berakhirKontrak: string; // yyyy-MM-dd
  jenisKontrak: string; // PKWT / PKWTT / dll
  kontrakKe: number;
  statusBerakhir: string;
  deskripsi?: string;
  fileName?: string;
};

interface ContractModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: ContractEntry | null;
  onClose: () => void;
  onSubmit: (data: ContractEntry) => void;
  submitting?: boolean;
}

const optionsStatusKontrak = [
  { value: 'Aktif', label: 'Aktif' },
  { value: 'Tidak Aktif', label: 'Tidak Aktif' },
  { value: 'Habis', label: 'Habis' },
];

const optionsJenisKontrak = [
  { value: 'PKWT', label: 'PKWT' },
  { value: 'PKWTT', label: 'PKWTT' },
  { value: 'Intern', label: 'Intern' },
];

const optionsStatusBerakhir = [
  { value: '-', label: '-' },
  { value: 'Diperpanjang', label: 'Diperpanjang' },
  { value: 'Berakhir', label: 'Berakhir' },
];

const emptyForm: ContractEntry = {
  namaLengkap: '',
  statusKontrak: '',
  lamaBekerja: '',
  ttdKontrakTerakhir: '',
  berakhirKontrak: '',
  jenisKontrak: '',
  kontrakKe: 0,
  statusBerakhir: '-',
  deskripsi: '',
};

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, mode, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<ContractEntry>(emptyForm);
  const title = useMemo(() => (mode === 'add' ? 'Tambah Kontrak' : 'Edit Kontrak'), [mode]);

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, isOpen]);

  const handleInput = (key: keyof ContractEntry, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const content = (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="col-span-2">
        <Label>Nama Lengkap</Label>
        <InputField placeholder="Nama Lengkap" value={form.namaLengkap} onChange={(e) => handleInput('namaLengkap', e.target.value)} required />
      </div>

      <div>
        <Label>Status Kontrak</Label>
        <Select options={optionsStatusKontrak} placeholder="Select" defaultValue={form.statusKontrak} onChange={(v) => handleInput('statusKontrak', v)} required />
      </div>
      <div>
        <Label>Lama Bekerja</Label>
        <InputField placeholder="mis. 3 Tahun" value={form.lamaBekerja} onChange={(e) => handleInput('lamaBekerja', e.target.value)} />
      </div>

      <div>
        <Label>TTD Kontrak Terakhir</Label>
        <InputField type="date" value={form.ttdKontrakTerakhir} onChange={(e) => handleInput('ttdKontrakTerakhir', e.target.value)} />
      </div>
      <div>
        <Label>Berakhir Kontrak</Label>
        <InputField type="date" value={form.berakhirKontrak} onChange={(e) => handleInput('berakhirKontrak', e.target.value)} />
      </div>

      <div>
        <Label>Jenis Kontrak</Label>
        <Select options={optionsJenisKontrak} placeholder="Select" defaultValue={form.jenisKontrak} onChange={(v) => handleInput('jenisKontrak', v)} required />
      </div>
      <div>
        <Label>Kontrak ke</Label>
        <InputField type="number" min="0" value={form.kontrakKe} onChange={(e) => handleInput('kontrakKe', Number(e.target.value))} />
      </div>

      <div>
        <Label>Status Berakhir</Label>
        <Select options={optionsStatusBerakhir} placeholder="Select" defaultValue={form.statusBerakhir} onChange={(v) => handleInput('statusBerakhir', v)} />
      </div>
      <div className="col-span-2">
        <Label>Description</Label>
        <TextArea placeholder="Enter as description ..." rows={4} value={form.deskripsi || ''} onChange={(v) => handleInput('deskripsi', v)} />
      </div>

      <div className="col-span-2">
        <FileInput skFileName={form.fileName || ''} onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleInput('fileName', file.name);
        }} />
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
      maxWidth="max-w-3xl"
    />
  );
};

export default ContractModal;