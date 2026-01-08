// Dokumentasi: Modal Tambah/Edit Potongan Tidak Tetap (Nama Potongan, Deksripsi Umum)
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { useNonRecurringDeductionModal } from '@/features/payroll/hooks/modals/payroll-configuration/non-recurring-deduction/useNonRecurringDeductionModal';

type FormValues = {
  namaPotongan: string;
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

const PotonganTidakTetapModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, title, confirmTitleButton }) => {
  const { form, setField, handleSubmit } = useNonRecurringDeductionModal({
    isOpen,
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Nama Potongan</Label>
        <Input placeholder="Masukkan nama potongan" value={form.namaPotongan} onChange={(e) => setField('namaPotongan', e.target.value)} />
      </div>
      <div>
        <Label>Deksripsi Umum</Label>
        <TextArea placeholder="Tulis description ..." value={form.deskripsiUmum} onChange={(value) => setField('deskripsiUmum', value)} />
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={title ?? 'Edit Potongan Tidak Tetap'}
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

export default PotonganTidakTetapModal;
