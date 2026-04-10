import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import SelectField from '@/components/shared/field/SelectField';
import DateField from '@/components/shared/field/DateField';
import FileInput from '@/components/shared/form/FileInput';
import { useFraudModal, PelanggaranEntry } from '@/features/employee/hooks/modals/employee-data/fraud/useFraudModal';

export type { PelanggaranEntry };

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

const PelanggaranModal: React.FC<PelanggaranModalProps> = ({ isOpen, mode, initialData, onClose, onSubmit, submitting = false, disciplinaryOptions = [], onFileChange }) => {
  const { form, title, full_name, handleInput, handleFileChange } = useFraudModal({ isOpen, mode, initialData, onFileChange });

  const content = (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="col-span-2">
        <InputField
          label="Nama Lengkap"
          placeholder="Nama Lengkap"
          value={full_name}
          onChange={(e) => handleInput('namaLengkap', e.target.value)}
          required
        />
      </div>

      <div className='col-span-2'>
        <InputField
          label="Jenis Pelanggaran"
          placeholder="Masukkan jenis pelanggaran"
          value={form.jenis_pelanggaran}
          onChange={(e) => handleInput('jenis_pelanggaran', e.target.value)}
          required
        />
      </div>
      <div className='col-span-2'>
        <DateField
          label="Tanggal Kejadian"
          id="tanggal_pelanggaran"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggal_pelanggaran}
          onChange={(_, dateStr) => handleInput('tanggal_pelanggaran', dateStr)}
          required
        />
      </div>

      <div className='col-span-2'>
        <SelectField
          label="Jenis Tindakan"
          options={disciplinaryOptions}
          placeholder="Select"
          defaultValue={form.jenis_tindakan}
          onChange={(v) => handleInput('jenis_tindakan', v)}
          required
        />
      </div>
      <div className='col-span-2 md:col-span-1'>
        <DateField
          label="Tanggal Mulai Tindakan"
          id="tanggal_mulai_hukuman"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggal_mulai_hukuman}
          onChange={(_, dateStr) => handleInput('tanggal_mulai_hukuman', dateStr)}
          required
        />
      </div>
      <div className='col-span-2 md:col-span-1'>
        <DateField
          label="Tanggal Berakhir Tindakan"
          id="tanggal_selesai_hukuman"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggal_selesai_hukuman}
          onChange={(_, dateStr) => handleInput('tanggal_selesai_hukuman', dateStr)}
          required
        />
      </div>

      <div className="col-span-2">
        <TextAreaField
          label="Description Pelanggaran"
          placeholder="Ketik deskripsi …"
          rows={4}
          value={form.deskripsi_pelanggaran}
          onChange={(v) => handleInput('deskripsi_pelanggaran', v)}
          required
        />
      </div>

      <div className="col-span-2">
        <FileInput
          skFileName={form.file || ''}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            handleFileChange(file);
          }}
          required
        />
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
