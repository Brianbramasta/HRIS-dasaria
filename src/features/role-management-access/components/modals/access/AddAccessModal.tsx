import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { IconPlus, IconHapus } from '@/icons/components/icons';
import { useAddAccessModal } from '../../../hooks/modals/access/useAddAccessModal';

interface AddAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAccessModal({ isOpen, onClose }: AddAccessModalProps) {
  const {
    items,
    handleAddRow,
    handleRemoveRow,
    handleFieldChange,
    handleSubmit,
  } = useAddAccessModal(isOpen, onClose);

  const content = (
    <div className="space-y-4 px-1">
      {items.map((item, index) => (
        <div key={item.id} className="space-y-3 pb-4 border-b last:border-b-0">
          <div className="flex items-end gap-3">
            <div className="flex-grow">
              <InputField
                label="Nama Akses"
                placeholder="Masukkan nama akses"
                value={item.akses}
                onChange={(e) => handleFieldChange(item.id, 'akses', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="mb-[2px]">
              {index === 0 ? (
                <button
                  onClick={handleAddRow}
                  className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-success-500 hover:bg-success-600"
                  type="button"
                >
                  <IconPlus size={20} color="white" />
                </button>
              ) : (
                <button
                  onClick={() => handleRemoveRow(item.id)}
                  className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-error-500 hover:bg-error-600"
                  type="button"
                >
                  <IconHapus color="white" />
                </button>
              )}
            </div>
          </div>
          <div>
            <InputField
              label="Kode"
              placeholder="Kode"
              value={item.code}
              disabled
              className="w-full"
            />
          </div>
          <TextAreaField
            label="Catatan"
            placeholder="Detail Catatan..."
            value={item.deskripsi}
            onChange={(e) => handleFieldChange(item.id, 'deskripsi', e)}
            className="w-full"
            rows={4}
          />
        </div>
      ))}
    </div>
  );

  return (
    <ModalAddEdit
      title="Tambah Akses"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-[700px]"
    />
  );
}
