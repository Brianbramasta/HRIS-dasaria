import { useState, useCallback } from 'react';
import submissionTypeService from '../../services/SubmissionTypeService';
import { cashAdvanceServices } from '@/features/payroll/services/CashAdvanceServices';
import { LoanTypeItem } from '@/features/payroll/types/dto/CashAdvanceType';
import {
  SubmissionItem,
  SubmissionIndexData,
  PopupApplicationDetail,
  CalculateLoanInstallmentResult,
  StoreSubmissionPayload,
  ApiResponse,
  SelfServiceLoanInfo,
  SelfServiceResignationInfo,
  UpdateLoanPayload,
  UpdateResignationPayload,
} from '../../types/dto/SubmissionType';

interface UseApiSubmissionTypeReturn {
  loading: boolean;
  error: string | null;
  submissions: SubmissionItem[];
  popupDetail: PopupApplicationDetail | null;
  loanInstallment: CalculateLoanInstallmentResult | null;
  loanTypes: LoanTypeItem[];
  selfServiceLoanInfo: SelfServiceLoanInfo | null;
  selfServiceResignationInfo: SelfServiceResignationInfo | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };
  fetchIndex: (params?: any) => Promise<void>;
  fetchPopupDetail: (employeeId: string) => Promise<void>;
  calculateLoan: (employeeId: string, loanAmount: number, loanPeriodMonths: number) => Promise<void>;
  storeSubmission: (employeeId: string, payload: StoreSubmissionPayload) => Promise<string | null>;
  fetchLoanTypes: () => Promise<void>;
  fetchSelfServiceLoan: (token: string) => Promise<void>;
  fetchSelfServiceResignation: (token: string) => Promise<void>;
  updateLoanDetail: (token: string, payload: UpdateLoanPayload) => Promise<boolean>;
  updateResignationDetail: (token: string, payload: UpdateResignationPayload) => Promise<boolean>;
  resetDetail: () => void;
}

export const useApiSubmissionType = (): UseApiSubmissionTypeReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [popupDetail, setPopupDetail] = useState<PopupApplicationDetail | null>(null);
  const [loanInstallment, setLoanInstallment] = useState<CalculateLoanInstallmentResult | null>(null);
  const [loanTypes, setLoanTypes] = useState<LoanTypeItem[]>([]);
  const [selfServiceLoanInfo, setSelfServiceLoanInfo] = useState<SelfServiceLoanInfo | null>(null);
  const [selfServiceResignationInfo, setSelfServiceResignationInfo] = useState<SelfServiceResignationInfo | null>(null);
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

  const fetchPopupDetail = useCallback(async (employeeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionTypeService.getPopupApplicationDetail(employeeId);
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

  const calculateLoan = useCallback(async (employeeId: string, loanAmount: number, loanPeriodMonths: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionTypeService.calculateLoanInstallment(employeeId, loanAmount, loanPeriodMonths);
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

  const storeSubmission = useCallback(async (employeeId: string, payload: StoreSubmissionPayload): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('submission', payload.submission);
      formData.append('tanggal_pengajuan', payload.tanggal_pengajuan);
      const response = await submissionTypeService.store(employeeId, formData);
      return response.data.dataTypeOfApplication.token;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan pengajuan';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSelfServiceLoan = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionTypeService.getSelfServiceLoanInfo(token);
      setSelfServiceLoanInfo(response.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil info self-service kasbon';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSelfServiceResignation = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submissionTypeService.getSelfServiceResignationInfo(token);
      setSelfServiceResignationInfo(response.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil info self-service resign';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLoanDetail = useCallback(async (token: string, payload: UpdateLoanPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('loan_type_id', payload.loan_type_id);
      formData.append('nominal_loan', String(payload.nominal_loan));
      formData.append('loan_period', String(payload.loan_period));
      if (payload.loan_description) formData.append('loan_description', payload.loan_description);
      if (payload.supervisor_approval_file) formData.append('supervisor_approval_file', payload.supervisor_approval_file);
      if (payload.supporting_documents) formData.append('supporting_documents', payload.supporting_documents);

      await submissionTypeService.updateSelfServiceLoan(token, formData);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui detail kasbon';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResignationDetail = useCallback(async (token: string, payload: UpdateResignationPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('resignation_reason', payload.resignation_reason);
      if (payload.letter_of_commitment) formData.append('letter_of_commitment', payload.letter_of_commitment);
      if (payload.document_lampiran) formData.append('document_lampiran', payload.document_lampiran);

      await submissionTypeService.updateSelfServiceResignation(token, formData);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui detail resign';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setPopupDetail(null);
    setSelfServiceLoanInfo(null);
    setSelfServiceResignationInfo(null);
  }, []);

  return {
    loading,
    error,
    submissions,
    popupDetail,
    loanInstallment,
    loanTypes,
    selfServiceLoanInfo,
    selfServiceResignationInfo,
    pagination,
    fetchIndex,
    fetchPopupDetail,
    calculateLoan,
    storeSubmission,
    fetchLoanTypes,
    fetchSelfServiceLoan,
    fetchSelfServiceResignation,
    updateLoanDetail,
    updateResignationDetail,
    resetDetail,
  };
};
