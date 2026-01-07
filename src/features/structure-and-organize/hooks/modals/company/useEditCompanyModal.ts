import React from 'react';
import { companyService } from '../../../services/OrganizationService';
import { useBusinessLines } from '../../business-lines/useBusinessLines';
import type { BusinessLineListItem, CompanyListItem } from '../../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';

export function useEditCompanyModal(params: {
  isOpen: boolean;
  onClose: () => void;
  company?: CompanyListItem | null;
  onSuccess?: (updated: CompanyListItem) => void;
}) {
  const { isOpen, onClose, company, onSuccess } = params;
  const [name, setName] = React.useState('');
  const [businessLineId, setBusinessLineId] = React.useState('');
  const [businessLines, setBusinessLines] = React.useState<BusinessLineListItem[]>([]);
  const [description, setDescription] = React.useState('');
  const [docNumber, setDocNumber] = React.useState('');
  const [skFile, setSkFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const { getDropdown } = useBusinessLines({ autoFetch: false });

  React.useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const items = await getDropdown();
        setBusinessLines(items);
      } catch (e) {
        void e;
      }
    })();
  }, [isOpen, getDropdown]);

  React.useEffect(() => {
    if (company) {
      setName(company.name || '');
      setBusinessLineId(company.businessLineId || '');
      setDescription(company.description || '');
      setDocNumber(company.memoNumber || '');
      setSkFile(null);
    }
  }, [company]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const searchBusinessLines = async (q?: string) => {
    try {
      const items = await getDropdown(q);
      setBusinessLines(items);
    } catch (e) {
      void e;
    }
  };

  const handleSubmit = async () => {
    if (!company) return;
    setSubmitting(true);
    try {
      const skFilePayload = skFile || null;
      const updated = await companyService.update(company.id, {
        name: name.trim(),
        description: description.trim(),
        businessLineId: businessLineId || company.businessLineId || undefined,
        memoNumber: docNumber.trim(),
        skFile: skFilePayload,
      });
      onSuccess?.(updated);
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Perusahaan tidak diupdate',
        description: 'Gagal mengupdate perusahaan. Silakan coba lagi.',
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
    docNumber,
    setDocNumber,
    skFile,
    handleFileChange,
    searchBusinessLines,
    submitting,
    handleSubmit,
  };
}
