// Dokumentasi: Modal Edit THR (Lama Kerja, Deksripsi Umum)
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';

type FormValues = {
  lamaKerja: string;
  deskripsiUmum: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
}

// Dokumentasi: Komponen utama modal THR menggunakan ModalAddEdit
const EditThrModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const initial: FormValues = useMemo(() => ({
    lamaKerja: defaultValues?.lamaKerja ?? '',
    deskripsiUmum: defaultValues?.deskripsiUmum ?? '',
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Lama Kerja</Label>
        <Input placeholder="Masukkan lama kerja" value={form.lamaKerja} onChange={(e) => setField('lamaKerja', e.target.value)} />
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
      title={'Edit Tunjangan Hari Raya'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditThrModal;
