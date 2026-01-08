// Dokumentasi: Modal Edit BPJS dengan field Detail BPJS, Kategori BPJS, Jenis, dan %Value
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { useEditBpjsModal } from '@/features/payroll/hooks/modals/payroll-configuration/bpjs/useEditBpjsModal';

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

const EditBpjsModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const { form, setField, kategoriOptions, jenisOptions, handleSubmit } = useEditBpjsModal({
    isOpen,
    defaultValues,
    onSave,
    onClose,
  });

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
