import { useCallback, useState } from 'react';
import { businessLinesService } from '../services/request/business-lines.service';
import { companiesService } from '../services/request/companies.service';
import { BusinessLineDetailResponse, CompanyDetailResponse } from '../types/organization.api.types';

interface UseOrganizationReturn {
  businessLineDetail: BusinessLineDetailResponse | null;
  companyDetail: CompanyDetailResponse | null;
  loading: boolean;
  error: string | null;

  fetchBusinessLineDetail: (id: string) => Promise<void>;
  fetchCompanyDetail: (id: string) => Promise<void>;
  clearBusinessLineDetail: () => void;
  clearCompanyDetail: () => void;
}

export const useOrganization = (): UseOrganizationReturn => {
  const [businessLineDetail, setBusinessLineDetail] = useState<BusinessLineDetailResponse | null>(null);
  const [companyDetail, setCompanyDetail] = useState<CompanyDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinessLineDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await businessLinesService.getDetail(id);
      setBusinessLineDetail(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business line detail');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompanyDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await companiesService.getDetail(id);
      setCompanyDetail(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company detail');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearBusinessLineDetail = useCallback(() => {
    setBusinessLineDetail(null);
  }, []);

  const clearCompanyDetail = useCallback(() => {
    setCompanyDetail(null);
  }, []);

  return {
    businessLineDetail,
    companyDetail,
    loading,
    error,
    fetchBusinessLineDetail,
    fetchCompanyDetail,
    clearBusinessLineDetail,
    clearCompanyDetail,
  };
};