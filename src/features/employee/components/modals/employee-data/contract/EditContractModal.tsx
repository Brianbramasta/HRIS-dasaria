import React, { useEffect, useState } from 'react';
import BaseContractModal, { type ContractEntry } from './BaseModal';
import { getContractStatusDropdownOptions, getContractEndStatusDropdownOptions } from '@/features/employee/hooks/employee-data/detail/useContract';

interface EditContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onClose: () => void;
  onSubmit: (data: ContractEntry) => void;
  submitting?: boolean;
  onFileChange?: (file: File | null) => void;
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
  catatan: '',
  dokumenBerakhir: '',
};

const EditContractModal: React.FC<EditContractModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  submitting = false,
  onFileChange,
}) => {
  const [form, setForm] = useState<ContractEntry>(emptyForm);
  const [optionsContractStatus, setContractStatus] = useState<{ label: string; value: string }[]>([]);
  const [optionsContractEndStatus, setOptionsContractEndStatus] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Load dropdowns when modal opens
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
    }
  }, [initialData, isOpen, isLoadingDropdowns]);

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
    const file = e.target.files?.[0];
    if (file) {
      handleInput('dokumenBerakhir', file.name);
      onFileChange?.(file);
    } else {
      onFileChange?.(null);
    }
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <BaseContractModal
      isOpen={isOpen}
      title="Edit Kontrak"
      form={form}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
      isReadonly={false}
      optionsContractStatus={optionsContractStatus}
      optionsContractEndStatus={optionsContractEndStatus}
      onInputChange={handleInput}
      onDateChange={handleDateChange}
      onFileChange={handleFileChange}
      showStatusBerakhir={true}
      isLoading={isLoadingDropdowns}
    />
  );
};

export default EditContractModal;
