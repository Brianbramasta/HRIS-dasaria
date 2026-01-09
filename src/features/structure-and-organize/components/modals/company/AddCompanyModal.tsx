import React from 'react';
import type { CompanyListItem } from '../../../types/OrganizationApiTypes';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import SelectField from '@/components/shared/field/SelectField';
import FileInput from '@/components/form/input/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import {  TrashBinIcon } from '@/icons';
import { IconPlus } from '@/icons/components/icons';
import { useAddCompanyModal } from '../../../hooks/modals/company/useAddCompanyModal';



interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: CompanyListItem) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    name,
    setName,
    businessLineId,
    setBusinessLineId,
    businessLines,
    description,
    setDescription,
    documents,
    handleDocChange,
    handleDocFileChange,
    addDocumentRow,
    removeDocumentRow,
    searchBusinessLines,
    submitting,
    handleSubmit,
  } = useAddCompanyModal({ isOpen, onClose, onSuccess });

  return (
    <ModalAddEdit
      title="Tambah Perusahaan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-3xl"
      content={
        <>
          <InputField
              label="Nama Perusahaan"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              containerClassName="space-y-2"
          />

          <SelectField
                label="Lini Bisnis"
                required
              options={businessLines.map((bl) => ({ label: bl.name, value: bl.id }))}
              placeholder="Pilih Lini Bisnis"
              defaultValue={businessLineId}
              onChange={(value) => setBusinessLineId(value)}
              onSearch={async (q) => {
                await searchBusinessLines(q);
              }}
              containerClassName="space-y-2"
            />

          <TextAreaField
              label="Deskripsi Umum"
              required
              value={description}
              onChange={(e) => setDescription(e)}
              className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter as Deskripsi ..."
              containerClassName="space-y-2"
            />

          <div className="mt-4 hidden md:grid md:grid-cols-12 gap-3 text-sm font-medium">
            <div className="md:col-span-4">Nama Dokumen <span className="ml-1 text-error-500">*</span></div>
            <div className="md:col-span-4">No. Dokumen <span className="ml-1 text-error-500">*</span></div>
            <div className="md:col-span-4">Unggah file <span className="ml-1 text-error-500">*</span></div>
          </div>

          {documents.map((doc, idx) => (
            <div key={idx} className="grid grid-cols-12 items-start gap-3 mb-3">
              <div className="col-span-12 md:col-span-4">
                <InputField
                  label="Nama Dokumen"
                  labelClassName="text-sm font-medium md:hidden"
                  required
                  type="text"
                  value={doc.name}
                  onChange={(e) => handleDocChange(idx, 'name', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <InputField
                  label="No. Dokumen"
                  labelClassName="text-sm font-medium md:hidden"
                  required
                  type="text"
                  value={doc.number}
                  onChange={(e) => handleDocChange(idx, 'number', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="text-sm font-medium md:hidden mb-2 block">Unggah file</label>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="flex-1">
                    <FileInput onChange={(e) => handleDocFileChange(idx, e)} required />
                  </div>
                  {idx === documents.length - 1 ? (
                    <div className="flex flex-col gap-2 w-full md:flex-row md:w-auto">
                      {documents.length <= 1 ? null : (
                        <button
                          type="button"
                          onClick={() => removeDocumentRow(idx)}
                          className="ml-0 h-11 w-full rounded-lg bg-rose-500 px-4 text-sm font-medium text-white hover:bg-rose-600 md:ml-1 md:h-9 md:w-9 md:px-0"
                          aria-label="Hapus baris dokumen"
                        >
                          <span className="inline md:hidden">Hapus</span>
                          <TrashBinIcon className="hidden md:inline h-5 w-5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={addDocumentRow}
                        className="ml-0 h-11 w-full rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600 md:ml-1 md:h-9 md:w-9 md:px-0"
                        aria-label="Tambah dokumen"
                      >
                        <span className="inline md:hidden">Tambah</span>
                        <span className="hidden  md:flex md:items-center md:justify-center">
                          <IconPlus size={24} />
                        </span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeDocumentRow(idx)}
                      className="ml-0 h-11 w-full rounded-lg bg-rose-500 px-4 text-sm font-medium text-white hover:bg-rose-600 md:ml-1 md:h-9 md:w-9 md:px-0"
                      aria-label="Hapus baris dokumen"
                    >
                      <span className="inline md:hidden">Hapus</span>
                      <TrashBinIcon className="hidden md:inline h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      }
    />
  );
};

export default AddCompanyModal;
