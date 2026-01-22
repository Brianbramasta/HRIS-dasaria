// Dokumentasi: Modal Tambah/Edit Tunjangan Tidak Tetap (Nama Tunjangan, Deksripsi Umum)
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useEditNonRecurringAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/non-recurring-allowance/useEditNonRecurringAllowanceModal';

type FormValues = {
  namaTunjangan: string;
  deskripsiUmum: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
  title?: string;
  confirmTitleButton?: string;
}

const EditTunjanganTidakTetapModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, title, confirmTitleButton }) => {
  const { form, setField, handleSubmit } = useEditNonRecurringAllowanceModal({
    isOpen,
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <InputField
        label="Nama Tunjangan"
        placeholder="Masukkan nama tunjangan"
        value={form.namaTunjangan}
        onChange={(e) => setField('namaTunjangan', e.target.value)}
        required
      />
      <TextAreaField
        label="Deksripsi Umum"
        placeholder="Tulis description ..."
        value={form.deskripsiUmum}
        onChange={(value) => setField('deskripsiUmum', value)}
        required
      />
    </div>
  );

  return (
    <ModalAddEdit
      title={title ?? 'Edit Tunjangan Tidak Tetap'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-lg"
      confirmTitleButton={confirmTitleButton ?? 'Simpan Perubahan'}
      closeTitleButton="Tutup"
    />
  );
};

export default EditTunjanganTidakTetapModal;
