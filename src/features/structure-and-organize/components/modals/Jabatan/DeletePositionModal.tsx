import { useState } from "react";
// import { Modal } from "../../../../../components/ui/modal/index";
import { positionsService } from "../../../services/request/positions.service";
import type { PositionListItem } from "../../../types/organization.api.types";
import { useFileStore, /*setSkFile*/ } from '@/stores/fileStore';
import { addNotification } from "@/stores/notificationStore";
import ModalDelete from "../shared/modal/ModalDelete";
import ModalDeleteContent from "../shared/modal/ModalDeleteContent";


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
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // setSkFile(e.target.files[0]);
      console.log(skFile)
    }
  };

  const handleDelete = async () => {
    if (!position) return;
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await positionsService.delete(position.id, { memoNumber: memoNumber.trim(), skFile: skFile?.file });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete position:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <ModalDelete 
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={isLoading}
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
