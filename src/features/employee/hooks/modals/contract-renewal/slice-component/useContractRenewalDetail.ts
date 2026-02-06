import { useEffect, useMemo, useCallback } from 'react';
import { useContractRenewalStore } from '@/features/employee/stores/useContractRenewalStore';
import { useApiContractExtension } from '@/features/employee/hooks/api/useApiContractExtension';

type StatusOption = { value: string; label: string };
type ContractTypeOption = { value: string; label: string };

type Params = {
  data?: {
    employee_id?: string;
    full_name?: string;
    position_name?: string;
    department_name?: string;
    join_date?: string;
    end_date?: string;
    remaining_contract?: string;
    renewal_status_name?: string;
    contract_type_id?: string;
    contract_type_name?: string;
    contract_number?: string;
    new_contract_date?: string;
    new_contract_end_date?: string;
    contract_document?: string;
    evaluation_document?: string;
    notes?: string;
  };
  isEditing?: boolean;
  onChange?: (field: string, value: any) => void;
  showLimitedFields?: boolean;
  statusOptions?: StatusOption[];
  contractTypeOptions?: ContractTypeOption[];
};

export function useContractRenewalDetail({
  data = {},
  isEditing = false,
  onChange,
  showLimitedFields = false,
  statusOptions = [],
  contractTypeOptions = [],
}: Params) {
  const { shouldShowAllDetailFields, setChangeTypeName } = useContractRenewalStore();
  const { contractTypeOptions: apiContractTypeOptions, fetchContractTypes } = useApiContractExtension();

  useEffect(() => {
    if (contractTypeOptions.length === 0) {
      fetchContractTypes();
    }
  }, [contractTypeOptions.length, fetchContractTypes]);

  const effectiveContractTypeOptions = useMemo<ContractTypeOption[]>(() => {
    if (contractTypeOptions.length > 0) return contractTypeOptions;
    if (apiContractTypeOptions.length > 0) return apiContractTypeOptions;
    return [
      { label: 'Pilih Jenis Kontrak', value: '' },
      { label: 'Kontrak Tetap', value: 'Kontrak Tetap' },
      { label: 'Kontrak Sementara', value: 'Kontrak Sementara' },
      { label: 'PKWT', value: 'PKWT' },
    ];
  }, [contractTypeOptions, apiContractTypeOptions]);

  useEffect(() => {
    if (data?.renewal_status_name) {
      const selectedOption = statusOptions.find((opt) => opt.value === data.renewal_status_name);
      const label = selectedOption ? selectedOption.label : data.renewal_status_name;
      setChangeTypeName(label);
    }
  }, [data?.renewal_status_name, setChangeTypeName, statusOptions]);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      if (onChange) {
        onChange(field, value);
      }
      if (field === 'renewal_status_name') {
        const selectedOption = statusOptions.find((opt) => opt.value === value);
        const label = selectedOption ? selectedOption.label : value;
        setChangeTypeName(label);
      }
    },
    [onChange, statusOptions, setChangeTypeName]
  );

  const showAllDetailFields = useMemo(() => {
    return !showLimitedFields && shouldShowAllDetailFields();
  }, [showLimitedFields, shouldShowAllDetailFields]);

  return {
    isEditing,
    data,
    effectiveContractTypeOptions,
    handleInputChange,
    showAllDetailFields,
  };
}
