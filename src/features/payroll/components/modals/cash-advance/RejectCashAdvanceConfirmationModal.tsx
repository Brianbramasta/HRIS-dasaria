import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useRejectCashAdvanceModal } from '@/features/payroll/hooks/modals/cash-advance/useRejectCashAdvanceModal';

interface RejectCashAdvanceConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    data?: {
        loanId: string;
        nip: string;
        nama: string;
        bulanMulaiPotongan?: string;
        tanggalPencairan?: string;
    };
}

export const RejectCashAdvanceConfirmationModal: React.FC<RejectCashAdvanceConfirmationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    data,
}) => {
    const { rejectionReason, setRejectionReason, handleSubmit, loading } = useRejectCashAdvanceModal({
        isOpen,
        loanId: data?.loanId,
        onSuccess,
        onClose,
    });

    const modalContent = (
        <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center">
                    <svg width="60" height="54" viewBox="0 0 60 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 0L59.4442 51H0.555771L30 0Z" fill="#EF4444" />
                        <path d="M30 18V36" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <path d="M30 42H30.03" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                Konfirmasi Penolakan Kasbon
            </h2>

            {/* Form Fields */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-left">
                    <InputField
                        label="NIP"
                        value={data?.nip || ''}
                        disabled
                        containerClassName="w-full"
                        labelClassName="text-sm font-semibold mb-1"
                    />
                    <InputField
                        label="Nama"
                        value={data?.nama || ''}
                        disabled
                        containerClassName="w-full"
                        labelClassName="text-sm font-semibold mb-1"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                    <InputField
                        label="Bulan Mulai Potongan"
                        value={data?.bulanMulaiPotongan || '—'}
                        disabled
                        containerClassName="w-full"
                        labelClassName="text-sm font-semibold mb-1 text-[#475467]"
                    />
                    <InputField
                        label="Tanggal Pencairan"
                        value={data?.tanggalPencairan || '—'}
                        disabled
                        containerClassName="w-full"
                        labelClassName="text-sm font-semibold mb-1 text-[#475467]"
                    />
                </div>

                <TextAreaField
                    label="Alasan Penolakan (Wajib Diisi)"
                    placeholder="Enter as description ..."
                    value={rejectionReason}
                    onChange={(val) => setRejectionReason(val)}
                    required
                    rows={5}
                    containerClassName="w-full"
                    labelClassName="text-sm font-semibold mb-1"
                />

                <p className="text-sm text-red-500 font-medium pt-2">
                    *Harap memberikan alasan penolakan perpanjangan kontrak.
                </p>
            </div>
        </div>
    );

    return (
        <ModalAddEdit
            isOpen={isOpen}
            onClose={onClose}
            title={null} // Title is handled inside content for custom layout
            content={modalContent}
            handleSubmit={handleSubmit}
            submitting={loading}
            maxWidth="max-w-2xl"
            confirmTitleButton="Simpan"
            closeTitleButton="Tutup"
        />
    );
};

export default RejectCashAdvanceConfirmationModal;
