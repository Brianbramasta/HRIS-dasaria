// Dokumentasi: Modal Edit Tunjangan Lama Kerja dengan field Lama Kerja & Nomianal
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import { useEditLengthOfServiceAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditLengthOfServiceAllowanceModal';
import { LengthOfServiceAllowanceDetailResponse, LengthOfServiceAllowanceListItem } from '@/features/payroll/types/dto/fixed-allowance/LengthOfServiceAllowanceType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: LengthOfServiceAllowanceDetailResponse | LengthOfServiceAllowanceListItem | null;
  onSave: (values: { nominalValue: number }) => void;
  isLoading?: boolean;
}

// Dokumentasi: komponen modal utama untuk edit Tunjangan Lama Kerja
const EditTunjanganLamaKerjaModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, isLoading }) => {
  const { form, setField, handleSubmit } = useEditLengthOfServiceAllowanceModal({
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <div>
        {/* Read-only as per typical requirement when updating allowance based on fixed type */}
        <InputField
          label="Lama Kerja"
          placeholder="Tahun Ke-1"
          value={form.lamaKerja}
          onChange={(e) => setField('lamaKerja', e.target.value)}
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <InputField
          label="Nominal"
          placeholder="edit Nominal"
          value={form.nominal}
          onChange={(e) => setField('nominal', e.target.value)}
          required
        />
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={'Edit Tunjangan Lama Kerja'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={isLoading ?? false}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditTunjanganLamaKerjaModal;
