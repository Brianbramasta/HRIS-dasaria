import React, { useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { companyService, businessLineService } from '../../../services/organization.service';
import type { Company, BusinessLine } from '../../../types/organization.types';
import { PlusIcon } from '../../../../../icons/index';
import { TrashBinIcon } from '../../../../../icons/index';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: Company) => void;
}

interface Document {
  docName: string;
  docNumber: string;
  skFile: File | null;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [businessLineId, setBusinessLineId] = useState('');
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([]);
  const [description, setDescription] = useState('');

  // Document section
  const [documents, setDocuments] = useState<Document[]>([{ docName: '', docNumber: '', skFile: null }]);

  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    // load business lines for selection
    (async () => {
      try {
        const res = await businessLineService.getAll({ search: '', page: 1, pageSize: 100, sortBy: 'name', sortOrder: 'asc' });
        setBusinessLines(res.data);
      } catch (e) {
        console.error('Failed to load business lines', e);
      }
    })();
  }, []);

  const addDocument = () => {
    setDocuments([...documents, { docName: '', docNumber: '', skFile: null }]);
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  const handleDocumentChange = (index: number, field: 'docName' | 'docNumber', value: string) => {
    const newDocuments = [...documents];
    newDocuments[index][field] = value;
    setDocuments(newDocuments);
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const newDocuments = [...documents];
    newDocuments[index].skFile = file;
    setDocuments(newDocuments);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const details = documents
        .map((doc) => [doc.docName.trim(), doc.docNumber.trim(), doc.skFile?.name || ''].filter(Boolean).join(' | '))
        .filter(Boolean)
        .join('; ');

      const created = await companyService.create({
        name: name.trim(),
        description: description.trim(),
        businessLineId: businessLineId || '',
        details: details,
      });
      onSuccess?.(created);
      // reset and close
      setName('');
      setBusinessLineId('');
      setDescription('');
      setDocuments([{ docName: '', docNumber: '', skFile: null }]);
      onClose();
    } catch (err) {
      console.error('Failed to create company', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl p-6 zoom-50" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Tambah Perusahaan</h2>

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
          <label className="text-sm font-medium">Deskripsi Umum</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
          />
        </div>

        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="space-y-2 md:col-span-4">
                <label className="text-sm font-medium">Nama Dokumen</label>
                <input
                  type="text"
                  value={doc.docName}
                  onChange={(e) => handleDocumentChange(index, 'docName', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium">No. Dokumen</label>
                <input
                  type="text"
                  value={doc.docNumber}
                  onChange={(e) => handleDocumentChange(index, 'docNumber', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2 md:col-span-4">
                <label className="text-sm font-medium">Upload file</label>
                <div className="flex items-center gap-2">
                  <input type="file" onChange={(e) => handleFileChange(index, e)} className="text-sm" />
                  {doc.skFile && <span className="text-sm text-gray-600 truncate">{doc.skFile.name}</span>}
                </div>
              </div>
              <div className="flex gap-2 md:col-span-1">
                {documents.length > 1 && (
                  <button onClick={() => removeDocument(index)} className="p-2 h-10 w-10 flex items-center justify-center bg-red-200 text-red-600 rounded-lg">
                    <TrashBinIcon className="w-5 h-5" />
                  </button>
                )}
                {index === documents.length - 1 && (
                  <button onClick={addDocument} className="p-2 h-10 w-10 flex items-center justify-center bg-green-200 text-green-600 rounded-lg">
                    <PlusIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCompanyModal;