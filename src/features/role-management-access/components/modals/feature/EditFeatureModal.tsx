import { Modal } from '@/components/ui/modal';
import InputField from '@/components/shared/field/InputField';
import Button from '@/components/ui/button/Button';
import { useEditFeatureModal } from '../../../hooks/modals/feature/useEditFeatureModal';
import { FeatureData } from '../../../hooks/useFeatureDetail';

interface EditFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FeatureData | null;
}

export default function EditFeatureModal({ isOpen, onClose, data }: EditFeatureModalProps) {
  const {
    featureName,
    handleFeatureChange,
    handleSubmit,
  } = useEditFeatureModal(isOpen, onClose, data);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6"
      showCloseButton={false}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Ubah Fitur
        </h2>

        <div className="space-y-4 px-1">
          <InputField
            label="Nama Fitur"
            placeholder="Masukkan nama fitur"
            value={featureName}
            onChange={(e) => handleFeatureChange(e.target.value)}
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
