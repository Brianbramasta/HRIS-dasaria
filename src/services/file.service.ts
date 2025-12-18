import apiService from './api';
//  "ownerType": "business-line",
//       "ownerId": "4",
//       "name": "SK Direktorat Keuangan",
//       "docNumber": "SK-FIN/2024",
//       "fileName": "sk-direktorat-keuangan.pdf",
//       "type": "active",
//       "filePath": "https://example.com/sk-direktorat-keuangan.pdf",
//       "size": "1.2 MB",

export interface UploadedFileInfo {
  ownerType: string;
  ownerId: string;
  name: string;
  docNumber: string;
  type: string;
  fileName: string;
  filePath: string;
  fileType: string;
  size: number;
}

export interface SavedFileRecord {
  id: string | number;
  name: string;
  path: string;
  size: number;
  createdAt: string;
  // optional contextual info (entity, field, etc.)
  context?: string;
  entity?: string;
  entityId?: string;
  field?: string;
}

export const fileService = {
  create: async (position: Omit<UploadedFileInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<UploadedFileInfo> => {
      const response = await apiService.post<UploadedFileInfo>('/files', {
        ...position,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return response.data;
    },
  getByOwnerType: async (id: string, ownerType: string): Promise<UploadedFileInfo[]> => {
      const response = await apiService.get<UploadedFileInfo[]>(`/files?ownerType=${ownerType}&ownerId=${id}&_sort=createdAt&_order=desc&_limit=1`);
      return response.data;
    },
  upload: async (file: File): Promise<UploadedFileInfo> => {
    const resp = await apiService.uploadFile<UploadedFileInfo>('/upload', file);
    return resp.data;
  },

  // Simpan metadata file ke db.json (resource: uploaded-files)
  saveMeta: async (payload: {
    name: string;
    path: string;
    size: number;
    context?: string;
    entity?: string;
    entityId?: string;
    field?: string;
  }): Promise<SavedFileRecord> => {
    const resp = await apiService.post<SavedFileRecord>('/uploaded-files', payload);
    return resp.data;
  },

  list: async (): Promise<SavedFileRecord[]> => {
    const resp = await apiService.get<SavedFileRecord[]>('/uploaded-files');
    return resp.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiService.delete(`/uploaded-files/${id}`);
  },
};

export default fileService;