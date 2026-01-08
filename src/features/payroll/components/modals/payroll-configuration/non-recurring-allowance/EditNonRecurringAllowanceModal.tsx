// Dokumentasi: Modal Tambah/Edit Tunjangan Tidak Tetap (Nama Tunjangan, Deksripsi Umum)
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
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
      <div>
        <Label>Nama Tunjangan</Label>
        <Input placeholder="Masukkan nama tunjangan" value={form.namaTunjangan} onChange={(e) => setField('namaTunjangan', e.target.value)} />
      </div>
      <div>
        <Label>Deksripsi Umum</Label>
        <TextArea placeholder="Tulis description ..." value={form.deskripsiUmum} onChange={(value) => setField('deskripsiUmum', value)} />
      </div>
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
