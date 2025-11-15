import apiService, { ApiResponse } from '../../../services/api';

export interface StaffDocumentItem {
  id: string;
  tipeFile: string;
  namaFile: string;
  filePath?: string | null;
  staffId?: string;
  karyawanId?: string;
}

class StaffDocumentsService {
  async create(staffId: string, payload: Omit<StaffDocumentItem, 'id' | 'staffId' | 'karyawanId'>): Promise<ApiResponse<StaffDocumentItem>> {
    return apiService.post<StaffDocumentItem>(`staff/${staffId}/documents`, payload);
  }

  async update(staffId: string, documentId: string, payload: Partial<StaffDocumentItem>): Promise<ApiResponse<StaffDocumentItem>> {
    return apiService.patch<StaffDocumentItem>(`staff/${staffId}/documents/${documentId}`, payload);
  }

  async remove(staffId: string, documentId: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`staff/${staffId}/documents/${documentId}`);
  }
}

export const staffDocumentsService = new StaffDocumentsService();
export default staffDocumentsService;