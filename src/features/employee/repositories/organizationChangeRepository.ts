import { 
  OrganizationChangeEntity, 
  OrganizationChangeDetailEntity, 
  // EmployeeOrganizationChangeHistoryEntity 
} from '../types/entity/OrganizationChangeEntity';
import { 
  OrganizationChangeQueryParams,
  StoreOrganizationChangePayload,
  UploadDocumentPayload 
} from '../types/dto/OrganizationChangeType';
import { OrganizationChangeModel } from '../models/OrganizationChangeModel';
import { organizationChangeNewService } from '../services/OrganizationChangeNewService';

/**
 * Repository Layer - Pusat Utama Data Organization Change
 * 
 * Tanggung Jawab:
 * - Ambil data dari Service
 * - Gunakan Model untuk mapping
 * - Return data yang sudah siap pakai
 * - Error handling dan response validation
 */

export const organizationChangeRepository = {
  /**
   * Get organization changes list with pagination and filtering
   * @param params - Query parameters for filtering, sorting, and pagination
   * @returns Promise with transformed organization change data and pagination
   */
  async getOrganizationChanges(params?: OrganizationChangeQueryParams): Promise<{
    data: OrganizationChangeEntity[];
    pagination: {
      currentPage: number;
      perPage: number;
      total: number;
    };
  }> {
    try {
      const response = await organizationChangeNewService.getOrganizationChanges(params);
      
      if (response && response.meta?.status === 200 && response.data) {
        const apiResponse = response.data;
        
        // Transform API data to Entity using Model
        const transformedData = OrganizationChangeModel.transformListFromApi(apiResponse.data);
        
        return {
          data: transformedData,
          pagination: {
            currentPage: apiResponse.current_page || 1,
            perPage: apiResponse.per_page || 10,
            total: apiResponse.total || 0,
          },
        };
      } else {
        throw new Error(response?.meta?.message || 'Gagal memuat data perubahan organisasi');
      }
    } catch (error) {
      // Re-throw error untuk ditangani di hook
      throw error;
    }
  },

  /**
   * Get organization change detail
   * @param changeId - Organization change ID
   * @returns Promise with transformed organization change detail
   */
  async getOrganizationChangeDetail(changeId: string): Promise<OrganizationChangeDetailEntity> {
    try {
      const response = await organizationChangeNewService.getOrganizationChangeDetail(changeId);
      
      if (response && response.meta?.status === 200 && response.data) {
        // Transform API data to Entity using Model
        const transformedData = OrganizationChangeModel.transformDetailFromApi(response.data);
        return transformedData;
      } else {
        throw new Error(response?.meta?.message || 'Gagal memuat detail perubahan organisasi');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get organization changes by employee
   * @param employeeId - Employee ID
   * @returns Promise with transformed employee organization changes
   */
  async getOrganizationChangesByEmployee(employeeId: string): Promise<any> {
    try {
      const response = await organizationChangeNewService.getOrganizationChangesByEmployee(employeeId);
      
      if (response && response.meta?.status === 200 && response.data) {
        // Handle both response types - employee detail or organization history
        if (Array.isArray(response.data)) {
          // This is organization history response
          const transformedData = OrganizationChangeModel.transformEmployeeHistoryListFromApi(response.data);
          return transformedData;
        } else {
          // This is employee detail response - return the employee data directly
          return response.data;
        }
      } else {
        throw new Error(response?.meta?.message || 'Gagal memuat data perubahan organisasi karyawan');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Store new organization change
   * @param payload - Organization change data
   * @returns Promise with success status
   */
  async storeOrganizationChange(payload: StoreOrganizationChangePayload): Promise<boolean> {
    try {
      const response = await organizationChangeNewService.storeOrganizationChange(payload);
      
      if (response && response.meta?.status === 200) {
        return true;
      } else {
        throw new Error(response?.meta?.message || 'Gagal menyimpan perubahan organisasi');
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload document for organization change
   * @param changeId - Organization change ID
   * @param payload - Document upload data
   * @returns Promise with success status
   */
  async uploadDocument(changeId: string, payload: UploadDocumentPayload): Promise<boolean> {
    try {
      const response = await organizationChangeNewService.uploadDocument(changeId, payload);
      
      if (response && response.meta?.status === 200) {
        return true;
      } else {
        throw new Error(response?.meta?.message || 'Gagal mengunggah dokumen');
      }
    } catch (error) {
      throw error;
    }
  },
};

export default organizationChangeRepository;
