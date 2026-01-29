import { useEffect, useState, useMemo } from 'react';
import { useApiEmployeeSalary } from '@/features/employee/hooks/api/useApiEmployeeSalary';
import { useApiPayrollPreview } from '@/features/employee/hooks/api/useApiPayrollPreview';
import { TemporarySalaryResponse, NonFixAllowanceDetail } from '@/features/employee/types/dto/EmployeeSalaryType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  data: TemporarySalaryResponse | null;
  onSuccess: () => void;
}

export interface NonFixAllowanceFormItem {
  tr_id?: string;
  id: string;
  amount: number;
}

export const useEditStoryPayrollModal = ({ isOpen, onClose, employeeId, data, onSuccess }: Props) => {
  const { updateTemporarySalary, loading } = useApiEmployeeSalary();
  const { nonFixAllowanceOptions, fetchNonFixAllowanceDropdown } = useApiPayrollPreview();

  // Form State
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [npwp, setNpwp] = useState('');
  const [nonFixAllowances, setNonFixAllowances] = useState<NonFixAllowanceFormItem[]>([]);

  const allowanceOptions = useMemo(() => {
    return nonFixAllowanceOptions.map((item) => ({
      value: item.id,
      label: item.allowance_name,
    }));
  }, [nonFixAllowanceOptions]);

  // Fetch options
  useEffect(() => {
    if (isOpen) {
      fetchNonFixAllowanceDropdown();
    }
  }, [isOpen, fetchNonFixAllowanceDropdown]);

  // Initialize data
  useEffect(() => {
    if (data && isOpen) {
      setBankName(data.bank_name || '');
      setAccountNumber(String(data.bank_account_number || ''));
      setAccountHolder(data.bank_account_holder || '');
      setNpwp(String(data.npwp || ''));

      const initialNonFix = data.non_fix_allowance_details?.map((item) => ({
        tr_id: item.tr_employee_non_fix_allowance_id,
        id: item.non_fix_allowance_id,
        amount: item.amount,
      })) || [];
      setNonFixAllowances(initialNonFix);
    }
  }, [data, isOpen]);

  const handleAddAllowance = () => {
    setNonFixAllowances([...nonFixAllowances, { id: '', amount: 0 }]);
  };

  const handleRemoveAllowance = (index: number) => {
    const newAllowances = [...nonFixAllowances];
    newAllowances.splice(index, 1);
    setNonFixAllowances(newAllowances);
  };

  const handleChangeAllowance = (index: number, field: keyof NonFixAllowanceFormItem, value: any) => {
    const newAllowances = [...nonFixAllowances];
    newAllowances[index] = { ...newAllowances[index], [field]: value };
    setNonFixAllowances(newAllowances);
  };

  const handleSubmit = async () => {
    const payload: NonFixAllowanceDetail[] = nonFixAllowances.map((item) => ({
      tr_employee_non_fix_allowance_id: item.tr_id,
      non_fix_allowance_id: item.id,
      amount: item.amount,
    }));

    const success = await updateTemporarySalary(employeeId, {
      non_fix_allowance_details: payload,
    });

    if (success) {
      onSuccess();
      onClose();
    }
  };

  return {
    loading,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountHolder,
    setAccountHolder,
    npwp,
    setNpwp,
    nonFixAllowances,
    allowanceOptions,
    handleAddAllowance,
    handleRemoveAllowance,
    handleChangeAllowance,
    handleSubmit,
  };
};
