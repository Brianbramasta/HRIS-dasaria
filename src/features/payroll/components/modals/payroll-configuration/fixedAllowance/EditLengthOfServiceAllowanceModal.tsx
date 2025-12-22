// Dokumentasi: Modal Edit Tunjangan Lama Kerja dengan field Lama Kerja & Nomianal
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

type FormValues = {
  lamaKerja: string;
  nominal: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
}

// Dokumentasi: komponen modal utama untuk edit Tunjangan Lama Kerja
const EditTunjanganLamaKerjaModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const initial: FormValues = useMemo(() => ({
    lamaKerja: defaultValues?.lamaKerja ?? '',
    nominal: defaultValues?.nominal ?? '',
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'nominal' ? formatRupiah(value) : value }));
  };

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Lama Kerja</Label>
        <Input placeholder="Tahun Ke-1" value={form.lamaKerja} onChange={(e) => setField('lamaKerja', e.target.value)} />
      </div>
      <div>
        <Label>Nomianal</Label>
        <Input placeholder="edit Nominal" value={form.nominal} onChange={(e) => setField('nominal', e.target.value)} />
      </div>
    </div>
  );

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <ModalAddEdit
      title={'Edit Tunjangan Lama Kerja'}
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

// Dokumentasi: helper format angka ke ribuan
const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default EditTunjanganLamaKerjaModal;
