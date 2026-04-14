import { useState, useEffect } from 'react';
import { getContractEndStatusDropdownOptions, getContractTypeDropdownOptions } from './useContract';
import type { ContractEntry } from '@/features/employee/types/dto/ContractType';
import { validateContractDates, getErrorMessage, type ValidationResult } from '@/features/employee/utils/contractValidation';

export interface ModalContractOptions {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  isEditable?: boolean;
  isEditStatusBerakhir?: boolean;
  employeeJoinDate?: string;
}

export interface UseModalContractReturn {
  form: ContractEntry;
  setForm: (form: ContractEntry) => void;
  optionsContractStatus: { label: string; value: string }[];
  optionsContractEndStatus: { label: string; value: string }[];
  optionsJenisKontrak: { label: string; value: string }[];
  isLoadingDropdowns: boolean;
  handleInput: (key: keyof ContractEntry, value: any) => void;
  handleDateChange: (key: keyof ContractEntry) => (selectedDates: Date[]) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileFieldName?: string) => File | null;
  resetForm: (data?: ContractEntry) => void;
  validation: ValidationResult;
  getFieldError: (field: 'start_date' | 'end_date') => string | null;
}

const emptyForm: ContractEntry = {
  full_name: '',
  contract_status: 'Aktif',
  last_contract_signed_date: '',
  end_date: '',
  contract_type_id: '',
  contract_type_name: '',
  contract_number: 0,
  contract_end_status_id: '',
  deskripsi: '',
  note: '',
  dokumenBerakhir: '',
};

/**
 * Hook untuk mengelola state dan handlers semua contract modals
 * Digunakan oleh AddContractModal, EditContractModal, dan DetailContractModal
 */
export function useModalContract({ isOpen, initialData, isEditable = true, employeeJoinDate }: ModalContractOptions): UseModalContractReturn {
  const [form, setForm] = useState<ContractEntry>(emptyForm);
  const [optionsContractStatus, setContractStatus] = useState<{ label: string; value: string }[]>([]);
  const [optionsContractEndStatus, setOptionsContractEndStatus] = useState<{ label: string; value: string }[]>([]);
  const [optionsJenisKontrak, setOptionsJenisKontrak] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] });

  // Load dropdowns when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setIsLoadingDropdowns(true);

    const loadDropdowns = async () => {
      try {
        const [endStatusOptions, jenisKontrakOptions] = await Promise.all([
          getContractEndStatusDropdownOptions(),
          getContractTypeDropdownOptions(),
        ]);

        if (mounted) {
          setContractStatus([
            { label: 'Aktif', value: 'Aktif' },
            { label: 'Tidak Aktif', value: 'Tidak Aktif' },
          ]);
          setOptionsContractEndStatus(endStatusOptions);
          setOptionsJenisKontrak(jenisKontrakOptions);
        }
      } catch (error) {
        console.error('Error loading dropdowns:', error);
      } finally {
        if (mounted) {
          setIsLoadingDropdowns(false);
        }
      }
    };

    loadDropdowns();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Reset validation when modal closes
  useEffect(() => {
    if (!isOpen) {
      setValidation({ isValid: true, errors: [] });
    }
  }, [isOpen]);

  // Set form data after dropdowns are loaded
  useEffect(() => {
    if (!isLoadingDropdowns) {
      if (initialData) {
        setForm({
          ...emptyForm,
          ...initialData,
          employee_join_date: employeeJoinDate || '',
        });
      } else {
        setForm({
          ...emptyForm,
          employee_join_date: employeeJoinDate || '',
        });
      }
      //console.log('Initial Data:', initialData);
    }
  }, [initialData, isOpen, isLoadingDropdowns, employeeJoinDate]);

  /**
   * Handle input change untuk form fields
   */
  const handleInput = (key: keyof ContractEntry, value: any) => {
    if (!isEditable) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Handle date change dari date picker
   */
  const handleDateChange = (key: keyof ContractEntry) => (selectedDates: Date[]) => {
    if (!isEditable) return;
    
    let newDate = '';
    if (selectedDates.length > 0) {
      const date = selectedDates[0];
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      newDate = `${year}-${month}-${day}`;
    }
    
    // Update form first
    setForm((prev) => ({ ...prev, [key]: newDate }));
    
    // Trigger validation after date change
    setTimeout(() => {
      const updatedForm = { ...form, [key]: newDate };
      const validationResult = validateContractDates(
        updatedForm.last_contract_signed_date,
        updatedForm.end_date,
        updatedForm.employee_join_date || ''
      );
      setValidation(validationResult);
    }, 0);
  };

  /**
   * Handle file change dari file input
   * @param e File input change event
   * @param fileFieldName Nama field untuk menyimpan nama file (default: 'fileName')
   * @returns File object atau null
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileFieldName: string = 'fileName'): File | null => {
    if (!isEditable) return null;
    
    const file = e.target.files?.[0];
    if (file) {
      handleInput(fileFieldName as keyof ContractEntry, file.name);
      return file;
    } else {
      handleInput(fileFieldName as keyof ContractEntry, '');
      return null;
    }
  };

  /**
   * Get error message for a specific field
   */
  const getFieldError = (field: 'start_date' | 'end_date'): string | null => {
    return getErrorMessage(validation, field);
  };

  /**
   * Reset form ke state awal
   */
  const resetForm = (data?: ContractEntry) => {
    if (data) {
      setForm({
        ...emptyForm,
        ...data,
        employee_join_date: employeeJoinDate || '',
      });
    } else {
      setForm({
        ...emptyForm,
        employee_join_date: employeeJoinDate || '',
      });
    }
    // Reset validation
    setValidation({ isValid: true, errors: [] });
  };

  return {
    form,
    setForm,
    optionsContractStatus,
    optionsContractEndStatus,
    optionsJenisKontrak,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChange,
    resetForm,
    validation,
    getFieldError,
  };
}

export default useModalContract;
