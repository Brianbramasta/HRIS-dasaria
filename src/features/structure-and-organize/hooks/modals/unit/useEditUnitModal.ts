import { useState, useEffect } from 'react';
import { useDepartments } from '../../useDepartments';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import type { UnitRow } from '../../useUnits';

interface UseEditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: UnitRow | null;
  onSuccess?: () => void;
}

export const useEditUnitModal = ({ isOpen, onClose, unit, onSuccess }: UseEditUnitModalProps) => {
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { getDropdown } = useDepartments();
  const skFile = useFileStore(s => s.skFile);

  useEffect(() => {
    if (!unit) return;
    setName(unit['nama-unit'] || '');
    setDescription(unit['deskripsi-umum'] || '');
    // Note: memoNumber is not being set in the original code? 
    // Checking original code: 
    // const [memoNumber, setMemoNumber] = useState('');
    // ...
    // useEffect(() => { if (!unit) return; setName(...); setDescription(...); }, [unit]);
    // It seems memoNumber was NOT being set in original EditUnitModal either. I will keep it as is to preserve behavior.
  }, [unit]);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await getDropdown('');
        const opts = (res || []).map(d => ({ value: d.id, label: d.department_name }));
        setDepartments(opts);
        if (unit) {
          const found = opts.find(d => d.label === unit.departemen);
          if (found) setDepartmentId(found.value);
        }
      } catch {
        setDepartments([]);
      }
    })();
  }, [isOpen, getDropdown, unit]);

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleSearchDepartments = async (q: string) => {
    try {
      const res = await getDropdown(q || '');
      const opts = (res || []).map(d => ({ value: d.id, label: d.department_name }));
      setDepartments(opts);
    } catch {
      setDepartments([]);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !departmentId || !memoNumber.trim() || !skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Unit tidak diupdate',
        description: 'Nama Unit, Departemen, No. SK/Memo, dan File wajib diisi',
        hideDuration: 4000,
      });
      return;
    }

    setSubmitting(true);
    try {
      onSuccess?.();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    departmentId,
    setDepartmentId,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    departments,
    submitting,
    skFile,
    handleFileChange,
    handleSearchDepartments,
    handleSubmit,
  };
};
