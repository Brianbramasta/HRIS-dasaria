import type { PositionListItem } from "../../../types/OrganizationApiTypes";
import ModalDelete from "../../../../../components/shared/modal/ModalDelete";
import ModalDeleteContent from "../../../../../components/shared/modal/ModalDeleteContent";
import { useDeletePositionModal } from '../../../hooks/modals/job-title/useDeletePositionModal';


type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  position: PositionListItem | null;
};

export const DeletePositionModal = ({
  isOpen,
  onClose,
  onSuccess,
  position,
}: Props) => {
  const {
    memoNumber,
    setMemoNumber,
    skFile,
    submitting,
    handleFileChange,
    handleDelete,
  } = useDeletePositionModal({ isOpen, onClose, onSuccess, position });

  return (
    
    <ModalDelete 
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={
        <ModalDeleteContent
          memoNumber={memoNumber}
          onMemoNumberChange={(e) => setMemoNumber(e.target.value)}
          skFileName={skFile?.name || ''}
          onFileChange={handleFileChange}
        />
      }
      title="Hapus Data Jabatan"
    />
  );
};
