import { ResignationModel } from '../models/ResignationModel';
import { resignationApplicationsService } from '../services/ResignationApplicationsService';
import { resignationAdministrationService } from '../services/ResignationAdministrationService';
import { organizationChangeService } from '../services/OrganizationChangeService';
import { personalInformationService } from '../services/detail/PersonalInformationService';
import { contractService } from '../services/detail/ContractService';
import {
  ResignationApplicationListResponse,
  ResignationApplicationDetailResult,
  UploadDocumentsPayload,
  ResignationAdministrationListResponse,
  ResignationAdministrationDetailResult,
  AdministrationPopupResult,
  DocumentTypeItem,
  StoreAdministrationPayload,
  ContractEndStatusItem,
  PersonalInformationFullData,
} from '../types/dto/ResignationType';
import {
  ResignationApplicationListEntity,
  ResignationApplicationDetailEntity,
  ResignationAdministrationListEntity,
  ResignationAdministrationDetailEntity,
  AdministrationPopupEntity,
  DocumentTypeEntity,
  EmployeeOptionEntity,
  ContractEndStatusOptionEntity,
} from '../types/entity/ResignationEntity';

/**
 * Repository Layer - Pusat Utama Data Resignation
 * 
 * Tanggung Jawab:
 * - Ambil data dari Service
 * - Gunakan Model untuk mapping
 * - Return data yang sudah siap pakai
 * - Error handling dan response validation
 */

export const resignationRepository = {
  // --- Applications ---

  /**
   * Get resignation applications list with pagination and filtering
   * @param params - Query parameters for filtering, sorting, and pagination
   * @returns Promise with transformed resignation application data
   */
  async getApplications(params?: any): Promise<ResignationApplicationListEntity> {
    try {
      const response = await resignationApplicationsService.getApplications(params);
      
      if (response && response.meta?.status === 200 && response.data) {
        const apiResponse = response.data as ResignationApplicationListResponse;
        
        // Transform API data to Entity using Model
        return ResignationModel.transformApplicationListWithPagination(
          apiResponse.data,
          apiResponse.current_page,
          apiResponse.per_page,
          apiResponse.total
        );
      } else {
        throw new Error('Gagal memuat data pengajuan pengunduran diri');
      }
    } catch (error) {
      // Re-throw error untuk ditangani di hook
      throw error;
    }
  },

  /**
   * Get resignation application detail
   * @param id - Application ID
   * @returns Promise with resignation application detail
   */
  async getApplicationDetail(id: string): Promise<ResignationApplicationDetailEntity> {
    try {
      const response = await resignationApplicationsService.getApplicationDetail(id);
      
      if (response && response.meta?.status === 200 && response.data) {
        return ResignationModel.transformApplicationDetailFromApi(response.data as ResignationApplicationDetailResult);
      } else {
        throw new Error('Gagal memuat detail pengajuan pengunduran diri');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload documents for resignation application
   * @param id - Application ID
   * @param payload - Document upload payload
   * @returns Promise with API response
   */
  async uploadApplicationDocuments(id: string, payload: UploadDocumentsPayload): Promise<any> {
    try {
      const form = new FormData();
      payload.document_type_ids.forEach((docId, idx) => {
        form.append(`document_type_id[${idx}]`, docId);
      });
      payload.files.forEach((file, idx) => {
        form.append(`file[${idx}]`, file);
      });
      
      const response = await resignationApplicationsService.uploadDocuments(id, form);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal mengunggah dokumen pengajuan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Approve resignation application
   * @param id - Application ID
   * @param statusName - Status name
   * @param effectiveDate - Optional effective date
   * @returns Promise with API response
   */
  async approveApplication(id: string, statusName: string = 'Disetujui', effectiveDate?: string): Promise<any> {
    try {
      const response = await resignationApplicationsService.approve(id, statusName, effectiveDate);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal menyetujui pengajuan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reject resignation application
   * @param id - Application ID
   * @param statusName - Status name
   * @param payload - Optional rejection payload
   * @returns Promise with API response
   */
  async rejectApplication(id: string, statusName: string = 'Ditolak', payload?: { note_hr?: string }): Promise<any> {
    try {
      const response = await resignationApplicationsService.reject(id, statusName, payload);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal menolak pengajuan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Save resignation application as draft
   * @param id - Application ID
   * @param statusName - Status name
   * @returns Promise with API response
   */
  async saveDraftApplication(id: string, statusName: string = 'Dalam peninjauan'): Promise<any> {
    try {
      const response = await resignationApplicationsService.saveDraft(id, statusName);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal menyimpan draft pengajuan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete document from resignation application
   * @param applicationId - Application ID
   * @param documentId - Document ID
   * @returns Promise with API response
   */
  async deleteApplicationDocument(applicationId: string, documentId: string): Promise<any> {
    try {
      const response = await resignationApplicationsService.deleteDocument(applicationId, documentId);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal menghapus dokumen pengajuan');
      }
    } catch (error) {
      throw error;
    }
  },

  // --- Administration ---

  /**
   * Get administration popup data
   * @param nip - Employee NIP
   * @returns Promise with administration popup data
   */
  async getAdministrationPopup(nip: string): Promise<AdministrationPopupEntity> {
    try {
      const response = await resignationAdministrationService.getPopup(nip);
      
      if (response && response.meta?.status === 200 && response.data) {
        return ResignationModel.transformAdministrationPopupFromApi(response.data as AdministrationPopupResult);
      } else {
        throw new Error('Gagal memuat data popup terminasi');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Store new administration
   * @param payload - Administration payload
   * @returns Promise with API response
   */
  async storeAdministration(payload: StoreAdministrationPayload): Promise<any> {
    try {
      const form = new FormData();
      form.append('employee_id', payload.employee_id);
      form.append('tanggal_pengajuan_terminasi', payload.tanggal_pengajuan_terminasi);
      form.append('tanggal_efektif_terminasi', payload.tanggal_efektif_terminasi);
      form.append('description', payload.description);
      form.append('document', payload.document);
      form.append('end_status_id', payload.end_status_id);
      
      const response = await resignationAdministrationService.store(form);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal menyimpan terminasi administrasi');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get administration list with pagination and filtering
   * @param params - Query parameters for filtering, sorting, and pagination
   * @returns Promise with transformed administration data
   */
  async getAdministrationIndex(params?: any): Promise<ResignationAdministrationListEntity> {
    try {
      const response = await resignationAdministrationService.getIndex(params);
      
      if (response && response.meta?.status === 200 && response.data) {
        const apiResponse = response.data as ResignationAdministrationListResponse;
        
        // Transform API data to Entity using Model
        return ResignationModel.transformAdministrationListWithPagination(
          apiResponse.data,
          apiResponse.current_page,
          apiResponse.per_page,
          apiResponse.total
        );
      } else {
        throw new Error('Gagal memuat data terminasi administrasi');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get administration detail
   * @param id - Administration ID
   * @returns Promise with administration detail
   */
  async getAdministrationDetail(id: string): Promise<ResignationAdministrationDetailEntity> {
    try {
      const response = await resignationAdministrationService.getDetail(id);
      
      if (response && response.meta?.status === 200 && response.data) {
        return ResignationModel.transformAdministrationDetailFromApi(response.data as ResignationAdministrationDetailResult);
      } else {
        throw new Error('Gagal memuat detail terminasi administrasi');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload documents for administration
   * @param id - Administration ID
   * @param payload - Document upload payload
   * @returns Promise with API response
   */
  async uploadAdministrationDocuments(id: string, payload: UploadDocumentsPayload): Promise<any> {
    try {
      const form = new FormData();
      payload.document_type_ids.forEach((docId, idx) => {
        form.append(`document_type_id[${idx}]`, docId);
      });
      payload.files.forEach((file, idx) => {
        form.append(`file[${idx}]`, file);
      });
      
      const response = await resignationAdministrationService.uploadDocuments(id, form);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal mengunggah dokumen terminasi');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit administration
   * @param id - Administration ID
   * @returns Promise with API response
   */
  async submitAdministration(id: string): Promise<any> {
    try {
      const response = await resignationAdministrationService.submit(id);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal submit terminasi administrasi');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete document from administration
   * @param administrationId - Administration ID
   * @param documentId - Document ID
   * @returns Promise with API response
   */
  async deleteAdministrationDocument(administrationId: string, documentId: string): Promise<any> {
    try {
      const response = await resignationAdministrationService.deleteDocument(administrationId, documentId);
      
      if (response && response.meta?.status === 200) {
        return response.data;
      } else {
        throw new Error(response?.meta?.message || 'Gagal menghapus dokumen terminasi');
      }
    } catch (error) {
      throw error;
    }
  },

  // --- Dropdowns & Lists ---

  /**
   * Get document types
   * @returns Promise with document types list
   */
  async getDocumentTypes(): Promise<DocumentTypeEntity[]> {
    try {
      const response = await resignationAdministrationService.getDocumentTypes();
      
      if (response && response.meta?.status === 200) {
        const data = response.data || [];
        return ResignationModel.transformDocumentTypeListFromApi(data as DocumentTypeItem[]);
      } else {
        throw new Error('Gagal memuat tipe dokumen');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get employee list for dropdown
   * @param search - Search term
   * @returns Promise with employee options
   */
  async getEmployeeList(search?: string): Promise<EmployeeOptionEntity[]> {
    try {
      const response = await organizationChangeService.getAllEmployeeDropdown(search);
      const data = (response as any)?.data ?? [];
      
      return ResignationModel.transformEmployeeOptionListFromApi(data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get employee personal data
   * @param employeeId - Employee ID
   * @returns Promise with employee personal data
   */
  async getEmployeePersonalData(employeeId: string): Promise<PersonalInformationFullData> {
    try {
      const response = await personalInformationService.getPersonalInformationData(employeeId);
      
      if (response && response.meta?.status === 200) {
        return response.data as PersonalInformationFullData;
      } else {
        throw new Error('Gagal memuat data personal karyawan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get contract end status list
   * @param search - Search term
   * @returns Promise with contract end status options
   */
  async getContractEndStatusList(search?: string): Promise<ContractEndStatusOptionEntity[]> {
    try {
      const data = await contractService.getContractEndStatusDropdown(search);
      return ResignationModel.transformContractEndStatusOptionListFromApi(data as ContractEndStatusItem[]);
    } catch (error) {
      throw error;
    }
  },
};

export default resignationRepository;
