import { useEffect, useState } from 'react';
import { formatDateToIndonesian } from '@/utils/formatDate';

type UseEffectiveResignationDateModalParams = {
  isOpen: boolean;
  onSubmit: (tanggalEfektif: string, deskripsi: string) => void;
  contractEndDate?: string | null;
};

type UseEffectiveResignationDateModalReturn = {
  tanggalEfektif: string;
  tanggalEfektifIso: string;
  deskripsi: string;
  setDeskripsi: (value: string) => void;
  handleDateChange: (selectedDates: Date[]) => void;
  handleSubmit: () => void;
  validationError: string | null;
};

export function useEffectiveResignationDateModal({
  isOpen,
  onSubmit,
  contractEndDate,
}: UseEffectiveResignationDateModalParams): UseEffectiveResignationDateModalReturn {
  const [tanggalEfektif, setTanggalEfektif] = useState('');
  const [tanggalEfektifIso, setTanggalEfektifIso] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTanggalEfektif('');
      setTanggalEfektifIso('');
      setDeskripsi('');
      setValidationError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!tanggalEfektifIso.trim()) {
      return;
    }
    onSubmit(tanggalEfektifIso, deskripsi);
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      const date = selectedDates[0];
      const yyyy = String(date.getFullYear());
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;
      setTanggalEfektifIso(iso);
      setTanggalEfektif(formatDateToIndonesian(iso) || iso);
      
      // Validate against contract end date
      if (contractEndDate) {
        const effective = new Date(iso);
        const contractEnd = new Date(contractEndDate);
        
        if (effective > contractEnd) {
          setValidationError('Tanggal efektif tidak boleh melebihi tanggal berakhir kontrak');
        } else {
          setValidationError(null);
        }
      } else {
        setValidationError(null);
      }
    }
  };

  return {
    tanggalEfektif,
    tanggalEfektifIso,
    deskripsi,
    setDeskripsi,
    handleDateChange,
    handleSubmit,
    validationError,
  };
}
