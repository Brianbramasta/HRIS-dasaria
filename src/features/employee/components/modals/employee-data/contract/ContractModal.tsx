import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/components/shared/field/FileInput';
import DatePicker from '@/components/form/date-picker';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { getContractStatusDropdownOptions, getContractEndStatusDropdownOptions } from '@/features/employee/hooks/employee-data/detail/contract/useContract';
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

const optionsJenisKontrak = [
  { value: 'PKWT', label: 'PKWT' },
  { value: 'PKWTT', label: 'PKWTT' },
];

const emptyForm: ContractEntry = {
  full_name: '',
  contract_status_id: '',
  last_contract_signed_date: '',
  end_date: '',
  contract_type: '',
  contract_number: 0,
  contract_end_status_id: '',
  deskripsi: '',
  catatan: '',
  dokumenBerakhir: '',
};

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, mode, initialData, onClose, onSubmit, submitting = false, onFileChange, showStatusBerakhir = false }) => {
  const [form, setForm] = useState<ContractEntry>(emptyForm);
  const title = useMemo(() => (mode === 'add' ? 'Tambah Kontrak' : 'Edit Kontrak'), [mode]);
  const [optionsConntractStatus, setContractStatus] = useState<{ label: string; value: string }[]>([]);
  const [optionsContractEndStatus, setOptionsContractEndStatus] = useState<{ label: string; value: string }[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);

  // Load dropdowns first, then set form data for edit mode
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setIsLoadingDropdowns(true);

    const loadDropdowns = async () => {
      try {
        // Load Employee Status Dropdown
        const employeeStatusOptions = await getContractStatusDropdownOptions();
        if (mounted) {
          setContractStatus(employeeStatusOptions);
        }

        // Load Contract End Status Dropdown
        const contractEndStatusOptions = await getContractEndStatusDropdownOptions();
        if (mounted) {
          setOptionsContractEndStatus(contractEndStatusOptions);
        }
      } finally {
        if (mounted) {
          setIsLoadingDropdowns(false);
        }
      }
    };

    loadDropdowns();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Set form data after dropdowns are loaded
  useEffect(() => {
    if (!isLoadingDropdowns) {
      if (initialData && mode === 'edit') {
        setForm({
          ...emptyForm,
          ...initialData,
        });
      } else {
        setForm(emptyForm);
      }
      console.log('Initial Data:', initialData);
    }
    console.log('initialData changed:', initialData);
  }, [initialData, isOpen, isLoadingDropdowns, mode]);

  const handleInput = (key: keyof ContractEntry, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  

  // Handle date change from DatePicker (Indonesian format) to ISO format (yyyy-MM-dd)
  const handleDateChange = (key: keyof ContractEntry) => (selectedDates: Date[]) => {
    console.log('Selected Date:', selectedDates);
    if (selectedDates.length > 0) {
      const date = selectedDates[0];
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      console.log('ISO Date:', isoDate);
      console.log('Key:', key);
      handleInput(key, isoDate);
    } else {
      handleInput(key, '');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInput('fileName', file.name);
      onFileChange?.(file);
    } else {
      onFileChange?.(null);
    }
  };

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