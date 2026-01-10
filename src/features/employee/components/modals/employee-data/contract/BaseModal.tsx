import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';

import { formatDateToIndonesian } from '@/utils/formatDate';
import LinkPreview from '@/components/shared/form/LinkPreview';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { useContractModalConfig } from '@/features/employee/hooks/modals/employee-data/contract/useContractModalConfig';
import SelectField from '@/components/shared/field/SelectField';
import DateField from '@/components/shared/field/DateField';
import FileInput from '@/components/shared/form/FileInput';
import TextAreaField from '@/components/shared/field/TextAreaField';
import InputField from '@/components/shared/field/InputField';

export type ContractEntry = {
  id?: string;
  full_name: string;
  contract_status: string;
  // contract_status_name?: string;
  last_contract_signed_date: string; // yyyy-MM-dd
  end_date: string; // yyyy-MM-dd
  contract_type_id: string; // PKWT / PKWTT / dll
  contract_type_name?: string; // PKWT / PKWTT / dll
  contract_number: number;
  contract_end_status_id?: string;
  contract_end_status_name?: string;
  deskripsi?: string;
  fileName?: string;
  file_contract?: string;
  note?: string;
  file_for_resign?: string;
  dokumenBerakhir?: string;
  lama_bekerja?: string;
};

interface BaseContractModalProps {
  isOpen: boolean;
  title: string;
  form: ContractEntry;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  isReadonly?: boolean;
  optionsContractStatus: { label: string; value: string }[];
  optionsContractEndStatus?: { label: string; value: string }[];
  optionsJenisKontrak?: { label: string; value: string }[];
  onInputChange: (key: keyof ContractEntry, value: any) => void;
  onDateChange: (key: keyof ContractEntry) => (selectedDates: Date[]) => void;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showStatusBerakhir?: boolean;
  isLoading?: boolean;
  maxWidth?: string;
  isEditStatusBerakhir?: boolean;
}

const BaseContractModal: React.FC<BaseContractModalProps> = ({
  isOpen,
  title,
  form,
  onClose,
  onSubmit,
  submitting = false,
  isReadonly = false,
  optionsContractStatus,
  optionsContractEndStatus = [],
  optionsJenisKontrak,
  onInputChange,
  onDateChange,
  onFileChange,
  showStatusBerakhir = false,
  isLoading = false,
  maxWidth = 'max-w-3xl',
  isEditStatusBerakhir = false,
}) => {
  const { optionsJenisKontrak: defaultJenisKontrakOptions } = useContractModalConfig();
  const jenisKontrakOptions = optionsJenisKontrak ?? defaultJenisKontrakOptions;
  const content = (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Nama Lengkap */}
      <div className="col-span-1 md:col-span-2">
        <InputField
          label="Nama Lengkap"
          readonly
          placeholder="Nama Lengkap"
          value={form.full_name}
          onChange={(e) => onInputChange('full_name', e.target.value)}
          required={!isReadonly}
        />
      </div>

      {/* Status Kontrak */}
      <div className="md:col-span-2">
        <SelectField
          label="Status Kontrak"
          options={optionsContractStatus}
          placeholder="Select"
          defaultValue={form.contract_status}
          onChange={(v) => onInputChange('contract_status', v)}
          disabled={isReadonly}
          required={!isReadonly}
        />
      </div>

      {/* TTD Kontrak Terakhir */}
      <div className={form.contract_type_name === 'PKWTT' ? 'md:col-span-2' : ''}>
        <DateField
          id="last_contract_signed_date"
          label="TTD Kontrak Terakhir"
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.last_contract_signed_date) || undefined}
          onChange={isReadonly ? () => {} : onDateChange('last_contract_signed_date')}
          disabled={isReadonly}
          required={!isReadonly}
        />
      </div>

      {/* Berakhir Kontrak */}
     {form.contract_type_name !== 'PKWTT' && 
     <div>
        <DateField
          id="end_date"
          label="Berakhir Kontrak"
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.end_date) || undefined}
          onChange={isReadonly ? () => {} : onDateChange('end_date')}
          disabled={isReadonly}
          required={!isReadonly}
        />
      </div>}

      {/* Jenis Kontrak */}
      <div>
        <SelectField
          label="Jenis Kontrak"
          options={jenisKontrakOptions}
          placeholder="Select"
          defaultValue={form.contract_type_id}
          onChange={(v) => onInputChange('contract_type_id', v)}
          disabled={isReadonly}
          required={!isReadonly}
        />
      </div>

      {/* Kontrak ke */}
      <div>
        <InputField
          label="Kontrak ke"
          type="number"
          min="0"
          value={form.contract_number}
          onChange={(e) => onInputChange('contract_number', Number(e.target.value))}
          readonly={true}
        />
      </div>

      {/* Status Berakhir - hanya tampil untuk edit dan jika showStatusBerakhir true */}
      {showStatusBerakhir && (
        <div className="md:col-span-2">
          <SelectField
            label="Status Berakhir"
            options={optionsContractEndStatus}
            placeholder="Select"
            defaultValue={form.contract_end_status_id}
            onChange={(v) => onInputChange('contract_end_status_id', v)}
            disabled={isReadonly  && !isEditStatusBerakhir}
          />
        </div>
      )}

      {/* Dokumen Kontrak */}
      <div className="md:col-span-2">
        <Label>Dokumen Kontrak</Label>
        {form.file_contract ? (
          <LinkPreview
            label="Lihat Detail"
            url={form.file_contract ? formatUrlFile(form.file_contract) : undefined}
          />
        ) : (
          <FileInput
            skFileName={form.fileName || ''}
            onChange={onFileChange || (() => {})}
            isLabel={false}
            required={!isReadonly}
          />
        )}
      </div>

      {/* Catatan - hanya tampil saat edit mode dan Status Berakhir diisi */}
      {showStatusBerakhir && form.contract_end_status_id && form.contract_end_status_id !== '' && (
        <div className="col-span-2">
          <TextAreaField
            label="Catatan"
            placeholder="Enter as description ..."
            rows={4}
            value={form.note || ''}
            onChange={(v) => onInputChange('note', v)}
            disabled={isReadonly && !isEditStatusBerakhir}
          />
        </div>
      )}

      {/* Unggah Dokumen Berakhir - hanya tampil saat edit mode dan Status Berakhir diisi */}
      {showStatusBerakhir && form.contract_end_status_id && form.contract_end_status_id !== ''  && (
        <div className="col-span-2">
          <Label>Dokumen Berakhir</Label>
          {isReadonly && !isEditStatusBerakhir ?   (<LinkPreview
            label="Lihat Detail"
            url={form.file_for_resign ? formatUrlFile(form.file_for_resign) : undefined}
            
          /> ): (
          <FileInput
            skFileName={form.dokumenBerakhir || ''}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onInputChange('dokumenBerakhir', file.name);
                onFileChange?.(e);
              } else {
                onFileChange?.(e);
              }
            }}
            isLabel={false}
          />)
          }
        </div>
      )}
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={onSubmit}
      submitting={submitting || isLoading}
      maxWidth={maxWidth}
      isSubmit={isReadonly && !isEditStatusBerakhir? false : true}
    />
  );
};

export default BaseContractModal;
