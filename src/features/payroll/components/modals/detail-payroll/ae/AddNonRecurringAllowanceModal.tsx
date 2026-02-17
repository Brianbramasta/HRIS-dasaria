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
  fields,
}) => {
  const { form, setField, handleSubmit } = useAddNonRecurringAllowanceAEModal(defaultValues as any);

  const content = (
    <div className="space-y-5">
      {(fields ?? []).map((f) => (
        <div key={f.name}>
          <Label>{f.label}</Label>
          <Input
            type={f.inputType ?? 'text'}
            placeholder={f.placeholder ?? '0'}
            value={form?.[f.name] ?? ''}
            onChange={(e) => setField(f.name, e.target.value)}
            disabled={f.disabled}
            readonly={f.readonly}
          />
        </div>
      ))}
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

