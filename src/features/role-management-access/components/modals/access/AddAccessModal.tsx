import { Modal } from '@/components/ui/modal';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import Button from '@/components/ui/button/Button';
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6"
      showCloseButton={false}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Tambah Akses
        </h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
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
              <div >
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
