import { useModalContract } from '@/features/employee/hooks/employee-data/detail/contract/useModalContract';
import type { ContractEntry } from '@/features/employee/hooks/employee-data/detail/contract/useContract';

interface UseAddContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onSubmit: (data: ContractEntry) => void;
  onFileChange?: (file: File | null) => void;
}

export function useAddContractModal({
  isOpen,
  initialData,
  onSubmit,
  onFileChange,
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
  } = useModalContract({
    isOpen,
    initialData,
    isEditable: true,
  });

  const handleFileChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = handleFileChange(e, 'fileName');
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
    isReadonly: false,
    showStatusBerakhir: false,
    title: 'Tambah Kontrak',
  };
}

export default useAddContractModal;
