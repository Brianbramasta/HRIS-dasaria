import React from 'react';
import ModalDelete from '@/components/shared/modal/ModalDelete';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import useRejectionConfirmationKontrakModal from '@/features/employee/hooks/modals/contract-renewal/useRejectionConfirmationKontrakModal';

interface KonfirmasiPenolakanKontrakProps {
  isOpen: boolean;
  onClose: () => void;
  idKaryawan: string;
  nama: string;
  onSubmit?: (alasanPenolakan: string) => Promise<void>;
}

const KonfirmasiPenolakanKontrak: React.FC<KonfirmasiPenolakanKontrakProps> = ({
  isOpen,
  onClose,
  idKaryawan,
  nama,
  onSubmit,
}) => {
  const { alasanPenolakan, setAlasanPenolakan, submitting, handleSubmit, handleClose } =
    useRejectionConfirmationKontrakModal({ onClose, onSubmit });

  const modalContent = (
    <div className="space-y-4 ">
        <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                NIP
                </label>
                <InputField
                type="text"
                value={idKaryawan}
                disabled={true}
                className="w-full"
                />
            </div>

            <div className="space-y-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nama
                </label>
                <InputField
                type="text"
                value={nama}
                disabled={true}
                className="w-full"
                />
            </div>
        </div>

      <div className=''>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Alasan Penolakan <span className="text-red-500">*</span>
        </label>
        <TextArea
          placeholder="Enter as description ..."
          rows={5}
          value={alasanPenolakan}
          onChange={(value) => setAlasanPenolakan(value)}
          required={true}
          error={!alasanPenolakan.trim() && submitting}
        />
      </div>

      <p className="text-sm text-red-600">
        *Harap memberikan alasan penolakan perpanjangan kontrak.
      </p>
    </div>
  );

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={handleClose}
      content={modalContent}
      handleDelete={handleSubmit}
      submitting={submitting}
      confirmTitleButton="Simpan"
      closeTitleButton="Tutup"
      title="Konfirmasi Penolakan Kontrak"
      isAlert={false}
      maxWidth="max-w-xl"
    />
  );
};

export default KonfirmasiPenolakanKontrak;
