import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { useEditMarriageAllowanceModal } from '@/features/payroll/hooks/modals/payroll-configuration/fixedAllowance/useEditMarriageAllowanceModal';
import { MarriageAllowanceListItem, MarriageAllowanceUpdatePayload } from '@/features/payroll/types/dto/fixed-allowance/MarriageAllowanceType';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: MarriageAllowanceListItem | null;
  onSave: (values: MarriageAllowanceUpdatePayload) => Promise<void> | void;
  isLoading?: boolean;
}

// Dokumentasi: komponen modal utama untuk edit Tunjangan Pernikahan
const EditTunjanganPernikahanModal: React.FC<Props> = ({ isOpen, onClose, defaultValues, onSave, isLoading = false }) => {
  const { form, setField, statusOptions, handleSubmit } = useEditMarriageAllowanceModal({
    defaultValues,
    onSave,
    onClose,
  });

  const content = (
    <div className="space-y-5">
      <div>
        <Label>Status Pernikahan</Label>
        <Input 
            placeholder="TK/0" 
            value={form.statusPernikahan} 
            onChange={(e) => setField('statusPernikahan', e.target.value)} 
            disabled
        />
      </div>
      <div>
        <Label>Status</Label>
        <Select 
            options={statusOptions} 
            placeholder="Select" 
            defaultValue={form.status} 
            onChange={(v) => setField('status', v)} 
            disabled
        />
      </div>
      <div>
        <Label>Tanggungan</Label>
        <Input 
            placeholder="0" 
            value={form.tanggungan} 
            onChange={(e) => setField('tanggungan', e.target.value.replace(/[^0-9]/g, ''))} 
            disabled
        />
      </div>
      <div>
        <Label>Nominal</Label>
        <Input 
            placeholder="edit Nominal" 
            value={form.nominal} 
            onChange={(e) => setField('nominal', e.target.value)} 
        />
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={'Edit Tunjangan Pernikahan'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={isLoading}
      maxWidth="max-w-lg"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditTunjanganPernikahanModal;
