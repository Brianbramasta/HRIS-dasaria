// Dokumentasi: Modal Edit Tunjangan Transportasi dengan field TransPortasi, Kategori, Nomianal
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

type FormValues = {
  transportasi: string;
  kategori: string;
  nominal: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
}

// Dokumentasi: komponen modal utama untuk edit Tunjangan Transportasi
const EditTunjanganTransportasiModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const initial: FormValues = useMemo(() => ({
    transportasi: defaultValues?.transportasi ?? '',
    kategori: defaultValues?.kategori ?? '',
    nominal: defaultValues?.nominal ?? '',
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'nominal' ? formatRupiah(value) : value }));
  };

  const kategoriOptions = [
    { value: 'Staff', label: 'Staff' },
    { value: 'Kemitraan', label: 'Kemitraan' },
  ];

  const content = (
    <div className="space-y-5">
      <div>
        <Label>TransPortasi</Label>
        <Input placeholder="Transportasi-01" value={form.transportasi} onChange={(e) => setField('transportasi', e.target.value)} />
      </div>
      <div>
        <Label>Kategori</Label>
        <Select options={kategoriOptions} placeholder="Select" defaultValue={form.kategori} onChange={(v) => setField('kategori', v)} />
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
      title={'Edit Tunjangan Transportasi'}
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

export default EditTunjanganTransportasiModal;
