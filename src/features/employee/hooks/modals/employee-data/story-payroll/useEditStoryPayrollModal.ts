import { useEffect, useState, useMemo } from 'react';
import { useApiEmployeeSalary } from '@/features/employee/hooks/api/useApiEmployeeSalary';
import { useApiPayrollPreview } from '@/features/employee/hooks/api/useApiPayrollPreview';
import { TemporarySalaryResponse, NonFixAllowanceDetail, EmployeeSalaryShowResponse } from '@/features/employee/types/dto/EmployeeSalaryType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  data: EmployeeSalaryShowResponse | null;
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
      const employeeInfo = data.data.employee_information;
      const payrollInfo = data.data.payroll_information;
      
      setBankName(employeeInfo.bank_name || '');
      setAccountNumber(employeeInfo.bank_account_number || '');
      setAccountHolder(employeeInfo.bank_account_holder || '');
      setNpwp(employeeInfo.npwp || '');

      // Extract non-fixed allowances from new structure
      const nonFixedAllowances = payrollInfo.allowances
        .filter(allowance => allowance.type === 'non_fixed')
        .map((allowance) => ({
          tr_id: allowance.id,
          id: allowance.id || '',
          amount: allowance.amount,
        })) || [];
      setNonFixAllowances(nonFixedAllowances);
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
