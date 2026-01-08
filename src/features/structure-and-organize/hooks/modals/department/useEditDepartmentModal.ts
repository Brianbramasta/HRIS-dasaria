import { useEffect, useState } from 'react';
import type { DepartmentListItem, DivisionDropdown } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useDepartments } from '../../../hooks/useDepartments';
import { useDivisions } from '../../../hooks/useDivisions';

export function useEditDepartmentModal(params: {
  isOpen: boolean;
  onClose: () => void;
  department?: DepartmentListItem | null;
  onSuccess?: () => void;
}) {
  const { isOpen, onClose, department, onSuccess } = params;
  const [name, setName] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [divisions, setDivisions] = useState<DivisionDropdown[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { updateDepartment, getById } = useDepartments();
  const { getDropdown: getDivisionDropdown } = useDivisions();

  useEffect(() => {
    const initEdit = async () => {
      try {
        if (!department?.id) return;
        const mappedDepartment = await getById(department.id);
        if (!mappedDepartment) return;
        setName(mappedDepartment.name || '');
        setDivisionId(mappedDepartment.divisionId || '');
        setDescription(mappedDepartment.description || '');
        setMemoNumber(mappedDepartment.memoNumber || '');
        const dd = await getDivisionDropdown('');
        setDivisions(dd || []);
      } catch {
        addNotification({
          variant: 'error',
          title: 'Departemen tidak diupdate',
          description: 'Gagal mengupdate departemen. Silakan coba lagi.',
          hideDuration: 4000,
        });
      }
    };
    if (isOpen) initEdit();
  }, [isOpen, department?.id, getById, getDivisionDropdown]);

  const handleFileChange = () => {};

  const handleSubmit = async () => {
    if (!department) return;
    setSubmitting(true);
    try {
      await updateDepartment(department.id, {
        name,
        divisionId,
        description: description || null,
        memoNumber,
        skFile: skFile?.file as File,
      });
      onSuccess?.();
      onClose();
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const skFileName = skFile?.name || department?.skFile?.fileName || '';

  return {
    name,
    setName,
    divisionId,
    setDivisionId,
    description,
    setDescription,
    memoNumber,
    setMemoNumber,
    divisions,
    submitting,
    handleSubmit,
    handleFileChange,
    skFileName,
  };
}
