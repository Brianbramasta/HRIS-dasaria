import React from 'react';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import { Link as LinkIcon, FileText } from 'react-feather';

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
      <div className="space-y-6 p-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resign Karyawan</h2>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Bagikan Tautan */}
          <Button onClick={onShareLink} variant="primary" className="w-full flex items-center justify-center gap-2 py-3">
            <LinkIcon size={18} />
            Bagikan Tautan
          </Button>

          {/* Form Resign */}
          <Button onClick={onFormResign} variant="outline" className="w-full flex items-center justify-center gap-2 py-3">
            <FileText size={18} />
            Form Resign
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ResignKaryawanModal;