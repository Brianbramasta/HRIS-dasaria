import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/components/shared/field/FileInput';
import DatePicker from '@/components/form/date-picker';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

export type PelanggaranEntry = {
  id?: string;
  namaLengkap?: string;
  jenisPelanggaran: string;
  tanggalKejadian: string; // yyyy-MM-dd
  jenisTindakan: string; // disciplinary_id
  masaBerlaku: string;
  tanggalMulaiTindakan?: string;
  tanggalBerakhirTindakan?: string;
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
  disciplinaryOptions?: { label: string; value: string }[];
  onFileChange?: (file: File | null) => void;
}

// static options removed; use free text for pelanggaran and dynamic dropdown for tindakan

// removed masa berlaku select options in favor of date input

const emptyForm: PelanggaranEntry = {
  namaLengkap: '',
  jenisPelanggaran: '',
  tanggalKejadian: '',
  jenisTindakan: '',
  masaBerlaku: '',
  tanggalMulaiTindakan: '',
  tanggalBerakhirTindakan: '',
  deskripsi: '',
};

const PelanggaranModal: React.FC<PelanggaranModalProps> = ({ isOpen, mode, initialData, onClose, onSubmit, submitting = false, disciplinaryOptions = [], onFileChange }) => {
  const [form, setForm] = useState<PelanggaranEntry>(emptyForm);
  const title = useMemo(() => (mode === 'add' ? 'Tambah Pelanggaran' : 'Edit Pelanggaran'), [mode]);
  const {detail} = useDetailDataKaryawanPersonalInfo();
  const full_name = detail?.Personal_Data?.full_name || '';
 
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
        <InputField placeholder="Nama Lengkap" value={full_name} onChange={(e) => handleInput('namaLengkap', e.target.value)} required />
      </div>
 
      <div className='col-span-2'>
        <Label>Jenis Pelanggaran</Label>
        <InputField placeholder="Masukkan jenis pelanggaran" value={form.jenisPelanggaran} onChange={(e) => handleInput('jenisPelanggaran', e.target.value)} required />
      </div>
      <div className='col-span-2'>
        <Label>Tanggal Kejadian</Label>
        <DatePicker
          id="tanggalKejadian"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggalKejadian}
          onChange={(_, dateStr) => handleInput('tanggalKejadian', dateStr)}
        />
      </div>
 
      <div className='col-span-2'>
        <Label>Jenis Tindakan</Label>
        <Select options={disciplinaryOptions} placeholder="Select" defaultValue={form.jenisTindakan} onChange={(v) => handleInput('jenisTindakan', v)} required />
      </div>
      <div className='col-span-2 md:col-span-1'>
        <Label>Tanggal Mulai Tindakan</Label>
        <DatePicker
          id="tanggalMulaiTindakan"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggalMulaiTindakan}
          onChange={(_, dateStr) => handleInput('tanggalMulaiTindakan', dateStr)}
        />
      </div>
      <div className='col-span-2 md:col-span-1'>
        <Label>Tanggal Berakhir Tindakan</Label>
        <DatePicker
          id="tanggalBerakhirTindakan"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggalBerakhirTindakan}
          onChange={(_, dateStr) => handleInput('tanggalBerakhirTindakan', dateStr)}
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
          onFileChange?.(file ?? null);
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
