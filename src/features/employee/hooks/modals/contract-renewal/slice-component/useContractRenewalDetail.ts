import React, { useEffect, useMemo, useCallback } from 'react';
import { useContractRenewalStore } from '@/features/employee/stores/useContractRenewalStore';
import { useApiContractExtension } from '@/features/employee/hooks/api/useApiContractExtension';
import { addNotification } from '@/stores/notificationStore';

// Export validation functions untuk digunakan di file lain
export const validateNewContractEndDateFn = (newEndDate: string, oldEndDate: string, newStartDate?: string) => {
  const errors: string[] = [];
  
  const newEndDateObj = new Date(newEndDate);
  const oldEndDateObj = new Date(oldEndDate);
  
  // Calculate minDate as (newStartDate + 1 month) if provided, otherwise use (today + 1 month)
  let minDate: Date;
  if (newStartDate) {
    const newStartDateObj = new Date(newStartDate);
    minDate = new Date(newStartDateObj.getFullYear(), newStartDateObj.getMonth() + 1, newStartDateObj.getDate());
  } else {
    const today = new Date();
    minDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  }

  console.log('newEndDateObj', newEndDateObj);
  console.log('minDate', minDate);
  console.log('newEndDateObj <= minDate', newEndDateObj <= minDate);
  // Validasi A: Tanggal Berakhir Baru harus > (Tanggal Mulai Kontrak Baru + 1 bulan)
  if (newEndDateObj <= minDate) {
    const formattedMinDate = minDate.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    // const referenceDate = newStartDate ? 'tanggal mulai kontrak baru' : 'hari ini';
    errors.push(`Tanggal berakhir kontrak baru minimal harus lebih dari  ${formattedMinDate}. `);
    // Hal ini untuk memastikan notifikasi perpanjangan tidak terus muncul.
  }
  
  // Validasi A: Tanggal Berakhir Baru harus > Tanggal Berakhir Kontrak Lama
  if (newEndDateObj <= oldEndDateObj) {
    const formattedOldDate = oldEndDateObj.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    errors.push(`Tanggal berakhir kontrak baru harus lebih dari tanggal berakhir kontrak sebelumnya ${formattedOldDate}.`);
  }
  
  return errors;
};

export const validateNewContractStartDateFn = (newStartDate: string, oldEndDate: string) => {
  const errors: string[] = [];
  
  const newStartDateObj = new Date(newStartDate);
  const oldEndDateObj = new Date(oldEndDate);
  
  // Validasi B: Tanggal Mulai Kontrak Baru harus >= Tanggal Berakhir Kontrak Lama
  if (newStartDateObj < oldEndDateObj) {
    const formattedOldDate = oldEndDateObj.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    errors.push(`Tanggal mulai kontrak baru tidak boleh sebelum tanggal berakhir kontrak sebelumnya ${formattedOldDate}.`);
  }
  
  return errors;
};


type StatusOption = { value: string; label: string; disabled?: boolean };
type ContractTypeOption = { value: string; label: string };

interface ValidationErrors {
  new_contract_end_date?: string;
  new_contract_date?: string;
  end_date?: string;
}

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
    contract_sequence?: string;
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

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({});

  // Validation functions
  const validateNewContractEndDate = useCallback((newEndDate: string, oldEndDate: string, newStartDate?: string) => {
    return validateNewContractEndDateFn(newEndDate, oldEndDate, newStartDate);
  }, []);

  const validateNewContractStartDate = useCallback((newStartDate: string, oldEndDate: string) => {
    return validateNewContractStartDateFn(newStartDate, oldEndDate);
  }, []);


  
  const showValidationError = useCallback((errors: string[]) => {
    if (errors.length > 0) {
      errors.forEach(error => {
        addNotification({
          variant: 'error',
          title: 'Validasi Gagal',
          description: error,
        });
      });
      return true;
    }
    return false;
  }, []);

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
      let shouldProceed = true;
      
      // Validasi untuk field yang spesifik - selalu jalankan validasi jika ada value
      if (value) {
        switch (field) {
          case 'new_contract_end_date':
            if (data?.end_date) {
              const errors = validateNewContractEndDate(value, data.end_date, data?.new_contract_date);
              shouldProceed = !showValidationError(errors);
              
              // Update validation errors state
              setValidationErrors(prev => ({
                ...prev,
                new_contract_end_date: errors.length > 0 ? errors[0] : undefined
              }));
            }
            break;
            
          case 'new_contract_date':
            if (data?.end_date) {
              const errors = validateNewContractStartDate(value, data.end_date);
              shouldProceed = !showValidationError(errors);
              
              // Update validation errors state
              setValidationErrors(prev => ({
                ...prev,
                new_contract_date: errors.length > 0 ? errors[0] : undefined
              }));
            }
            break;
            
        }
      }
      
      
      // SELALU kirim value ke parent component untuk field tanggal kontrak, 
      // agar parent bisa melakukan validasi lengkap
      if (onChange && (field === 'new_contract_end_date' || field === 'new_contract_date')) {
        onChange(field, value);
      } else if (shouldProceed && onChange) {
        // Untuk field lain, hanya kirim jika validasi berhasil
        onChange(field, value);
      }
      
      // Logic existing untuk field lain
      if (field === 'renewal_status_name') {
        const selectedOption = statusOptions.find((opt) => opt.value === value);
        const label = selectedOption ? selectedOption.label : value;
        setChangeTypeName(label);
      }
      if (field === 'contract_type_id') {
        const selectedOption = effectiveContractTypeOptions.find((opt) => opt.value === value);
        const label = selectedOption ? selectedOption.label : value;
        // Update contract_type_name when contract_type_id changes
        if (onChange) {
          onChange('contract_type_name', label);
        }
      }
    },
    [onChange, statusOptions, setChangeTypeName, effectiveContractTypeOptions, isEditing, data, validateNewContractEndDate, validateNewContractStartDate, showValidationError]
  );

  const processedStatusOptions = useMemo(() => {
    // const options = statusOptions.length > 0 ? statusOptions : [
    //   { label: 'Diperpanjang Tetap', value: 'Diperpanjang Tetap' },
    //   { label: 'Diperpanjang Berubah', value: 'Diperpanjang Berubah' },
    //   { label: 'Sedang diproses', value: 'Sedang diproses', disabled: true },
    //   { label: 'Menunggu diproses', value: 'Menunggu diproses', disabled: true },
    //   { label: 'Ditolak', value: 'Ditolak', disabled: true },
    // ];
    const options = [
      { label: 'Diperpanjang Tetap', value: 'Diperpanjang Tetap' },
      { label: 'Diperpanjang Berubah', value: 'Diperpanjang Berubah' },
      { label: 'Sedang diproses', value: 'Sedang diproses', disabled: true },
      { label: 'Menunggu diproses', value: 'Menunggu diproses', disabled: true },
      { label: 'Ditolak', value: 'Ditolak', disabled: true },
    ];

    return options.map(option => {
      // Only allow "Diperpanjang Tetap" and "Diperpanjang Berubah" to be selectable
      const isSelectable = 
        option.label === 'Diperpanjang Tetap' || 
        option.label === 'Diperpanjang Berubah';
        
      return { 
        ...option, 
        disabled: !isSelectable 
      };
    });
  }, [statusOptions]);

  const showAllDetailFields = useMemo(() => {
    return !showLimitedFields && shouldShowAllDetailFields();
  }, [showLimitedFields, shouldShowAllDetailFields]);


  return {
    isEditing,
    data,
    effectiveContractTypeOptions,
    processedStatusOptions,
    handleInputChange,
    showAllDetailFields,
    validationErrors,
  };
}
