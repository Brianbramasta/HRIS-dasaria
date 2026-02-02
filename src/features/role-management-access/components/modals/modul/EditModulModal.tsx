import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import { useEditModulModal } from '../../../hooks/modals/modul/useEditModulModal';
import { ModulData } from '../../../hooks/useModulDetail';

interface EditModulModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ModulData | null;
}

export default function EditModulModal({ isOpen, onClose, data }: EditModulModalProps) {
  const {
    modulName,
    handleModulChange,
    handleSubmit,
  } = useEditModulModal(isOpen, onClose, data);

  const content = (
    <div className="space-y-4 px-1">
      <InputField
        label="Nama Modul"
        placeholder="Masukkan nama modul"
        value={modulName}
        onChange={(e) => handleModulChange(e.target.value)}
        className="w-full"
      />
    </div>
  );

  return (
    <ModalAddEdit
      title="Ubah Modul"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-[700px]"
    />
  );
}
