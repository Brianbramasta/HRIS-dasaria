import { useEffect, useState, useMemo } from 'react';
import { useApiEmployeeSalary } from '@/features/employee/hooks/api/useApiEmployeeSalary';
import { useApiPayrollPreview } from '@/features/employee/hooks/api/useApiPayrollPreview';
import { useBankDropdown } from '@/features/employee/hooks/api/useBankDropdown';
import { UpdateNonFixAllowancePayload, EmployeeSalaryShowResponse } from '@/features/employee/types/dto/EmployeeSalaryType';

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
  const { updateNonFixAllowance, loading } = useApiEmployeeSalary();
  const { nonFixAllowanceOptions, fetchNonFixAllowanceDropdown } = useApiPayrollPreview();
  const { bankOptions, fetchBankDropdown } = useBankDropdown();

  // Form State
  const [bankId, setBankId] = useState('');
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
      fetchBankDropdown();
    }
  }, [isOpen, fetchNonFixAllowanceDropdown, fetchBankDropdown]);

  // Initialize data
  useEffect(() => {
    if (data && isOpen) {
      const employeeInfo = data.data.employee_information;
      const payrollInfo = data.data.payroll_information;
      
      console.log('Setting bankId from API:', employeeInfo.bank_id);
      console.log('Available bankOptions:', bankOptions);
      
      setBankId(employeeInfo.bank_id || '');
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
  }, [data, isOpen, bankOptions]);

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
    const payload: UpdateNonFixAllowancePayload = {
      employee_id: employeeId,
      data_update: nonFixAllowances.map((item) => ({
        non_fix_id: item.id,
        amount: item.amount,
      })),
      bank_account_number: accountNumber,
      bank_id: bankId,
      bank_account_holder: accountHolder,
      npwp: npwp,
    };

    const success = await updateNonFixAllowance(payload);

    if (success) {
      onSuccess();
      onClose();
    }
  };

  return {
    loading,
    bankId,
    setBankId,
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
    bankOptions,
    handleAddAllowance,
    handleRemoveAllowance,
    handleChangeAllowance,
    handleSubmit,
  };
};
