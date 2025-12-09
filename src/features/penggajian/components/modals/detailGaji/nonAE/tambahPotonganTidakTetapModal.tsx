// Dokumentasi: Modal edit Potongan Tidak Tetap (Non-AE)
// Field: BPJS Kesehatan JKN (1%), BPJS Ketenagakerjaan JHT (2%), Kasbon
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/penggajian/components/layouts/layoutDetail';

interface FormValues {
  jkn1: string;
  jht2: string;
  kasbon: string;
}

type Props = ModalProps;

// Dokumentasi: Utility format angka ribuan Indonesia
const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const TambahPotonganTidakTetapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}) => {
  const initial: FormValues = useMemo(() => ({
    jkn1: formatRupiah(defaultValues?.jkn1 ?? ''),
    jht2: formatRupiah(defaultValues?.jht2 ?? ''),
    kasbon: formatRupiah(defaultValues?.kasbon ?? ''),
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: formatRupiah(value) }));
  };

  const content = (
    <div className="space-y-5">
      <div>
        <Label>BPJS Kesehatan JKN (1%)</Label>
        <Input placeholder="100.000" value={form.jkn1} onChange={(e) => setField('jkn1', e.target.value)} />
      </div>
      <div>
        <Label>BPJS Ketenagakerjaan JHT (2%)</Label>
        <Input placeholder="200.000" value={form.jht2} onChange={(e) => setField('jht2', e.target.value)} />
      </div>
      <div>
        <Label>Kasbon</Label>
        <Input placeholder="500.000" value={form.kasbon} onChange={(e) => setField('kasbon', e.target.value)} />
      </div>
    </div>
  );

  const handleSubmit = () => {
    onSave(form as unknown as Record<string, string>);
    onClose();
  };

  return (
    <ModalAddEdit
      title={'Potongan Tidak Tetap'}
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

export default TambahPotonganTidakTetapModal;

