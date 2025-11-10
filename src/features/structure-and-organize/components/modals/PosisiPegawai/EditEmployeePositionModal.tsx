import React, { useEffect, useState } from 'react';
import { employeePositionService } from '../../../services/organization.service';
import type { EmployeePosition } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';

interface EditEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: EmployeePosition) => void;
  employeePosition: EmployeePosition | null;
}

const EditEmployeePositionModal: React.FC<EditEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess, employeePosition }) => {
  const [name, setName] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [direktorat, setDirektorat] = useState('');
  const [divisi, setDivisi] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employeePosition) {
      setName(employeePosition.name);
      setJabatan(employeePosition.positionId);
      setDirektorat(employeePosition.directorateId);
      setDivisi(employeePosition.divisionId);
      setDepartemen(employeePosition.departmentId);
      setMemoNumber(employeePosition.memoFile || '');
      setDescription(employeePosition.description || '');
    }
  }, [employeePosition]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    if (!employeePosition || !name.trim()) return;
    setSubmitting(true);
    try {
      const updated = await employeePositionService.update(employeePosition.id, {
        name: name.trim(),
        positionId: jabatan.trim(),
        directorateId: direktorat.trim(),
        divisionId: divisi.trim(),
        departmentId: departemen.trim(),
        memoFile: memoNumber.trim(),
        description: description.trim(),
        skFile: skFile?.name || employeePosition.skFile,
      } as Omit<EmployeePosition, 'id' | 'createdAt' | 'updatedAt'>);
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
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Jabatan</label>
            <select
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
              type="text"
              value={memoNumber}
              onChange={(e) => setMemoNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gambaran Umum</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec."
            />
          </div>
          <FileInput skFileName={skFile?.name || employeePosition?.skFile || ''} onChange={handleFileChange} />
        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default EditEmployeePositionModal;