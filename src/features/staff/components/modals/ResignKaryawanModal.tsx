import React from 'react';
import { Modal } from '../../../../components/ui/modal';
import Button from '../../../../components/ui/button/Button';

interface ResignKaryawanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareLink: () => void;
  onFormResign: () => void;
}

export const ResignKaryawanModal: React.FC<ResignKaryawanModalProps> = ({
  isOpen,
  onClose,
  onShareLink,
  onFormResign,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true} className="max-w-md">
      <div className="space-y-6 p-8 px-[90px]">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#006896] dark:text-white">Resign Karyawan</h2>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Bagikan Tautan */}
          <Button onClick={onShareLink} variant="primary" className="w-full flex items-center justify-center gap-2 py-3">
            <img src="/images/icons/share.svg" alt="Import" className="w-5 h-5" />
            Bagikan Tautan
          </Button>

          {/* Form Resign */}
          <Button onClick={onFormResign} variant="outline" className="w-full flex items-center justify-center gap-2 py-3">
            <img src="/images/icons/note.svg" alt="Import" className="w-5 h-5" />
            Form Resign
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ResignKaryawanModal;