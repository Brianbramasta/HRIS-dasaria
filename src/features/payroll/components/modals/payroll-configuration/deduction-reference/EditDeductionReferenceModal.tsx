import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useEditDeductionReferenceModal } from '@/features/payroll/hooks/modals/payroll-configuration/deduction-reference/useEditDeductionReferenceModal';
import { RefDeductionListItem } from '@/features/payroll/types/dto/RefDeductionType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refDeductionData?: RefDeductionListItem | null;
  onSuccess: () => void;
}

const EditAcuanPotonganModal: React.FC<Props> = ({ isOpen, onClose, refDeductionData, onSuccess }) => {
  const { form, setField, kategoriOptions, handleSubmit, loading } = useEditDeductionReferenceModal({
    isOpen,
    refDeductionData,
    onSuccess,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <InputField
        label="Acuan Potongan"
        placeholder="Contoh: UMR"
        value={form.acuanPotongan}
        onChange={(e) => setField('acuanPotongan', e.target.value)}
        disabled
      />
      
      <SelectField
        label="Kategori"
        options={kategoriOptions}
        placeholder="Select"
        defaultValue={form.kategori}
        onChange={(v) => setField('kategori', v)}
        disabled
      />

      <InputField
        label="Nominal"
        placeholder="3.524.238"
        value={form.nominal}
        onChange={(e) => setField('nominal', e.target.value)}
        required
      />

      <TextAreaField
        label="Keterangan"
        placeholder="Tambahkan keterangan"
        value={form.keterangan}
        onChange={(value) => setField('keterangan', value)}
      />
    </div>
  );

  return (
    <ModalAddEdit
      title={'Edit Acuan Potongan'}
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

export default EditAcuanPotonganModal;
