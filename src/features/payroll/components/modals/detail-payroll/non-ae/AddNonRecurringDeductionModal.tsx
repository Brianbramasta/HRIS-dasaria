import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/payroll/components/layouts/LayoutDetail';
import { useAddNonRecurringDeductionModal } from '@/features/payroll/hooks/modals/detail-payroll/non-ae/useAddNonRecurringDeductionModal';

type Props = ModalProps;

const TambahPotonganTidakTetapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}) => {
  const { form, setField, handleSubmit } = useAddNonRecurringDeductionModal(defaultValues as any);

  const content = (
    <div className="space-y-5">
      <div>
        <Label>BPJS Kesehatan JKN (1%)</Label>
        <Input placeholder="100.000" value={form.jkn1} onChange={(e) => setField('jkn1', e.target.value)} />
      </div>
      <div>
        <Label>BPJS Ketenagakerjaan JHT (2%)</Label>
        <Input placeholder="200.000" value={form.jht2} onChange={(e) => setField('jht2', e.target.value)} />
      </div>
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

export default TambahPotonganTidakTetapModal;

