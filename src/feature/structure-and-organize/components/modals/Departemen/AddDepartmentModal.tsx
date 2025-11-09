import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { departmentService, divisionService } from '../../../services/organization.service';
import type { Division } from '../../../types/organization.types';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const res = await divisionService.getAll({ search: '', page: 1, pageSize: 100, sortBy: 'name', sortOrder: 'asc' });
        setDivisions(res.data || []);
      } catch (err) {
        console.error('Failed to load divisions', err);
      }
    };
    if (isOpen) loadDivisions();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDivisionId('');
      setMemoNumber('');
      setSkFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await departmentService.create({
        name,
        divisionId,
        skFile: skFile?.name,
        memoFile: memoNumber,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to add department', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Add Department</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Departemen</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Divisi</label>
          <select
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih Divisi</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <input
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name || !divisionId}
            className="rounded-xl bg-primary px-5 py-2 text-white disabled:opacity-60"
          >
            Simpan
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddDepartmentModal;