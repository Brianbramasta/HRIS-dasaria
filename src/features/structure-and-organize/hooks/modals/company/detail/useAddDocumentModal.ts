import React from 'react';
import { companiesService } from '../../../../services/request/CompaniesService';
import { addNotification } from '@/stores/notificationStore';

type DocEntry = { name: string; docNumber: string; file: File | null };

export function useAddDocumentModal(params: {
  companyId: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { companyId, onClose, onSuccess } = params;
  const [entries, setEntries] = React.useState<DocEntry[]>([{ name: '', docNumber: '', file: null }]);
  const [submitting, setSubmitting] = React.useState(false);

  const updateEntry = (index: number, patch: Partial<DocEntry>) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, { name: '', docNumber: '', file: null }]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    updateEntry(index, { file: f });
  };

  const handleSubmit = async () => {
    if (!companyId) return;
    const valid = entries.filter((e) => e.name.trim() && e.file);
    if (!valid.length) {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak ditambahkan',
        description: 'Isi minimal satu dokumen dan unggah file.',
      });
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'POST');
      valid.forEach((e, i) => {
        formData.append(`documents[${i}][cd_name]`, e.name.trim());
        formData.append(`documents[${i}][cd_decree_number]`, e.docNumber.trim());
        formData.append(`documents[${i}][cd_file]`, e.file as File);
      });

      await companiesService.addDocuments(companyId, formData);
      onSuccess?.();
      setEntries([{ name: '', docNumber: '', file: null }]);
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Gagal menyimpan dokumen',
        description: 'Terjadi kesalahan saat menyimpan dokumen.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    entries,
    updateEntry,
    addEntry,
    removeEntry,
    handleFileChange,
    submitting,
    handleSubmit,
  };
}
