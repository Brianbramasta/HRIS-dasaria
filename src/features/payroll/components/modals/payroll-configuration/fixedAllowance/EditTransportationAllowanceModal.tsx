// Dokumentasi: Modal Edit Tunjangan Transportasi dengan field TransPortasi, Kategori, Nomianal
import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { useEditTransportationAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditTransportationAllowanceModal';
import { TransportationAllowanceDetailResponse, TransportationAllowanceUpdatePayload } from '@/features/payroll/types/dto/fixed-allowance/TransportationAllowanceType';

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
      <div>
        <Label>Transportasi</Label>
        <Input 
          placeholder="Transportasi-01" 
          value={form.transportasi} 
          onChange={(e) => setField('transportasi', e.target.value)} 
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label>Kategori</Label>
        <Input 
          placeholder="Staff" 
          value={form.kategori} 
          onChange={(e) => setField('kategori', e.target.value)} 
          disabled
          className="bg-gray-100"
        />
      </div>
      <div>
        <Label>Nominal</Label>
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
      submitting={isLoading ?? false}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditTunjanganTransportasiModal;
