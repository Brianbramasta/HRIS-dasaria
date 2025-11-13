import React, { useState } from 'react';
import { employeePositionService } from '../../../services/organization.service';
import type { EmployeePosition } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import { addNotification } from '@/stores/notificationStore';

interface AddEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: EmployeePosition) => void;
}

const AddEmployeePositionModal: React.FC<AddEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [direktorat, setDirektorat] = useState('');
  const [divisi, setDivisi] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    console.log('submit', name, jabatan, direktorat, divisi, departemen, memoNumber, description, skFile);
    
    if (!skFile) {
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      const created = await employeePositionService.create({
        name: name.trim(),
        positionId: jabatan.trim(),
        directorateId: direktorat.trim(),
        divisionId: divisi.trim(),
        departmentId: departemen.trim(),
        memoFile: memoNumber.trim(),
        description: description.trim(),
        skFile: skFile?.name || '',
      } as Omit<EmployeePosition, 'id' | 'createdAt' | 'updatedAt'>);
      onSuccess?.(created);
      setName('');
      setJabatan('');
      setDirektorat('');
      setDivisi('');
      setDepartemen('');
      setMemoNumber('');
      setDescription('');
      setSkFile(null);
      onClose();
    } catch (err) {
      console.error('Failed to create employee position', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      title="Tambah Posisi"
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
          <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />
        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default AddEmployeePositionModal;