import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { departmentService, divisionService } from '../../../services/organization.service';
import type { Division } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

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
    <ModalAddEdit 
      title="Add Department"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      content={<>
      <div className="space-y-2">
          <label className="text-sm font-medium">Nama Departemen</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Divisi</label>
          
          <Select
            options={divisions.map((d) => ({ value: d.id, label: d.name }))}
            onChange={(e) => setDivisionId(e)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>


        <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />

      </>}
    />
  );
};

export default AddDepartmentModal;