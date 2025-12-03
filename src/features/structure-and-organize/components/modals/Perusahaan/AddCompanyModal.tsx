import React, { useState } from 'react';
import { companyService } from '../../../services/organization.service';
import { useBusinessLines } from '../../../hooks/useBusinessLines';
import type { CompanyListItem, BusinessLineListItem } from '../../../types/organization.api.types';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/components/form/input/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import { addNotification } from '@/stores/notificationStore';
import {  TrashBinIcon } from '@/icons';
import { iconPlus } from '@/icons/components/icons';



interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: CompanyListItem) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [businessLineId, setBusinessLineId] = useState('');
  const [businessLines, setBusinessLines] = useState<BusinessLineListItem[]>([]);
  const [description, setDescription] = useState('');
  // Dokumen dinamis: minimal satu baris wajib dengan file
  const [documents, setDocuments] = useState<{ name: string; number: string; file: File | null }[]>([
    { name: '', number: '', file: null },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const { getDropdown } = useBusinessLines();

  React.useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const items = await getDropdown();
        setBusinessLines(items);
      } catch (e) {
        console.error('Failed to load business lines', e);
      }
    })();
  }, [isOpen, getDropdown]);
  const handleDocChange = (index: number, key: 'name' | 'number', value: string) => {
    setDocuments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleDocFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocuments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], file };
      return next;
    });
  };

  const addDocumentRow = () => {
    setDocuments((prev) => [...prev, { name: '', number: '', file: null }]);
  };

  const removeDocumentRow = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (!documents[0]?.file) {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak ditambahkan',
        description: 'File SK Wajib di isi pada baris pertama',
      });
      return;
    }
    setSubmitting(true);
    try {
      const memoNumber = documents[0].number.trim();
      const skFile = documents[0].file || null;
      const created = await companyService.create({
        name: name.trim(),
        description: description.trim(),
        businessLineId: businessLineId || '',
        memoNumber,
        skFile,
      });
      onSuccess?.(created);
      // reset and close
      setName('');
      setBusinessLineId('');
      setDescription('');
      setDocuments([{ name: '', number: '', file: null }]);
      onClose();
    } catch (err) {
      console.error('Failed to create company', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      title="Tambah Perusahaan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-3xl"
      content={
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Perusahaan</label>
            <Input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lini Bisnis</label>
            <Select
              required
              options={businessLines.map((bl) => ({ label: bl.name, value: bl.id }))}
              placeholder="Pilih Lini Bisnis"
              defaultValue={businessLineId}
              onChange={(value) => setBusinessLineId(value)}
              onSearch={async (q) => {
                try {
                  const items = await getDropdown(q);
                  setBusinessLines(items);
                } catch (e) {
                  console.error('Failed to search business lines', e);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Umum</label>
            <TextArea
              required
              value={description}
              onChange={(e) => setDescription(e)}
              className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter as Deskripsi ..."
            />
          </div>

          <div className="mt-4 hidden md:grid md:grid-cols-12 gap-3 text-sm font-medium">
            <div className="md:col-span-4">Nama Dokumen</div>
            <div className="md:col-span-4">No. Dokumen</div>
            <div className="md:col-span-4">Unggah file</div>
          </div>

          {documents.map((doc, idx) => (
            <div key={idx} className="grid grid-cols-12 items-start gap-3 mb-3">
              <div className="col-span-12 md:col-span-4">
                <label className="text-sm font-medium md:hidden">Nama Dokumen</label>
                <Input
                  required
                  type="text"
                  value={doc.name}
                  onChange={(e) => handleDocChange(idx, 'name', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="text-sm font-medium md:hidden">No. Dokumen</label>
                <Input
                  required
                  type="text"
                  value={doc.number}
                  onChange={(e) => handleDocChange(idx, 'number', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <label className="text-sm font-medium md:hidden">Unggah file</label>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="flex-1">
                    <FileInput onChange={(e) => handleDocFileChange(idx, e)} />
                  </div>
                  {idx === 0 ? (
                    <button
                      type="button"
                      onClick={addDocumentRow}
                      className="ml-0 h-11 w-full rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white hover:bg-emerald-600 md:ml-1 md:h-9 md:w-9 md:px-0"
                      aria-label="Tambah dokumen"
                    >
                      <span className="inline md:hidden">Tambah</span>
                      <span className="hidden  md:flex md:items-center md:justify-center">{iconPlus({ size: 24 })}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeDocumentRow(idx)}
                      className="ml-0 h-11 w-full rounded-lg bg-rose-500 px-4 text-sm font-medium text-white hover:bg-rose-600 md:ml-1 md:h-9 md:w-9 md:px-0"
                      aria-label="Hapus baris dokumen"
                    >
                      <span className="inline md:hidden">Hapus</span>
                      <TrashBinIcon className="hidden md:inline h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      }
    />
  );
};

export default AddCompanyModal;
