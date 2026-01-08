import { useEffect, useMemo, useState } from 'react';
import { getContractStatusDropdownOptions, getContractEndStatusDropdownOptions } from '@/features/employee/hooks/employee-data/detail/contract/useContract';

export type ContractEntry = {
  id?: string;
  full_name: string;
  contract_status_id: string;
  contract_status_name?: string;
  last_contract_signed_date: string;
  end_date: string;
  contract_type: string;
  contract_number: number;
  contract_end_status_id?: string;
  contract_end_status_name?: string;
  deskripsi?: string;
  fileName?: string;
  file_contract?: string;
  catatan?: string;
  dokumenBerakhir?: string;
  lamaBekerja?: string;
};

const emptyForm: ContractEntry = {
  full_name: '',
  contract_status_id: '',
  last_contract_signed_date: '',
  end_date: '',
  contract_type: '',
  contract_number: 0,
  contract_end_status_id: '',
  deskripsi: '',
  catatan: '',
  dokumenBerakhir: '',
};

interface UseContractModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: ContractEntry | null;
  showStatusBerakhir?: boolean;
  onFileChange?: (file: File | null) => void;
}

export function useContractModal({
  isOpen,
  mode,
  initialData,
  showStatusBerakhir = false,
  onFileChange,
}: UseContractModalProps) {
  const [form, setForm] = useState<ContractEntry>(emptyForm);
  const title = useMemo(() => (mode === 'add' ? 'Tambah Kontrak' : 'Edit Kontrak'), [mode]);
  const [optionsContractStatus, setContractStatus] = useState<{ label: string; value: string }[]>([]);
  const [optionsContractEndStatus, setOptionsContractEndStatus] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setIsLoadingDropdowns(true);

    const loadDropdowns = async () => {
      try {
        const employeeStatusOptions = await getContractStatusDropdownOptions();
        if (mounted) {
          setContractStatus(employeeStatusOptions);
        }
        const contractEndStatusOptions = await getContractEndStatusDropdownOptions();
        if (mounted) {
          setOptionsContractEndStatus(contractEndStatusOptions);
        }
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

  useEffect(() => {
    if (!isLoadingDropdowns) {
      if (initialData && mode === 'edit') {
        setForm({
          ...emptyForm,
          ...initialData,
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [initialData, isOpen, isLoadingDropdowns, mode]);

  const handleInput = (key: keyof ContractEntry, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (key: keyof ContractEntry) => (selectedDates: Date[]) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      handleInput('fileName', file.name);
      onFileChange?.(file);
    } else {
      onFileChange?.(null);
    }
  };

  return {
    form,
    title,
    optionsContractStatus,
    optionsContractEndStatus,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChange,
    showStatusBerakhir,
    mode,
  };
}

export default useContractModal;
