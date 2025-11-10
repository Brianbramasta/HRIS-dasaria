import React, { useState } from 'react';
import { Modal } from '../../../../../../components/ui/modal/index';
import { officeService } from '../../../../services/organization.service';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose, companyId, onSuccess }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [employeeCount, setEmployeeCount] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !companyId) return;
    setSubmitting(true);
    try {
      await officeService.create({
        name: name.trim(),
        companyId,
        address: address.trim(),
        employeeCount: typeof employeeCount === 'number' ? employeeCount : 0,
      } as any);
      onSuccess?.();
      setName('');
      setAddress('');
      setEmployeeCount('');
      onClose();
    } catch (err) {
      console.error('Failed to create branch', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Tambah Branch</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Branch</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border px-4 py-3" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Alamat</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border px-4 py-3" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Jumlah Karyawan</label>
          <input value={employeeCount as any} onChange={(e) => setEmployeeCount(e.target.value ? Number(e.target.value) : '')} type="number" className="w-full rounded-xl border px-4 py-3" />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button onClick={handleSubmit} disabled={submitting} className="rounded-xl bg-blue-600 px-5 py-2 text-white disabled:opacity-60">Save</button>
        </div>
      </div>
    </Modal>
  );
};

export default AddBranchModal;
