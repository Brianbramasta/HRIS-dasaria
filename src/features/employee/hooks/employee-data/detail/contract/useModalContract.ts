import { useState, useEffect } from 'react';
import { getContractStatusDropdownOptions, getContractEndStatusDropdownOptions, getContractTypeDropdownOptions } from './useContract';
import type { ContractEntry } from './useContract';

export interface ModalContractOptions {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  isEditable?: boolean;
  isEditStatusBerakhir?: boolean;
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
}

const emptyForm: ContractEntry = {
  full_name: '',
  contract_status_id: '',
  last_contract_signed_date: '',
  end_date: '',
  contract_type: '',
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
export function useModalContract({ isOpen, initialData, isEditable = true }: ModalContractOptions): UseModalContractReturn {
  const [form, setForm] = useState<ContractEntry>(emptyForm);
  const [optionsContractStatus, setContractStatus] = useState<{ label: string; value: string }[]>([]);
  const [optionsContractEndStatus, setOptionsContractEndStatus] = useState<{ label: string; value: string }[]>([]);
  const [optionsJenisKontrak, setOptionsJenisKontrak] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Load dropdowns when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setIsLoadingDropdowns(true);

    const loadDropdowns = async () => {
      try {
        const [statusOptions, endStatusOptions, jenisKontrakOptions] = await Promise.all([
          getContractStatusDropdownOptions(),
          getContractEndStatusDropdownOptions(),
          getContractTypeDropdownOptions(),
        ]);

        if (mounted) {
          setContractStatus(statusOptions);
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

  // Set form data after dropdowns are loaded
  useEffect(() => {
    if (!isLoadingDropdowns) {
      if (initialData) {
        setForm({
          ...emptyForm,
          ...initialData,
        });
      } else {
        setForm(emptyForm);
      }
      console.log('Initial Data:', initialData);
    }
  }, [initialData, isOpen, isLoadingDropdowns]);

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
    
    if (selectedDates.length > 0) {
      const date = selectedDates[0];
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      handleInput(key, isoDate);
    } else {
      handleInput(key, '');
    }
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
   * Reset form ke state awal
   */
  const resetForm = (data?: ContractEntry) => {
    if (data) {
      setForm({
        ...emptyForm,
        ...data,
      });
    } else {
      setForm(emptyForm);
    }
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
  };
}

export default useModalContract;
