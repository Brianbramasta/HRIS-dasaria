import React from 'react';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import { CheckCircle } from 'react-feather';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToHome: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onBackToHome,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      className="max-w-md"
    >
      <div className="space-y-6 p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pendaftaran Selesai
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          "Terima kasih telah mengisi formulir pendaftaran. Proses pendaftaran
          Anda telah selesai dan saat ini dalam antrian untuk direview oleh tim
          HR."
        </p>

        {/* Button */}
        <Button
          onClick={onBackToHome}
          variant="primary"
          className="w-full py-3"
        >
          Back to Homepage
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
