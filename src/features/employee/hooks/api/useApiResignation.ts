import { useState, useCallback } from 'react';
import { TableFilter } from '../../../../types/SharedType';
import useFilterStore from '../../../../stores/filterStore';
import {
  UploadDocumentsPayload,
  StoreAdministrationPayload,
  PersonalInformationFullData,
} from '../../types/dto/ResignationType';
import {
  ResignationApplicationEntity,
  ResignationApplicationDetailEntity,
  ResignationAdministrationEntity,
  ResignationAdministrationDetailEntity,
  AdministrationPopupEntity,
  DocumentTypeEntity,
  EmployeeOptionEntity,
  ContractEndStatusOptionEntity,
} from '../../types/entity/ResignationEntity';
import { resignationRepository } from '../../repositories/resignationRepository';
import { formatFilterValue } from '@/utils/formatFilterValue';

interface UseApiResignationReturn {
  loading: boolean;
  error: string | null;

  // Applications
  applications: ResignationApplicationEntity[];
  applicationDetail: ResignationApplicationDetailEntity | null;
  appPagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Administration
  adminList: ResignationAdministrationEntity[];
  adminDetail: ResignationAdministrationDetailEntity | null;
  adminPopup: AdministrationPopupEntity | null;
  adminPagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Dropdowns & Lists
  documentTypes: DocumentTypeEntity[];
  employeeOptions: EmployeeOptionEntity[];
  contractEndStatusOptions: ContractEndStatusOptionEntity[];
  selectedEmployeeData: PersonalInformationFullData | null;

  // Server-side filtering states
  columnFilters: Record<string, string[]>;
  dateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;
  adminColumnFilters: Record<string, string[]>;
  adminDateRangeFilters: Record<string, { startDate: string; endDate: string | null }>;

  // Actions - Applications
  fetchApplications: (params?: Partial<TableFilter>) => Promise<void>;
  fetchApplicationDetail: (id: string) => Promise<void>;
  uploadApplicationDocuments: (id: string, payload: UploadDocumentsPayload) => Promise<boolean>;
  approveApplication: (id: string, effectiveDate?: string) => Promise<boolean>;
  rejectApplication: (id: string, payload?: { note_hr?: string }) => Promise<boolean>;
  saveDraftApplication: (id: string) => Promise<boolean>;
  deleteDocument: (applicationId: string, documentId: string) => Promise<boolean>;

  // Actions - Administration
  fetchAdminPopup: (nip: string) => Promise<void>;
  storeAdministration: (payload: StoreAdministrationPayload) => Promise<boolean>;
  fetchAdministrationIndex: (params?: Partial<TableFilter>) => Promise<void>;
  fetchAdministrationDetail: (id: string) => Promise<void>;
  uploadAdministrationDocuments: (id: string, payload: UploadDocumentsPayload) => Promise<boolean>;
  submitAdministration: (id: string) => Promise<boolean>;
  fetchDocumentTypes: () => Promise<void>;
  deleteAdministrationDocument: (administrationId: string, documentId: string) => Promise<boolean>;

  // Employee List & Personal Data
  fetchEmployeeList: (search?: string) => Promise<void>;
  fetchEmployeePersonalData: (employeeId: string) => Promise<void>;
  fetchContractEndStatusList: (search?: string) => Promise<void>;

  // Filter handlers
  handleApplicationColumnFilterChange: (columnId: string, values: string[]) => void;
  handleApplicationDateRangeFilterChange: (columnId: string, startDate: string, endDate: string | null) => void;
  handleAdminColumnFilterChange: (columnId: string, values: string[]) => void;
  handleAdminDateRangeFilterChange: (columnId: string, startDate: string, endDate: string | null) => void;

  // Reset
  resetApplicationDetail: () => void;
  resetAdministrationDetail: () => void;
}

