import { Modal } from '@/components/ui/modal';
import InputField from '@/components/shared/field/InputField';
import Button from '@/components/ui/button/Button';
import { useEditServiceModal } from '../../../hooks/modals/service/useEditServiceModal';
import { LayananData } from '../../../hooks/useRoleManagement';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LayananData | null;
  onSuccess?: () => void;
}

export default function EditServiceModal({ isOpen, onClose, data, onSuccess }: EditServiceModalProps) {
  const {
    serviceName,
    handleServiceChange,
    handleSubmit,
  } = useEditServiceModal(isOpen, onClose, data, onSuccess);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6"
      showCloseButton={false}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Ubah Layanan
        </h2>

        <div className="space-y-4 px-1">
          <InputField
            label="Nama Sistem Layanan"
            placeholder="Masukkan nama layanan"
            value={serviceName}
            onChange={(e) => handleServiceChange(e.target.value)}
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
