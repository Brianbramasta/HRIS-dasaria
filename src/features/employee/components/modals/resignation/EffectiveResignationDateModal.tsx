import React, { useEffect, useState } from 'react';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Label from '../../../../../components/form/Label';
import InputField from '../../../../../components/form/input/InputField';
import DatePicker from '../../../../../components/form/date-picker';
import TextArea from '../../../../../components/form/input/TextArea';

interface EffectiveResignationDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tanggalEfektif: string, deskripsi: string) => void;
  submitting: boolean;
  nip: string;
  namaLengkap: string;
  posisi: string;
  tanggalPengajuan: string;
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
}) => {
  const [tanggalEfektif, setTanggalEfektif] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTanggalEfektif('');
      setDeskripsi('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!tanggalEfektif.trim()) {
      return;
    }
    onSubmit(tanggalEfektif, deskripsi);
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      const date = selectedDates[0];
      const formatted = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      setTanggalEfektif(formatted);
    }
  };

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
          value={tanggalPengajuan}
          disabled
          placeholder="Tanggal Pengajuan"
        />
      </div>

      <div>
        <Label htmlFor="tanggal-efektif">Tanggal Efektif</Label>
        <DatePicker
          id="tanggal-efektif"
          mode="single"
          onChange={handleDateChange}
          placeholder="Select a date"
        />
      </div>

      <div>
        <Label htmlFor="deskripsi">Deskripsi</Label>
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
