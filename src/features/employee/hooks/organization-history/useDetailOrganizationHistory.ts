import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApiOrganizationChange } from '../api/useApiOrganizationChange';
import { formatCurrency } from '@/utils/formatCurrency';
import { OrganizationChangeDetail } from '../../types/dto/OrganizationChangeType';

interface UseDetailOrganizationHistoryReturn {
  // State
  skFile: File | null;
  adendumFile: File | null;
  loading: boolean;
  organizationChangeDetail: OrganizationChangeDetail | null;
  
  // URL params
  id: string;
  atasan: string;
  
  // Actions
  setSkFile: (file: File | null) => void;
  setAdendumFile: (file: File | null) => void;
  handleSubmit: () => Promise<void>;
  
  // Computed values
  title: string;
  currency: (value: number) => string;
}

export const useDetailOrganizationHistory = (): UseDetailOrganizationHistoryReturn => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || '';
  const atasan = searchParams.get('atasan') || '';
  
  // API Hook
  const {
    organizationChangeDetail,
    fetchOrganizationChangeDetail,
    uploadDocument,
    loading,
  } = useApiOrganizationChange();

  // File states
  const [skFile, setSkFile] = useState<File | null>(null);
  const [adendumFile, setAdendumFile] = useState<File | null>(null);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!id) return;
    
    const payload = {
      decree_file: skFile || undefined,
      adendum_file: adendumFile || undefined,
    };

    const success = await uploadDocument(id, payload);
    if (success) {
      navigate('/organization-history');
    }
  }, [id, skFile, adendumFile, uploadDocument, navigate]);

  // Fetch detail data on component mount
  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      await fetchOrganizationChangeDetail(id);
    };
    loadDetail();
  }, [id, fetchOrganizationChangeDetail]);

  // Format currency utility
  const currency = formatCurrency;

  // Computed values
  const title = 'Detail Perubahan Organisasi';

  return {
    // State
    skFile,
    adendumFile,
    loading,
    organizationChangeDetail,
    
    // URL params
    id,
    atasan,
    
    // Actions
    setSkFile,
    setAdendumFile,
    handleSubmit,
    
    // Computed values
    title,
    currency,
  };
};
