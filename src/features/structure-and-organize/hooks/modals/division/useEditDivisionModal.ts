import { useEffect, useState } from 'react';
import type { DivisionListItem, DirectorateDropdown } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useDivisions } from '../../division/useDivisions';
import { useDirectorates } from '../../directorate/useDirectorates';

export function useEditDivisionModal(params: {
  isOpen: boolean;
  onClose: () => void;
  division?: DivisionListItem | null;
  onSuccess?: () => void;
}) {
  const { isOpen, onClose, division, onSuccess } = params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [directorateId, setDirectorateId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [directorates, setDirectorates] = useState<DirectorateDropdown[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { updateDivision } = useDivisions();
  const { getDropdown: getDirectorateDropdown } = useDirectorates();

  const [directorateSearch, setDirectorateSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const res = await getDirectorateDropdown(directorateSearch);
        setDirectorates(res || []);
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [isOpen, directorateSearch, getDirectorateDropdown]);

  useEffect(() => {
    if (isOpen && division) {
      setName(division.name || '');
      setDescription(division.description || '');
      setDirectorateId(division.directorateId || '');
      setMemoNumber((division as any).memoNumber || '');
    }
  }, [isOpen, division]);

  const handleFileChange = () => {};

  const handleSubmit = async () => {
    if (!division) return;
    setSubmitting(true);
    try {
      await updateDivision(division.id, {
        name,
        directorateId,
        description: description || null,
        memoNumber,
        skFile: (skFile?.file ? (skFile.file as File) : (null as any)) as any,
      });
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Divisi tidak diupdate',
        description: 'Gagal mengupdate divisi. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const skFileName = skFile?.name || division?.skFile?.fileName || '';

  return {
    name,
    setName,
    description,
    setDescription,
    directorateId,
    setDirectorateId,
    memoNumber,
    setMemoNumber,
    directorates,
    submitting,
    handleSubmit,
    handleFileChange,
    skFileName,
    handleDirectorateSearch: setDirectorateSearch,
  };
}
