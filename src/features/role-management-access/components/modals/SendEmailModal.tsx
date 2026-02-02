import React from 'react';
import ModalAddEdit from '../../../../components/shared/modal/ModalAddEdit';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (user: any) => void;
    isLoading?: boolean;
}

const IconBlueEnvelope = () => (
    <svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="18" width="80" height="50" rx="8" fill="#007AFF" />
        <path d="M3 18L43 48L83 18" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SendEmailModal: React.FC<SendEmailModalProps> = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
    return (
        <ModalAddEdit
            isOpen={isOpen}
            onClose={onClose}
            handleSubmit={() => onSubmit({})}
            submitting={isLoading}
            confirmTitleButton="Kirim Email"
            closeTitleButton="Tutup"
            maxWidth="max-w-[500px]"
            content={
                <div className="flex flex-col items-center justify-center pt-4">
                    <div className="mb-6">
                        <IconBlueEnvelope />
                    </div>
                    <p className="text-xl font-bold text-center text-gray-900 dark:text-white leading-relaxed px-4">
                        Apakah ingin mengirimkan detail akun ke Email berikut?
                    </p>
                </div>
            }
        />
    );
};

export default SendEmailModal;
