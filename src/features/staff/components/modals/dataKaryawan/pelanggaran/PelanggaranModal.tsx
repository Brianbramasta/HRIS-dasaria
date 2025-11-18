import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/features/structure-and-organize/components/modals/shared/field/FileInput';

export type PelanggaranEntry = {
  id?: number;
  namaLengkap?: string;
  jenisPelanggaran: string;
  tanggalKejadian: string; // yyyy-MM-dd
  jenisTindakan: string;
  masaBerlaku: string;
  deskripsi: string;
  fileName?: string;
};

interface PelanggaranModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: PelanggaranEntry | null;
  onClose: () => void;
  onSubmit: (data: PelanggaranEntry) => void;
  submitting?: boolean;
}

const optionJenisPelanggaran = [
  { value: 'Terlambat', label: 'Terlambat' },
  { value: 'Tidak masuk', label: 'Tidak masuk' },
  { value: 'Mailing', label: 'Mailing' },
];

const optionJenisTindakan = [
  { value: 'Teguran', label: 'Teguran' },
  { value: 'Peringatan Lisan', label: 'Peringatan Lisan' },
  { value: 'SP1', label: 'SP1' },
  { value: 'Pemberhentian', label: 'Pemberhentian' },
];

const optionMasaBerlaku = [
  { value: '1 Bulan', label: '1 Bulan' },
  { value: '3 Bulan', label: '3 Bulan' },
  { value: '6 Bulan', label: '6 Bulan' },
  { value: 'Tidak terikat', label: 'Tidak terikat' },
];

const emptyForm: PelanggaranEntry = {
  namaLengkap: '',
  jenisPelanggaran: '',
  tanggalKejadian: '',
  jenisTindakan: '',
  masaBerlaku: '',
  deskripsi: '',
};

const PelanggaranModal: React.FC<PelanggaranModalProps> = ({ isOpen, mode, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<PelanggaranEntry>(emptyForm);
  const title = useMemo(() => (mode === 'add' ? 'Tambah Pelanggaran' : 'Edit Pelanggaran'), [mode]);

  useEffect(() => {
    setForm(initialData && mode === 'edit' ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, isOpen, mode]);

  const handleInput = (key: keyof PelanggaranEntry, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const content = (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="col-span-2">
        <Label>Nama Lengkap</Label>
        <InputField placeholder="Nama Lengkap" value={form.namaLengkap} onChange={(e) => handleInput('namaLengkap', e.target.value)} required />
      </div>

      <div>
        <Label>Jenis Pelanggaran</Label>
        <Select options={optionJenisPelanggaran} placeholder="Select" defaultValue={form.jenisPelanggaran} onChange={(v) => handleInput('jenisPelanggaran', v)} required />
      </div>
      <div>
        <Label>Tanggal Kejadian</Label>
        <InputField type="date" value={form.tanggalKejadian} onChange={(e) => handleInput('tanggalKejadian', e.target.value)} required />
      </div>

      <div>
        <Label>Jenis Tindakan</Label>
        <Select options={optionJenisTindakan} placeholder="Select" defaultValue={form.jenisTindakan} onChange={(v) => handleInput('jenisTindakan', v)} required />
      </div>
      <div>
        <Label>Masa Berlaku</Label>
        <Select options={optionMasaBerlaku} placeholder="Select" defaultValue={form.masaBerlaku} onChange={(v) => handleInput('masaBerlaku', v)} required />
      </div>

      <div className="col-span-2">
        <Label>Description Pelanggaran</Label>
        <TextArea placeholder="Ketik deskripsi …" rows={4} value={form.deskripsi} onChange={(v) => handleInput('deskripsi', v)} required />
      </div>

      <div className="col-span-2">
        <Label>Upload Dokumen terbaru</Label>
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

export default PelanggaranModal;