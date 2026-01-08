import { useModalContract } from '@/features/employee/hooks/employee-data/detail/contract/useModalContract';
import type { ContractEntry } from '@/features/employee/hooks/employee-data/detail/contract/useContract';

interface UseDetailContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
}

export function useDetailContractModal({
  isOpen,
  initialData,
}: UseDetailContractModalProps) {
  const {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    isLoadingDropdowns,
  } = useModalContract({
    isOpen,
    initialData,
    isEditable: false,
  });

  const handleInput = () => {};
  const handleDateChange = () => () => {};
  const handleSubmit = () => {};
  const handleFileChangeWrapper = () => {};

  return {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleSubmit,
    handleFileChangeWrapper,
    isReadonly: true,
    showStatusBerakhir: true,
    title: 'Detail Kontrak',
  };
}

export default useDetailContractModal;
