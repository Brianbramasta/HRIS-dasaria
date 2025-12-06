import React, { useEffect, useState } from 'react';
import { officesService } from '../../../services/request/offices.service';
import { companiesService } from '../../../services/request/companies.service';
import type { OfficeListItem } from '../../../types/organization.api.types';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';
import MultiSelect from '@/components/form/MultiSelect';



interface AddOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: OfficeListItem) => void;
}

const AddOfficeModal: React.FC<AddOfficeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  // DOK: gunakan companyIds sebagai multi-select perusahaan sesuai api.contract.kantor.md
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ value: string; text: string }[]>([]);
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await companiesService.getDropdown();
        setCompanyOptions(res.map((c) => ({ value: c.id, text: c.name })));
      } catch (e) {
        console.error('Failed to fetch companies', e);
      }
    })();
  }, [isOpen]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {
    // metadata file dikelola oleh FileInput melalui store
  };

  // DOK: submit create mengirim company[n][id_company] melalui officesService.create
  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (!skFile?.name){
      addNotification({
        variant: 'error',
        title: 'Office tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    if (!companyIds.length) {
      addNotification({
        variant: 'error',
        title: 'Office tidak ditambahkan',
        description: 'Perusahaan wajib diisi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      const created = await officesService.create({
        companyIds: companyIds,
        name: name.trim(),
        description: description.trim() || null,
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file || undefined,
      });
      onSuccess?.(created);
      setName('');
      setCompanyIds([]);
      setMemoNumber('');
      setDescription('');
      useFileStore.getState().clearSkFile();
      onClose();
    } catch (err) {
      console.error('Failed to create office', err);
      addNotification({
        variant: 'error',
        title: 'Office tidak ditambahkan',
        description: 'Gagal menambahkan office. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
    <ModalAddEdit
      title="Tambah Office"
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          <div className="space-y-2">
          <label className="text-sm font-medium">Nama Office</label>
          <Input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <MultiSelect
          label="Perusahaan"
          options={companyOptions}
          defaultSelected={companyIds}
          onChange={setCompanyIds}
        />

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
          <TextArea
            required
            value={description}
            onChange={(e) => setDescription(e)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
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

export default AddOfficeModal;
