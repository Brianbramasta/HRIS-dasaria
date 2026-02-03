import React from 'react';
import { Modal } from '@/components/ui/modal';
import InputField from '@/components/shared/field/InputField';
import DateField from '@/components/shared/field/DateField';
import Button from '@/components/ui/button/Button';

interface SearchScheduleAndDiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: { bulanMulaiPotongan: string; tanggalPencairan: string }) => void;
    data?: {
        nip: string;
        namaLengkap: string;
    };
}

export const SearchScheduleAndDiscountModal: React.FC<SearchScheduleAndDiscountModalProps> = ({
    isOpen,
    onClose,
    onSave,
    data,
}) => {
    const [bulanMulaiPotongan, setBulanMulaiPotongan] = React.useState<string>('');
    const [tanggalPencairan, setTanggalPencairan] = React.useState<string>('');

    const handleSave = () => {
        onSave?.({
            bulanMulaiPotongan,
            tanggalPencairan,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-xl">
            <div className="p-10 space-y-8">
                <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    Atur Jadwal Pencairan & Potongan
                </h2>

                <div className="space-y-5">
                    <InputField
                        label="NIP"
                        value={data?.nip || 'DSR999'}
                        readonly
                        containerClassName="w-full"
                        labelClassName="text-sm font-semibold mb-1"
                    />

                    <InputField
                        label="Nama Lengkap"
                        value={data?.namaLengkap || 'Megawati'}
                        readonly
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

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="px-10 py-2.5 text-base font-semibold border-gray-300"
                    >
                        Tutup
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="px-10 py-2.5 text-base font-semibold bg-[#007bff] hover:bg-blue-700 text-white border-none shadow-md"
                    >
                        Simpan
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SearchScheduleAndDiscountModal;
