import { useModalContract } from '@/features/employee/hooks/employee-data/detail/contract/useModalContract';
import type { ContractEntry } from '@/features/employee/hooks/employee-data/detail/contract/useContract';

interface UseEditContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onSubmit: (data: ContractEntry) => void;
  onFileChange?: (file: File | null) => void;
}

export function useEditContractModal({
  isOpen,
  initialData,
  onSubmit,
  onFileChange,
}: UseEditContractModalProps) {
  const {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    optionsJenisKontrak,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChange,
  } = useModalContract({
    isOpen,
    initialData,
    isEditable: true,
    isEditStatusBerakhir: true,
  });

  const handleFileChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = handleFileChange(e, 'dokumenBerakhir');
    onFileChange?.(file);
  };

  const handleSubmit = () => {
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
    isReadonly: true,
    showStatusBerakhir: true,
    isEditStatusBerakhir: true,
    title: 'Edit Kontrak',
  };
}

export default useEditContractModal;
