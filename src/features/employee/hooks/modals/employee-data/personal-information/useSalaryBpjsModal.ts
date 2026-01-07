import { useEffect, useMemo, useState } from 'react';
import { usePTKPDropdown, useStep4Data } from '@/features/employee/hooks/employee-data/form/useFromStep';
import { UpdateSalaryDataPayload, UpdateBpjsDataPayload } from '@/features/employee/types/detail/PersonalInformation';

export type SalaryBpjsForm = {
  gaji?: string;
  noRekening?: string;
  npwp?: string;
  bank?: string;
  namaAkunBank?: string;
  ptkpStatus?: string;
  noBpjsTK?: string;
  statusBpjsTK?: string;
  noBpjsKS?: string;
  statusBpjsKS?: string;
  nominalBpjsTK?: string;
};

type Params = {
  isOpen: boolean;
  employeeId?: string;
  initialData?: SalaryBpjsForm | null;
  onClose: () => void;
  onSubmitSalary?: (employeeId: string, payload: UpdateSalaryDataPayload) => Promise<void>;
  onSubmitBpjs?: (employeeId: string, payload: UpdateBpjsDataPayload) => Promise<void>;
};

export function useSalaryBpjsModal({ isOpen, employeeId = '', initialData, onClose, onSubmitSalary, onSubmitBpjs }: Params) {
  const [form, setForm] = useState<SalaryBpjsForm>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const title = useMemo(() => 'Edit Salary & BPJS', []);
  const { ptkpOptions, loading: ptkpLoading, fetchPTKPOptions } = usePTKPDropdown(isOpen);
  const { bankOptions } = useStep4Data(isOpen);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, isOpen]);

  const handleInput = (key: keyof SalaryBpjsForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!employeeId) {
      return;
    }
    setIsSubmitting(true);
    try {
      const salaryPayload: UpdateSalaryDataPayload = {
        bank_id: form.bank,
        bank_account_number: form.noRekening,
        bank_account_holder: form.namaAkunBank,
        npwp: form.npwp,
        ptkp_id: form.ptkpStatus,
      };
      const bpjsPayload: UpdateBpjsDataPayload = {
        bpjs_employment_number: form.noBpjsTK,
        bpjs_employment_status: form.statusBpjsTK,
        bpjs_health_number: form.noBpjsKS,
        bpjs_health_status: form.statusBpjsKS,
      };
      if (onSubmitSalary) {
        await onSubmitSalary(employeeId, salaryPayload);
      }
      if (onSubmitBpjs) {
        await onSubmitBpjs(employeeId, bpjsPayload);
      }
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    form,
    bankOptions,
    ptkpOptions,
    ptkpLoading,
    fetchPTKPOptions,
    handleInput,
    handleSubmit,
    isSubmitting,
  };
}
