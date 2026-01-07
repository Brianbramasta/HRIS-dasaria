import React from 'react';
import { companyService } from '../../services/OrganizationService';
import { useBusinessLines } from '../../business-lines/useBusinessLines';
import type { BusinessLineListItem, CompanyListItem } from '../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';

export function useAddCompanyModal(params: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: CompanyListItem) => void;
}) {
  const { isOpen, onClose, onSuccess } = params;
  const [name, setName] = React.useState('');
  const [businessLineId, setBusinessLineId] = React.useState('');
  const [businessLines, setBusinessLines] = React.useState<BusinessLineListItem[]>([]);
  const [description, setDescription] = React.useState('');
  const [documents, setDocuments] = React.useState<{ name: string; number: string; file: File | null }[]>([
    { name: '', number: '', file: null },
  ]);
  const [submitting, setSubmitting] = React.useState(false);
  const { getDropdown } = useBusinessLines({ autoFetch: false });

  React.useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const items = await getDropdown();
        setBusinessLines(items);
      } catch {
      }
    })();
  }, [isOpen, getDropdown]);

  const handleDocChange = (index: number, key: 'name' | 'number', value: string) => {
    setDocuments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleDocFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocuments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], file };
      return next;
    });
  };

  const addDocumentRow = () => {
    setDocuments((prev) => [...prev, { name: '', number: '', file: null }]);
  };

  const removeDocumentRow = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const searchBusinessLines = async (q?: string) => {
    try {
      const items = await getDropdown(q);
      setBusinessLines(items);
    } catch {
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (!documents[0]?.file) {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak ditambahkan',
        description: 'File SK Wajib di isi pada baris pertama',
      });
      return;
    }
    setSubmitting(true);
    try {
      const validDocs = documents
        .filter((d) => d.file && d.name.trim())
        .map((d) => ({ name: d.name.trim(), number: d.number.trim(), file: d.file as File }));

      const created = await companyService.create({
        name: name.trim(),
        businessLineId: businessLineId || '',
        description: description.trim(),
        documents: validDocs,
      } as any);
      onSuccess?.(created);
      setName('');
      setBusinessLineId('');
      setDescription('');
      setDocuments([{ name: '', number: '', file: null }]);
      onClose();
    } catch (err) {
      addNotification({
        variant: 'error',
        title: 'Perusahaan tidak ditambahkan',
        description: 'Gagal menambahkan perusahaan. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    businessLineId,
    setBusinessLineId,
    businessLines,
    description,
    setDescription,
    documents,
    handleDocChange,
    handleDocFileChange,
    addDocumentRow,
    removeDocumentRow,
    searchBusinessLines,
    submitting,
    handleSubmit,
  };
}
