import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/features/structure-and-organize/components/modals/shared/field/FileInput';
import DatePicker from '@/components/form/date-picker';

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

// removed masa berlaku select options in favor of date input

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
        <DatePicker
          id="tanggalKejadian"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggalKejadian}
          onChange={(_, dateStr) => handleInput('tanggalKejadian', dateStr)}
        />
      </div>

      <div>
        <Label>Jenis Tindakan</Label>
        <Select options={optionJenisTindakan} placeholder="Select" defaultValue={form.jenisTindakan} onChange={(v) => handleInput('jenisTindakan', v)} required />
      </div>
      <div>
        <Label>Masa Berlaku Tindakan</Label>
        <DatePicker
          id="masaBerlakuTindakan"
          placeholder="hh/bb/tttt"
          defaultDate={form.masaBerlaku}
          onChange={(_, dateStr) => handleInput('masaBerlaku', dateStr)}
        />
      </div>

      <div className="col-span-2">
        <Label>Description Pelanggaran</Label>
        <TextArea placeholder="Ketik deskripsi …" rows={4} value={form.deskripsi} onChange={(v) => handleInput('deskripsi', v)} required />
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

export default PelanggaranModal;
