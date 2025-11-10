import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { departmentService, divisionService } from '../../../services/organization.service';
import type { Department, Division } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: Department | null;
  onSuccess?: () => void;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ isOpen, onClose, department, onSuccess }) => {
  const [name, setName] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
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
    if (isOpen && department) {
      setName(department.name || '');
      setDivisionId(department.divisionId || '');
      setMemoNumber(department.memoFile || '');
      setSkFileName(department.skFile || '');
    }
  }, [isOpen, department]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleSubmit = async () => {
    if (!department) return;
    setSubmitting(true);
    try {
      await departmentService.update(department.id, {
        name,
        divisionId,
        memoFile: memoNumber,
        skFile: skFileName || department.skFile,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to update department', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Edit Department</h2>

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

        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK</label>
          <div className="flex items-center gap-2">
            <input type="file" onChange={handleFileChange} />
            {skFileName && <span className="text-sm text-gray-600">{skFileName}</span>}
          </div>
        </div> */}
        <FileInput skFileName={skFileName} onChange={handleFileChange} />

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

export default EditDepartmentModal;