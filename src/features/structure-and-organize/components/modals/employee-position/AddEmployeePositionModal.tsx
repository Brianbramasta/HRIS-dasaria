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
    structuralJob,
    direktorat,
    divisi,
    departemen,
    unit,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    positionOptions,
    structuralJobOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    unitOptions,
    visibleFields,
    isDisabledField,
    handleFileChange,
    handleSubmit,
    handleClose,
    handleInput,
    searchPositions,
    searchDirectorates,
    searchDivisions,
    searchDepartments,
  } = useAddEmployeePositionModal({ isOpen, onClose, onSuccess });

  return (
    <ModalAddEdit
      title="Tambah Posisi"
      isOpen={isOpen}
      onClose={handleClose}
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
            label="Jabatan Kepangkatan"
            required
            options={positionOptions}
            placeholder="Pilih Jabatan Kepangkatan"
            defaultValue={jabatan}
            onChange={(v) => handleInput('jabatan', v)}
            onSearch={async (q) => {
              await searchPositions(q);
            }}
          />
          <SelectField
            containerClassName="space-y-2"
            label="Jabatan Struktural"
            required={false}
            options={structuralJobOptions}
            placeholder="Pilih Jabatan Struktural"
            defaultValue={structuralJob}
            onChange={(v) => handleInput('structuralJob', v)}
            disabled={!jabatan || isDisabledField}
          />
          {visibleFields.direktorat && (
            <SelectField
              containerClassName="space-y-2"
              label="Direktorat"
              required
              options={directorateOptions}
              placeholder="Pilih Direktorat"
              defaultValue={direktorat}
              onChange={(v) => handleInput('direktorat', v)}
              onSearch={async (q) => {
                await searchDirectorates(q);
              }}
              disabled={isDisabledField}
            />
          )}
          {visibleFields.divisi && (
            <SelectField
              containerClassName="space-y-2"
              label="Divisi"
              required
              options={divisionOptions.length > 0 ? divisionOptions : [{ label: 'Pilih direktorat terlebih dahulu', value: '' }]}
              placeholder="Pilih Divisi"
              defaultValue={divisi}
              onChange={(v) => handleInput('divisi', v)}
              onSearch={async (q) => {
                await searchDivisions(q);
              }}
              disabled={!direktorat || isDisabledField}
            />
          )}
          {visibleFields.departemen && (
            <SelectField
              containerClassName="space-y-2"
              label="Departemen"
              required
              options={departmentOptions.length > 0 ? departmentOptions : [{ label: 'Pilih divisi terlebih dahulu', value: '' }]}
              placeholder="Pilih Departemen"
              defaultValue={departemen}
              onChange={(v) => handleInput('departemen', v)}
              onSearch={async (q) => {
                await searchDepartments(q);
              }}
              disabled={!divisi || isDisabledField}
            />
          )}
          {visibleFields.unit && (
            <SelectField
              containerClassName="space-y-2"
              label="Unit"
              required={false}
              options={unitOptions.length > 0 ? unitOptions : [{ label: 'Pilih departemen terlebih dahulu', value: '' }]}
              placeholder="Pilih Unit"
              defaultValue={unit}
              onChange={(v) => handleInput('unit', v)}
              disabled={!departemen || isDisabledField}
            />
          )}
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
            label="Deskripsi Tugas"
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
