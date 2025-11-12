import React from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { companyService } from '../../../services/organization.service';
import type { Company } from '../../../types/organization.types';
import Input from '@/components/form/input/InputField';

interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
  onSuccess?: () => void;
}

const DeleteCompanyModal: React.FC<DeleteCompanyModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!company) return;
    setSubmitting(true);
    try {
      await companyService.delete(company.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete company', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6 zoom-50 dark:text-white" showCloseButton>
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold">Hapus Data</h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            type="text"
            value={(company?.details || '').split(' | ')[1] || ''}
            disabled
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK</label>
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center text-gray-500">
            <p className="text-lg font-semibold">Drop File Here</p>
            <p className="text-sm">Drag and drop your PNG, JPG, WebP, SVG images here or browse</p>
            <span className="mt-3 inline-block text-primary underline">Browser File</span>
          </div>
          <p className="text-xs text-gray-500">*Data tidak benar-benar dihapus akan tetapi diarsipkan</p>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button
            onClick={handleDelete}
            disabled={submitting}
            className="rounded-xl bg-red-600 px-5 py-2 text-white disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCompanyModal;