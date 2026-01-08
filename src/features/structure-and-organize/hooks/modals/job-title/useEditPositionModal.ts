import { useEffect, useState } from 'react';
import type { PositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { usePositions } from '../../../hooks/useJobTitle';

interface UseEditPositionModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  position: PositionListItem | null | undefined;
}

export function useEditPositionModal({
  isOpen,
  onClose,
  onSuccess,
  position,
}: UseEditPositionModalParams) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [directSubordinates, setDirectSubordinates] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { updatePosition, detail } = usePositions();

  const handleFileChange = () => {};

  useEffect(() => {
    if (!isOpen || !position?.id) return;
    (async () => {
      try {
        const mappedPosition = await detail(position.id);
        if (!mappedPosition) return;
        setName(mappedPosition.name || '');
        setGrade((mappedPosition.grade as string) || '');
        setDirectSubordinates(
          Array.isArray(mappedPosition.directSubordinates)
            ? mappedPosition.directSubordinates.join(', ')
            : ''
        );
        setMemoNumber(mappedPosition.memoNumber || '');
        setJobDescription(mappedPosition.jobDescription || '');
      } catch (error) {
        console.error('Failed to fetch position detail:', error);
        addNotification({
          variant: 'error',
          title: 'Gagal mengambil detail jabatan',
          description: 'Terjadi kesalahan saat memuat data jabatan.',
          hideDuration: 4000,
        });
      }
    })();
  }, [isOpen, position?.id, detail]);

  useEffect(() => {
    if (position) {
      setName(position.name || '');
      setGrade(position.grade || '');
      setDirectSubordinates(
        Array.isArray(position.directSubordinates)
          ? position.directSubordinates.join(', ')
          : ''
      );
      setMemoNumber(position.memoNumber || '');
      setJobDescription(position.jobDescription || '');
    }
  }, [position]);

  const handleSubmit = async () => {
    if (!position) return;
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        grade: grade.trim() || null,
        jobDescription: jobDescription.trim() || null,
        directSubordinates: directSubordinates
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file as File,
      };
      await updatePosition(position.id, payload);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update position:', error);
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak diupdate',
        description: 'Gagal mengupdate jabatan. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    grade,
    setGrade,
    directSubordinates,
    setDirectSubordinates,
    memoNumber,
    setMemoNumber,
    jobDescription,
    setJobDescription,
    skFile,
    submitting,
    handleFileChange,
    handleSubmit,
  };
}

