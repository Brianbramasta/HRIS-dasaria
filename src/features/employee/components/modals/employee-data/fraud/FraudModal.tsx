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
          value={form.jenisPelanggaran}
          onChange={(e) => handleInput('jenisPelanggaran', e.target.value)}
          required
        />
      </div>
      <div className='col-span-2'>
        <DateField
          label="Tanggal Kejadian"
          id="tanggalKejadian"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggalKejadian}
          onChange={(_, dateStr) => handleInput('tanggalKejadian', dateStr)}
          required
        />
      </div>

      <div className='col-span-2'>
        <SelectField
          label="Jenis Tindakan"
          options={disciplinaryOptions}
          placeholder="Select"
          defaultValue={form.jenisTindakan}
          onChange={(v) => handleInput('jenisTindakan', v)}
          required
        />
      </div>
      <div className='col-span-2 md:col-span-1'>
        <DateField
          label="Tanggal Mulai Tindakan"
          id="tanggalMulaiTindakan"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggalMulaiTindakan}
          onChange={(_, dateStr) => handleInput('tanggalMulaiTindakan', dateStr)}
          required
        />
      </div>
      <div className='col-span-2 md:col-span-1'>
        <DateField
          label="Tanggal Berakhir Tindakan"
          id="tanggalBerakhirTindakan"
          placeholder="hh/bb/tttt"
          defaultDate={form.tanggalBerakhirTindakan}
          onChange={(_, dateStr) => handleInput('tanggalBerakhirTindakan', dateStr)}
          required
        />
      </div>

      <div className="col-span-2">
        <TextAreaField
          label="Description Pelanggaran"
          placeholder="Ketik deskripsi …"
          rows={4}
          value={form.deskripsi}
          onChange={(v) => handleInput('deskripsi', v)}
          required
        />
      </div>

      <div className="col-span-2">
        <FileInput
          skFileName={form.fileName || ''}
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
