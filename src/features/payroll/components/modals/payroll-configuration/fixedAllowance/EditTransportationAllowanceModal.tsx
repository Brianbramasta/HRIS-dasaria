// Dokumentasi: Modal Edit Tunjangan Transportasi dengan field TransPortasi, Kategori, Nomianal
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { useEditTransportationAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditTransportationAllowanceModal';

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
  const { form, setField, kategoriOptions, handleSubmit } = useEditTransportationAllowanceModal({
    defaultValues,
    onSave,
    onClose,
  });

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

export default EditTunjanganTransportasiModal;
