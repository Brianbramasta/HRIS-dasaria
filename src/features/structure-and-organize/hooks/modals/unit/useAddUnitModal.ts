import { useState, useEffect } from 'react';
import { useDepartments } from '../../useDepartments';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useCreateUnit, useGetUnits } from '../../api/useApiUnits';

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
  
  const { execute: createUnit, loading: submitting } = useCreateUnit();
  const {execute: fetchApi } = useGetUnits();


  const { getDropdown } = useDepartments();
  const skFile = useFileStore(s => s.skFile);
  const setSkFile = useFileStore(s => s.setSkFile);
  const clearSkFile = useFileStore(s => s.clearSkFile);

  useEffect(() => {
    if (isOpen) {
        clearSkFile();
        setName('');
        setDepartmentId('');
        setMemoNumber('');
        setDescription('');
    }
  }, [isOpen, clearSkFile]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSkFile({
        name: file.name,
        path: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        file: file
      });
    }
  };

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

    try {
      await createUnit({
        name,
        departmentId,
        memoNumber,
        description,
        skFile: skFile.file,
      });

      addNotification({
        variant: 'success',
        title: 'Berhasil',
        description: 'Unit berhasil ditambahkan',
        hideDuration: 4000,
      });
      await fetchApi({});
      
      onSuccess?.();
      onClose();
    } catch (error) {
       // Error handled by hook
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
