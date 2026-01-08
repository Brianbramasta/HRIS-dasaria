import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/payroll/components/layouts/LayoutDetail';
import { useAddNonRecurringAllowanceModal } from '@/features/payroll/hooks/modals/detail-payroll/non-ae/useAddNonRecurringAllowanceModal';

type Props = ModalProps;

const TambahTunjanganTidakTetapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}) => {
  const { form, setField, handleSubmit } = useAddNonRecurringAllowanceModal(defaultValues as any);

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Tunjangan PPH 21</Label>
        <Input placeholder="150.000" value={form.pph21} onChange={(e) => setField('pph21', e.target.value)} />
      </div>
      <div>
        <Label>Tunjangan Pendidikan</Label>
        <Input placeholder="300.000" value={form.pendidikan} onChange={(e) => setField('pendidikan', e.target.value)} />
      </div>
      <div>
        <Label>Tunjangan Performa</Label>
        <Input placeholder="1.500.000" value={form.performa} onChange={(e) => setField('performa', e.target.value)} />
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={'Tunjangan Tidak Tetap'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => handleSubmit(onSave, onClose)}
      submitting={false}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default TambahTunjanganTidakTetapModal;

