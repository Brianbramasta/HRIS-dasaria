// Dokumentasi: Modal Tambah/Edit Potongan Tidak Tetap (Nama Potongan, Deksripsi Umum)
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';

type FormValues = {
  namaPotongan: string;
  deskripsiUmum: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
  title?: string;
  confirmTitleButton?: string;
}

// Dokumentasi: Komponen utama modal Potongan Tidak Tetap menggunakan ModalAddEdit sebagai wrapper
const PotonganTidakTetapModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, title, confirmTitleButton }) => {
  const initial: FormValues = useMemo(() => ({
    namaPotongan: defaultValues?.namaPotongan ?? '',
    deskripsiUmum: defaultValues?.deskripsiUmum ?? '',
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Nama Potongan</Label>
        <Input placeholder="Masukkan nama potongan" value={form.namaPotongan} onChange={(e) => setField('namaPotongan', e.target.value)} />
      </div>
      <div>
        <Label>Deksripsi Umum</Label>
        <TextArea placeholder="Tulis description ..." value={form.deskripsiUmum} onChange={(value) => setField('deskripsiUmum', value)} />
      </div>
    </div>
  );

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <ModalAddEdit
      title={title ?? 'Edit Potongan Tidak Tetap'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-lg"
      confirmTitleButton={confirmTitleButton ?? 'Simpan Perubahan'}
      closeTitleButton="Tutup"
    />
  );
};

export default PotonganTidakTetapModal;
