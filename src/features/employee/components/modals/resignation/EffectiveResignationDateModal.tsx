import React from 'react';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Label from '../../../../../components/form/Label';
import InputField from '../../../../../components/form/input/InputField';
import DateField from '../../../../../components/shared/field/DateField';
import TextArea from '../../../../../components/form/input/TextArea';
import { useEffectiveResignationDateModal } from '../../../hooks/modals/resignation/useEffectiveResignationDateModal';
import { formatDateToIndonesian } from '@/utils/formatDate';

interface EffectiveResignationDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tanggalEfektif: string, deskripsi: string) => void;
  submitting: boolean;
  nip: string;
  namaLengkap: string;
  posisi: string;
  tanggalPengajuan: string;
  contractEndDate?: string | null;
}

const EffectiveResignationDateModal: React.FC<EffectiveResignationDateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  nip,
  namaLengkap,
  posisi,
  tanggalPengajuan,
  contractEndDate,
}) => {
  const { deskripsi, setDeskripsi, handleDateChange, handleSubmit, validationError } =
    useEffectiveResignationDateModal({ isOpen, onSubmit, contractEndDate });
 

  const content = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nip">NIP</Label>
        <InputField
          id="nip"
          type="text"
          value={nip}
          disabled
          placeholder="NIP"
        />
      </div>

      <div>
        <Label htmlFor="namaLengkap">Nama Lengkap</Label>
        <InputField
          id="namaLengkap"
          type="text"
          value={namaLengkap}
          disabled
          placeholder="Nama Lengkap"
        />
      </div>

      <div>
        <Label htmlFor="posisi">Posisi</Label>
        <InputField
          id="posisi"
          type="text"
          value={posisi}
          disabled
          placeholder="Posisi"
        />
      </div>

      <div>
        <Label htmlFor="tanggalPengajuan">Tanggal Pengajuan</Label>
        <InputField
          id="tanggalPengajuan"
          type="text"
          value={formatDateToIndonesian(String(tanggalPengajuan)) || tanggalPengajuan}
          disabled
          placeholder="Tanggal Pengajuan"
        />
      </div>

      <div>
        <DateField
          id="tanggal-efektif"
          label="Tanggal Efektif"
          mode="single"
          onChange={(_dates, dateStr) => {
            // Convert DateField output to hook format
            const selectedDates = dateStr ? [new Date(dateStr)] : [];
            handleDateChange(selectedDates);
          }}
          placeholder="Pilih tanggal"
          maxDate={(() => {
            if (!contractEndDate) return undefined;
            const parsed = new Date(contractEndDate);
            // Check if date is valid
            return isNaN(parsed.getTime()) ? undefined : parsed;
          })()}
          error={validationError || undefined}
        />
        {contractEndDate && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tanggal berakhir kontrak: {formatDateToIndonesian(contractEndDate) || contractEndDate}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="deskripsi">Catatan</Label>
        <TextArea
          placeholder="Deskripsi..."
          rows={4}
          value={deskripsi}
          onChange={(value) => setDeskripsi(value)}
        />
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        *Harap pilih tanggal efektif sesuai dengan kebijakan perusahaan.
      </p>
    </div>
  );

  return (
    <ModalAddEdit
      title="Efektif Pengunduran Diri"
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-2xl"
      confirmTitleButton="Simpan"
      closeTitleButton="Tutup"
    />
  );
};

export default EffectiveResignationDateModal;
