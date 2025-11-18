import React from 'react';
import { Modal } from '../../../../components/ui/modal';
import Button from '../../../../components/ui/button/Button';
// import { Plus, Upload } from 'react-feather';

interface AddKaryawanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManual: () => void;
  onImportFile: () => void;
}

export const AddKaryawanModal: React.FC<AddKaryawanModalProps> = ({
  isOpen,
  onClose,
  onAddManual,
  onImportFile,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      className="max-w-md"
    >
      <div className="space-y-6 p-8 px-[90px]">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#006896] dark:text-white">
            Tambah Karyawan
          </h2>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Registrasi Terima Button */}
          <Button
            onClick={onImportFile}
            variant="custom"
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#006896] text-white"
          >
            <img src="/images/icons/share.svg" alt="Import" className="w-5 h-5" />
            Bagikan Tautan
          </Button>

          {/* Tambah Manual Button */}
          <Button
            onClick={onAddManual}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3"
          >
            <img src="/images/icons/note.svg" alt="Import" className="w-5 h-5" />
            Tambah Manual
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddKaryawanModal;
