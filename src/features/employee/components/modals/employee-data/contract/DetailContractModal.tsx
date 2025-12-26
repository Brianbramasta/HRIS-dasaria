import React, { useEffect, useState } from 'react';
import BaseContractModal, { type ContractEntry } from './BaseModal';
import { getContractStatusDropdownOptions, getContractEndStatusDropdownOptions } from '@/features/employee/hooks/employee-data/detail/useContract';

interface DetailContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onClose: () => void;
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

const DetailContractModal: React.FC<DetailContractModalProps> = ({
  isOpen,
  initialData,
  onClose,
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

  const handleInput = () => {
    // Read-only mode, do nothing
  };

  const handleDateChange = () => () => {
    // Read-only mode, do nothing
  };

  const handleSubmit = () => {
    // Read-only mode, do nothing
  };

  return (
    <BaseContractModal
      isOpen={isOpen}
      title="Detail Kontrak"
      form={form}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={false}
      isReadonly={true}
      optionsContractStatus={optionsContractStatus}
      optionsContractEndStatus={optionsContractEndStatus}
      onInputChange={handleInput}
      onDateChange={handleDateChange}
      showStatusBerakhir={true}
      isLoading={isLoadingDropdowns}
    />
  );
};

export default DetailContractModal;
