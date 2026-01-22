// Dokumentasi: Modal Edit BPJS dengan field Detail BPJS, Kategori BPJS, Jenis, dan %Value
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import { useEditBpjsModal } from '@/features/payroll/hooks/modals/payroll-configuration/bpjs/useEditBpjsModal';
import { BpjsItemListItem } from '@/features/payroll/types/dto/BpjsItemType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: BpjsItemListItem | null;
  onSuccess: () => void;
}

const EditBpjsModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSuccess }) => {
  const { form, setField, handleSubmit, loading } = useEditBpjsModal({
    isOpen,
    defaultValues,
    onSuccess,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <InputField
        label="Detail BPJS"
        placeholder="Contoh: BPJS Kesehatan - Iuran Karyawan"
        value={form.detailBpjs}
        disabled
        className="bg-gray-100 cursor-not-allowed"
      />
      
      <InputField
        label="Kategori BPJS"
        value={form.kategoriBpjs}
        disabled
        className="bg-gray-100 cursor-not-allowed"
      />
      
      <InputField
        label="Jenis"
        value={form.jenis}
        disabled
        className="bg-gray-100 cursor-not-allowed"
      />
      
      <InputField
        label="%Value"
        placeholder="Masukkan persentase"
        value={form.percent}
        onChange={(e) => setField('percent', e.target.value)}
        type="number"
        step={0.01}
        required
      />
    </div>
  );

  return (
    <ModalAddEdit
      title={'Edit BPJS'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={loading}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditBpjsModal;
