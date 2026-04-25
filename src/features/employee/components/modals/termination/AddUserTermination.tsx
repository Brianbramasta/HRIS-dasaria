import React, { useMemo, useState, useEffect } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import DateField from '@/components/shared/field/DateField';
import FIleField from '@/components/shared/field/FIleField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useApiResignation } from '@/features/employee/hooks/api/useApiResignation';
import { formatDateToIndonesian } from '@/utils/formatDate';

export type AddTerminationForm = {
  nip: string;
  pengguna: string;
  posisi: string;
  statusBerakhir: string;
  tanggalPengajuan: string | null;
  tanggalEfektif: string | null;
  file?: File;
  letter_of_commitment?: File;
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
  const [letterOfCommitment, setLetterOfCommitment] = useState<File | undefined>(undefined);
  const [catatan, setCatatan] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    loading,
    employeeOptions,
    contractEndStatusOptions,
    selectedEmployeeData,
    adminPopup,
    fetchEmployeeList,
    fetchContractEndStatusList,
    fetchAdminPopup,
  } = useApiResignation();

  // Fetch employee list and contract end status on mount
  useEffect(() => {
    if (isOpen) {
      fetchEmployeeList();
      fetchContractEndStatusList();
    }
  }, [isOpen]);

  // Handle employee search with popup data enhancement
  const handleEmployeeSearch = (search: string) => {
    fetchEmployeeList(search);
    
    // If we have a selected NIP and search is empty, fetch popup data
    if (nip && !search.trim()) {
      fetchAdminPopup(nip);
    }
  };

  // Fetch admin popup data when NIP is selected
  useEffect(() => {
    if (nip && isOpen) {
      fetchAdminPopup(nip);
    }
  }, [nip, isOpen, fetchAdminPopup]);

  
  // Update pengguna dan posisi from selected employee data
  useEffect(() => {
    if (selectedEmployeeData?.Personal_Data && selectedEmployeeData?.Employment_Position_Data) {
      setPengguna(selectedEmployeeData.Personal_Data.full_name || '');
      setPosisi(selectedEmployeeData.Employment_Position_Data.position_name || '');
    }
  }, [selectedEmployeeData]);

  // Use popup data to auto-fill form fields when available
  useEffect(() => {
    if (adminPopup?.employee_data) {
      // Use popup data from employee_data nested object
      setPengguna(adminPopup.employee_data.employee_name || '');
      setPosisi(adminPopup.employee_data.position_name || '');
    }
  }, [adminPopup]);

  // Auto-set tanggal efektif when status is "Berakhir" or "Kontrak Selesai"
  useEffect(() => {
    if (statusBerakhir && selectedEmployeeData?.Latest_Contract?.end_date) {
      // Find the selected status option to get the label
      const selectedStatus = contractEndStatusOptions.find(option => option.value === statusBerakhir);
      if (selectedStatus && (selectedStatus.label === 'Berakhir' || selectedStatus.label === 'Kontrak Selesai')) {
        setTanggalEfektif(selectedEmployeeData.Latest_Contract.end_date);
      }
    }
  }, [statusBerakhir, selectedEmployeeData, contractEndStatusOptions]);

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
      setLetterOfCommitment(undefined);
      setCatatan('');
      setValidationError(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f);
  };

  // Validation function for effective date
  const validateEffectiveDate = (effectiveDate: string, contractEndDate: string | null): string | null => {
    if (!effectiveDate || !contractEndDate) {
      return null;
    }
    
    // Parse dates for comparison
    const effective = new Date(effectiveDate);
    const contractEnd = new Date(contractEndDate);
    
    // Check if effective date exceeds contract end date
    if (effective > contractEnd) {
      return 'Tanggal efektif tidak boleh melebihi tanggal berakhir kontrak';
    }
    
    return null;
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
      letter_of_commitment: letterOfCommitment,
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
        disabled={submitting || loading || !nip}
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
          maxDate={(() => {
            if (!adminPopup?.contract_end_date) return undefined;
            const parsed = new Date(adminPopup.contract_end_date);
            // Check if date is valid
            return isNaN(parsed.getTime()) ? undefined : parsed;
          })()}
          disabled={submitting || !nip}
          required
        />
        <DateField
          label="Tanggal Efektif"
          // placeholder="Select a date"
          defaultDate={tanggalEfektif || undefined}
          onChange={(_dates, dateStr) => {
            setTanggalEfektif(dateStr || null);
            // Validate against contract end date
            if (dateStr && adminPopup?.contract_end_date) {
              const error = validateEffectiveDate(dateStr, adminPopup.contract_end_date);
              setValidationError(error);
            } else {
              setValidationError(null);
            }
          }}
          disabled={submitting || !nip}
          required
          minDate={tanggalPengajuan || undefined}
          maxDate={(() => {
            if (!adminPopup?.contract_end_date) return undefined;
            const parsed = new Date(adminPopup.contract_end_date);
            // Check if date is valid
            return isNaN(parsed.getTime()) ? undefined : parsed;
          })()}
          error={validationError || undefined}
        />
        
      </div>
      {adminPopup?.contract_end_date && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tanggal berakhir kontrak: {formatDateToIndonesian(adminPopup.contract_end_date) || adminPopup.contract_end_date}
          </p>
        )}
      <FIleField
        label="Upload Dokumen"
        onChange={handleFileChange}
        required
        disabled={!nip}
      />
      {adminPopup?.has_active_loan && (
        <>
          <FIleField
            label="Surat Komitmen Pelunasan Kasbon"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setLetterOfCommitment(f);
            }}
            required
            disabled={!nip}
          />
          <p className="text-sm text-gray-600 mt-1">
            Harap melampirkan dokumen Komitmen Pelunasan Kasbon dengan template <span className="font-semibold"><a href="https://docs.google.com/document/d/1f9_IC1hI1Ag0mJ6TVAZdggM_W7DsFmdhXJYnULdBLdY/edit?tab=t.0" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">sesuai tautan berikut.</a></span>{' '}
          </p>
        </>
      )}
      <TextAreaField
        label="Catatan"
        placeholder="Deskripsi..."
        value={catatan}
        onChange={(v) => setCatatan(v)}
        rows={4}
        disabled={submitting || !nip}
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
