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
  const [structuralPositions, setStructuralPositions] = useState<string[]>(['']);
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
        //note-update:ubah parameter directSubordinates menjadi structuralPositions ketika api sudah di update
        setStructuralPositions(
          Array.isArray(mappedPosition.directSubordinates) &&
          mappedPosition.directSubordinates.length > 0
            ? mappedPosition.directSubordinates.map((s: string) => s || '')
            : ['']
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
       //note-update:ubah parameter directSubordinates menjadi structuralPositions ketika api sudah di update
      setStructuralPositions(
        Array.isArray(position.directSubordinates) && position.directSubordinates.length > 0
          ? position.directSubordinates.map((s) => s || '')
          : ['']
      );
      setMemoNumber(position.memoNumber || '');
      setJobDescription(position.jobDescription || '');
    }
  }, [position]);

  const handleSubmit = async () => {
    if (!position) return;
    const cleanedStructural = structuralPositions.map((s) => s.trim()).filter(Boolean);
    if (cleanedStructural.length === 0) {
      addNotification({
        variant: 'error',
        title: 'Jabatan tidak diupdate',
        description: 'Jabatan Struktural wajib diisi minimal satu baris',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        grade: grade.trim() || null,
        jobDescription: jobDescription.trim() || null,
        directSubordinates: cleanedStructural, //note-update:ubah parameter directSubordinates menjadi structuralPositions ketika api sudah di update
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
    structuralPositions,
    setStructuralPositions,
    addStructuralRow: () => setStructuralPositions((prev) => [...prev, '']),
    removeStructuralRow: (index: number) =>
      setStructuralPositions((prev) => prev.filter((_, i) => i !== index)),
    updateStructuralAt: (index: number, value: string) =>
      setStructuralPositions((prev) => prev.map((v, i) => (i === index ? value : v))),
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

