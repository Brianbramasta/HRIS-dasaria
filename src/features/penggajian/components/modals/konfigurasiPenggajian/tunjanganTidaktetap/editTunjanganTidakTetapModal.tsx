// Dokumentasi: Modal Tambah/Edit Tunjangan Tidak Tetap (Nama Tunjangan, Deksripsi Umum)
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';

type FormValues = {
  namaTunjangan: string;
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

// Dokumentasi: Komponen utama modal Tunjangan Tidak Tetap menggunakan ModalAddEdit sebagai wrapper
const EditTunjanganTidakTetapModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, title, confirmTitleButton }) => {
  const initial: FormValues = useMemo(() => ({
    namaTunjangan: defaultValues?.namaTunjangan ?? '',
    deskripsiUmum: defaultValues?.deskripsiUmum ?? '',
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Nama Tunjangan</Label>
        <Input placeholder="Masukkan nama tunjangan" value={form.namaTunjangan} onChange={(e) => setField('namaTunjangan', e.target.value)} />
      </div>
      <div>
        <Label>Deksripsi Umum</Label>
        // Dokumentasi: Perbaikan handler TextArea - onChange mengembalikan string value
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
      title={title ?? 'Edit Tunjangan Tidak Tetap'}
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

export default EditTunjanganTidakTetapModal;
