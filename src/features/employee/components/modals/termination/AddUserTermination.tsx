import React, { useMemo, useState, useEffect } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import DateField from '@/components/shared/field/DateField';
import FIleField from '@/components/shared/field/FIleField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useApiResignation } from '@/features/employee/hooks/api/useApiResignation';

export type AddTerminationForm = {
  nip: string;
  pengguna: string;
  posisi: string;
  statusBerakhir: string;
  tanggalPengajuan: string | null;
  tanggalEfektif: string | null;
  file?: File;
  catatan?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddTerminationForm) => void;
  submitting?: boolean;
};

const AddUserTermination: React.FC<Props> = ({ isOpen, onClose, onSubmit, submitting = false }) => {
  const title = useMemo(() => 'Tambah User Terminasi', []);
  const [nip, setNip] = useState('');
  const [pengguna, setPengguna] = useState('');
  const [posisi, setPosisi] = useState('');
  const [statusBerakhir, setStatusBerakhir] = useState('');
  const [tanggalPengajuan, setTanggalPengajuan] = useState<string | null>(null);
  const [tanggalEfektif, setTanggalEfektif] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [catatan, setCatatan] = useState('');

  const {
    loading,
    employeeOptions,
    contractEndStatusOptions,
    selectedEmployeeData,
    fetchEmployeeList,
    fetchEmployeePersonalData,
    fetchContractEndStatusList,
  } = useApiResignation();

  // Fetch employee list and contract end status on mount
  useEffect(() => {
    if (isOpen) {
      fetchEmployeeList();
      fetchContractEndStatusList();
    }
  }, [isOpen]);

  // Handle employee search
  const handleEmployeeSearch = (search: string) => {
    fetchEmployeeList(search);
  };

  // Auto-fill pengguna and posisi when employee is selected
  useEffect(() => {
    if (nip && isOpen) {
      fetchEmployeePersonalData(nip);
    }
  }, [nip, isOpen]);

  // Update pengguna dan posisi from selected employee data
  useEffect(() => {
    if (selectedEmployeeData?.Personal_Data && selectedEmployeeData?.Employment_Position_Data) {
      setPengguna(selectedEmployeeData.Personal_Data.full_name || '');
      setPosisi(selectedEmployeeData.Employment_Position_Data.position_name || '');
    }
  }, [selectedEmployeeData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNip('');
      setPengguna('');
      setPosisi('');
      setStatusBerakhir('');
      setTanggalPengajuan(null);
      setTanggalEfektif(null);
      setFile(undefined);
      setCatatan('');
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f);
  };

  const handleSubmit = () => {
    const payload: AddTerminationForm = {
      nip,
      pengguna,
      posisi,
      statusBerakhir,
      tanggalPengajuan,
      tanggalEfektif,
      file,
      catatan,
    };
    onSubmit(payload);
  };

  const content = (
    <div className="space-y-6">
      <SelectField
        label="NIP"
        required
        options={employeeOptions.length > 0 ? employeeOptions : [{ label: 'Memuat opsi...', value: '' }]}
        defaultValue={nip || ''}
        onChange={(v) => setNip(v)}
        onSearch={handleEmployeeSearch}
        placeholder="Pilih NIP"
        disabled={submitting || loading || employeeOptions.length === 0}
      />
      <InputField
        label="Pengguna"
        placeholder="Otomatis"
        value={pengguna}
        disabled={true}
      />
      <InputField
        label="Posisi"
        placeholder="Otomatis"
        value={posisi}
        disabled={true}
      />
      <SelectField
        label="Status Berakhir"
        placeholder="Pilih Status Berakhir"
        options={contractEndStatusOptions.length > 0 ? contractEndStatusOptions : [{ label: 'Memuat opsi...', value: '' }]}
        onChange={(value) => setStatusBerakhir(value)}
        defaultValue={statusBerakhir}
        required
        disabled={submitting || loading}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateField
          label="Tanggal Pengajuan"
          // placeholder="Select a date"
          defaultDate={tanggalPengajuan || undefined}
          onChange={(_dates, dateStr) => {
            setTanggalPengajuan(dateStr || null);
            // Auto-reset Tanggal Efektif if new Tanggal Pengajuan is later than current Tanggal Efektif
            if (dateStr && tanggalEfektif && dateStr > tanggalEfektif) {
              setTanggalEfektif(null);
            }
          }}
          disabled={submitting}
          required
        />
        <DateField
          label="Tanggal Efektif"
          // placeholder="Select a date"
          defaultDate={tanggalEfektif || undefined}
          onChange={(_dates, dateStr) => setTanggalEfektif(dateStr || null)}
          disabled={submitting}
          required
          minDate={tanggalPengajuan || undefined}
        />
      </div>
      <FIleField
        label="Upload Dokumen"
        onChange={handleFileChange}
        required
      />
      <TextAreaField
        label="Catatan"
        placeholder="Deskripsi..."
        value={catatan}
        onChange={(v) => setCatatan(v)}
        rows={4}
        disabled={submitting}
      />
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={submitting || loading}
      maxWidth="max-w-lg"
      titleAlign="center"
    />
  );
};

export default AddUserTermination;
