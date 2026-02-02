// Dokumentasi: Modal Edit Tunjangan Transportasi dengan field TransPortasi, Kategori, Nomianal
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import { useEditTransportationAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditTransportationAllowanceModal';
import { TransportationAllowanceDetailResponse, TransportationAllowanceUpdatePayload } from '@/features/payroll/types/dto/fixed-allowance/TransportationAllowanceType';
import { formatCurrency, parseCurrency } from '@/utils/formatCurrency';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: TransportationAllowanceDetailResponse | null;
  onSave: (values: TransportationAllowanceUpdatePayload) => void;
  isLoading?: boolean;
}

// Dokumentasi: komponen modal utama untuk edit Tunjangan Transportasi
const EditTunjanganTransportasiModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, isLoading }) => {
  const { form, setField, handleSubmit } = useEditTransportationAllowanceModal({
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <InputField
        label="Transportasi"
        placeholder="Transportasi-01"
        value={form.transportasi}
        onChange={(e) => setField('transportasi', e.target.value)}
        disabled
        className="bg-gray-100"
        required
      />
      <InputField
        label="Kategori"
        placeholder="Staff"
        value={form.kategori}
        onChange={(e) => setField('kategori', e.target.value)}
        disabled
        className="bg-gray-100"
        required
      />
      <InputField
        label="Nominal"
        placeholder="edit Nominal"
        value={form.nominal ? formatCurrency(parseCurrency(form.nominal) ?? 0) : ''}
        onChange={(e) => setField('nominal', e.target.value)}
        required
      />
    </div>
  );

  return (
    <ModalAddEdit
      title={'Edit Tunjangan Transportasi'}
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

export default EditTunjanganTransportasiModal;
