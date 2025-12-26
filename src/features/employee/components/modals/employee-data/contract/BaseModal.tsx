import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/components/shared/field/FileInput';
import DatePicker from '@/components/form/date-picker';
import { formatDateToIndonesian } from '@/utils/formatDate';
import LinkPreview from '@/components/shared/form/LinkPreview';

export type ContractEntry = {
  id?: string;
  full_name: string;
  contract_status_id: string;
  contract_status_name?: string;
  last_contract_signed_date: string; // yyyy-MM-dd
  end_date: string; // yyyy-MM-dd
  contract_type: string; // PKWT / PKWTT / dll
  contract_number: number;
  contract_end_status_id?: string;
  contract_end_status_name?: string;
  deskripsi?: string;
  fileName?: string;
  file_contract?: string;
  catatan?: string;
  dokumenBerakhir?: string;
  lamaBekerja?: string;
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
}

const defaultJenisKontrakOptions = [
  { value: 'PKWT', label: 'PKWT' },
  { value: 'PKWTT', label: 'PKWTT' },
];

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
  optionsJenisKontrak = defaultJenisKontrakOptions,
  onInputChange,
  onDateChange,
  onFileChange,
  showStatusBerakhir = false,
  isLoading = false,
  maxWidth = 'max-w-3xl',
}) => {
  const content = (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Nama Lengkap */}
      <div className="col-span-2">
        <Label>Nama Lengkap</Label>
        <InputField
          readonly
          placeholder="Nama Lengkap"
          value={form.full_name}
          onChange={(e) => onInputChange('full_name', e.target.value)}
          required
        />
      </div>

      {/* Status Kontrak */}
      <div className="md:col-span-2">
        <Label>Status Kontrak</Label>
        <Select
          options={optionsContractStatus}
          placeholder="Select"
          defaultValue={form.contract_status_id}
          onChange={(v) => onInputChange('contract_status_id', v)}
          disabled={isReadonly}
          required
        />
      </div>

      {/* TTD Kontrak Terakhir */}
      <div>
        <DatePicker
          id="last_contract_signed_date"
          label="TTD Kontrak Terakhir"
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.last_contract_signed_date) || undefined}
          onChange={isReadonly ? () => {} : onDateChange('last_contract_signed_date')}
        />
      </div>

      {/* Berakhir Kontrak */}
      <div>
        <DatePicker
          id="end_date"
          label="Berakhir Kontrak"
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.end_date) || undefined}
          onChange={isReadonly ? () => {} : onDateChange('end_date')}
        />
      </div>

      {/* Jenis Kontrak */}
      <div>
        <Label>Jenis Kontrak</Label>
        <Select
          options={optionsJenisKontrak}
          placeholder="Select"
          defaultValue={form.contract_type}
          onChange={(v) => onInputChange('contract_type', v)}
          disabled={isReadonly}
          required
        />
      </div>

      {/* Kontrak ke */}
      <div>
        <Label>Kontrak ke</Label>
        <InputField
          type="number"
          min="0"
          value={form.contract_number}
          onChange={(e) => onInputChange('contract_number', Number(e.target.value))}
          readonly={isReadonly}
        />
      </div>

      {/* Status Berakhir - hanya tampil untuk edit dan jika showStatusBerakhir true */}
      {showStatusBerakhir && (
        <div className="md:col-span-2">
          <Label>Status Berakhir</Label>
          <Select
            options={optionsContractEndStatus}
            placeholder="Select"
            defaultValue={form.contract_end_status_id}
            onChange={(v) => onInputChange('contract_end_status_id', v)}
            disabled={isReadonly}
          />
        </div>
      )}

      {/* Dokumen Kontrak */}
      <div className="md:col-span-2">
        <Label>Dokumen Kontrak</Label>
        {isReadonly ? (
          <LinkPreview
            label="Lihat Detail"
            url={form.file_contract ? String(form.file_contract) : undefined}
          />
        ) : (
          <FileInput
            skFileName={form.fileName || ''}
            onChange={onFileChange || (() => {})}
          />
        )}
      </div>

      {/* Catatan - hanya tampil saat edit mode dan Status Berakhir diisi */}
      {showStatusBerakhir && form.contract_end_status_id && form.contract_end_status_id !== '' && (
        <div className="col-span-2">
          <Label>Catatan</Label>
          <TextArea
            placeholder="Enter as description ..."
            rows={4}
            value={form.catatan || ''}
            onChange={(v) => onInputChange('catatan', v)}
            disabled={isReadonly}
          />
        </div>
      )}

      {/* Unggah Dokumen Berakhir - hanya tampil saat edit mode dan Status Berakhir diisi */}
      {showStatusBerakhir && form.contract_end_status_id && form.contract_end_status_id !== '' && !isReadonly && (
        <div className="col-span-2">
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
            isLabel={true}
          />
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
    />
  );
};

export default BaseContractModal;
