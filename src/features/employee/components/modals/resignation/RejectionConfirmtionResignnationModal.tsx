import { useState, useEffect } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { AlertTriangle } from 'react-feather';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  submitting: boolean;
  nip: string;
  namaLengkap: string;
}

export default function RejectionConfirmtionResignnationModal({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  nip,
  namaLengkap,
}: Props) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isOpen) setNote('');
  }, [isOpen]);

  return (
    <ModalAddEdit
      title="Konfirmasi Penolakan Pengunduran Diri"
      isOpen={isOpen}
      onClose={onClose}
      submitting={submitting}
      handleSubmit={() => onSubmit(note)}
      maxWidth="max-w-3xl"
      confirmTitleButton="Simpan"
      closeTitleButton="Tutup"
      titleAlign="center"
      content={
        <div className="space-y-5">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <AlertTriangle className="text-red-500" size={36} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField label="NIP" value={nip} disabled />
            <InputField label="Nama" value={namaLengkap} disabled />
          </div>
          <TextAreaField
            label="Catatan"
            placeholder="Enter as description ..."
            rows={5}
            value={note}
            onChange={(e) => setNote(e)}
            required
          />
          <div className="text-xs text-red-500">
            *Harap memberikan alasan penolakan perpanjangan kontrak.
          </div>
        </div>
      }
    />
  );
}

