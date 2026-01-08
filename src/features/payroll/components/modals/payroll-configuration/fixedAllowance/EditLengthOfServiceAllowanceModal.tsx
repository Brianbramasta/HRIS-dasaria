// Dokumentasi: Modal Edit Tunjangan Lama Kerja dengan field Lama Kerja & Nomianal
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { useEditLengthOfServiceAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditLengthOfServiceAllowanceModal';

type FormValues = {
  lamaKerja: string;
  nominal: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
}

// Dokumentasi: komponen modal utama untuk edit Tunjangan Lama Kerja
const EditTunjanganLamaKerjaModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const { form, setField, handleSubmit } = useEditLengthOfServiceAllowanceModal({
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Lama Kerja</Label>
        <Input placeholder="Tahun Ke-1" value={form.lamaKerja} onChange={(e) => setField('lamaKerja', e.target.value)} />
      </div>
      <div>
        <Label>Nomianal</Label>
        <Input placeholder="edit Nominal" value={form.nominal} onChange={(e) => setField('nominal', e.target.value)} />
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={'Edit Tunjangan Lama Kerja'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditTunjanganLamaKerjaModal;
