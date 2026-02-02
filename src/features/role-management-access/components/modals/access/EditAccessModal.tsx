import { Modal } from '@/components/ui/modal';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import Button from '@/components/ui/button/Button';
import { useEditAccessModal } from '../../../hooks/modals/access/useEditAccessModal';
import type { AccessData } from '../../../hooks/useAccessDetail';

interface EditAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AccessData | null;
}

export default function EditAccessModal({ isOpen, onClose, data }: EditAccessModalProps) {
  const {
    akses,
    code,
    deskripsi,
    fitur,
    handleAksesChange,
    handleCodeChange,
    handleDeskripsiChange,
    handleFiturChange,
    handleSubmit,
  } = useEditAccessModal(isOpen, onClose, data);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6"
      showCloseButton={false}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Ubah Akses
        </h2>

        <div className="space-y-4 px-1">
          <InputField
            label="Nama Akses"
            placeholder="Masukkan nama akses"
            value={akses}
            onChange={(e) => handleAksesChange(e.target.value)}
            className="w-full"
          />
          <InputField
            label="Kode"
            disabled
            placeholder="Masukkan kode"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full"
          />
          <TextAreaField
            label="Catatan"
            placeholder="Detail Catatan..."
            value={deskripsi}
            onChange={(e) => handleDeskripsiChange(e)}
            className="w-full"
            rows={4}
          />
          <InputField
            label="Fitur"
            placeholder="Masukkan nama fitur"
            value={fitur}
            onChange={(e) => handleFiturChange(e.target.value)}
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
