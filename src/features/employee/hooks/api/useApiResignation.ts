import { useState, useCallback } from 'react';
import {
  ResignationApplicationListItem,
  ResignationApplicationDetailResult,
  ResignationApplicationListResponse,
  UploadDocumentsPayload,
  ResignationAdministrationListItem,
  ResignationAdministrationDetailResult,
  ResignationAdministrationListResponse,
  AdministrationPopupResult,
  DocumentTypeItem,
  StoreAdministrationPayload,
} from '../../types/dto/ResignationType';
import { resignationApplicationsService } from '../../services/ResignationApplicationsService';
import { resignationAdministrationService } from '../../services/ResignationAdministrationService';

interface UseApiResignationReturn {
  loading: boolean;
  error: string | null;

  // Applications
  applications: ResignationApplicationListItem[];
  applicationDetail: ResignationApplicationDetailResult | null;
  appPagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Administration
  adminList: ResignationAdministrationListItem[];
  adminDetail: ResignationAdministrationDetailResult | null;
  adminPopup: AdministrationPopupResult | null;
  adminPagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Dropdowns
  documentTypes: DocumentTypeItem[];

  // Actions - Applications
  fetchApplications: (params?: any) => Promise<void>;
  fetchApplicationDetail: (id: string) => Promise<void>;
  uploadApplicationDocuments: (id: string, payload: UploadDocumentsPayload) => Promise<boolean>;
  approveApplication: (id: string) => Promise<boolean>;
  rejectApplication: (id: string) => Promise<boolean>;
  saveDraftApplication: (id: string) => Promise<boolean>;

  // Actions - Administration
  fetchAdminPopup: (nip: string) => Promise<void>;
  storeAdministration: (payload: StoreAdministrationPayload) => Promise<boolean>;
  fetchAdministrationIndex: (params?: any) => Promise<void>;
  fetchAdministrationDetail: (id: string) => Promise<void>;
  uploadAdministrationDocuments: (id: string, payload: UploadDocumentsPayload) => Promise<boolean>;
  submitAdministration: (id: string) => Promise<boolean>;
  fetchDocumentTypes: () => Promise<void>;

  // Reset
  resetApplicationDetail: () => void;
  resetAdministrationDetail: () => void;
}

export const useApiResignation = (): UseApiResignationReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Applications
  const [applications, setApplications] = useState<ResignationApplicationListItem[]>([]);
  const [applicationDetail, setApplicationDetail] = useState<ResignationApplicationDetailResult | null>(null);
  const [appPagination, setAppPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  // Administration
  const [adminList, setAdminList] = useState<ResignationAdministrationListItem[]>([]);
  const [adminDetail, setAdminDetail] = useState<ResignationAdministrationDetailResult | null>(null);
  const [adminPopup, setAdminPopup] = useState<AdministrationPopupResult | null>(null);
  const [adminPagination, setAdminPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  // Dropdowns
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeItem[]>([]);

  const fetchApplications = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await resignationApplicationsService.getApplications(params);
      const data = resp.data as ResignationApplicationListResponse;
      setApplications(data?.data || []);
      setAppPagination({
        currentPage: data?.current_page || 1,
        perPage: data?.per_page || 10,
        total: data?.total || 0,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil daftar pengajuan';
      setError(msg);
      console.error('Error fetchApplications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplicationDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await resignationApplicationsService.getApplicationDetail(id);
      setApplicationDetail(resp.data as ResignationApplicationDetailResult);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil detail pengajuan';
      setError(msg);
      console.error('Error fetchApplicationDetail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadApplicationDocuments = useCallback(async (id: string, payload: UploadDocumentsPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      payload.document_type_ids.forEach((docId, idx) => {
        form.append(`document_type_id[${idx}]`, docId);
      });
      payload.files.forEach((file, idx) => {
        form.append(`file[${idx}]`, file);
      });
      await resignationApplicationsService.uploadDocuments(id, form);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah dokumen pengajuan';
      setError(msg);
      console.error('Error uploadApplicationDocuments:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveApplication = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resignationApplicationsService.approve(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyetujui pengajuan';
      setError(msg);
      console.error('Error approveApplication:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectApplication = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resignationApplicationsService.reject(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menolak pengajuan';
      setError(msg);
      console.error('Error rejectApplication:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDraftApplication = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resignationApplicationsService.saveDraft(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan draft pengajuan';
      setError(msg);
      console.error('Error saveDraftApplication:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminPopup = useCallback(async (nip: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await resignationAdministrationService.getPopup(nip);
      setAdminPopup(resp.data as AdministrationPopupResult);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil popup terminasi';
      setError(msg);
      console.error('Error fetchAdminPopup:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const storeAdministration = useCallback(async (payload: StoreAdministrationPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('employee_id', payload.employee_id);
      form.append('tanggal_pengajuan_terminasi', payload.tanggal_pengajuan_terminasi);
      form.append('tanggal_efektif_terminasi', payload.tanggal_efektif_terminasi);
      form.append('description', payload.description);
      form.append('document', payload.document);
      form.append('end_status_id', payload.end_status_id);
      await resignationAdministrationService.store(form);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan terminasi administrasi';
      setError(msg);
      console.error('Error storeAdministration:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdministrationIndex = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await resignationAdministrationService.getIndex(params);
      const data = resp.data as ResignationAdministrationListResponse;
      setAdminList(data?.data || []);
      setAdminPagination({
        currentPage: data?.current_page || 1,
        perPage: data?.per_page || 10,
        total: data?.total || 0,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil daftar terminasi';
      setError(msg);
      console.error('Error fetchAdministrationIndex:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdministrationDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await resignationAdministrationService.getDetail(id);
      setAdminDetail(resp.data as ResignationAdministrationDetailResult);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil detail terminasi';
      setError(msg);
      console.error('Error fetchAdministrationDetail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAdministrationDocuments = useCallback(async (id: string, payload: UploadDocumentsPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      payload.document_type_ids.forEach((docId, idx) => {
        form.append(`document_type_id[${idx}]`, docId);
      });
      payload.files.forEach((file, idx) => {
        form.append(`file[${idx}]`, file);
      });
      await resignationAdministrationService.uploadDocuments(id, form);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah dokumen terminasi';
      setError(msg);
      console.error('Error uploadAdministrationDocuments:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAdministration = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resignationAdministrationService.submit(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal submit terminasi administrasi';
      setError(msg);
      console.error('Error submitAdministration:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocumentTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await resignationAdministrationService.getDocumentTypes();
      setDocumentTypes(resp.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil tipe dokumen';
      setError(msg);
      console.error('Error fetchDocumentTypes:', err);
      setDocumentTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetApplicationDetail = useCallback(() => {
    setApplicationDetail(null);
  }, []);

  const resetAdministrationDetail = useCallback(() => {
    setAdminDetail(null);
  }, []);

  return {
    loading,
    error,
    applications,
    applicationDetail,
    appPagination,
    adminList,
    adminDetail,
    adminPopup,
    adminPagination,
    documentTypes,
    fetchApplications,
    fetchApplicationDetail,
    uploadApplicationDocuments,
    approveApplication,
    rejectApplication,
    saveDraftApplication,
    fetchAdminPopup,
    storeAdministration,
    fetchAdministrationIndex,
    fetchAdministrationDetail,
    uploadAdministrationDocuments,
    submitAdministration,
    fetchDocumentTypes,
    resetApplicationDetail,
    resetAdministrationDetail,
  };
};

export default useApiResignation;
