import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
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

  const content = (
    <div className="space-y-4 px-1">
      <InputField
        label="Nama Akses"
        placeholder="Masukkan nama akses"
        value={akses}
        onChange={(e) => handleAksesChange(e.target.value)}
        className="w-full"
      />
      <InputField
        label="Fitur"
        disabled
        placeholder="Masukkan nama fitur"
        value={fitur}
        onChange={(e) => handleFiturChange(e.target.value)}
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
    </div>
  );

  return (
    <ModalAddEdit
      title="Ubah Akses"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-[700px]"
    />
  );
}
