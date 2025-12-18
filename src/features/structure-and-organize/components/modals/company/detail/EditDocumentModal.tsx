import React from 'react';
// Dokumentasi: Integrasi service companiesService untuk tambah dokumen perusahaan bila ada file baru
import { companiesService } from '../../../../services/request/CompaniesService';
import ModalAddEdit from '../../shared/modal/ModalAddEdit';
import FileInput from '../../../../../../components/form/input/FileInput';
import { addNotification } from '@/stores/notificationStore';

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName?: string;
  document?: any | null;
  onSuccess?: () => void;
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ isOpen, onClose, companyId, companyName, document, onSuccess }) => {
  const [name, setName] = React.useState('');
  const [docNumber, setDocNumber] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (document) {
      setName(document?.name || document?.fileName || '');
      setDocNumber(document?.docNumber || document?.doc_number || '');
      setFile(null);
    }
  }, [document, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!document || !companyId) return;
    if (!name.trim()) {
      addNotification({
        variant: 'error',
        title: 'Gagal menyimpan dokumen',
        description: 'Nama dokumen wajib diisi.',
      });
      return;
    }
    setSubmitting(true);
    try {
      if (file) {
        await companiesService.addDocuments(companyId, [{ name: name.trim(), number: docNumber.trim(), file }]);
      } else {
        // Tetap lakukan update metadata bila tidak ada file baru
        const payload: any = {
          name: name.trim(),
          doc_number: docNumber.trim(),
          file_name: document?.fileName || document?.file_name || '',
          owner_type: 'company',
          owner_id: companyId,
          size: document?.size || undefined,
          updated_at: new Date().toISOString(),
        };
        await (await import('../../../../../../services/api')).apiService.patch(`/files/${document.id}`, payload as any);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to update document', err);
      addNotification({
        variant: 'error',
        title: 'Gagal menyimpan dokumen',
        description: 'Terjadi kesalahan saat menyimpan dokumen.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Edit Dokumen"
      maxWidth="max-w-md"
      content={
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Perusahaan</label>
            <input
              value={companyName || ''}
              disabled
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Nama Dokumen</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">No. Dokumen</label>
            <input
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Unggah file</label>
            <FileInput onChange={handleFileChange} />
          </div>
        </>
      }
    />
  );
};

export default EditDocumentModal;

