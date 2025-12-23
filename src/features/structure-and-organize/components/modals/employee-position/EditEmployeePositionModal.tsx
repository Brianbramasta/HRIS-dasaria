// Dokumentasi: Modal edit Posisi Pegawai, ambil detail dulu lalu dropdown dinamis menggunakan hooks
import React, { useEffect, useMemo, useState } from 'react';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../../../../../components/shared/field/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Select from '@/components/form/Select';
import { addNotification } from '@/stores/notificationStore';
import { useEmployeePositions } from '../../../hooks/useEmployeePositions';
import { usePositions } from '../../../hooks/usePositions';
import { useDirectorates } from '../../../hooks/useDirectorates';
import { useDivisions } from '../../../hooks/useDivisions';
import { useDepartments } from '../../../hooks/useDepartments';

interface EditEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: EmployeePositionListItem) => void;
  employeePosition: EmployeePositionListItem | null;
}

const EditEmployeePositionModal: React.FC<EditEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess, employeePosition }) => {
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

  // Dokumentasi: inisialisasi edit - ambil detail terlebih dahulu, lalu muat dropdown
  const [positionOptions, setPositionOptions] = useState<{ value: string; label: string }[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<{ value: string; label: string }[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<{ value: string; label: string }[]>([]);
  const [departmentOptionsAll, setDepartmentOptionsAll] = useState<{ value: string; label: string }[]>([]);
  const departmentOptions = useMemo(() => {
    // Dokumentasi: gunakan dropdown departemen tanpa filter divisi (endpoint tidak mengembalikan id_division)
    return departmentOptionsAll;
  }, [departmentOptionsAll]);

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
        console.log('Detail Posisi Pegawai', mappedDetail);
        // Setelah detail, muat dropdown
        // Dokumentasi: dropdown jabatan pakai hook.getDropdown
        const posItems = await getPositionDropdown('');
        setPositionOptions((posItems || []).map((p:any) => ({ value: p.id, label: p.job_title_name })));
        console.log('positionOptions', posItems);
        const dirItems = await getDirectorateDropdown('');
        setDirectorateOptions((dirItems || []).map((d:any) => ({ value: d.id, label: d.directorate_name })));

        const divItems = await getDivisionDropdown('');
        setDivisionOptions((divItems || []).map((d:any) => ({ value: d.id, label: d.division_name })));

        // Dokumentasi: dropdown departemen pakai hook.getDropdown
        const depItems = await getDepartmentDropdown('');
        setDepartmentOptionsAll((depItems || []).map((d:any) => ({ value: d.id, label: d.department_name })));
      } catch (e) {
        console.error('Gagal inisialisasi edit posisi pegawai', e);
      }
    })();
  }, [isOpen, employeePosition?.id, detail, getPositionDropdown, getDirectorateDropdown, getDivisionDropdown, getDepartmentDropdown]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  // Dokumentasi: submit update Posisi Pegawai - kirim File asli untuk position_decree_file
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

  return (
    <ModalAddEdit
      title="Update Posisi"
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Posisi</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Jabatan</label>
            <Select
              required
              options={positionOptions}
              placeholder="Pilih Jabatan"
              defaultValue={jabatan}
              onChange={(v) => {setJabatan(v); console.log('value',v);
              }}
              onSearch={async (q) => {
                try {
                  // Dokumentasi: cari dropdown jabatan via hook.getDropdown
                  const items = await getPositionDropdown(q);
                  setPositionOptions((items || []).map((p:any) => ({ value: p.id, label: p.name })));
                } catch (e) { console.error(e); }
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Direktorat</label>
            <Select
              required
              options={directorateOptions}
              placeholder="Pilih Direktorat"
              defaultValue={direktorat}
              onChange={(v) => setDirektorat(v)}
              onSearch={async (q) => {
                try {
                  const items = await getDirectorateDropdown(q);
                  setDirectorateOptions((items || []).map((d:any) => ({ value: d.id, label: d.name })));
                } catch (e) { console.error(e); }
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Divisi</label>
            <Select
              required
              options={divisionOptions}
              placeholder="Pilih Divisi"
              defaultValue={divisi}
              onChange={(v) => { setDivisi(v); setDepartemen(''); }}
              onSearch={async (q) => {
                try {
                  const items = await getDivisionDropdown(q);
                  setDivisionOptions((items || []).map((d:any) => ({ value: d.id, label: d.name })));
                } catch (e) { console.error(e); }
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Departemen</label>
            <Select
              required
              options={departmentOptions}
              placeholder="Pilih Departemen"
              defaultValue={departemen}
              onChange={(v) => setDepartemen(v)}
              onSearch={async (q) => {
                try {
                  // Dokumentasi: cari dropdown departemen via hook.getDropdown
                  const items = await getDepartmentDropdown(q);
                  setDepartmentOptionsAll((items || []).map((d:any) => ({ value: d.id, label: d.name })));
                } catch (e) { console.error(e); }
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
            <input
              required
              type="text"
              value={memoNumber}
              onChange={(e) => setMemoNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gambaran Umum</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Lorem ipsum dolor sit amet consectetur. Nunc et nec vel nec."
            />
          </div>
          <FileInput skFileName={skFile?.name || (employeePosition as any)?.skFile?.fileName || ''} onChange={handleFileChange} />
        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default EditEmployeePositionModal;
