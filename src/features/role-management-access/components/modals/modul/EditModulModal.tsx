import { Modal } from '@/components/ui/modal';
import InputField from '@/components/shared/field/InputField';
import Button from '@/components/ui/button/Button';
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6"
      showCloseButton={false}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Ubah Modul
        </h2>

        <div className="space-y-4 px-1">
          <InputField
            label="Nama Modul"
            placeholder="Masukkan nama modul"
            value={modulName}
            onChange={(e) => handleModulChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={handleSubmit}>
            Simpan
          </Button>
        </div>
      </div>
    </Modal>
  );
}
