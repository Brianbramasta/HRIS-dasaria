// Dokumentasi: Modal edit Posisi Pegawai, ambil detail dulu lalu dropdown dinamis
import React, { useEffect, useMemo, useState } from 'react';
import { employeePositionsService } from '../../../services/request/EmployeePositionsService';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/ModalAddEdit';
import Select from '@/components/form/Select';
import { positionsService } from '../../../services/request/PositionService';
import { directoratesService } from '../../../services/request/DirectoratesService';
import { divisionsService } from '../../../services/request/DivisionsService';
import { departmentsService } from '../../../services/request/DepartmentsService';
import { addNotification } from '@/stores/notificationStore';

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
        const detail = await employeePositionsService.detail(employeePosition.id);
        setName(detail.name || '');
        setJabatan(detail.positionId || '');
        setDirektorat(detail.directorateId || '');
        setDivisi(detail.divisionId || '');
        setDepartemen(detail.departmentId || '');
        setMemoNumber(detail.memoNumber || '');
        setDescription((detail as any).description || '');
        console.log('Detail Posisi Pegawai', detail);
        console.log('positionId', detail.positionId)
        // Setelah detail, muat dropdown
        // Dokumentasi: dropdown jabatan pakai service.getDropdown
        const posItems = await positionsService.getDropdown('');
        setPositionOptions((posItems || []).map((p) => ({ value: p.id, label: p.name })));
        console.log('positionOptions', posItems);
        const dirItems = await directoratesService.getDropdown('');
        setDirectorateOptions((dirItems || []).map((d) => ({ value: d.id, label: d.name })));

        const divItems = await divisionsService.getDropdown('');
        setDivisionOptions((divItems || []).map((d) => ({ value: d.id, label: d.name })));

        // Dokumentasi: dropdown departemen pakai service.getDropdown
        const depItems = await departmentsService.getDropdown('');
        setDepartmentOptionsAll((depItems || []).map((d) => ({ value: d.id, label: d.name })));
      } catch (e) {
        console.error('Gagal inisialisasi edit posisi pegawai', e);
      }
    })();
  }, [isOpen, employeePosition?.id]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  // Dokumentasi: submit update Posisi Pegawai - kirim File asli untuk position_decree_file
  const handleSubmit = async () => {
    if (!employeePosition || !name.trim()) return;
    // if (!skFile?.name) {
    //   addNotification({
    //     variant: 'error',
    //     title: 'Posisi Pegawai tidak diupdate',
    //     description: 'File Wajib di isi',
    //     hideDuration: 4000,
    //   });
    //   setSubmitting(false);
    //   return;
    // }
    setSubmitting(true);
    try {
      const updated = await employeePositionsService.update(employeePosition.id, {
        name: name.trim(),
        positionId: jabatan.trim(),
        directorateId: direktorat.trim() || null,
        divisionId: divisi.trim() || null,
        departmentId: departemen.trim() || null,
        startDate: null,
        endDate: null,
        memoNumber: memoNumber.trim(),
        description: description.trim(),
        skFile: skFile?.file || null,
      });
      onSuccess?.(updated);
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
                  // Dokumentasi: cari dropdown jabatan via service.getDropdown
                  const items = await positionsService.getDropdown(q);
                  setPositionOptions((items || []).map((p) => ({ value: p.id, label: p.name })));
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
                  const items = await directoratesService.getDropdown(q);
                  setDirectorateOptions((items || []).map((d) => ({ value: d.id, label: d.name })));
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
                  const items = await divisionsService.getDropdown(q);
                  setDivisionOptions((items || []).map((d) => ({ value: d.id, label: d.name })));
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
                  // Dokumentasi: cari dropdown departemen via service.getDropdown
                  const items = await departmentsService.getDropdown(q);
                  setDepartmentOptionsAll((items || []).map((d) => ({ value: d.id, label: d.name })));
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
