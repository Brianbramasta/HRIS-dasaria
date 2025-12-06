import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { departmentsService } from '../../../services/request/departments.service';
import { divisionsService } from '../../../services/request/divisions.service';
import type { DepartmentListItem, DivisionListItem } from '../../../types/organization.api.types';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: DepartmentListItem | null;
  onSuccess?: () => void;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ isOpen, onClose, department, onSuccess }) => {
  const [name, setName] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [divisions, setDivisions] = useState<DivisionListItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const res = await divisionsService.getList({ search: '', page: 1, pageSize: 100, sortBy: 'name', sortOrder: 'asc' });
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
      setDescription((department as any).description || '');
      setMemoNumber((department as any).memoNumber || '');
    }
  }, [isOpen, department]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    if (!department) return;
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Surat Keputusan tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return};
    setSubmitting(true);
    try {
      await departmentsService.update(department.id, {
        name,
        divisionId,
        description: description || null,
        memoNumber,
        skFile: skFile?.file as File,
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
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Update Departemen"
      content={<>
      
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Departemen</label>
          <Input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Divisi</label>
          <Select
            required
            onChange={(e) => setDivisionId(e)}
            options={divisions.map((d) => ({ value: d.id, label: d.name }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            required
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deskripsi Umum</label>
          <TextArea
            required
            value={description}
            onChange={(value) => setDescription(value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as Deskripsi ..."
          />
        </div>

        <FileInput skFileName={skFile?.name || department?.skFile?.fileName || ''} onChange={handleFileChange} />

      </>}
    />
  );
};

export default EditDepartmentModal;
