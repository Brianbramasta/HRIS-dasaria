import { useEffect, useState, useCallback, useMemo } from 'react';
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
    fetchDivisions,
    fetchDepartments,
    clearDropdowns,
  } = useAddEmployeePositionModalStore();

  // Get selected labels for visibility logic
  const selectedJabatanLabel = useMemo(() => {
    const selected = positionOptions.find(opt => opt.value === jabatan);
    return selected?.label || '';
  }, [positionOptions, jabatan]);

  const selectedStructuralJobLabel = useMemo(() => {
    const selected = structuralJobOptions.find(opt => opt.value === structuralJob);
    return selected?.label || '';
  }, [structuralJobOptions, structuralJob]);

  // Determine field visibility based on job title and structural job
  const visibleFields = useMemo(() => {
    const fields = {
      direktorat: true,
      divisi: true,
      departemen: true,
      unit: true,
    };

    if (!selectedJabatanLabel) return fields;

    // Similar logic to EmployeeDataModal
    if (selectedJabatanLabel.includes('PKL') || selectedJabatanLabel.includes('Internship')) {
      return fields;
    }

    if (selectedJabatanLabel.includes('Kemitraan')) {
      return fields;
    }

    // Staff category logic
    if (['Entry Level', 'Officer'].some(l => selectedJabatanLabel.includes(l))) {
      return fields;
    }
    
    fields.divisi = false;
    fields.departemen = false;
    fields.unit = false;

    if (selectedJabatanLabel.includes('Principal')) {
      fields.divisi = true;
      fields.departemen = true;
      if (['Kepala Branch', 'Branch Leader'].includes(selectedStructuralJobLabel)) {
        fields.unit = true;
      }
    } else if (selectedJabatanLabel.includes('Supervisor')) {
      fields.divisi = true;
      fields.departemen = true;
    } else if (selectedJabatanLabel.includes('Manager')) {
      fields.divisi = true;
    } else if (['Direktur', 'Director'].includes(selectedJabatanLabel)) {
      // Only direktorat
    } else {
      fields.divisi = true;
      fields.departemen = true;
      fields.unit = true;
    }

    return fields;
  }, [selectedJabatanLabel, selectedStructuralJobLabel]);

  const isDisabledField = false; // Can be adjusted based on requirements

  // Handle input changes with reset logic
  const handleInput = useCallback((key: string, value: string) => {
    switch (key) {
      case 'jabatan':
        setJabatan(value);
        setStructuralJob('');
        fetchStructuralJobs(value);
        break;
      case 'structuralJob':
        setStructuralJob(value);
        break;
      case 'direktorat':
        setDirektorat(value);
        setDivisi('');
        setDepartemen('');
        setUnit('');
        fetchDivisions(value);
        break;
      case 'divisi':
        setDivisi(value);
        setDepartemen('');
        setUnit('');
        fetchDepartments(value);
        break;
      case 'departemen':
        setDepartemen(value);
        setUnit('');
        fetchUnits(value);
        break;
      case 'unit':
        setUnit(value);
        break;
    }
  }, [fetchStructuralJobs, fetchDivisions, fetchDepartments, fetchUnits]);

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
    structuralJob,
    direktorat,
    divisi,
    departemen,
    unit,
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
    visibleFields,
    isDisabledField,
    handleFileChange,
    handleSubmit,
    handleClose,
    handleInput,
    searchPositions,
    searchDirectorates,
    searchDivisions,
    searchDepartments,
  };
}

