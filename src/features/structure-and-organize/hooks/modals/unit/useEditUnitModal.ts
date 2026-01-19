import { useState, useEffect } from 'react';
import { useDepartments } from '../../useDepartments';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import type { UnitRow } from '../../useUnits';
import { useGetUnitById, useUpdateUnit, useGetUnits } from '../../api/useApiUnits';
import { toFileSummary } from '../../../utils/shared/toFileSummary';

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
  const [departmentSearch, setDepartmentSearch] = useState('');
  
  const { execute: getUnitById, loading: fetching } = useGetUnitById();
  const { execute: updateUnit, loading: submitting } = useUpdateUnit();
  const { execute: fetchApi } = useGetUnits();


  const { getDropdown } = useDepartments();
  const skFile = useFileStore(s => s.skFile);
  const setSkFile = useFileStore(s => s.setSkFile);
  const clearSkFile = useFileStore(s => s.clearSkFile);

  useEffect(() => {
    if (!isOpen || !unit?.id) return;

    const fetchData = async () => {
      try {
        const res = await getUnitById(unit.id);
        const data = (res as any)?.data;
        if (data) {
          setName(data.unit_name || '');
          setDescription(data.description || '');
          setMemoNumber(data.unit_decree_number || '');
          
          if (data.unit_decree_file_url) {
            const summary = toFileSummary(data.unit_decree_file_url);
            if (summary) {
                setSkFile({
                    name: summary.fileName,
                    path: summary.fileUrl,
                    size: Number(summary.size) || 0,
                    type: summary.fileType,
                });
            }
          } else {
            clearSkFile();
          }

          // Set department
          if (data.department_id) {
             setDepartmentId(data.department_id);
          }
        }
      } catch (err) {
        addNotification({
          variant: 'error',
          title: 'Gagal mengambil data',
          description: 'Data unit tidak ditemukan',
          hideDuration: 4000,
        });
      }
    };

    fetchData();
  }, [isOpen, unit?.id, getUnitById, setSkFile, clearSkFile]);

  useEffect(() => {
    if (isOpen) {
      setDepartmentSearch('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const res = await getDropdown(departmentSearch);
        const opts = (res || []).map(d => ({ value: d.id, label: d.department_name }));
        setDepartments(opts);
      } catch {
        setDepartments([]);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [isOpen, departmentSearch, getDropdown]);

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

  const handleSearchDepartments = (q: string) => {
    setDepartmentSearch(q);
  };

  const handleSubmit = async () => {
    if (!unit?.id) return;
    
    if (!name.trim() || !departmentId || !memoNumber.trim()) {
      addNotification({
        variant: 'error',
        title: 'Unit tidak diupdate',
        description: 'Nama Unit, Departemen, dan No. SK/Memo wajib diisi',
        hideDuration: 4000,
      });
      return;
    }

    try {
      await updateUnit(unit.id, {
        name,
        departmentId,
        memoNumber,
        description,
        skFile: skFile?.file || null,
      });

      addNotification({
        variant: 'success',
        title: 'Berhasil',
        description: 'Unit berhasil diupdate',
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
    fetching,
    skFile,
    handleFileChange,
    handleSearchDepartments,
    handleSubmit,
  };
};
