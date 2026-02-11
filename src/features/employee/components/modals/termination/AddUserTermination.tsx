import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import DateField from '@/components/shared/field/DateField';
import FIleField from '@/components/shared/field/FIleField';
import TextAreaField from '@/components/shared/field/TextAreaField';

export type AddTerminationForm = {
  nip: string;
  pengguna: string;
  posisi: string;
  statusBerakhir: string;
  tanggalPengajuan: string | null;
  tanggalEfektif: string | null;
  file?: File;
  catatan?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddTerminationForm) => void;
  submitting?: boolean;
};

const AddUserTermination: React.FC<Props> = ({ isOpen, onClose, onSubmit, submitting = false }) => {
  const title = useMemo(() => 'Tambah User Terminasi', []);
  const [nip, setNip] = useState('');
  const [pengguna, setPengguna] = useState('');
  const [posisi, setPosisi] = useState('');
  const [statusBerakhir, setStatusBerakhir] = useState('');
  const [tanggalPengajuan, setTanggalPengajuan] = useState<string | null>(null);
  const [tanggalEfektif, setTanggalEfektif] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [catatan, setCatatan] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f);
  };

  const handleSubmit = () => {
    const payload: AddTerminationForm = {
      nip,
      pengguna,
      posisi,
      statusBerakhir,
      tanggalPengajuan,
      tanggalEfektif,
      file,
      catatan,
    };
    onSubmit(payload);
  };

  const content = (
    <div className="space-y-6">
      <InputField
        label="NIP"
        placeholder="Input"
        value={nip}
        onChange={(e) => setNip(e.target.value)}
      />
      <InputField
        label="Pengguna"
        placeholder="Otomatis"
        value={pengguna}
        onChange={(e) => setPengguna(e.target.value)}
        disabled
      />
      <InputField
        label="Posisi"
        placeholder="Otomatis"
        value={posisi}
        onChange={(e) => setPosisi(e.target.value)}
        disabled
      />
      <SelectField
        label="Status Berakhir"
        placeholder="Pilih Status Berakhir"
        options={[
          { value: 'PHK', label: 'PHK' },
          { value: 'Kontrak Selesai', label: 'Kontrak Selesai' },
          { value: 'Tidak Lolos Evaluasi', label: 'Tidak Lolos Evaluasi' },
          { value: 'Tidak Memperpanjang (Evaluasi)', label: 'Tidak Memperpanjang (Evaluasi)' },
          { value: '-', label: '-' },
        ]}
        onChange={(value) => setStatusBerakhir(value)}
        defaultValue={statusBerakhir}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateField
          label="Tanggal Pengajuan"
          placeholder="Select a date"
          defaultDate={tanggalPengajuan || undefined}
          onChange={(_dates, dateStr) => setTanggalPengajuan(dateStr || null)}
        />
        <DateField
          label="Tanggal Efektif"
          placeholder="Select a date"
          defaultDate={tanggalEfektif || undefined}
          onChange={(_dates, dateStr) => setTanggalEfektif(dateStr || null)}
        />
      </div>
      <FIleField
        label="Upload Dokumen"
        onChange={handleFileChange}
      />
      <TextAreaField
        label="Catatan"
        placeholder="Deskripsi..."
        value={catatan}
        onChange={(v) => setCatatan(v)}
        rows={4}
      />
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-lg"
      titleAlign="center"
    />
  );
};

export default AddUserTermination;
