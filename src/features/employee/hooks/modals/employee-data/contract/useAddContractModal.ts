import { useModalContract } from '@/features/employee/hooks/employee-data/detail/contract/useModalContract';
import type { ContractEntry } from '@/features/employee/types/dto/ContractType';
import { addNotification } from '@/stores/notificationStore';

interface UseAddContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onSubmit: (data: ContractEntry) => void;
  onFileChange?: (file: File | null) => void;
  employeeJoinDate?: string;
}

export function useAddContractModal({
  isOpen,
  initialData,
  onSubmit,
  onFileChange,
  employeeJoinDate,
}: UseAddContractModalProps) {
  const {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    optionsJenisKontrak,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChange,
    validation,
    getFieldError,
  } = useModalContract({
    isOpen,
    initialData,
    isEditable: true,
    employeeJoinDate,
  });

  const handleFileChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = handleFileChange(e, 'fileName');
    onFileChange?.(file);
  };

  const handleSubmit = () => {
    // Check validation before submit
    if (!validation.isValid) {
      // Show notification for validation errors
      const errorMessages = validation.errors.map(err => err.message).join(', ');
      addNotification({
        variant: 'error',
        title: 'Validasi Gagal',
        description: errorMessages || 'Periksa kembali data yang Anda masukkan.',
      });
      return;
    }

    onSubmit(form);
  };

  return {
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
    isReadonly: false,
    showStatusBerakhir: false,
    title: 'Tambah Kontrak',
  };
}

export default useAddContractModal;
