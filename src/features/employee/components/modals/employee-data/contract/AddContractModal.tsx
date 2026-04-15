import React from "react";
import BaseContractModal, { type ContractEntry } from "./BaseModal";
import { useAddContractModal } from "@/features/employee/hooks/modals/employee-data/contract/useAddContractModal";

interface AddContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onClose: () => void;
  onSubmit: (data: ContractEntry) => void;
  submitting?: boolean;
  onFileChange?: (file: File | null) => void;
  employeeJoinDate?: string;
  employeeId?: string;
}

const AddContractModal: React.FC<AddContractModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSubmit,
  submitting = false,
  onFileChange,
  employeeJoinDate,
  employeeId,
}) => {
  const {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    optionsJenisKontrak,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChangeWrapper,
    handleSubmit,
    validation,
    getFieldError,
    positionValidation,
  } = useAddContractModal({
    isOpen,
    initialData,
    onSubmit,
    onFileChange,
    employeeJoinDate,
    employeeId,
  });

  // Check if all required fields are filled
  const isFormComplete = !!(
    form.contract_status &&
    form.contract_type_id &&
    form.last_contract_signed_date &&
    (form.contract_type_name === 'PKWTT' || form.end_date) &&
    form.fileName
  );

  return (
    <BaseContractModal
      isOpen={isOpen}
      title="Tambah Kontrak"
      form={form}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitting={submitting}
      isReadonly={false}
      optionsContractStatus={optionsContractStatus}
      optionsContractEndStatus={optionsContractEndStatus}
      optionsJenisKontrak={optionsJenisKontrak}
      onInputChange={handleInput}
      onDateChange={handleDateChange}
      onFileChange={handleFileChangeWrapper}
      showStatusBerakhir={false}
      isLoading={isLoadingDropdowns}
      getFieldError={getFieldError}
      validation={validation}
      isFormComplete={isFormComplete && positionValidation.isValid}
      showAlert={isOpen && !positionValidation.isValid}
      alertMessage={positionValidation.errorMessage}
    />
  );
};

export default AddContractModal;
