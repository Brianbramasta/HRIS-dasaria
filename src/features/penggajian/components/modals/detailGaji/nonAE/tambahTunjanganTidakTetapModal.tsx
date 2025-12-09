// Dokumentasi: Modal edit Tunjangan Tidak Tetap
// Menggunakan ModalAddEdit sebagai wrapper dan InputField untuk form.
import React, { useState, useMemo } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/penggajian/components/layouts/layoutDetail';

interface FormValues {
  pph21: string;
  pendidikan: string;
  performa: string;
}

type Props = ModalProps;

// Dokumentasi: Utility format angka ke format ribuan Indonesia (titik)
const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Dokumentasi: Modal utama untuk mengedit nilai tunjangan tidak tetap
const TambahTunjanganTidakTetapModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}) => {
  const initial: FormValues = useMemo(() => ({
    pph21: formatRupiah(defaultValues?.pph21 ?? ''),
    pendidikan: formatRupiah(defaultValues?.pendidikan ?? ''),
    performa: formatRupiah(defaultValues?.performa ?? ''),
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: formatRupiah(value) }));
  };

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Tunjangan PPH 21</Label>
        <Input placeholder="150.000" value={form.pph21} onChange={(e) => setField('pph21', e.target.value)} />
      </div>
      <div>
        <Label>Tunjangan Pendidikan</Label>
        <Input placeholder="300.000" value={form.pendidikan} onChange={(e) => setField('pendidikan', e.target.value)} />
      </div>
      <div>
        <Label>Tunjangan Performa</Label>
        <Input placeholder="1.500.000" value={form.performa} onChange={(e) => setField('performa', e.target.value)} />
      </div>
    </div>
  );

  const handleSubmit = () => {
    onSave(form as unknown as Record<string, string>);
    onClose();
  };

  return (
    <ModalAddEdit
      title={'Tunjangan Tidak Tetap'}
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

export default TambahTunjanganTidakTetapModal;

