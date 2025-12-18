// Dokumentasi: Modal Edit Tunjangan Pernikahan dengan field Status Pernikahan, Status, Tanggungan, Nominal
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

type FormValues = {
  statusPernikahan: string;
  status: string;
  tanggungan: string;
  nominal: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
}

// Dokumentasi: komponen modal utama untuk edit Tunjangan Pernikahan
const EditTunjanganPernikahanModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const initial: FormValues = useMemo(() => ({
    statusPernikahan: defaultValues?.statusPernikahan ?? '',
    status: defaultValues?.status ?? '',
    tanggungan: String(defaultValues?.tanggungan ?? ''),
    nominal: defaultValues?.nominal ?? '',
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'nominal' ? formatRupiah(value) : value }));
  };

  const statusOptions = [
    { value: 'Tidak Menikah', label: 'Tidak Menikah' },
    { value: 'Menikah', label: 'Menikah' },
  ];

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Status Pernikahan</Label>
        <Input placeholder="TK/0" value={form.statusPernikahan} onChange={(e) => setField('statusPernikahan', e.target.value)} />
      </div>
      <div>
        <Label>Status</Label>
        <Select options={statusOptions} placeholder="Select" defaultValue={form.status} onChange={(v) => setField('status', v)} />
      </div>
      <div>
        <Label>Tanggungan</Label>
        <Input placeholder="0" value={form.tanggungan} onChange={(e) => setField('tanggungan', e.target.value.replace(/[^0-9]/g, ''))} />
      </div>
      <div>
        <Label>Nominal</Label>
        <Input placeholder="edit Nominal" value={form.nominal} onChange={(e) => setField('nominal', e.target.value)} />
      </div>
    </div>
  );

  const handleSubmit = () => {
    onSave({ ...form, tanggungan: form.tanggungan });
    onClose();
  };

  return (
    <ModalAddEdit
      title={'Edit Tunjangan Pernikahan'}
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

// Dokumentasi: helper untuk format angka ke ribuan Indonesia
const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default EditTunjanganPernikahanModal;
