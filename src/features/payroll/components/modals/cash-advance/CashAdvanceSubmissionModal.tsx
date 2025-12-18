// Dokumentasi: Komponen modal "Pengajuan Kasbon" berisi aksi Bagikan dan Form Kasbon
import React from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';

interface PengajuanKasbonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareLink: () => void;
  onFormKasbon: () => void;
}

export const PengajuanKasbonModal: React.FC<PengajuanKasbonModalProps> = ({
  isOpen,
  onClose,
  onShareLink,
  onFormKasbon,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true} className="max-w-md">
      <div className="space-y-6 p-8 px-[90px]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#006896] dark:text-white">Pengajuan Kasbon</h2>
        </div>

        <div className="space-y-3">
          <Button onClick={onShareLink} variant="primary" className="w-full flex items-center justify-center gap-2 py-3">
            <img src="/images/icons/share.svg" alt="Bagikan" className="w-5 h-5" />
            Bagikan form
          </Button>

          <Button onClick={onFormKasbon} variant="outline" className="w-full flex items-center justify-center gap-2 py-3">
            <img src="/images/icons/note.svg" alt="Form Kasbon" className="w-5 h-5" />
            Form Kasbon
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PengajuanKasbonModal;
