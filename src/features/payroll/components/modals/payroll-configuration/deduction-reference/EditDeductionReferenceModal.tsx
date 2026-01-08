// Dokumentasi: Modal Edit Acuan Potongan dengan field Acuan Potongan, Kategori, Nominal, dan Keterangan
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import { useEditDeductionReferenceModal } from '@/features/payroll/hooks/modals/payroll-configuration/deduction-reference/useEditDeductionReferenceModal';

type FormValues = {
  acuanPotongan: string;
  kategori: string;
  nominal: string;
  keterangan: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
}

const EditAcuanPotonganModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave }) => {
  const { form, setField, kategoriOptions, handleSubmit } = useEditDeductionReferenceModal({
    isOpen,
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Acuan Potongan</Label>
        <Input placeholder="Contoh: UMR" value={form.acuanPotongan} onChange={(e) => setField('acuanPotongan', e.target.value)} />
      </div>
      <div>
        <Label>Kategori</Label>
        <Select options={kategoriOptions} placeholder="Select" defaultValue={form.kategori} onChange={(v) => setField('kategori', v)} />
      </div>
      <div>
        <Label>Nominal</Label>
        <Input placeholder="3.524.238" value={form.nominal} onChange={(e) => setField('nominal', e.target.value)} />
      </div>
      <div>
        <Label>Keterangan</Label>
        <TextArea placeholder="Tambahkan keterangan" value={form.keterangan} onChange={(value) => setField('keterangan', value)} />
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={'Edit Acuan Potongan'}
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

export default EditAcuanPotonganModal;
