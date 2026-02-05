import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
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

  const content = (
    <div className="space-y-4 px-1">
      <InputField
        label="Nama Fitur"
        placeholder="Masukkan nama fitur"
        value={featureName}
        onChange={(e) => handleFeatureChange(e.target.value)}
        className="w-full"
      />
    </div>
  );

  return (
    <ModalAddEdit
      title="Ubah Fitur"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-[700px]"
    />
  );
}
