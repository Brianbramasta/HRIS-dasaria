import { 
  PayrollHistoryListEntity, 
  KasbonHistoryListEntity 
} from '../types/entity/PayrollHistoryEntity';
import { PayrollHistoryModel } from '../models/PayrollHistoryModel';
import { personalInformationService } from '../services/detail/PersonalInformationService';

/**
 * Repository Layer - Pusat Utama Data Payroll & Kasbon History
 * 
 * Tanggung Jawab:
 * - Ambil data dari Service
 * - Gunakan Model untuk mapping
 * - Return data yang sudah siap pakai
 * - Error handling dan response validation
 */

export const payrollHistoryRepository = {
  /**
   * Get payroll history for an employee
   * @param employeeId - Employee ID
   * @returns Promise with transformed payroll history data
   */
  async getPayrollHistory(employeeId: string): Promise<PayrollHistoryListEntity> {
    try {
      const response = await personalInformationService.getPayrollHistory(employeeId);
      
      console.log('Payroll API Response:', response);
      
      if (response && response.meta?.status === 200 && response.data) {
        // Transform API data to Entity using Model
        const transformedData = PayrollHistoryModel.transformPayrollHistoryList(response.data);
        
        return transformedData;
      } else {
        throw new Error('Gagal memuat riwayat penggajian');
      }
    } catch (error) {
      // Re-throw error untuk ditangani di hook
      throw error;
    }
  },

  /**
   * Get kasbon history for an employee
   * @param employeeId - Employee ID
   * @returns Promise with transformed kasbon history data
   */
  async getKasbonHistory(employeeId: string): Promise<KasbonHistoryListEntity> {
    try {
      const response = await personalInformationService.getKasbonHistory(employeeId);
      
      console.log('Kasbon API Response:', response);
      
      if (response && response.meta?.status === 200 && response.data) {
        // Transform API data to Entity using Model
        const transformedData = PayrollHistoryModel.transformKasbonHistoryList(response.data);
        
        return transformedData;
      } else {
        throw new Error('Gagal memuat riwayat kasbon');
      }
    } catch (error) {
      // Re-throw error untuk ditangani di hook
      throw error;
    }
  },
};

export default payrollHistoryRepository;
