import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import DateField from '@/components/shared/field/DateField';

interface SearchScheduleAndDiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: { bulanMulaiPotongan: string; tanggalPencairan: string }) => void;
    data?: {
        nip: string;
        namaLengkap: string;
        bulanMulaiPotongan?: string;
        tanggalPencairan?: string;
    };
}

export const SearchScheduleAndDiscountModal: React.FC<SearchScheduleAndDiscountModalProps> = ({
    isOpen,
    onClose,
    onSave,
    data,
}) => {
    const [bulanMulaiPotongan, setBulanMulaiPotongan] = React.useState<string>(data?.bulanMulaiPotongan || '');
    const [tanggalPencairan, setTanggalPencairan] = React.useState<string>(data?.tanggalPencairan || '');

    const handleSave = () => {
        onSave?.({
            bulanMulaiPotongan,
            tanggalPencairan,
        });
    };

    const modalContent = (
        <div className="space-y-5">
            <InputField
                label="NIP"
                value={data?.nip || 'DSR999'}
                disabled
                containerClassName="w-full"
                labelClassName="text-sm font-semibold mb-1"
            />

            <InputField
                label="Nama Lengkap"
                value={data?.namaLengkap || 'Megawati'}
                disabled
                containerClassName="w-full"
                labelClassName="text-sm font-semibold mb-1"
            />

            <DateField
                label="Bulan Mulai Potongan"
                placeholder="Pilih Bulan & Tahun"
                containerClassName="w-full"
                labelClassName="text-sm font-semibold mb-1"
                onChange={(_, dateStr) => setBulanMulaiPotongan(dateStr || '')}
                view="month"
            />

            <DateField
                label="Tanggal Pencairan"
                placeholder="Pilih Tanggal"
                containerClassName="w-full"
                labelClassName="text-sm font-semibold mb-1"
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
            handleSubmit={handleSave}
            submitting={false}
            maxWidth="max-w-xl"
            confirmTitleButton="Simpan"
            closeTitleButton="Tutup"
        />
    );
};

export default SearchScheduleAndDiscountModal;
