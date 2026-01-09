// Dokumentasi: Modal tambah Posisi Pegawai dengan dropdown dinamis menggunakan hooks
import React from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import { useAddEmployeePositionModal } from '../../../hooks/modals/employee-position/useAddEmployeePositionModal';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import TextAreaField from '@/components/shared/field/TextAreaField';

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
          <InputField
            containerClassName="space-y-2"
            label="Nama Posisi"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <SelectField
            containerClassName="space-y-2"
            label="Jabatan"
            required
            options={positionOptions}
            placeholder="Pilih Jabatan"
            defaultValue={jabatan}
            onChange={(v) => setJabatan(v)}
            onSearch={async (q) => {
              await searchPositions(q);
            }}
          />
          <SelectField
            containerClassName="space-y-2"
            label="Direktorat"
            required
            options={directorateOptions}
            placeholder="Pilih Direktorat"
            defaultValue={direktorat}
            onChange={(v) => setDirektorat(v)}
            onSearch={async (q) => {
              await searchDirectorates(q);
            }}
          />
          <SelectField
            containerClassName="space-y-2"
            label="Divisi"
            required
            options={divisionOptions}
            placeholder="Pilih Divisi"
            defaultValue={divisi}
            onChange={(v) => { setDivisi(v); /* reset departemen jika divisi berubah */ setDepartemen(''); }}
            onSearch={async (q) => {
              await searchDivisions(q);
            }}
          />
          <SelectField
            containerClassName="space-y-2"
            label="Departemen"
            required
            options={departmentOptions}
            placeholder="Pilih Departemen"
            defaultValue={departemen}
            onChange={(v) => setDepartemen(v)}
            onSearch={async (q) => {
              await searchDepartments(q);
            }}
          />
          <InputField
            containerClassName="space-y-2"
            label="No. Surat Keputusan / Memo Internal"
            required
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <TextAreaField
            containerClassName="space-y-2"
            label="Gambaran Umum"
            required
            value={description}
            onChange={(e) => setDescription(e)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec."
          />
          <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} required />
        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default AddEmployeePositionModal;
