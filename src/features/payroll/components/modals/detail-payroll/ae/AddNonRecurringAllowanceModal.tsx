// Dokumentasi: Modal edit Tunjangan Tidak Tetap (AE)
// Field: Komisi Sales, Komisi Survey Sales, Growth Reward, Insentif, Fee Mitra Subnet
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import type { ModalProps } from '@/features/payroll/components/layouts/LayoutDetail';

interface FormValues {
  komisiSales: string;
  komisiSurveySales: string;
  growthReward: string;
  insentif: string;
  feeMitraSubnet: string;
}

type Props = ModalProps;

// Dokumentasi: Format angka ribuan dengan titik pemisah
const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const TambahTunjanganTidakTetapModalAE: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultValues,
  onSave,
}) => {
  const initial: FormValues = useMemo(() => ({
    komisiSales: formatRupiah(defaultValues?.komisiSales ?? ''),
    komisiSurveySales: formatRupiah(defaultValues?.komisiSurveySales ?? ''),
    growthReward: formatRupiah(defaultValues?.growthReward ?? ''),
    insentif: formatRupiah(defaultValues?.insentif ?? ''),
    feeMitraSubnet: formatRupiah(defaultValues?.feeMitraSubnet ?? ''),
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: formatRupiah(value) }));
  };

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Komisi Sales</Label>
        <Input placeholder="150.000" value={form.komisiSales} onChange={(e) => setField('komisiSales', e.target.value)} />
      </div>
      <div>
        <Label>Komisi Survey Sales</Label>
        <Input placeholder="300.000" value={form.komisiSurveySales} onChange={(e) => setField('komisiSurveySales', e.target.value)} />
      </div>
      <div>
        <Label>Growth Reward</Label>
        <Input placeholder="1.500.000" value={form.growthReward} onChange={(e) => setField('growthReward', e.target.value)} />
      </div>
      <div>
        <Label>Insentif</Label>
        <Input placeholder="1.500.000" value={form.insentif} onChange={(e) => setField('insentif', e.target.value)} />
      </div>
      <div>
        <Label>Fee Mitra Subnet</Label>
        <Input placeholder="1.500.000" value={form.feeMitraSubnet} onChange={(e) => setField('feeMitraSubnet', e.target.value)} />
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

export default TambahTunjanganTidakTetapModalAE;

