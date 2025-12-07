import React, { useState, useEffect } from 'react';
import { officeService, companyService } from '../../../../services/organization.service';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import ModalAddEdit from '../../shared/modal/modalAddEdit';
import { addNotification } from '@/stores/notificationStore';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose, companyId, onSuccess }) => {
  const [companyName, setCompanyName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [address, setAddress] = useState('');
  const [employeeCount, setEmployeeCount] = useState<number | ''>('');
  const [branchOptions, setBranchOptions] = useState<{ value: string; label: string; meta?: any }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedBranch || !companyId) return;
    setSubmitting(true);
    try {
      // Use selected branch label as name when creating new branch record
      const selected = branchOptions.find(b => b.value === selectedBranch);
      const nameToCreate = selected?.label || 'Branch';
      await officeService.create({
        name: nameToCreate,
        companyId,
        address: address.trim(),
        employeeCount: typeof employeeCount === 'number' ? employeeCount : 0,
      } as any);
      onSuccess?.();
      setSelectedBranch('');
      setAddress('');
      setEmployeeCount('');
      onClose();
    } catch (err) {
      console.error('Failed to create branch', err);
      // optionally show error toast
      addNotification({
        variant: 'error',
        title: 'Gagal membuat cabang',
        description: 'Terjadi kesalahan saat membuat cabang.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        // load company name
        if (companyId) {
          const c = await companyService.getDetail(companyId);
          setCompanyName(c.company?.name || '');
        }

        // load offices as branch options (prefer same company offices)
        const res = await officeService.getList({ search: '', page: 1, pageSize: 200, sortBy: 'name', sortOrder: 'asc' });
        const all = res.data || [];
        // prefer offices of same company
        const same = all.filter((o: any) => String(o.companyId) === String(companyId));
        const source = same.length ? same : all;
        setBranchOptions(source.map((o: any) => ({ value: o.id, label: o.name, meta: o })));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isOpen, companyId]);

  // when user selects a branch option, auto-fill jumlah karyawan if available
  useEffect(() => {
    const sel = branchOptions.find(b => b.value === selectedBranch);
    if (sel?.meta?.employeeCount) {
      setEmployeeCount(sel.meta.employeeCount);
    } else {
      setEmployeeCount('');
    }
    // optionally fill address if meta has address
    if (sel?.meta?.address) setAddress(sel.meta.address);
  }, [selectedBranch, branchOptions]);

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
