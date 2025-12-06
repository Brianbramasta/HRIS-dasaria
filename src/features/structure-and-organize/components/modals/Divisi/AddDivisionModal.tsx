import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { divisionsService } from '../../../services/request/divisions.service';
import { directoratesService } from '../../../services/request/directorates.service';
import type { DirectorateListItem } from '../../../types/organization.api.types';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import { addNotification } from '@/stores/notificationStore';


interface AddDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDivisionModal: React.FC<AddDivisionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [directorateId, setDirectorateId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [directorates, setDirectorates] = useState<DirectorateListItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDirectorates = async () => {
      try {
        // Menggunakan endpoint dropdown direktorat untuk mengambil opsi lebih ringan
        const res = await directoratesService.getDropdown('');
        setDirectorates(res || []);
      } catch (err) {
        console.error('Failed to load directorates', err);
      }
    };
    if (isOpen) loadDirectorates();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setDirectorateId('');
      setMemoNumber('');
      useFileStore.getState().clearSkFile();
    }
  }, [isOpen]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    // Validasi: kirim File SK sesuai kontrak API terbaru
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Divisi tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await divisionsService.create({
        name,
        directorateId,
        description: description || null,
        memoNumber,
        // Kirim file SK sebagai File
        skFile: skFile.file as File,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to add division', err);
      addNotification({
        variant: 'error',
        title: 'Divisi tidak ditambahkan',
        description: 'Gagal menambahkan divisi. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Tambah Divisi"
      content={
        <>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Divisi</label>
          <Input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direktorat</label>
          {/* <select
            value={directorateId}
            onChange={(e) => setDirectorateId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih Direktorat</option>
            {directorates.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select> */}
          <Select
            required
            options={directorates.map(d => ({ value: d.id, label: d.name }))}
            placeholder="Select directorate"
            onChange={(v) => setDirectorateId(v)}
            defaultValue={directorateId}
            className=""
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            required
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deskripsi Umum</label>
          {/* <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          /> */}
          <TextArea
            required
            value={description}
            onChange={(value) => setDescription(value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        

        
        <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />

        </>

              }
    />
  );
};

export default AddDivisionModal;
