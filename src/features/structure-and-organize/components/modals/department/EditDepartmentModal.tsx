import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { departmentsService } from '../../../services/request/DepartmentsService';
import { divisionsService } from '../../../services/request/DivisionsService';
import type { DepartmentListItem, DivisionDropdown } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../../../../../components/shared/field/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';
import {mapToDepartment} from '../../../hooks/useDepartments'

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
  const [divisions, setDivisions] = useState<DivisionDropdown[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Alur edit: ambil detail departemen terlebih dahulu, kemudian dropdown divisi
  useEffect(() => {
    const initEdit = async () => {
      try {
        if (!department?.id) return;
        const detail = await departmentsService.getById(department.id);
        const mappedDepartment = mapToDepartment(detail.data);
        setName(mappedDepartment.name || '');
        setDivisionId(mappedDepartment.divisionId || '');
        setDescription(mappedDepartment.description || '');
        setMemoNumber(mappedDepartment.memoNumber || '');
        const dd = await divisionsService.getDropdown('');
        setDivisions(dd.data || []);
      } catch (err) {
        console.error('Failed to initialize edit department', err);
        addNotification({
          variant: 'error',
          title: 'Departemen tidak diupdate',
          description: 'Gagal mengupdate departemen. Silakan coba lagi.',
          hideDuration: 4000,
        });
      }
    };
    if (isOpen) initEdit();
  }, [isOpen, department?.id]);

  // Menghapus alur lama, kini data diisi dari getById

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    if (!department) return;
    // if (!skFile?.file) {
    //   addNotification({
    //     variant: 'error',
    //     title: 'Surat Keputusan tidak ditambahkan',
    //     description: 'File Wajib di isi',
    //     hideDuration: 4000,
    //   });
    //   return};
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
            options={divisions.map((d) => ({ value: d.id, label: d.division_name }))}
            defaultValue={divisionId}
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
