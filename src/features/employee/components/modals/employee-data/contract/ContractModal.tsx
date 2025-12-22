import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
// import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/components/shared/field/FileInput';
import DatePicker from '@/components/form/date-picker';
import { formatDateToIndonesian } from '@/utils/formatDate';

export type ContractEntry = {
  id?: number;
  namaLengkap: string;
  statusKontrak: string;
  lamaBekerja: string; // contoh: "3 Tahun"
  ttdKontrakTerakhir: string; // yyyy-MM-dd
  berakhirKontrak: string; // yyyy-MM-dd
  jenisKontrak: string; // PKWT / PKWTT / dll
  kontrakKe: number;
  statusBerakhir: string;
  deskripsi?: string;
  fileName?: string;
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

const optionsStatusKontrak = [
  { value: '1', label: 'Aktif' },
  { value: '2', label: 'Tidak Aktif' },
  { value: '3', label: 'Probation' },
  { value: '4', label: 'Resigned' }
];

const optionsJenisKontrak = [
  { value: '1', label: 'PKWT' },
  { value: '2', label: 'PKWTT' },
];

const optionsStatusBerakhir = [
  { value: '1', label: 'Resign' },
  { value: '2', label: 'PHK' },
  { value: '3', label: 'Tidak Diperpanjang' }
];

const emptyForm: ContractEntry = {
  namaLengkap: '',
  statusKontrak: '',
  lamaBekerja: '',
  ttdKontrakTerakhir: '',
  berakhirKontrak: '',
  jenisKontrak: '',
  kontrakKe: 0,
  statusBerakhir: '-',
  deskripsi: '',
};

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, mode, initialData, onClose, onSubmit, submitting = false, onFileChange, showStatusBerakhir = false }) => {
  const [form, setForm] = useState<ContractEntry>(emptyForm);
  const title = useMemo(() => (mode === 'add' ? 'Tambah Kontrak' : 'Edit Kontrak'), [mode]);

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, isOpen]);

  const handleInput = (key: keyof ContractEntry, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Convert ISO date (yyyy-MM-dd) to Indonesian format (d F Y)
  // const convertToIndonesianDate = (isoDate: string): string => {
  //   if (!isoDate) return '';
  //   const date = new Date(isoDate);
  //   const months = [
  //     'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  //     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  //   ];
  //   const day = date.getDate();
  //   const month = months[date.getMonth()];
  //   const year = date.getFullYear();
  //   return `${day} ${month} ${year}`;
  // };

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
        <InputField readonly placeholder="Nama Lengkap" value={form.namaLengkap} onChange={(e) => handleInput('namaLengkap', e.target.value)} required />
      </div>

      <div className='md:col-span-2'>
        <Label>Status Kontrak</Label>
        <Select options={optionsStatusKontrak} placeholder="Select" defaultValue={form.statusKontrak} onChange={(v) => handleInput('statusKontrak', v)} required />
      </div>
      {/* <div>
        <Label>Lama Bekerja</Label>
        <InputField placeholder="mis. 3 Tahun" value={form.lamaBekerja} onChange={(e) => handleInput('lamaBekerja', e.target.value)} />
      </div> */}

      <div>
        <DatePicker 
          id="ttdKontrakTerakhir" 
          label="TTD Kontrak Terakhir" 
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.ttdKontrakTerakhir) || undefined}
          onChange={handleDateChange('ttdKontrakTerakhir')}
        />
      </div>
      <div>
        <DatePicker 
          id="berakhirKontrak" 
          label="Berakhir Kontrak" 
          placeholder="Pilih Tanggal"
          defaultDate={formatDateToIndonesian(form.berakhirKontrak) || undefined}
          onChange={handleDateChange('berakhirKontrak')}
        />
      </div>

      <div>
        <Label>Jenis Kontrak</Label>
        <Select options={optionsJenisKontrak} placeholder="Select" defaultValue={form.jenisKontrak} onChange={(v) => handleInput('jenisKontrak', v)} required />
      </div>
      <div>
        <Label>Kontrak ke</Label>
        <InputField type="number" min="0" value={form.kontrakKe} onChange={(e) => handleInput('kontrakKe', Number(e.target.value))} />
      </div>

      <div className='md:col-span-2' hidden={!showStatusBerakhir}>
        <Label>Status Berakhir</Label>
        <Select options={optionsStatusBerakhir} placeholder="Select" defaultValue={form.statusBerakhir} onChange={(v) => handleInput('statusBerakhir', v)} />
      </div>
      {/* <div className="col-span-2" hidden>
        <Label>Description</Label>
        <TextArea placeholder="Enter as description ..." rows={4} value={form.deskripsi || ''} onChange={(v) => handleInput('deskripsi', v)} />
      </div> */}

      <div className="col-span-2">
        <FileInput skFileName={form.fileName || ''} onChange={handleFileChange} />
      </div>
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