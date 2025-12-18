import apiService, { ApiResponse } from '../../../services/api';

export interface StaffEducationItem {
  id: string;
  namaLembaga: string;
  nilaiPendidikan?: string | null;
  jurusanKeahlian?: string | null;
  tahunLulus?: string | null;
  staffId?: string;
  karyawanId?: string;
}

class StaffEducationService {
  async create(staffId: string, payload: Omit<StaffEducationItem, 'id' | 'staffId' | 'karyawanId'>): Promise<ApiResponse<StaffEducationItem>> {
    return apiService.post<StaffEducationItem>(`staff/${staffId}/education`, payload);
  }

  async update(staffId: string, educationId: string, payload: Partial<StaffEducationItem>): Promise<ApiResponse<StaffEducationItem>> {
    return apiService.patch<StaffEducationItem>(`staff/${staffId}/education/${educationId}`, payload);
  }

  async remove(staffId: string, educationId: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`staff/${staffId}/education/${educationId}`);
  }
}

export const staffEducationService = new StaffEducationService();
export default staffEducationService;