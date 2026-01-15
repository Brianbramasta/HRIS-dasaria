import { useState, useEffect } from 'react';
import { useDepartments } from '../../useDepartments';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';

interface UseAddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const useAddUnitModal = ({ isOpen, onClose, onSuccess }: UseAddUnitModalProps) => {
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { getDropdown } = useDepartments();
  const skFile = useFileStore(s => s.skFile);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await getDropdown('');
        setDepartments((res || []).map(d => ({ value: d.id, label: d.department_name })));
      } catch {
        setDepartments([]);
      }
    })();
  }, [isOpen, getDropdown]);

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleSearchDepartments = async (q: string) => {
    try {
      const res = await getDropdown(q || '');
      setDepartments((res || []).map(d => ({ value: d.id, label: d.department_name })));
    } catch {
      setDepartments([]);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !departmentId || !memoNumber.trim() || !skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Unit tidak ditambahkan',
        description: 'Nama Unit, Departemen, No. SK/Memo, dan File wajib diisi',
        hideDuration: 4000,
      });
      return;
    }

    setSubmitting(true);
    try {
      onSuccess?.();
      onClose();
      setName('');
      setDepartmentId('');
      setMemoNumber('');
      setDescription('');
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
