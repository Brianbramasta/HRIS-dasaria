import { useEffect, useState, useCallback } from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore, clearSkFile } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useApiEmployeePositions } from '../../api/useApiEmployeePositions';
import { useAddEmployeePositionModalStore } from '../../../stores/employee-position/useAddEmployeePositionModalStore';

interface UseAddEmployeePositionModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: EmployeePositionListItem) => void;
}

export function useAddEmployeePositionModal({ isOpen, onClose, onSuccess }: UseAddEmployeePositionModalParams) {
  const [name, setName] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [structuralJob, setStructuralJob] = useState('');
  const [direktorat, setDirektorat] = useState('');
  const [divisi, setDivisi] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [unit, setUnit] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { createEmployeePosition } = useApiEmployeePositions();
  
  const {
    positionOptions,
    structuralJobOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    unitOptions,
    searchPositions,
    searchDirectorates,
    searchDivisions,
    searchDepartments,
    fetchStructuralJobs,
    fetchUnits,
    clearDropdowns,
  } = useAddEmployeePositionModalStore();

  const handleFileChange = () => {};

  const clearForm = useCallback(() => {
    setName('');
    setJabatan('');
    setStructuralJob('');
    setDirektorat('');
    setDivisi('');
    setDepartemen('');
    setUnit('');
    setMemoNumber('');
    setDescription('');
    clearDropdowns();
    clearSkFile();
  }, [clearDropdowns]);

  const handleClose = useCallback(() => {
    clearForm();
    onClose();
  }, [clearForm, onClose]);

  // Handle modal open/close - clear when closed, initialize when opened
  useEffect(() => {
    if (!isOpen) {
      clearForm();
      return;
    }
    searchPositions('');
    searchDirectorates('');
    searchDivisions('');
    searchDepartments('');
  }, [isOpen, searchPositions, searchDirectorates, searchDivisions, searchDepartments, clearForm]);

  // Fetch Structural Jobs when Jabatan (Kepangkatan) changes
  useEffect(() => {
    if (!jabatan) {
      return;
    }
    fetchStructuralJobs(jabatan);
  }, [jabatan, fetchStructuralJobs]);

  // Fetch Units when Department changes
  useEffect(() => {
    if (!departemen) {
      return;
    }
    fetchUnits(departemen);
  }, [departemen, fetchUnits]);

  const handleSubmit = async () => {
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await createEmployeePosition({
        name: name.trim(),
        positionId: jabatan.trim(),
        structuralJobId: structuralJob.trim() || null,
        directorateId: direktorat.trim() || null,
        divisionId: divisi.trim() || null,
        departmentId: departemen.trim() || null,
        unitId: unit.trim() || null,
        description: description.trim(),
        startDate: null,
        endDate: null,
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file || null,
      });
      onSuccess?.(null as any);
      clearForm();
      onClose();
    } catch (err) {
      console.error('Failed to create employee position', err);
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak ditambahkan',
        description: 'Gagal menambahkan posisi pegawai. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    jabatan,
    setJabatan,
    structuralJob,
    setStructuralJob,
    direktorat,
    setDirektorat,
    divisi,
    setDivisi,
    departemen,
    setDepartemen,
    unit,
    setUnit,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    positionOptions,
    structuralJobOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    unitOptions,
    handleFileChange,
    handleSubmit,
    handleClose,
    searchPositions,
    searchDirectorates,
    searchDivisions,
    searchDepartments,
  };
}

