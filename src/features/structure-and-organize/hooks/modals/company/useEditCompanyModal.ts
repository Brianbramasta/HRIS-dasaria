import React from 'react';
import { companiesService } from '../../../services/request/CompaniesService';
import { useApiBusinessLines } from '../../api/useApiBusinessLines';
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
  const [businessLineSearch, setBusinessLineSearch] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [docNumber, setDocNumber] = React.useState('');
  const [skFile, setSkFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const { getDropdown } = useApiBusinessLines();

  React.useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const items = await getDropdown(businessLineSearch || undefined);
        setBusinessLines(items);
      } catch (e) {
        void e;
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [isOpen, getDropdown, businessLineSearch]);

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

  const searchBusinessLines = (q?: string) => {
    setBusinessLineSearch(q || '');
  };

  const handleSubmit = async () => {
    if (!company) return;
    setSubmitting(true);
    try {
      const skFilePayload = skFile || null;
      
      const formData = new FormData();
      formData.append('_method', 'PUT');
      if (name.trim()) formData.append('company_name', name.trim());
      if (description.trim()) formData.append('company_description', description.trim());
      const blId = businessLineId || company.businessLineId;
      if (blId) formData.append('id_bl', blId);

      if (docNumber.trim() || skFilePayload) {
        formData.append('documents[0][cd_name]', 'Dokumen');
        if (docNumber.trim()) formData.append('documents[0][cd_decree_number]', docNumber.trim());
        if (skFilePayload) formData.append('documents[0][cd_file]', skFilePayload);
      }

      const updated = await companiesService.update(company.id, formData);
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
