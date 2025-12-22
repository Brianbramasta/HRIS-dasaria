import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import FileInput from '@/components/form/input/FileInput';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import {iconPlus as Plus} from '@/icons/components/icons'
// import { Plus } from 'lucide-react';
// import { Plus } from 'react-feather';
import { TrashBinIcon } from '@/icons/index';
import Button from '@/components/ui/button/Button';

type DocumentRow = {
  id: number;
  tipeFile: string;
  namaFile: string;
  filePath?: string;
};

export type PersonalDocumentsForm = {
  tipeFile?: string;
  pendingRows: { tipeFile?: string; fileName?: string }[];
  rows: DocumentRow[];
};

interface Props {
  isOpen: boolean;
  initialData?: PersonalDocumentsForm | null;
  onClose: () => void;
  onSubmit: (data: PersonalDocumentsForm) => void;
  submitting?: boolean;
}

const TIPE_DOKUMEN_OPTIONS = [
  { value: 'Kartu Tanda Penduduk', label: 'Kartu Tanda Penduduk' },
  { value: 'Ijazah Terakhir', label: 'Ijazah Terakhir' },
  { value: 'Kartu Keluarga', label: 'Kartu Keluarga' },
  { value: 'BPJS Kesehatan', label: 'BPJS Kesehatan' },
  { value: 'BPJS Ketenagakerjaan', label: 'BPJS Ketenagakerjaan' },
];

const PersonalDocumentsModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const title = useMemo(() => 'Edit Berkas & Dokumen', []);
  const [form, setForm] = useState<PersonalDocumentsForm>(() => {
    const base: any = initialData || {};
    const rows: DocumentRow[] = Array.isArray(base.rows) ? base.rows : [];
    const pendingRows: { tipeFile?: string; fileName?: string }[] = Array.isArray(base.pendingRows) && base.pendingRows.length
      ? base.pendingRows
      : [{ tipeFile: '', fileName: '' }];
    return { tipeFile: base.tipeFile || '', pendingRows, rows } as PersonalDocumentsForm;
  });

  // const handleSet = (key: keyof PersonalDocumentsForm, value: any) => {
  //   setForm((prev) => ({ ...prev, [key]: value }));
  // };

  const addPendingRow = () => {
    setForm((prev) => ({ ...prev, pendingRows: [...prev.pendingRows, { tipeFile: '', fileName: '' }] }));
  };

  const removePendingRow = (idx: number) => {
    setForm((prev) => ({ ...prev, pendingRows: prev.pendingRows.filter((_, i) => i !== idx) }));
  };

  const setPendingRowType = (idx: number, v: string) => {
    setForm((prev) => ({
      ...prev,
      pendingRows: prev.pendingRows.map((row, i) => (i === idx ? { ...row, tipeFile: v } : row)),
    }));
  };

  const setPendingRowFile = (idx: number, name?: string) => {
    setForm((prev) => ({
      ...prev,
      pendingRows: prev.pendingRows.map((row, i) => (i === idx ? { ...row, fileName: name || '' } : row)),
    }));
  };

  const handleUploadAdd = () => {
    const validRows = form.pendingRows.filter((r) => r.tipeFile && r.fileName);
    if (!validRows.length) return;
    const baseId = (form.rows[form.rows.length - 1]?.id || 0);
    const nextRows: DocumentRow[] = validRows.map((r, i) => ({
      id: baseId + i + 1,
      tipeFile: r.tipeFile as string,
      namaFile: r.fileName as string,
    }));
    setForm((prev) => ({ ...prev, rows: [...prev.rows, ...nextRows], pendingRows: [{ tipeFile: '', fileName: '' }] }));
  };

  const handleDeleteRow = (id: number) => {
    setForm((prev) => ({ ...prev, rows: prev.rows.filter((r) => r.id !== id) }));
  };

  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <h4 className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</h4>
      </div>
      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <h3 className="text-xl font-semibold mb-4">Berkas / Dokumen</h3>
        <div className="space-y-4">
          {form.pendingRows?.map((row, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr_auto] items-end">
              <div>
                <Label>Tipe File</Label>
                <Select options={TIPE_DOKUMEN_OPTIONS} placeholder="Pilih Jenis Dokumen" defaultValue={row.tipeFile || ''} onChange={(v) => setPendingRowType(idx, v)} />
              </div>
              <div>
                <Label>Upload file</Label>
                <FileInput onChange={(e) => {
                  const f = e.target.files?.[0];
                  setPendingRowFile(idx, f ? f.name : '');
                }} />
              </div>
              <div className="flex items-center gap-2 md:pt-6">
                {idx === 0 && (
                  <button type="button" title="Tambah baris" onClick={addPendingRow} className="rounded-xl bg-green-600 px-3 py-3 text-white">
                    <Plus size={16} />
                  </button>
                )}
                {form.pendingRows?.length > 1 && idx > 0 && (
                  <button type="button" title="Hapus baris" onClick={() => removePendingRow(idx)} className="rounded-xl bg-red-600 px-3 py-3 text-white">
                    <TrashBinIcon className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant='primary' onClick={handleUploadAdd} className="rounded-xl bg-brand-600 px-5 py-2 text-white">Unggah</Button>
        </div>
      </div>

      <div>
        <Table className="min-w-[640px] md:min-w-full">
          <TableHeader>
            <TableRow className="bg-brand-900 text-white">
              <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">No.</TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tipe File</TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama File</TableCell>
              <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {form.rows.length ? (
              form.rows.map((r, idx) => (
                <TableRow key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="px-6 py-4 text-center text-sm">{idx + 1}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{r.tipeFile}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{r.namaFile}</TableCell>
              <TableCell className="px-6 py-4 text-center">
                <div className="flex items-center justify-center">
                  <button className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/[0.04]" onClick={() => handleDeleteRow(r.id)} title="Hapus">
                    <TrashBinIcon className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Tidak ada berkas/dokumen pribadi</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default PersonalDocumentsModal;