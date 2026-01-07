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
import { useContractModal, type ContractEntry } from '@/features/employee/hooks/modals/employee-data/contract/useContractModal';
import { useContractModalConfig } from '@/features/employee/hooks/modals/employee-data/contract/useContractModalConfig';

export type { ContractEntry };

interface ContractModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: ContractEntry | null;
  onClose: () => void;
  onSubmit: (data: ContractEntry) => void;
  submitting?: boolean;
  onFileChange?: (file: File | null) => void;
  showStatusBerakhir?: boolean;
}

const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
  submitting = false,
  onFileChange,
  showStatusBerakhir = false,
}) => {
  const { optionsJenisKontrak } = useContractModalConfig();
  const {
    form,
    title,
    optionsContractStatus: optionsConntractStatus,
    optionsContractEndStatus,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChange,
  } = useContractModal({
    isOpen,
    mode,
    initialData,
    showStatusBerakhir,
    onFileChange,
  });

  const content = (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="col-span-2">
        <Label>Nama Lengkap</Label>
        <InputField readonly placeholder="Nama Lengkap" value={form.full_name} onChange={(e) => handleInput('full_name', e.target.value)} required />
      </div>

      <div className='md:col-span-2'>
        <Label>Status Kontrak</Label>
        <Select options={optionsConntractStatus} placeholder="Select" defaultValue={form.contract_status_id} onChange={(v) => handleInput('contract_status_id', v)} required />
      </div>

      <div>
        <DatePicker 
          id="last_contract_signed_date" 
          label="TTD Kontrak Terakhir" 
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.last_contract_signed_date) || undefined}
          onChange={handleDateChange('last_contract_signed_date')}
        />
      </div>
      <div>
        <DatePicker 
          id="end_date" 
          label="Berakhir Kontrak" 
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.end_date) || undefined}
          onChange={handleDateChange('end_date')}
        />
      </div>

      <div>
        <Label>Jenis Kontrak</Label>
        <Select options={optionsJenisKontrak} placeholder="Select" defaultValue={form.contract_type} onChange={(v) => handleInput('contract_type', v)} required />
      </div>
      <div>
        <Label>Kontrak ke</Label>
        <InputField type="number" min="0" value={form.contract_number} onChange={(e) => handleInput('contract_number', Number(e.target.value))} />
      </div>

      <div className='md:col-span-2' hidden={!showStatusBerakhir}>
        <Label>Status Berakhir</Label>
        <Select options={optionsContractEndStatus} placeholder="Select" defaultValue={form.contract_end_status_id} onChange={(v) => handleInput('contract_end_status_id', v)} />
      </div>

      <div className='md:col-span-2' >
        <Label>Dokumen Kontrak</Label>
      {mode === 'edit'? (
        <div className="col-span-2">
          <LinkPreview label="Lihat Detail" url={form.file_contract ? String(form.file_contract) : undefined} />
        </div>
      ): ( <div className="col-span-2">
        <FileInput skFileName={form.fileName || ''} onChange={handleFileChange} />
      </div>)}
      </div>

      {/* Catatan - hanya tampil saat edit dan Status Berakhir diisi */}
      {mode === 'edit' && form.contract_end_status_id && form.contract_end_status_id !== '' && (
        <div className="col-span-2">
          <Label>Catatan</Label>
          <TextArea placeholder="Enter as description ..." rows={4} value={form.catatan || ''} onChange={(v) => handleInput('catatan', v)} />
        </div>
      )}

      {/* Unggah Dokumen Berakhir - hanya tampil saat edit dan Status Berakhir diisi */}
      {mode === 'edit' && form.contract_end_status_id && form.contract_end_status_id !== '' && (
        <div className="col-span-2">
          <FileInput skFileName={form.dokumenBerakhir || ''} onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleInput('dokumenBerakhir', file.name);
              onFileChange?.(file);
            } else {
              onFileChange?.(null);
            }
          }} isLabel={true} />
        </div>
      )}
      {/* <div className="col-span-2" hidden>
        <Label>Description</Label>
        <TextArea placeholder="Enter as description ..." rows={4} value={form.deskripsi || ''} onChange={(v) => handleInput('deskripsi', v)} />
      </div> */}

     
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-3xl"
    />
  );
};

export default ContractModal;
