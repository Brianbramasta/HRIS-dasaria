import { useState, useCallback } from 'react';
import submissionTypeService from '../../services/SubmissionTypeService';
import { cashAdvanceServices } from '@/features/payroll/services/CashAdvanceServices';
import { LoanTypeItem } from '@/features/payroll/types/dto/CashAdvanceType';
import {
  SubmissionItem,
  SubmissionIndexData,
  PopupApplicationDetailResult,
  CalculateLoanInstallmentResult,
  StoreSubmissionPayload,
  ApiResponse,
  PopupStatus,
} from '../../types/dto/SubmissionType';

interface UseApiSubmissionTypeReturn {
  loading: boolean;
  error: string | null;
  submissions: SubmissionItem[];
  popupDetail: PopupApplicationDetailResult | null;
  loanInstallment: CalculateLoanInstallmentResult | null;
  loanTypes: LoanTypeItem[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };
  fetchIndex: (params?: any) => Promise<void>;
  fetchPopupDetail: (status: PopupStatus) => Promise<void>;
  calculateLoan: (nominal: number | string) => Promise<void>;
  storeSubmission: (payload: StoreSubmissionPayload) => Promise<boolean>;
  fetchLoanTypes: () => Promise<void>;
  resetDetail: () => void;
}

export const useApiSubmissionType = (): UseApiSubmissionTypeReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [popupDetail, setPopupDetail] = useState<PopupApplicationDetailResult | null>(null);
  const [loanInstallment, setLoanInstallment] = useState<CalculateLoanInstallmentResult | null>(null);
  const [loanTypes, setLoanTypes] = useState<LoanTypeItem[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchIndex = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<SubmissionIndexData> = await submissionTypeService.getIndex(params);
      if (response.data) {
        setSubmissions(response.data.data || []);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil daftar pengajuan';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPopupDetail = useCallback(async (status: PopupStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionTypeService.getPopupApplicationDetail(status);
      if (response.data) {
        setPopupDetail(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil detail popup pengajuan';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateLoan = useCallback(async (nominal: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionTypeService.calculateLoanInstallment(nominal);
      if (response.data) {
        setLoanInstallment(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menghitung cicilan pinjaman';
      setError(msg);
      setLoanInstallment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLoanTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cashAdvanceServices.getLoanTypesDropdown();
      setLoanTypes(response.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil daftar jenis kasbon';
      setError(msg);
      setLoanTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const storeSubmission = useCallback(async (payload: StoreSubmissionPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('submission', payload.submission);
      formData.append('tanggal_pengajuan', payload.tanggal_pengajuan);
      formData.append('loan_type_id', payload.loan_type_id);
      formData.append('nominal_loan', String(payload.nominal_loan));
      formData.append('loan_period', String(payload.loan_period));
      formData.append('loan_description', payload.loan_description);
      formData.append('nominal_installment', String(payload.nominal_installment));
      if (payload.document_lampiran) {
        formData.append('document_lampiran', payload.document_lampiran);
      }
      if (payload.supervisor_approval_file) {
        formData.append('supervisor_approval_file', payload.supervisor_approval_file);
      }
      if (payload.supporting_documents) {
        formData.append('supporting_documents', payload.supporting_documents);
      }
      await submissionTypeService.store(formData);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan pengajuan';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setPopupDetail(null);
  }, []);

  return {
    loading,
    error,
    submissions,
    popupDetail,
    loanInstallment,
    loanTypes,
    pagination,
    fetchIndex,
    fetchPopupDetail,
    calculateLoan,
    storeSubmission,
    fetchLoanTypes,
    resetDetail,
  };
};
