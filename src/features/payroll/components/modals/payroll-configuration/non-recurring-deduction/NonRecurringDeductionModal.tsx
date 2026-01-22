// Dokumentasi: Modal Tambah/Edit Potongan Tidak Tetap (Nama Potongan, Deksripsi Umum)
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useNonRecurringDeductionModal, NonRecurringDeductionForm } from '@/features/payroll/hooks/modals/payroll-configuration/non-recurring-deduction/useNonRecurringDeductionModal';

export type { NonRecurringDeductionForm };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<NonRecurringDeductionForm> | null;
  onSave: (values: NonRecurringDeductionForm) => void;
  title?: string;
  confirmTitleButton?: string;
  isLoading?: boolean;
}

const NonRecurringDeductionModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  defaultValues, 
  onSave, 
  title, 
  confirmTitleButton,
  isLoading = false
}) => {
  const { form, setField, handleSubmit } = useNonRecurringDeductionModal({
    isOpen,
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <InputField
        label="Nama Potongan"
        placeholder="Masukkan nama potongan"
        value={form.namaPotongan}
        onChange={(e) => setField('namaPotongan', e.target.value)}
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
      title={title ?? 'Edit Potongan Tidak Tetap'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={isLoading}
      maxWidth="max-w-lg"
      confirmTitleButton={confirmTitleButton ?? 'Simpan Perubahan'}
      closeTitleButton="Tutup"
    />
  );
};

export default NonRecurringDeductionModal;
