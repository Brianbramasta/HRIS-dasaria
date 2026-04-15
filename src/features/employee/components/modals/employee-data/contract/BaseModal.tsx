import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Alert from '@/components/ui/alert/Alert';

import { formatDateToIndonesian } from '@/utils/formatDate';
import LinkPreview from '@/components/shared/form/LinkPreview';
import { formatUrlFile } from '@/utils/formatUrlFile';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';
import { useContractModalConfig } from '@/features/employee/hooks/modals/employee-data/contract/useContractModalConfig';
import SelectField from '@/components/shared/field/SelectField';
import DateField from '@/components/shared/field/DateField';
import FileInput from '@/components/shared/form/FileInput';
import TextAreaField from '@/components/shared/field/TextAreaField';
import InputField from '@/components/shared/field/InputField';
import type { ContractEntry } from '@/features/employee/types/dto/ContractType';

export type { ContractEntry };

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
  getFieldError?: (field: 'start_date' | 'end_date') => string | null;
  validation?: { isValid: boolean; errors: any[] };
  isFormComplete?: boolean;
  alertMessage?: string;
  showAlert?: boolean;
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
  getFieldError,
  validation,
  isFormComplete,
  showAlert,
  alertMessage,
}) => {
  const { optionsJenisKontrak: defaultJenisKontrakOptions } = useContractModalConfig();
  const jenisKontrakOptions = optionsJenisKontrak ?? defaultJenisKontrakOptions;
  const content = (
    <>
      {/* Show Alert if validation fails */}
      {showAlert && alertMessage && (
        <div className="mb-4">
          <Alert
            variant="error"
            title="Validasi Gagal"
            message={alertMessage}
          />
        </div>
      )}
      
      {!showAlert && (
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
          disabled={true}
        />
      </div>

      {/* Status Kontrak */}
      <div className="md:col-span-2">
        <SelectField
          label="Status Kontrak"
          options={optionsContractStatus}
          placeholder="Select"
          defaultValue={form.contract_status || 'Aktif'}
          onChange={(v) => onInputChange('contract_status', v)}
          disabled={true}
          required={!isReadonly}
        />
      </div>
      
      {/* Jenis Kontrak */}
      <div>
        <SelectField
          label="Jenis Kontrak"
          options={jenisKontrakOptions}
          placeholder="Select"
          defaultValue={form.contract_type_id}
          onChange={(v) => {
            onInputChange('contract_type_id', v);
            const selectedOption = jenisKontrakOptions.find(option => option.value === v);
            if (selectedOption) {
              onInputChange('contract_type_name', selectedOption.label);
            }
          }}
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
          disabled={true}
        />
      </div>

      {/* TTD Kontrak Terakhir */}
      <div className={form.contract_type_name === 'PKWTT' ? 'md:col-span-2' : ''}>
        <DateField
          id="last_contract_signed_date"
          label="Mulai Kontrak"
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.last_contract_signed_date) || undefined}
          onChange={isReadonly ? () => {} : onDateChange('last_contract_signed_date')}
          disabled={isReadonly}
          required={!isReadonly}
          error={getFieldError?.('start_date') || undefined}
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
          error={getFieldError?.('end_date') || undefined}
        />
      </div>}

      

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
        {/* <Label>Dokumen Kontrak</Label> */}
        {form.file_contract ? (
          <>
        <Label>Dokumen Kontrak</Label> 

          <LinkPreview
            label="Lihat Detail"
            url={form.file_contract}
            onClick={() => form.file_contract && handleViewFileByUrl(form.file_contract)}
          /></>
        ) : (
          <FileInput
            skFileName={form.fileName || ''}
            onChange={onFileChange || (() => {})}
            // isLabel={false}
            label='Dokumen Kontrak'
            required={!isReadonly}
            maxFileSize = {10 * 1024 * 1024}
          />
        )}
      </div>

      {/* Document Lampiran */}
      {form.document_lampiran && (
        <div className="md:col-span-2">
          <Label>Dokumen Lampiran</Label>
          <LinkPreview
            label="Lihat Detail"
            url={form.document_lampiran}
            onClick={() => form.document_lampiran && handleViewFileByUrl(form.document_lampiran)}
          />
        </div>
      )}

      {/* Document Berakhir */}
      {form.document && (
        <div className="md:col-span-2">
          <Label>Dokumen Berakhir</Label>
          <LinkPreview
            label="Lihat Detail"
            url={form.document}
            onClick={() => form.document && handleViewFileByUrl(form.document)}
          />
        </div>
      )}

      {form.evaluation_doc && (
        <div className="md:col-span-2">
          <Label>Evaluation Dokumen</Label>
          <LinkPreview
            label="Lihat Detail"
            url={form.evaluation_doc}
            onClick={() => form.evaluation_doc && handleViewFileByUrl(form.evaluation_doc)}
          />
        </div>
      )}

      {/* ambil dari  */}

      {/* Note HR - tampil untuk detail modal */}
      {form.note_hr && (
        <div className="col-span-2">
          <TextAreaField
            label="Catatan HR"
            placeholder="Catatan HR..."
            rows={3}
            value={form.note_hr || ''}
            onChange={() => {}}
            disabled={true}
          />
        </div>
      )}

      {/* Description - tampil untuk detail modal */}
      {form.description && (
        <div className="col-span-2">
          <TextAreaField
            label="Deskripsi"
            placeholder="Deskripsi..."
            rows={3}
            value={form.description || ''}
            onChange={() => {}}
            disabled={true}
          />
        </div>
      )}

      {/* Remaining Month - tampil untuk detail modal */}
      {/* {form.remaining_month && (
        <div className="md:col-span-2">
          <InputField
            label="Sisa Kontrak"
            placeholder="Sisa Kontrak"
            value={form.remaining_month}
            onChange={() => {}}
            disabled={true}
          />
        </div>
      )} */}

      {/* Document Lampiran - tampil untuk detail modal */}
      {form.document_lampiran && (
        <div className="col-span-2">
          <LinkPreview
            label="Dokumen Lampiran"
            url={formatUrlFile(form.document_lampiran)}
          />
        </div>
      )}

      {/* Document - tampil untuk detail modal */}
      {form.document && (
        <div className="col-span-2">
          <LinkPreview
            label="Dokumen Berakhir"
            url={formatUrlFile(form.document)}
          />
        </div>
      )}

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
    </div>)}
    </>
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
      isSubmit={isReadonly && !isEditStatusBerakhir? false : (isFormComplete && (validation?.isValid ?? true))}
    />
  );
};

export default BaseContractModal;
