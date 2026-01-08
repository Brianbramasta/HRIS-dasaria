// Dokumentasi: Modal tambah Posisi Pegawai dengan dropdown dinamis menggunakan hooks
import React from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Select from '@/components/form/Select';
import { useAddEmployeePositionModal } from '../../../hooks/modals/employee-position/useAddEmployeePositionModal';

interface AddEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: EmployeePositionListItem) => void;
}

const AddEmployeePositionModal: React.FC<AddEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    name,
    setName,
    jabatan,
    setJabatan,
    direktorat,
    setDirektorat,
    divisi,
    setDivisi,
    departemen,
    setDepartemen,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    positionOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    handleFileChange,
    handleSubmit,
    searchPositions,
    searchDirectorates,
    searchDivisions,
    searchDepartments,
  } = useAddEmployeePositionModal({ isOpen, onClose, onSuccess });

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
            <Select
              required
              options={positionOptions}
              placeholder="Pilih Jabatan"
              defaultValue={jabatan}
              onChange={(v) => setJabatan(v)}
              onSearch={async (q) => {
                await searchPositions(q);
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Direktorat</label>
            <Select
              required
              options={directorateOptions}
              placeholder="Pilih Direktorat"
              defaultValue={direktorat}
              onChange={(v) => setDirektorat(v)}
              onSearch={async (q) => {
                await searchDirectorates(q);
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Divisi</label>
            <Select
              required
              options={divisionOptions}
              placeholder="Pilih Divisi"
              defaultValue={divisi}
              onChange={(v) => { setDivisi(v); /* reset departemen jika divisi berubah */ setDepartemen(''); }}
              onSearch={async (q) => {
                await searchDivisions(q);
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Departemen</label>
            <Select
              required
              options={departmentOptions}
              placeholder="Pilih Departemen"
              defaultValue={departemen}
              onChange={(v) => setDepartemen(v)}
              onSearch={async (q) => {
                await searchDepartments(q);
              }}
            />
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
