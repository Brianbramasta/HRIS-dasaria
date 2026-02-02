import React from 'react';
import { Modal } from '../../../../components/ui/modal/index';
import Button from '../../../../components/ui/button/Button';

export type ActionType = 'approve' | 'negotiate';

interface ActionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: ActionType;
  isLoading?: boolean;
}

const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  isLoading = false,
}) => {
  // const isApprove = type === 'approve';

  const config = {
    approve: {
      title: "Anda akan menyetujui rekomendasi yang diajukan.",
      confirmLabel: "Setujui",
      cancelLabel: "Batal",
      confirmColor: "bg-[#22C55E] hover:bg-[#16A34A] text-white", // Green-500/600
      icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="30" fill="#22C55E" />
          <path d="M28 41L35 48L52 31" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    negotiate: {
      title: "Apakah anda ingin melakukan negoisasi terkait perpanjangan kontrak ?",
      confirmLabel: "Negoisasi",
      cancelLabel: "Tutup",
      confirmColor: "bg-[#007BFF] hover:bg-[#0056b3] text-white", // Blue
      icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 13.3333H20C16.3181 13.3333 13.3333 16.3181 13.3333 20V60C13.3333 63.6819 16.3181 66.6667 20 66.6667H60C63.6819 66.6667 66.6667 63.6819 66.6667 60V20C66.6667 16.3181 63.6819 13.3333 60 13.3333Z" stroke="#007BFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M53.3333 6.66666V20" stroke="#007BFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26.6667 6.66666V20" stroke="#007BFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3333 33.3333H66.6667" stroke="#007BFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="50" cy="50" r="16" fill="#007BFF" stroke="white" strokeWidth="4"/>
          <path d="M50 44V50H56" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  };

  const currentConfig = config[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-8 max-w-xl w-full rounded-3xl"
      showCloseButton={true}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="flex items-center justify-center">
          {currentConfig.icon}
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white w-full leading-relaxed px-4 m-0">
          {currentConfig.title}
        </h2>

        <div className="flex justify-end gap-3 w-full pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
          >
            {currentConfig.cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${currentConfig.confirmColor}`}
          >
            {isLoading ? "Memproses..." : currentConfig.confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ActionConfirmationModal;
