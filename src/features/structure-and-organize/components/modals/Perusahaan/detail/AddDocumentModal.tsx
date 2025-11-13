import React, { useState } from 'react';
import { apiService } from '../../../../../../services/api';
import ModalAddEdit from '../../shared/modal/modalAddEdit';
import FileInput from '../../../../../../components/form/input/FileInput';
import { addNotification } from '@/stores/notificationStore';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, companyId, onSuccess }) => {
  type DocEntry = { name: string; docNumber: string; file: File | null };
  const [entries, setEntries] = useState<DocEntry[]>([{ name: '', docNumber: '', file: null }]);
  const [submitting, setSubmitting] = useState(false);
  // default type to active to preserve filtering in listing
  const defaultType: 'active' | 'archive' = 'active';

  const updateEntry = (index: number, patch: Partial<DocEntry>) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, { name: '', docNumber: '', file: null }]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    updateEntry(index, { file: f });
  };

  const handleSubmit = async () => {
    if (!companyId) return;
    const valid = entries.filter((e) => e.name.trim() && e.file);
    if (!valid.length) {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak ditambahkan',
        description: 'Isi minimal satu dokumen dan unggah file.',
      });
      return;
    }
    setSubmitting(true);
    try {
      const now = Date.now();
      await Promise.all(
        valid.map((e, idx) => {
          const payload = {
            id: `${now}-${idx}`,
            name: e.name.trim(),
            docNumber: e.docNumber.trim(),
            fileName: e.file?.name || '',
            filePath: e.file?.name || '',
            ownerType: 'company',
            ownerId: companyId,
            size: e.file ? `${Math.round((e.file.size || 0) / 1024)} KB` : undefined,
            type: defaultType,
            createdAt: new Date().toISOString(),
          } as any;
          return apiService.post('/documents', payload);
        })
      );
      onSuccess?.();
      setEntries([{ name: '', docNumber: '', file: null }]);
      onClose();
    } catch (err) {
      console.error('Failed to create documents', err);
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
      title="Tambah Dokumen"
      content={
        <>
          {entries.map((entry, idx) => (
            <div key={`entry-${idx}`} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Dokumen</label>
                <input
                  required
                  value={entry.name}
                  onChange={(e) => updateEntry(idx, { name: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. Dokumen</label>
                <input
                  required
                  value={entry.docNumber}
                  onChange={(e) => updateEntry(idx, { docNumber: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload file</label>
                <FileInput onChange={(e) => handleFileChange(idx, e)} />
              </div>
              {entries.length > 1 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => removeEntry(idx)}
                    className="w-full rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
              {idx === 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={addEntry}
                    className="w-full rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700 inline-flex items-center justify-center gap-2"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white">+</span>
                    Tambah
                  </button>
                </div>
              )}
              <hr className="my-4 border-gray-200" />
            </div>
          ))}
        </>
      }
    />
  );
};

export default AddDocumentModal;
