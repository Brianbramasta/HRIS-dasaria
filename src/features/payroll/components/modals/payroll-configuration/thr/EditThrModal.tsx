// Dokumentasi: Modal Edit THR (Lama Kerja, Deksripsi Umum)
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useEditThrModal } from '@/features/payroll/hooks/modals/payroll-configuration/thr/useEditThrModal';

type FormValues = {
  lamaKerja: string;
  deskripsiUmum: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
  isLoading?: boolean;
}

const EditThrModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, isLoading = false }) => {
  const { form, setField, handleSubmit } = useEditThrModal({
    isOpen,
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <InputField
        label="Lama Kerja"
        placeholder="Masukkan lama kerja"
        value={form.lamaKerja}
        onChange={(e) => setField('lamaKerja', e.target.value)}
        required
      />
      <TextAreaField
        label="Deskripsi Umum"
        placeholder="Tulis description ..."
        value={form.deskripsiUmum}
        onChange={(value) => setField('deskripsiUmum', value)}
        required
      />
    </div>
  );

  return (
    <ModalAddEdit
      title={'Edit Tunjangan Hari Raya'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={isLoading}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditThrModal;
