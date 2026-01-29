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
  const [structuralJob, setStructuralJob] = useState('');
  const [direktorat, setDirektorat] = useState('');
  const [divisi, setDivisi] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [unit, setUnit] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { updateEmployeePosition, detail } = useApiEmployeePositions();
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
    if (!isOpen || !employeePosition?.id) return;
    (async () => {
      try {
        const mappedDetail = await detail(employeePosition.id);
        if (!mappedDetail) return;
        setName(mappedDetail.name || '');
        setJabatan(mappedDetail.positionId || '');
        setStructuralJob(mappedDetail.structuralJobId || '');
        setDirektorat(mappedDetail.directorateId || '');
        setDivisi(mappedDetail.divisionId || '');
        setDepartemen(mappedDetail.departmentId || '');
        setUnit(mappedDetail.unitId || '');
        setMemoNumber(mappedDetail.memoNumber || '');
        setDescription((mappedDetail as any).description || '');

        const posItems = await getPositionDropdown('');
        let posOpts = (posItems || []).map((p: any) => ({ value: p.id, label: p.job_title_name }));
        if (mappedDetail.positionId && mappedDetail.positionName && !posOpts.find(o => o.value === mappedDetail.positionId)) {
          posOpts = [{ value: mappedDetail.positionId, label: mappedDetail.positionName }, ...posOpts];
        }
        setPositionOptions(posOpts);

        if (mappedDetail.positionId) {
          const structItems = await employeeMasterDataService.getStructuralJobDropdown(mappedDetail.positionId);
          let structOpts = (structItems || []).map((j: any) => ({ value: j.id, label: j.name }));
          if (mappedDetail.structuralJobId && mappedDetail.structuralJobName && !structOpts.find(o => o.value === mappedDetail.structuralJobId)) {
            structOpts = [{ value: mappedDetail.structuralJobId, label: mappedDetail.structuralJobName }, ...structOpts];
          }
          setStructuralJobOptions(structOpts);
        }

        const dirItems = await getDirectorateDropdown('');
        let dirOpts = (dirItems || []).map((d: any) => ({ value: d.id, label: d.directorate_name }));
        if (mappedDetail.directorateId && mappedDetail.directorateName && !dirOpts.find(o => o.value === mappedDetail.directorateId)) {
          dirOpts = [{ value: mappedDetail.directorateId, label: mappedDetail.directorateName }, ...dirOpts];
        }
        setDirectorateOptions(dirOpts);

        const divItems = await getDivisionDropdown('');
        let divOpts = (divItems || []).map((d: any) => ({ value: d.id, label: d.division_name }));
        if (mappedDetail.divisionId && mappedDetail.divisionName && !divOpts.find(o => o.value === mappedDetail.divisionId)) {
          divOpts = [{ value: mappedDetail.divisionId, label: mappedDetail.divisionName }, ...divOpts];
        }
        setDivisionOptions(divOpts);

        const depItems = await getDepartmentDropdown('');
        let depOpts = (depItems || []).map((d: any) => ({ value: d.id, label: d.department_name }));
        if (mappedDetail.departmentId && mappedDetail.departmentName && !depOpts.find(o => o.value === mappedDetail.departmentId)) {
          depOpts = [{ value: mappedDetail.departmentId, label: mappedDetail.departmentName }, ...depOpts];
        }
        setDepartmentOptionsAll(depOpts);

        if (mappedDetail.departmentId) {
          const unitItems = await employeeMasterDataService.getUnitDropdownByDepartmentId(mappedDetail.departmentId, '');
          let uOpts = (unitItems || []).map((u: any) => ({ value: u.id, label: u.name ?? u.name }));
          if (mappedDetail.unitId && mappedDetail.unitName && !uOpts.find(o => o.value === mappedDetail.unitId)) {
            uOpts = [{ value: mappedDetail.unitId, label: mappedDetail.unitName }, ...uOpts];
          }
          setUnitOptions(uOpts);
        }

      } catch (e) {
        console.error('Gagal inisialisasi edit posisi pegawai', e);
      }
    })();
  }, [isOpen, employeePosition?.id, detail, getPositionDropdown, getDirectorateDropdown, getDivisionDropdown, getDepartmentDropdown]);

  // Fetch Structural Jobs when Jabatan (Kepangkatan) changes (User interaction)
  useEffect(() => {
    if (!isOpen) return;
    if (!jabatan) {
      setStructuralJobOptions([]);
      // Only reset if user changed it manually, but hard to detect here.
      // Ideally we only want to reset if the change wasn't from initialization.
      // But for simplicity, we let the init logic handle the initial fetch, and this handles updates.
      // To avoid clearing on init, we can check if options are empty?
      // Actually, init logic runs once. This effect runs on `jabatan` change.
      // Init sets `jabatan`. This effect runs.
      // We should be careful not to overwrite the init options if they are already set correctly.
      // However, simplest way: fetch fresh options when jabatan changes.
    } else {
        // We only fetch if options are not already populated for this jabatan?
        // Or just fetch always.
        (async () => {
             try {
                 const data = await employeeMasterDataService.getStructuralJobDropdown(jabatan);
                 setStructuralJobOptions((data || []).map((j: any) => ({ value: j.id, label: j.name })));
             } catch (e) {
                 console.error(e);
             }
        })();
    }
  }, [jabatan, isOpen]);

  // Fetch Units when Department changes
  useEffect(() => {
    if (!isOpen) return;
    if (!departemen) {
        setUnitOptions([]);
    } else {
        (async () => {
             try {
                 const data = await employeeMasterDataService.getUnitDropdownByDepartmentId(departemen, '');
                 setUnitOptions((data || []).map((u: any) => ({ value: u.id, label: u.name ?? u.name })));
             } catch (e) {
                 console.error(e);
             }
        })();
    }
  }, [departemen, isOpen]);

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
    if (!employeePosition || !name.trim()) return;
    setSubmitting(true);
    try {
      await updateEmployeePosition(employeePosition.id, {
        name: name.trim(),
        positionId: jabatan.trim(),
        structuralJobId: structuralJob.trim() || null,
        directorateId: direktorat.trim() || null,
        divisionId: divisi.trim() || null,
        departmentId: departemen.trim() || null,
        unitId: unit.trim() || null,
        startDate: null,
        endDate: null,
        memoNumber: memoNumber.trim(),
        description: description.trim(),
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

