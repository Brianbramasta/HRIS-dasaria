import { Modal } from '@/components/ui/modal';
import InputField from '@/components/shared/field/InputField';
import Button from '@/components/ui/button/Button';
import { IconPlus, IconHapus } from '@/icons/components/icons';
import { useAddFeatureModal } from '../../../hooks/modals/feature/useAddFeatureModal';

interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFeatureModal({ isOpen, onClose }: AddFeatureModalProps) {
  const {
    features,
    handleAddFeature,
    handleRemoveFeature,
    handleFeatureChange,
    handleSubmit,
  } = useAddFeatureModal(isOpen, onClose);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6"
      showCloseButton={false}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Tambah Fitur
        </h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          {features.map((feature, index) => (
            <div key={feature.id} className="flex items-end gap-3">
              <div className="flex-grow">
                <InputField
                  label="Nama Fitur"
                  placeholder="Masukkan nama fitur"
                  value={feature.name}
                  onChange={(e) => handleFeatureChange(feature.id, e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="mb-[2px]">
                {index === 0 ? (
                  <button
                    onClick={handleAddFeature}
                    className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-success-500 hover:bg-success-600"
                    type="button"
                  >
                    <IconPlus size={20} color="white" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRemoveFeature(feature.id)}
                    className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-error-500 hover:bg-error-600"
                    type="button"
                  >
                    <IconHapus color="white" />
                  </button>
                )}
              </div>
            </div>
          ))}
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
