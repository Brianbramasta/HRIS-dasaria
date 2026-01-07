import React from 'react';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import ModalAddEdit from '../../../../../../components/shared/modal/ModalAddEdit';
import { useAddBranchModal } from '../../../../hooks/modals/company/detail/useAddBranchModal';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose, companyId, onSuccess }) => {
  const {
    companyName,
    selectedBranch,
    setSelectedBranch,
    // address,
    // setAddress,
    employeeCount,
    branchOptions,
    submitting,
    handleSubmit,
  } = useAddBranchModal({ isOpen, onClose, companyId, onSuccess });

  return (
    
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Tambah Branch"
      content={<>
         <div className="space-y-2">
          <label className="text-sm font-medium">Nama Perusahaan</label>
          <Input required disabled value={companyName} onChange={() => {}} className="" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Branch</label>
          <Select
            required
            options={branchOptions.map(o => ({ value: o.value, label: o.label }))}
            placeholder="Select branch"
            onChange={(v) => setSelectedBranch(v)}
            defaultValue={selectedBranch}
            className=""
          />
        </div>

        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Alamat</label>
          <Input value={address} onChange={(e:any) => setAddress(e.target.value)} />
        </div> */}

        <div className="space-y-2">
          <label className="text-sm font-medium">Jumlah Karyawan</label>
          <Input disabled value={employeeCount as any} onChange={() => {}} />
        </div>
      </>}
    />
  );
};

export default AddBranchModal;
