// Dokumentasi: Modal tambah Posisi Pegawai dengan dropdown dinamis menggunakan service
import React, { useEffect, useMemo, useState } from 'react';
import { employeePositionsService } from '../../../services/request/employeePositions.service';
import type { EmployeePositionListItem } from '../../../types/organization.api.types';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import { addNotification } from '@/stores/notificationStore';
import Select from '@/components/form/Select';
import { positionsService } from '../../../services/request/positions.service';
import { directoratesService } from '../../../services/request/directorates.service';
import { divisionsService } from '../../../services/request/divisions.service';
import { departmentsService } from '../../../services/request/departments.service';

interface AddEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: EmployeePositionListItem) => void;
}

const AddEmployeePositionModal: React.FC<AddEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [direktorat, setDirektorat] = useState('');
  const [divisi, setDivisi] = useState('');
  const [departemen, setDepartemen] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  // Dokumentasi: state opsi dropdown (posisi/jabatan, direktorat, divisi, departemen)
  const [positionOptions, setPositionOptions] = useState<{ value: string; label: string }[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<{ value: string; label: string }[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<{ value: string; label: string }[]>([]);
  const [departmentOptionsAll, setDepartmentOptionsAll] = useState<{ value: string; label: string }[]>([]);
  const departmentOptions = useMemo(() => {
    // Dokumentasi: gunakan dropdown departemen tanpa filter divisi (endpoint tidak mengembalikan id_division)
    return departmentOptionsAll;
  }, [departmentOptionsAll]);

  // Dokumentasi: handler perubahan file SK (metadata disimpan di store)
  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  // Dokumentasi: muat dropdown dinamis saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        // Dokumentasi: posisi/jabatan - gunakan endpoint dropdown dari service
        const posItems = await positionsService.getDropdown('');
        setPositionOptions((posItems || []).map((p) => ({ value: p.id, label: p.name })));

        // direktorat: endpoint dropdown
        const dirItems = await directoratesService.getDropdown('');
        setDirectorateOptions((dirItems || []).map((d) => ({ value: d.id, label: d.name })));

        // divisi: endpoint dropdown
        const divItems = await divisionsService.getDropdown('');
        setDivisionOptions((divItems || []).map((d) => ({ value: d.id, label: d.name })));

        // Dokumentasi: departemen - gunakan endpoint dropdown dari service
        const depItems = await departmentsService.getDropdown('');
        setDepartmentOptionsAll((depItems || []).map((d) => ({ value: d.id, label: d.name })));
      } catch (e) {
        console.error('Gagal memuat dropdown', e);
      }
    })();
  }, [isOpen]);

  // Dokumentasi: submit pembuatan Posisi Pegawai - kirim File asli untuk position_decree_file
  const handleSubmit = async () => {
    console.log('submit', name, jabatan, direktorat, divisi, departemen, memoNumber, description, skFile);
    
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
      const created = await employeePositionsService.create({
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
      onSuccess?.(created);
      setName('');
      setJabatan('');
      setDirektorat('');
      setDivisi('');
      setDepartemen('');
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

  return (
    <ModalAddEdit
      title="Tambah Posisi"
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
              onChange={(v) => setJabatan(v)}
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
              onChange={(v) => { setDivisi(v); /* reset departemen jika divisi berubah */ setDepartemen(''); }}
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
          <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />
        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default AddEmployeePositionModal;
