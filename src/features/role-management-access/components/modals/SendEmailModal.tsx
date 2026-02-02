import React from 'react';
import ModalAddEdit from '../../../../components/shared/modal/ModalAddEdit';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (user: any) => void;
    isLoading?: boolean;
}

const IconBlueEnvelope = () => (
    <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M64.5 13H12.5C8.925 13 6.0325 15.925 6.0325 19.5L6 58.5C6 62.075 8.925 65 12.5 65H64.5C68.075 65 71 62.075 71 58.5V19.5C71 15.925 68.075 13 64.5 13ZM64.5 26L38.5 42.25L12.5 26V19.5L38.5 35.75L64.5 19.5V26Z" fill="#007BFF" />
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
