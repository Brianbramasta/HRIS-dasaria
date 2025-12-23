import React, { useEffect, useState } from 'react';
import type { DivisionDropdown } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../../../../../components/shared/field/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';
import { useDepartments } from '../../../hooks/useDepartments';
import { useDivisions } from '../../../hooks/useDivisions';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [divisions, setDivisions] = useState<DivisionDropdown[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { createDepartment } = useDepartments();
  const { getDropdown: getDivisionDropdown } = useDivisions();

  // Mengambil dropdown Divisi sesuai kontrak API 1.7
  useEffect(() => {
    const loadDivisions = async () => {
      try {
        const res = await getDivisionDropdown('');
        setDivisions(res || []);
      } catch (err) {
        console.error('Failed to load divisions', err);
      }
    };
    if (isOpen) loadDivisions();
  }, [isOpen, getDivisionDropdown]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDivisionId('');
      setDescription('');
      setMemoNumber('');
      useFileStore.getState().clearSkFile();
    }
  }, [isOpen]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    setSubmitting(true);
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Surat Keputusan tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    try {
      await createDepartment({
        name,
        divisionId,
        description: description || null,
        memoNumber,
        skFile: skFile?.file as File,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to add department', err);
      addNotification({
        variant: 'error',
        title: 'Departemen tidak ditambahkan',
        description: 'Gagal menambahkan departemen. Silakan coba lagi.',
        hideDuration: 4000,
      });
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
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Divisi</label>
          
          <Select
          required
            options={divisions.map((d) => ({ value: d.id, label: d.division_name }))}
            onChange={(e) => setDivisionId(e)}
            defaultValue={divisionId}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
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


        <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />

      </>}
    />
  );
};

export default AddDepartmentModal;
