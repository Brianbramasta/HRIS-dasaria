import React, { useEffect, useState } from 'react';
import { officesService } from '../../../services/request/OfficesService';
import { companiesService } from '../../../services/request/CompaniesService';
import type { OfficeListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import MultiSelect from '@/components/form/MultiSelect';
import { addNotification } from '@/stores/notificationStore';



interface EditOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: OfficeListItem | null;
  onSuccess?: (updated: OfficeListItem) => void;
}

const EditOfficeModal: React.FC<EditOfficeModalProps> = ({ isOpen, onClose, office, onSuccess }) => {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  // DOK: gunakan companyIds sebagai multi-select perusahaan pada update kantor
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ value: string; text: string }[]>([]);

  useEffect(() => {
    if (!isOpen || !office?.id) return;
    (async () => {
      try {
        const fresh = await officesService.getById(office.id);
        setName(fresh.name || '');
        setMemoNumber(fresh.memoNumber || '');
        setDescription(fresh.description || '');

        const initialIds = (fresh as any)?.companyIds ?? ((office as any)?.companyIds ?? []);
        const fallbackId = (fresh as any)?.companyId ?? (office as any)?.companyId;
        const selectedIds = Array.isArray(initialIds) && initialIds.length > 0
          ? initialIds
          : (fallbackId ? [fallbackId] : []);
        setCompanyIds(selectedIds);
        console.log('selectedIds', selectedIds);
        console.log('initialIds', initialIds);
        const res = await companiesService.getDropdown();
        const opts = res.map((c) => ({ value: c.id, text: c.name }));
        // ensure all selected ids exist in options
        const missing = selectedIds.filter((id) => !opts.some((o) => o.value === id));
        for (const id of missing) {
          try {
            const detail = await companiesService.getDetail(id);
            opts.push({ value: id, text: detail.company.name });
          } catch (e) {
            void e;
          }
        }
        setCompanyOptions(opts);
      } catch (e) {
        console.error('Failed to fetch office detail', e);
      }
    })();
  }, [isOpen, office]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {
    // metadata file dikelola oleh FileInput melalui store
  };

  // DOK: submit update mengirim company[n][id_company] melalui officesService.update
  const handleSubmit = async () => {
    if (!office) return;
    if (!name.trim()) return;
    // if (!skFile?.name){
    //       addNotification({
    //         variant: 'error',
    //         title: 'Office tidak ditambahkan',
    //         description: 'File Wajib di isi',
    //         hideDuration: 4000,
    //       });
    //       return;
    //     }
    setSubmitting(true);
    try {
      const updated = await officesService.update(office.id, {
        companyIds: companyIds,
        name: name.trim(),
        description: description.trim() || null,
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file || null,
      });
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update office', err);
      addNotification({
        variant: 'error',
        title: 'Office tidak diupdate',
        description: 'Gagal mengupdate office. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      title="Update Office"
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
        
        <FileInput skFileName={skFile?.name || office?.skFile?.fileName || ''} onChange={handleFileChange} />

        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default EditOfficeModal;
