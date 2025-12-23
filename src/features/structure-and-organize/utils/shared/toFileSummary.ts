import { FileSummary } from '../../types/OrganizationApiTypes'; // Pastikan path sesuai dengan struktur type Anda

/**
 * Mengubah URL file menjadi FileSummary object
 * @param url - URL file yang akan diproses
 * @returns FileSummary object atau null jika url kosong
 */
export const toFileSummary = (url: string | null): FileSummary | null => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1] || '';
  const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';
  return {
    fileName,
    fileUrl: url,
    fileType: ext,
    size: null,
  };
};
