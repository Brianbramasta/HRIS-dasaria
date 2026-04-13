// Dokumentasi: Modal edit Posisi Pegawai, ambil detail dulu lalu dropdown dinamis menggunakan hooks
import React from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import { useEditEmployeePositionModal } from '../../../hooks/modals/employee-position/useEditEmployeePositionModal';
import SelectField from '@/components/shared/field/SelectField';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';

interface EditEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: EmployeePositionListItem) => void;
  employeePosition: EmployeePositionListItem | null;
}

const EditEmployeePositionModal: React.FC<EditEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess, employeePosition }) => {
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
    structuralJob,
    setStructuralJob,
    structuralJobOptions,
    unit,
    setUnit,
    unitOptions,
    visibleFields,
    handleFileChange,
    handleSubmit,
    searchPositions,
    searchDirectorates,
    searchDivisions,
    searchDepartments,
  } = useEditEmployeePositionModal({ isOpen, onClose, onSuccess, employeePosition });

  return (
    <ModalAddEdit
      title="Update Posisi"
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          <InputField
            label="Nama Posisi"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <SelectField
            label="Jabatan Kepangkatan"
            required
            options={positionOptions}
            placeholder="Pilih Jabatan Kepangkatan"
            defaultValue={jabatan}
            onChange={(v) => {
              setJabatan(v);
              //console.log('value', v);
            }}
            onSearch={async (q) => {
              await searchPositions(q);
            }}
          />
          <SelectField
            label="Jabatan Struktural"
            required={false}
            options={structuralJobOptions}
            placeholder="Pilih Jabatan Struktural"
            defaultValue={structuralJob}
            onChange={(v) => setStructuralJob(v)}
            disabled={!jabatan}
          />
          {visibleFields.direktorat && (
            <SelectField
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
          )}
          {visibleFields.divisi && (
            <SelectField
              label="Divisi"
              required
              options={divisionOptions}
              placeholder="Pilih Divisi"
              defaultValue={divisi}
              onChange={(v) => {
                setDivisi(v);
                setDepartemen('');
              }}
              onSearch={async (q) => {
                await searchDivisions(q);
              }}
            />
          )}
          {visibleFields.departemen && (
            <SelectField
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
          )}
          {visibleFields.unit && (
            <SelectField
              label="Unit"
              required={false}
              options={unitOptions}
              placeholder="Pilih Unit"
              defaultValue={unit}
              onChange={(v) => setUnit(v)}
              disabled={!departemen}
            />
          )}
          <InputField
            label="No. Surat Keputusan / Memo Internal"
            required
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
          />
          <TextAreaField
            label="Deskripsi Tugas"
            required
            value={description}
            onChange={(val) => setDescription(val)}
            className="min-h-28"
            placeholder="Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec."
          />
          <FileInput
            required
            skFileName={skFile?.name || (employeePosition as any)?.skFile?.fileName || ''}
            onChange={handleFileChange}
          />
        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default EditEmployeePositionModal;
