import { useEffect, useMemo, useState } from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useEmployeePositions } from '../../../hooks/useEmployeePositions';
import { usePositions } from '../../../hooks/useJobTitle';
import { useDirectorates } from '../../../hooks/useDirectorates';
import { useDivisions } from '../../../hooks/useDivisions';
import { useDepartments } from '../../../hooks/useDepartments';

interface UseEditEmployeePositionModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: EmployeePositionListItem) => void;
  employeePosition: EmployeePositionListItem | null;
}

export function useEditEmployeePositionModal({
  isOpen,
  onClose,
  onSuccess,
  employeePosition,
}: UseEditEmployeePositionModalParams) {
  const [name, setName] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [direktorat, setDirektorat] = useState('');
  const [divisi, setDivisi] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { updateEmployeePosition, detail } = useEmployeePositions();
  const { getDropdown: getPositionDropdown } = usePositions();
  const { getDropdown: getDirectorateDropdown } = useDirectorates();
  const { getDropdown: getDivisionDropdown } = useDivisions();
  const { getDropdown: getDepartmentDropdown } = useDepartments();

  const [positionOptions, setPositionOptions] = useState<{ value: string; label: string }[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<{ value: string; label: string }[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<{ value: string; label: string }[]>([]);
  const [departmentOptionsAll, setDepartmentOptionsAll] = useState<{ value: string; label: string }[]>([]);
  const departmentOptions = useMemo(() => departmentOptionsAll, [departmentOptionsAll]);

  const handleFileChange = () => {};

  useEffect(() => {
    if (!isOpen || !employeePosition?.id) return;
    (async () => {
      try {
        const mappedDetail = await detail(employeePosition.id);
        if (!mappedDetail) return;
        setName(mappedDetail.name || '');
        setJabatan(mappedDetail.positionId || '');
        setDirektorat(mappedDetail.directorateId || '');
        setDivisi(mappedDetail.divisionId || '');
        setDepartemen(mappedDetail.departmentId || '');
        setMemoNumber(mappedDetail.memoNumber || '');
        setDescription((mappedDetail as any).description || '');
        const posItems = await getPositionDropdown('');
        setPositionOptions((posItems || []).map((p: any) => ({ value: p.id, label: p.job_title_name })));
        const dirItems = await getDirectorateDropdown('');
        setDirectorateOptions((dirItems || []).map((d: any) => ({ value: d.id, label: d.directorate_name })));
        const divItems = await getDivisionDropdown('');
        setDivisionOptions((divItems || []).map((d: any) => ({ value: d.id, label: d.division_name })));
        const depItems = await getDepartmentDropdown('');
        setDepartmentOptionsAll((depItems || []).map((d: any) => ({ value: d.id, label: d.department_name })));
      } catch (e) {
        console.error('Gagal inisialisasi edit posisi pegawai', e);
      }
    })();
  }, [isOpen, employeePosition?.id, detail, getPositionDropdown, getDirectorateDropdown, getDivisionDropdown, getDepartmentDropdown]);

  const searchPositions = async (q: string) => {
    try {
      const items = await getPositionDropdown(q);
      setPositionOptions((items || []).map((p: any) => ({ value: p.id, label: p.name })));
    } catch (e) {
      console.error(e);
    }
  };

  const searchDirectorates = async (q: string) => {
    try {
      const items = await getDirectorateDropdown(q);
      setDirectorateOptions((items || []).map((d: any) => ({ value: d.id, label: d.name })));
    } catch (e) {
      console.error(e);
    }
  };

  const searchDivisions = async (q: string) => {
    try {
      const items = await getDivisionDropdown(q);
      setDivisionOptions((items || []).map((d: any) => ({ value: d.id, label: d.name })));
    } catch (e) {
      console.error(e);
    }
  };

  const searchDepartments = async (q: string) => {
    try {
      const items = await getDepartmentDropdown(q);
      setDepartmentOptionsAll((items || []).map((d: any) => ({ value: d.id, label: d.name })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    if (!employeePosition || !name.trim()) return;
    setSubmitting(true);
    try {
      await updateEmployeePosition(employeePosition.id, {
        name: name.trim(),
        positionId: jabatan.trim(),
        directorateId: direktorat.trim() || null,
        divisionId: divisi.trim() || null,
        departmentId: departemen.trim() || null,
        startDate: null,
        endDate: null,
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file || null,
      });
      onSuccess?.(null as any);
      onClose();
    } catch (err) {
      console.error('Failed to update employee position', err);
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak diupdate',
        description: 'Gagal mengupdate posisi pegawai. Silakan coba lagi.',
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
    direktorat,
    setDirektorat,
    divisi,
    setDivisi,
    departemen,
    setDepartemen,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    positionOptions,
    directorateOptions,
    divisionOptions,
    departmentOptions,
    handleFileChange,
    handleSubmit,
    searchPositions,
    searchDirectorates,
    searchDivisions,
    searchDepartments,
  };
}

