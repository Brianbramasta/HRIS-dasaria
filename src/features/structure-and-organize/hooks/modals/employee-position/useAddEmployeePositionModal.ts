import { useEffect, useMemo, useState, useRef } from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useApiEmployeePositions } from '../../api/useApiEmployeePositions';
import { useApiJobTitles } from '../../api/useApiJobTitles';
import { useApiDirectorates } from '../../api/useApiDirectorates';
import { useApiDivisions } from '../../api/useApiDivisions';
import { useApiDepartments } from '../../api/useApiDepartments';
import { employeeMasterDataService } from '../../../../employee/services/EmployeeMasterData.service';

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
  const { getDropdown: getPositionDropdown } = useApiJobTitles();
  const { getDropdown: getDirectorateDropdown } = useApiDirectorates();
  const { getDropdown: getDivisionDropdown } = useApiDivisions();
  const { getDropdown: getDepartmentDropdown } = useApiDepartments();

  const [positionOptions, setPositionOptions] = useState<{ value: string; label: string }[]>([]);
  const [structuralJobOptions, setStructuralJobOptions] = useState<{ value: string; label: string }[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<{ value: string; label: string }[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<{ value: string; label: string }[]>([]);
  const [departmentOptionsAll, setDepartmentOptionsAll] = useState<{ value: string; label: string }[]>([]);
  const [unitOptions, setUnitOptions] = useState<{ value: string; label: string }[]>([]);
  const departmentOptions = useMemo(() => departmentOptionsAll, [departmentOptionsAll]);

  const handleFileChange = () => {};

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const posItems = await getPositionDropdown('');
        setPositionOptions((posItems || []).map((p: any) => ({ value: p.id, label: p.job_title_name })));
        const dirItems = await getDirectorateDropdown('');
        setDirectorateOptions((dirItems || []).map((d: any) => ({ value: d.id, label: d.directorate_name })));
        const divItems = await getDivisionDropdown('');
        setDivisionOptions((divItems || []).map((d: any) => ({ value: d.id, label: d.division_name })));
        const depItems = await getDepartmentDropdown('');
        setDepartmentOptionsAll((depItems || []).map((d: any) => ({ value: d.id, label: d.department_name })));
      } catch (e) {
        console.error('Gagal memuat dropdown', e);
      }
    })();
  }, [isOpen, getPositionDropdown, getDirectorateDropdown, getDivisionDropdown, getDepartmentDropdown]);

  // Fetch Structural Jobs when Jabatan (Kepangkatan) changes
  useEffect(() => {
    if (!jabatan) {
      setStructuralJobOptions([]);
      setStructuralJob('');
      return;
    }
    (async () => {
      try {
        const data = await employeeMasterDataService.getStructuralJobDropdown(jabatan);
        setStructuralJobOptions((data || []).map((j: any) => ({ value: j.id, label: j.name })));
      } catch (e) {
        console.error('Gagal memuat dropdown Jabatan Struktural', e);
      }
    })();
  }, [jabatan]);

  // Fetch Units when Department changes
  useEffect(() => {
    if (!departemen) {
      setUnitOptions([]);
      setUnit('');
      return;
    }
    (async () => {
      try {
        const data = await employeeMasterDataService.getUnitDropdownByDepartmentId(departemen, '');
        setUnitOptions((data || []).map((u: any) => ({ value: u.id, label: u.name ?? u.name })));
      } catch (e) {
        console.error('Gagal memuat dropdown Unit', e);
      }
    })();
  }, [departemen]);

  const searchPositionsTimeout = useRef<any>(null);
  const searchDirectoratesTimeout = useRef<any>(null);
  const searchDivisionsTimeout = useRef<any>(null);
  const searchDepartmentsTimeout = useRef<any>(null);

  const searchPositions = (q: string) => {
    if (searchPositionsTimeout.current) clearTimeout(searchPositionsTimeout.current);
    searchPositionsTimeout.current = setTimeout(async () => {
      try {
        const items = await getPositionDropdown(q);
        setPositionOptions((items || []).map((p: any) => ({ value: p.id, label: p.job_title_name })));
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

  const searchDirectorates = (q: string) => {
    if (searchDirectoratesTimeout.current) clearTimeout(searchDirectoratesTimeout.current);
    searchDirectoratesTimeout.current = setTimeout(async () => {
      try {
        const items = await getDirectorateDropdown(q);
        setDirectorateOptions((items || []).map((d: any) => ({ value: d.id, label: d.directorate_name })));
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

  const searchDivisions = (q: string) => {
    if (searchDivisionsTimeout.current) clearTimeout(searchDivisionsTimeout.current);
    searchDivisionsTimeout.current = setTimeout(async () => {
      try {
        const items = await getDivisionDropdown(q);
        setDivisionOptions((items || []).map((d: any) => ({ value: d.id, label: d.division_name })));
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

  const searchDepartments = (q: string) => {
    if (searchDepartmentsTimeout.current) clearTimeout(searchDepartmentsTimeout.current);
    searchDepartmentsTimeout.current = setTimeout(async () => {
      try {
        const items = await getDepartmentDropdown(q);
        setDepartmentOptionsAll((items || []).map((d: any) => ({ value: d.id, label: d.department_name })));
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

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
      setName('');
      setJabatan('');
      setStructuralJob('');
      setDirektorat('');
      setDivisi('');
      setDepartemen('');
      setUnit('');
      setMemoNumber('');
      setDescription('');
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
    searchPositions,
    searchDirectorates,
    searchDivisions,
    searchDepartments,
  };
}

