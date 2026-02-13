import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import DateField from '@/components/shared/field/DateField';
import { useSearchScheduleAndDiscountModal } from '@/features/payroll/hooks/modals/cash-advance/useSearchScheduleAndDiscountModal';

interface SearchScheduleAndDiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    data?: {
        loanId: string;
        nip: string;
        namaLengkap: string;
        bulanMulaiPotongan?: string;
        tanggalPencairan?: string;
    };
}

export const SearchScheduleAndDiscountModal: React.FC<SearchScheduleAndDiscountModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    data,
}) => {
    const {
        bulanMulaiPotongan,
        setBulanMulaiPotongan,
        tanggalPencairan,
        setTanggalPencairan,
        handleSubmit,
        loading,
    } = useSearchScheduleAndDiscountModal({
        isOpen,
        loanId: data?.loanId,
        defaultValues: {
            bulanMulaiPotongan: data?.bulanMulaiPotongan,
            tanggalPencairan: data?.tanggalPencairan,
        },
        onSuccess,
        onClose,
    });

    const modalContent = (
        <div className="space-y-5">
            <InputField
                label="NIP"
                value={data?.nip || ''}
                disabled
                containerClassName="w-full"
                labelClassName="text-sm font-semibold mb-1"
            />

            <InputField
                label="Nama Lengkap"
                value={data?.namaLengkap || ''}
                disabled
                containerClassName="w-full"
                labelClassName="text-sm font-semibold mb-1"
            />

            <DateField
                label="Bulan Mulai Potongan"
                placeholder="Pilih Bulan & Tahun"
                containerClassName="w-full"
                labelClassName="text-sm font-semibold mb-1"
                defaultDate={bulanMulaiPotongan}
                onChange={(_, dateStr) => setBulanMulaiPotongan(dateStr || '')}
                view="month"
            />

            <DateField
                label="Tanggal Pencairan"
                placeholder="Pilih Tanggal"
                containerClassName="w-full"
                labelClassName="text-sm font-semibold mb-1"
                defaultDate={tanggalPencairan}
                onChange={(_, dateStr) => setTanggalPencairan(dateStr || '')}
            />

            <p className="text-sm text-red-500 font-medium">
                *Harap pilih Bulan Mulai Potongan dan Tanggal Pencairan yang sesuai dengan kebijakan perusahaan.
            </p>
        </div>
    );

    return (
        <ModalAddEdit
            isOpen={isOpen}
            onClose={onClose}
            title="Atur Jadwal Pencairan & Potongan"
            content={modalContent}
            handleSubmit={handleSubmit}
            submitting={loading}
            maxWidth="max-w-xl"
            confirmTitleButton="Simpan"
            closeTitleButton="Tutup"
        />
    );
};

export default SearchScheduleAndDiscountModal;
