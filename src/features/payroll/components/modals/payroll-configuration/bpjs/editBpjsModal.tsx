// Dokumentasi: Modal Edit BPJS dengan field Detail BPJS, Kategori BPJS, Jenis, dan %Value
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

type FormValues = {
  detailBpjs: string;
  kategoriBpjs: string;
  jenis: string;
  percent: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
}

// Dokumentasi: Komponen utama modal Edit BPJS. Menggunakan ModalAddEdit sebagai wrapper
const EditBpjsModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const initial: FormValues = useMemo(() => ({
    detailBpjs: defaultValues?.detailBpjs ?? '',
    kategoriBpjs: defaultValues?.kategoriBpjs ?? '',
    jenis: defaultValues?.jenis ?? '',
    percent: defaultValues?.percent ?? '',
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const kategoriOptions = [
    { value: 'Kesehatan', label: 'Kesehatan' },
    { value: 'Ketenagakerjaan', label: 'Ketenagakerjaan' },
  ];

  const jenisOptions = [
    { value: 'Potongan', label: 'Potongan' },
    { value: 'Tunjangan', label: 'Tunjangan' },
  ];

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Detail BPJS</Label>
        <Input placeholder="Contoh: BPJS Kesehatan - Iuran Karyawan" value={form.detailBpjs} onChange={(e) => setField('detailBpjs', e.target.value)} />
      </div>
      <div>
        <Label>Kategori BPJS</Label>
        <Select options={kategoriOptions} placeholder="Select" defaultValue={form.kategoriBpjs} onChange={(v) => setField('kategoriBpjs', v)} />
      </div>
      <div>
        <Label>Jenis</Label>
        <Select options={jenisOptions} placeholder="Select" defaultValue={form.jenis} onChange={(v) => setField('jenis', v)} />
      </div>
      <div>
        <Label>%Value</Label>
        <Input placeholder="1%" value={form.percent} onChange={(e) => setField('percent', e.target.value)} />
      </div>
    </div>
  );

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <ModalAddEdit
      title={'Edit BPJS'}
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

export default EditBpjsModal;
