import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/payroll/components/layouts/LayoutDetail';
import { useAddNonRecurringDeductionAEModal } from '@/features/payroll/hooks/modals/detail-payroll/ae/useAddNonRecurringDeductionAEModal';

type Props = ModalProps;

const TambahPotonganTidakTetapModalAE: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}) => {
  const { form, setField, handleSubmit } = useAddNonRecurringDeductionAEModal(defaultValues as any);

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Kasbon</Label>
        <Input placeholder="500.000" value={form.kasbon} onChange={(e) => setField('kasbon', e.target.value)} />
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={'Potongan Tidak Tetap'}
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

export default TambahPotonganTidakTetapModalAE;

