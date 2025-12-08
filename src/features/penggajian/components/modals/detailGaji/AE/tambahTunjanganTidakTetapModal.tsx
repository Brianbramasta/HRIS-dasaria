// Dokumentasi: Modal edit Tunjangan Tidak Tetap (AE)
// Field: Komisi Sales, Komisi Survey Sales, Growth Reward, Insentif, Fee Mitra Subnet
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

interface FormValues {
  komisiSales: string;
  komisiSurveySales: string;
  growthReward: string;
  insentif: string;
  feeMitraSubnet: string;
}

interface TambahTunjanganTidakTetapModalAEProps {
  isOpen: boolean;
  onClose: () => void;
  submitting?: boolean;
  defaultValues?: Partial<FormValues>;
  onSave?: (values: FormValues) => void;
}

// Dokumentasi: Format angka ribuan dengan titik pemisah
const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const TambahTunjanganTidakTetapModalAE: React.FC<TambahTunjanganTidakTetapModalAEProps> = ({
  isOpen,
  onClose,
  submitting = false,
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
    onSave?.(form);
    onClose();
  };

  return (
    <ModalAddEdit
      title={'Tunjangan Tidak Tetap'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default TambahTunjanganTidakTetapModalAE;

