import React, { useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/payroll/components/layouts/LayoutDetail';
import { useAddNonRecurringAllowanceModal } from '@/features/payroll/hooks/modals/detail-payroll/non-ae/useAddNonRecurringAllowanceModal';
import { useApiPayrollPeriod } from '@/features/payroll/hooks/api/useApiPayrollPeriod';
import { useParams } from 'react-router-dom';
import { formatInputCurrency, parseCurrency } from '@/utils/formatCurrency';

type Props = ModalProps & {
  onRefresh?: () => void;
};

const TambahTunjanganTidakTetapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
  fields,
  onRefresh,
}) => {
  const { form, setField, handleSubmit } = useAddNonRecurringAllowanceModal(defaultValues as any);
  const { id: payrollId } = useParams();
  const { updateNonFixAllowance } = useApiPayrollPeriod();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitWithApi = async () => {
    setSubmitting(true);
    try {
      if (payrollId) {
        const nonFixedAllowances = Object.entries(form ?? {})
          .map(([key, rawAmount]) => {
            const match = key.match(/^nfa_(.+)$/);
            if (!match) return null;
            const componenId = match[1];
            const amount = parseCurrency(String(rawAmount ?? ''));
            return { componenId, amount: amount === null ? '' : String(amount) };
          })
          .filter(Boolean) as { componenId: string; amount: string }[];

        const ok = await updateNonFixAllowance({ payrollId, nonFixedAllowances });
        if (!ok) return;
      }

      onSave(form ?? {});
      onClose();
      // Refresh payroll detail data
      onRefresh?.();
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
      title={'Tunjangan Tidak Tetap'}
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

export default TambahTunjanganTidakTetapModal;

