import React, { useEffect, useState } from 'react';
import { employeePositionsService } from '../../../services/request/employeePositions.service';
import type { EmployeePositionListItem } from '../../../types/organization.api.types';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import { addNotification } from '@/stores/notificationStore';

interface EditEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: EmployeePositionListItem) => void;
  employeePosition: EmployeePositionListItem | null;
}

const EditEmployeePositionModal: React.FC<EditEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess, employeePosition }) => {
  const [name, setName] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [direktorat, setDirektorat] = useState('');
  const [divisi, setDivisi] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employeePosition) {
      setName(employeePosition.name);
      setJabatan(employeePosition.positionId || '');
      setDirektorat(employeePosition.directorateId || '');
      setDivisi(employeePosition.divisionId || '');
      setDepartemen(employeePosition.departmentId || '');
      setMemoNumber((employeePosition as any).memoNumber || '');
      setDescription((employeePosition as any).description || '');
    }
  }, [employeePosition]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    if (!employeePosition || !name.trim()) return;
    if (!skFile?.name) {
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak diupdate',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      const updated = await employeePositionsService.update(employeePosition.id, {
        name: name.trim(),
        positionId: jabatan.trim(),
        directorateId: direktorat.trim() || null,
        divisionId: divisi.trim() || null,
        departmentId: departemen.trim() || null,
        startDate: null,
        endDate: null,
        memoNumber: memoNumber.trim(),
        skFileId: skFile?.path || skFile?.name,
      });
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update employee position', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      title="Update Posisi"
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Posisi</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Jabatan</label>
            <select
              required
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Jabatan</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Direktorat</label>
            <select
              required
              value={direktorat}
              onChange={(e) => setDirektorat(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Direktorat</option>
              <option value="Teknologi dan Jaringan">Teknologi dan Jaringan</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Divisi</label>
            <select
              required
              value={divisi}
              onChange={(e) => setDivisi(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Divisi</option>
              <option value="Teknologi">Teknologi</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Departemen</label>
            <select
              required
              value={departemen}
              onChange={(e) => setDepartemen(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Departemen</option>
              <option value="Businnes Operation">Businnes Operation</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
            <input
              required
              type="text"
              value={memoNumber}
              onChange={(e) => setMemoNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gambaran Umum</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec."
            />
          </div>
          <FileInput skFileName={skFile?.name || (employeePosition as any)?.skFile?.fileName || ''} onChange={handleFileChange} />
        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default EditEmployeePositionModal;