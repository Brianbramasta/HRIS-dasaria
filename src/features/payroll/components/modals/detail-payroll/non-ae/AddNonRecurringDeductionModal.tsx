import React, { useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/payroll/components/layouts/LayoutDetail';
import { useAddNonRecurringDeductionModal } from '@/features/payroll/hooks/modals/detail-payroll/non-ae/useAddNonRecurringDeductionModal';
import { useApiPayrollPeriod } from '@/features/payroll/hooks/api/useApiPayrollPeriod';
import { useParams } from 'react-router-dom';
import { formatInputCurrency, parseCurrency } from '@/utils/formatCurrency';

type Props = ModalProps;

const TambahPotonganTidakTetapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
  fields,
}) => {
  const { form, setField, handleSubmit } = useAddNonRecurringDeductionModal(defaultValues as any);
  const { id: payrollId } = useParams();
  const { updateNonFixDeduction } = useApiPayrollPeriod();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitWithApi = async () => {
    setSubmitting(true);
    try {
      if (payrollId) {
        const nonFixedDeductions = Object.entries(form ?? {})
          .map(([key, rawAmount]) => {
            const match = key.match(/^nfd_(.+)$/);
            if (!match) return null;
            const componenId = match[1];
            const amount = parseCurrency(String(rawAmount ?? ''));
            return { componenId, amount: amount === null ? '' : String(amount) };
          })
          .filter(Boolean) as { componenId: string; amount: string }[];

        const ok = await updateNonFixDeduction({ payrollId, nonFixedDeductions });
        if (!ok) return;
      }

      onSave(form ?? {});
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-5">
      {(fields ?? []).map((f) => (
        <div key={f.name}>
          <Label>{f.label}</Label>
          <Input
            type={f.inputType ?? 'text'}
            placeholder={f.placeholder ?? '0'}
            value={formatInputCurrency(form?.[f.name] ?? '')}
            onChange={(e) => setField(f.name, formatInputCurrency(e.target.value))}
            disabled={f.disabled}
            readonly={f.readonly}
          />
        </div>
      ))}
    </div>
  );

  return (
    <ModalAddEdit
      title={'Potongan Tidak Tetap'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={payrollId ? handleSubmitWithApi : () => handleSubmit(onSave, onClose)}
      submitting={submitting}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default TambahPotonganTidakTetapModal;