export const useApiResignation = (): UseApiResignationReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Applications
  const [applications, setApplications] = useState<ResignationApplicationEntity[]>([]);
  const [applicationDetail, setApplicationDetail] = useState<ResignationApplicationDetailEntity | null>(null);
  const [appPagination, setAppPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  // Administration
  const [adminList, setAdminList] = useState<ResignationAdministrationEntity[]>([]);
  const [adminDetail, setAdminDetail] = useState<ResignationAdministrationDetailEntity | null>(null);
  const [adminPopup, setAdminPopup] = useState<AdministrationPopupEntity | null>(null);
  const [adminPagination, setAdminPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  // Dropdowns
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeEntity[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOptionEntity[]>([]);
  const [contractEndStatusOptions, setContractEndStatusOptions] = useState<ContractEndStatusOptionEntity[]>([]);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<PersonalInformationFullData | null>(null);

  // Server-side filtering states
  const [applicationColumnFilters, setApplicationColumnFilters] = useState<Record<string, string[]>>({});
  const [applicationDateRangeFilters, setApplicationDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});
  const [adminColumnFilters, setAdminColumnFilters] = useState<Record<string, string[]>>({});
  const [adminDateRangeFilters, setAdminDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

  // Filter values from store - use fixed keys for each type
  const applicationFilterValue = formatFilterValue(useFilterStore((s) => s.filters['Pengunduran Diri']));
  const adminFilterValue = formatFilterValue(useFilterStore((s) => s.filters['Terminasi Administrasi']));

  const fetchApplications = useCallback(async (params?: Partial<TableFilter>) => {
    setLoading(true);
    setError(null);
    try {
      // Build query params
      const queryParams: any = {
        page: params?.page ?? appPagination.currentPage,
        per_page: params?.pageSize ?? appPagination.perPage,
      };

      if (params?.search) queryParams.search = params.search;
      if (params?.sortBy) queryParams.column = params.sortBy;
      if (params?.sortOrder) queryParams.sort = params.sortOrder;
      
      // Handle filter - convert to array if needed
      const filterParam = params?.filter ?? applicationFilterValue;
      if (filterParam) {
        queryParams.filter = Array.isArray(filterParam) ? filterParam : [filterParam];
      }

      // Add column filters - format: filter_column[column_name][in][]=value
      Object.entries(applicationColumnFilters).forEach(([columnId, values]) => {
        if (values && values.length > 0) {
          values.forEach((value) => {
            const key = `filter_column[${columnId}][in][]`;
            if (!queryParams[key]) {
              queryParams[key] = [];
            }
            queryParams[key].push(value);
          });
        }
      });

      // Add date range filters - format: filter_column[column_name][range][]=start_date & filter_column[column_name][range][]=end_date
      Object.entries(applicationDateRangeFilters).forEach(([columnId, dateRange]) => {
        if (dateRange && dateRange.startDate) {
          const key = `filter_column[${columnId}][range][]`;
          if (!queryParams[key]) {
            queryParams[key] = [];
          }
          queryParams[key].push(dateRange.startDate);
          if (dateRange.endDate) {
            queryParams[key].push(dateRange.endDate);
          }
        }
      });

      const result = await resignationRepository.getApplications(queryParams);
      setApplications(result.data);
      setAppPagination({
        currentPage: result.pagination.current_page,
        perPage: result.pagination.per_page,
        total: result.pagination.total,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil daftar pengajuan';
      setError(msg);
      console.error('Error fetchApplications:', err);
    } finally {
      setLoading(false);
    }
  }, [applicationFilterValue, applicationColumnFilters, applicationDateRangeFilters, appPagination.perPage]);

  const fetchApplicationDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resignationRepository.getApplicationDetail(id);
      setApplicationDetail(result);
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
      await resignationRepository.uploadApplicationDocuments(id, payload);
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

  const approveApplication = useCallback(async (id: string, effectiveDate?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resignationRepository.approveApplication(id, 'Disetujui', effectiveDate);
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

  const rejectApplication = useCallback(async (id: string, payload?: { note_hr?: string }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resignationRepository.rejectApplication(id, 'Ditolak', payload);
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
      await resignationRepository.saveDraftApplication(id);
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
  const deleteDocument = useCallback(async (applicationId: string, documentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resignationRepository.deleteApplicationDocument(applicationId, documentId);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus dokumen pengajuan';
      setError(msg);
      console.error('Error deleteDocument:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminPopup = useCallback(async (nip: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resignationRepository.getAdministrationPopup(nip);
      setAdminPopup(result);
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
      await resignationRepository.storeAdministration(payload);
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

  const fetchAdministrationIndex = useCallback(async (params?: Partial<TableFilter>) => {
    setLoading(true);
    setError(null);
    try {
      // Build query params
      const queryParams: any = {
        page: params?.page ?? adminPagination.currentPage,
        per_page: params?.pageSize ?? adminPagination.perPage,
      };

      if (params?.search) queryParams.search = params.search;
      if (params?.sortBy) queryParams.column = params.sortBy;
      if (params?.sortOrder) queryParams.sort = params.sortOrder;
      
      // Handle filter - convert to array if needed
      const filterParam = params?.filter ?? adminFilterValue;
      if (filterParam) {
        queryParams.filter = Array.isArray(filterParam) ? filterParam : [filterParam];
      }

      // Add column filters - format: filter_column[column_name][in][]=value
      Object.entries(adminColumnFilters).forEach(([columnId, values]) => {
        if (values && values.length > 0) {
          values.forEach((value) => {
            const key = `filter_column[${columnId}][in][]`;
            if (!queryParams[key]) {
              queryParams[key] = [];
            }
            queryParams[key].push(value);
          });
        }
      });

      // Add date range filters - format: filter_column[column_name][range][]=start_date & filter_column[column_name][range][]=end_date
      Object.entries(adminDateRangeFilters).forEach(([columnId, dateRange]) => {
        if (dateRange && dateRange.startDate) {
          const key = `filter_column[${columnId}][range][]`;
          if (!queryParams[key]) {
            queryParams[key] = [];
          }
          queryParams[key].push(dateRange.startDate);
          if (dateRange.endDate) {
            queryParams[key].push(dateRange.endDate);
          }
        }
      });

      const result = await resignationRepository.getAdministrationIndex(queryParams);
      setAdminList(result.data);
      setAdminPagination({
        currentPage: result.pagination.current_page,
        perPage: result.pagination.per_page,
        total: result.pagination.total,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil daftar terminasi';
      setError(msg);
      console.error('Error fetchAdministrationIndex:', err);
    } finally {
      setLoading(false);
    }
  }, [adminFilterValue, adminColumnFilters, adminDateRangeFilters, adminPagination.perPage]);

  const fetchAdministrationDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resignationRepository.getAdministrationDetail(id);
      setAdminDetail(result);
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
      await resignationRepository.uploadAdministrationDocuments(id, payload);
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
      await resignationRepository.submitAdministration(id);
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
      const result = await resignationRepository.getDocumentTypes();
      setDocumentTypes(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil tipe dokumen';
      setError(msg);
      console.error('Error fetchDocumentTypes:', err);
      setDocumentTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAdministrationDocument = useCallback(async (administrationId: string, documentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await resignationRepository.deleteAdministrationDocument(administrationId, documentId);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus dokumen terminasi';
      setError(msg);
      console.error('Error deleteAdministrationDocument:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeList = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resignationRepository.getEmployeeList(search);
      setEmployeeOptions(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil daftar karyawan';
      setError(msg);
      console.error('Error fetchEmployeeList:', err);
      setEmployeeOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeePersonalData = useCallback(async (employeeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resignationRepository.getEmployeePersonalData(employeeId);
      setSelectedEmployeeData(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil data personal karyawan';
      setError(msg);
      console.error('Error fetchEmployeePersonalData:', err);
      setSelectedEmployeeData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContractEndStatusList = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resignationRepository.getContractEndStatusList(search);
      setContractEndStatusOptions(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil status akhir kontrak';
      setError(msg);
      console.error('Error fetchContractEndStatusList:', err);
      setContractEndStatusOptions([]);
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

  // Filter handlers for applications
  const handleApplicationColumnFilterChange = useCallback((columnId: string, values: string[]) => {
    setApplicationColumnFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
  }, []);

  const handleApplicationDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
    setApplicationDateRangeFilters((prev) => ({
      ...prev,
      [columnId]: { startDate, endDate },
    }));
  }, []);

  // Filter handlers for administration
  const handleAdminColumnFilterChange = useCallback((columnId: string, values: string[]) => {
    setAdminColumnFilters((prev) => ({
      ...prev,
      [columnId]: values,
    }));
  }, []);

  const handleAdminDateRangeFilterChange = useCallback((columnId: string, startDate: string, endDate: string | null) => {
    setAdminDateRangeFilters((prev) => ({
      ...prev,
      [columnId]: { startDate, endDate },
    }));
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
    employeeOptions,
    contractEndStatusOptions,
    selectedEmployeeData,
    // Server-side filtering states
    columnFilters: applicationColumnFilters,
    dateRangeFilters: applicationDateRangeFilters,
    adminColumnFilters,
    adminDateRangeFilters,
    fetchApplications,
    fetchApplicationDetail,
    uploadApplicationDocuments,
    approveApplication,
    rejectApplication,
    saveDraftApplication,
    deleteDocument,
    fetchAdminPopup,
    storeAdministration,
    fetchAdministrationIndex,
    fetchAdministrationDetail,
    uploadAdministrationDocuments,
    submitAdministration,
    fetchDocumentTypes,
    deleteAdministrationDocument,
    fetchEmployeeList,
    fetchEmployeePersonalData,
    fetchContractEndStatusList,
    // Filter handlers
    handleApplicationColumnFilterChange,
    handleApplicationDateRangeFilterChange,
    handleAdminColumnFilterChange,
    handleAdminDateRangeFilterChange,
    resetApplicationDetail,
    resetAdministrationDetail,
  };
};

export default useApiResignation;
