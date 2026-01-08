import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/payroll/components/layouts/LayoutDetail';
import { useAddNonRecurringAllowanceAEModal } from '@/features/payroll/hooks/modals/detail-payroll/ae/useAddNonRecurringAllowanceAEModal';

type Props = ModalProps;

const TambahTunjanganTidakTetapModalAE: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}) => {
  const { form, setField, handleSubmit } = useAddNonRecurringAllowanceAEModal(defaultValues as any);

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Komisi Sales</Label>
        <Input placeholder="150.000" value={form.komisiSales} onChange={(e) => setField('komisiSales', e.target.value)} />
      </div>
      <div>
        <Label>Komisi Survey Sales</Label>
        <Input placeholder="300.000" value={form.komisiSurveySales} onChange={(e) => setField('komisiSurveySales', e.target.value)} />
      </div>
      <div>
        <Label>Growth Reward</Label>
        <Input placeholder="1.500.000" value={form.growthReward} onChange={(e) => setField('growthReward', e.target.value)} />
      </div>
      <div>
        <Label>Insentif</Label>
        <Input placeholder="1.500.000" value={form.insentif} onChange={(e) => setField('insentif', e.target.value)} />
      </div>
      <div>
        <Label>Fee Mitra Subnet</Label>
        <Input placeholder="1.500.000" value={form.feeMitraSubnet} onChange={(e) => setField('feeMitraSubnet', e.target.value)} />
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

export default TambahTunjanganTidakTetapModalAE;

