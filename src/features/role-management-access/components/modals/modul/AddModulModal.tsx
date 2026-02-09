import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import { IconPlus, IconHapus } from '@/icons/components/icons';
import { useAddModulModal } from '../../../hooks/modals/modul/useAddModulModal';

interface AddModulModalProps {
  isOpen: boolean;
  onClose: () => void;
  appsId?: string;
  onSuccess?: () => void;
}

export default function AddModulModal({ isOpen, onClose, appsId, onSuccess }: AddModulModalProps) {
  const {
    moduls,
    handleAddModul,
    handleRemoveModul,
    handleModulChange,
    handleSubmit,
    loading,
  } = useAddModulModal(isOpen, onClose, appsId, onSuccess);

  const content = (
    <div className="space-y-4 px-1">
      {moduls.map((modul, index) => (
        <div key={modul.id} className="flex items-end gap-3">
          <div className="flex-grow">
            <InputField
              label="Nama Modul"
              placeholder="Masukkan nama modul"
              value={modul.name}
              onChange={(e) => handleModulChange(modul.id, e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-[2px]">
            {index === 0 ? (
              <button
                onClick={handleAddModul}
                className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-success-500 hover:bg-success-600"
                type="button"
              >
                <IconPlus size={20} color="white" />
              </button>
            ) : (
              <button
                onClick={() => handleRemoveModul(modul.id)}
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
  );

  return (
    <ModalAddEdit
      title="Tambah Modul"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={loading}
      maxWidth="max-w-[700px]"
    />
  );
}
