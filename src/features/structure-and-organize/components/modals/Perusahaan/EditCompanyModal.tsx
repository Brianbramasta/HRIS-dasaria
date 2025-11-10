import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { companyService, businessLineService } from '../../../services/organization.service';
import type { Company, BusinessLine } from '../../../types/organization.types';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
  onSuccess?: (updated: Company) => void;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const [name, setName] = useState('');
  const [businessLineId, setBusinessLineId] = useState('');
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([]);
  const [description, setDescription] = useState('');

  // Document fields parsed from details
  const [docName, setDocName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await businessLineService.getAll({ search: '', page: 1, pageSize: 100, sortBy: 'name', sortOrder: 'asc' });
        setBusinessLines(res.data);
      } catch (e) {
        console.error('Failed to load business lines', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setBusinessLineId(company.businessLineId || '');
      setDescription(company.description || '');
      // Parse details into doc fields: "name | number | filename"
      const parts = (company.details || '').split(' | ');
      setDocName(parts[0] || '');
      setDocNumber(parts[1] || '');
      // keep skFile null until new upload; existing filename retained via details
      setSkFile(null);
    }
  }, [company]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    if (!company) return;
    setSubmitting(true);
    try {
      const existingFileName = (company.details || '').split(' | ')[2] || '';
      const details = [docName.trim(), docNumber.trim(), skFile?.name || existingFileName]
        .filter(Boolean)
        .join(' | ');

      const updated = await companyService.update(company.id, {
        name: name.trim(),
        description: description.trim(),
        businessLineId: businessLineId || company.businessLineId,
        details,
      });
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update company', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl p-6 zoom-50" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Update Perusahaan</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Perusahaan</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Lini Bisnis</label>
          <select
            value={businessLineId}
            onChange={(e) => setBusinessLineId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih Lini Bisnis</option>
            {businessLines.map((bl) => (
              <option key={bl.id} value={bl.id}>{bl.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <input
            type="text"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="SK-Dasaria/03/2025"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deksripsi Umum</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK terbaru</label>
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl">⬆️</span>
            </div>
            <p className="text-lg font-semibold">Drop File Here</p>
            <p className="text-sm text-gray-500">Drag and drop your PNG, JPG, WebP, SVG images here or browse</p>
            <label className="mt-3 inline-block cursor-pointer text-primary underline">
              <input type="file" className="hidden" onChange={handleFileChange} />
              Browser File
            </label>
            {(skFile || company?.details) && (
              <p className="mt-2 text-sm text-gray-600">Selected: {skFile?.name || (company?.details?.split(' | ')[2] || '')}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white disabled:opacity-60"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditCompanyModal;