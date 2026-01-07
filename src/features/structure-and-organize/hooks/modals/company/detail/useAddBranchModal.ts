import React from 'react';
import { officeService } from '../../../../services/OrganizationService';
import { addNotification } from '@/stores/notificationStore';
import { useCompanies } from '../../../../hooks/useCompanies';

export function useAddBranchModal(params: {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}) {
  const { isOpen, onClose, companyId, onSuccess } = params;
  const [companyName, setCompanyName] = React.useState('');
  const [selectedBranch, setSelectedBranch] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [employeeCount, setEmployeeCount] = React.useState<number | ''>('');
  const [branchOptions, setBranchOptions] = React.useState<{ value: string; label: string; meta?: any }[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const { getDetail: getCompanyDetail } = useCompanies();

  const handleSubmit = async () => {
    if (!selectedBranch || !companyId) return;
    setSubmitting(true);
    try {
      const selected = branchOptions.find((b) => b.value === selectedBranch);
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
    } catch {
      addNotification({
        variant: 'error',
        title: 'Gagal membuat cabang',
        description: 'Terjadi kesalahan saat membuat cabang.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        if (companyId) {
          const c = await getCompanyDetail(companyId);
          setCompanyName(c.company?.name || '');
        }
        const res = await officeService.getList({ page: 1, per_page: 200, search: '', column: 'office_name', sort: 'asc' });
        const all = res.data || [];
        const same = all.filter((o: any) => String(o.companyId) === String(companyId));
        const source = same.length ? same : all;
        setBranchOptions(source.map((o: any) => ({ value: o.id, label: o.name, meta: o })));
      } catch (e) {
        void e;
      }
    })();
  }, [isOpen, companyId, getCompanyDetail]);

  React.useEffect(() => {
    const sel = branchOptions.find((b) => b.value === selectedBranch);
    if (sel?.meta?.employeeCount) {
      setEmployeeCount(sel.meta.employeeCount);
    } else {
      setEmployeeCount('');
    }
    if (sel?.meta?.address) setAddress(sel.meta.address);
  }, [selectedBranch, branchOptions]);

  return {
    companyName,
    selectedBranch,
    setSelectedBranch,
    address,
    setAddress,
    employeeCount,
    branchOptions,
    submitting,
    handleSubmit,
  };
}
