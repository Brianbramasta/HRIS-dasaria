import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import FileInput from '@/components/form/input/FileInput';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import {iconPlus as Plus} from '@/icons/components/icons'
// import { Plus } from 'lucide-react';
// import { Plus } from 'react-feather';
import { TrashBinIcon } from '@/icons/index';
import Button from '@/components/ui/button/Button';
import { getDocumentTypeDropdownOptions } from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';
import { addNotification } from '@/stores/notificationStore';

type DocumentRow = {
  id: number;
  tipeFile: string;
  type_id: string;
  namaFile: string;
  filePath?: string;
  file?: File;
  document_id?: string;
};

export type PersonalDocumentsForm = {
  tipeFile?: string;
  pendingRows: { tipeFile?: string; type_id?: string; fileName?: string; file?: File }[];
  rows: DocumentRow[];
};

interface Props {
  isOpen: boolean;
  initialData?: PersonalDocumentsForm | null;
  onClose: () => void;
  onSubmit: (data: PersonalDocumentsForm) => void;
  submitting?: boolean;
}

const PersonalDocumentsModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const title = useMemo(() => 'Edit Berkas & Dokumen', []);
  const [documentTypeOptions, setDocumentTypeOptions] = useState<{ value: string; label: string }[]>([]);
  // Dokumentasi: Seed untuk reset FileInput setelah unggah agar input file kosong kembali
  const [fileResetSeed, setFileResetSeed] = useState<number>(0);
  const [form, setForm] = useState<PersonalDocumentsForm>(() => {
    const base: any = initialData || {};
    const rows: DocumentRow[] = Array.isArray(base.rows) ? base.rows : [];
    const pendingRows: { tipeFile?: string; type_id?: string; fileName?: string; file?: File }[] = Array.isArray(base.pendingRows) && base.pendingRows.length
      ? base.pendingRows
      : [{ tipeFile: '', type_id: '', fileName: '' }];
    return { tipeFile: base.tipeFile || '', pendingRows, rows } as PersonalDocumentsForm;
  });

  // Dokumentasi: Sinkronisasi ulang state form ketika initialData berubah atau modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    const base: any = initialData || {};
    const rows: DocumentRow[] = Array.isArray(base.rows) ? base.rows : [];
    const pendingRows: { tipeFile?: string; type_id?: string; fileName?: string; file?: File }[] = Array.isArray(base.pendingRows) && base.pendingRows.length
      ? base.pendingRows
      : [{ tipeFile: '', type_id: '', fileName: '' }];
    setForm({ tipeFile: base.tipeFile || '', pendingRows, rows });
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    getDocumentTypeDropdownOptions()
      .then((opts) => { if (mounted) setDocumentTypeOptions(opts); })
      .catch(() => { setDocumentTypeOptions([]); });
    return () => { mounted = false; };
  }, [isOpen]);

  // Dokumentasi: Mengambil daftar tipe dokumen yang sudah ada di tabel (form.rows) agar tidak muncul di opsi Select
  const usedTypeIdsRows = useMemo(() => {
    const set = new Set<string>();
    (form.rows || []).forEach((r) => {
      const id = String(r.type_id || r.tipeFile || '').trim();
      if (id) set.add(id);
    });
    return set;
  }, [form.rows]);

  // Dokumentasi: Filter opsi Select per baris pending; hilangkan tipe yang sudah dipakai di rows dan pending baris lain
  const getFilteredDocumentTypeOptions = (idx: number) => {
    if (!documentTypeOptions?.length) return [];
    const usedInPending = new Set<string>();
    (form.pendingRows || []).forEach((row, i) => {
      if (i === idx) return;
      const id = String(row.type_id || row.tipeFile || '').trim();
      if (id) usedInPending.add(id);
    });
    return documentTypeOptions.filter((opt) => {
      const val = String(opt.value);
      return !usedTypeIdsRows.has(val) && !usedInPending.has(val);
    });
  };

  // const handleSet = (key: keyof PersonalDocumentsForm, value: any) => {
  //   setForm((prev) => ({ ...prev, [key]: value }));
  // };

  const addPendingRow = () => {
    setForm((prev) => ({ ...prev, pendingRows: [...prev.pendingRows, { tipeFile: '', type_id: '', fileName: '' }] }));
  };

  const removePendingRow = (idx: number) => {
    setForm((prev) => ({ ...prev, pendingRows: prev.pendingRows.filter((_, i) => i !== idx) }));
  };

  const setPendingRowType = (idx: number, v: string) => {
    setForm((prev) => ({
      ...prev,
      pendingRows: prev.pendingRows.map((row, i) => (i === idx ? { ...row, tipeFile: v, type_id: v } : row)),
    }));
  };

  const setPendingRowFile = (idx: number, file?: File, name?: string) => {
    setForm((prev) => ({
      ...prev,
      pendingRows: prev.pendingRows.map((row, i) => (i === idx ? { ...row, fileName: name || '', file } : row)),
    }));
  };


  const handleUploadAdd = () => {
    // Dokumentasi: Validasi wajib isi tipe dokumen dan file di setiap baris sebelum unggah
    const incompleteRows = form.pendingRows.filter((r) => !(r.tipeFile && r.fileName && r.file));
    if (incompleteRows.length) {
      addNotification({
        variant: 'warning',
        title: 'Lengkapi tipe & file',
        description: 'Silakan pilih tipe dokumen dan unggah file untuk setiap baris.',
        hideDuration: 4000,
      });
      return;
    }
    const validRows = form.pendingRows.filter((r) => r.tipeFile && r.fileName && r.file);
    if (!validRows.length) return;
    const baseId = (form.rows[form.rows.length - 1]?.id || 0);
    const nextRows: DocumentRow[] = validRows.map((r, i) => ({
      id: baseId + i + 1,
      tipeFile: r.tipeFile as string,
      type_id: (r.type_id as string) || (r.tipeFile as string),
      namaFile: r.fileName as string,
      file: r.file,
    }));
    console.log('nextRows',nextRows);
    // Dokumentasi: Setelah unggah, kosongkan input file dengan membuat baris pending baru yang kosong
    setForm((prev) => ({ ...prev, rows: [...prev.rows, ...nextRows], pendingRows: [{ tipeFile: '', type_id: '', fileName: '', file: undefined }] }));
    // Dokumentasi: Tingkatkan seed agar FileInput di-remount dan file selection ter-reset
    setFileResetSeed((s) => s + 1);
  };

  const handleDeleteRow = (id: number) => {
    setForm((prev) => ({ ...prev, rows: prev.rows.filter((r) => r.id !== id) }));
  };

  const getDocumentTypeLabel = (type: string) => {
    return documentTypeOptions.find((opt) => opt.value === type)?.label || type;
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
                {/* Dokumentasi: Opsi per baris difilter agar tidak duplikat dengan baris lain dan data tabel */}
                <Select options={getFilteredDocumentTypeOptions(idx)} placeholder="Pilih Jenis Dokumen" defaultValue={row.tipeFile || row.type_id || ''} onChange={(v) => setPendingRowType(idx, v)} />
              </div>
              <div>
                <Label>Upload file</Label>
                {/* Dokumentasi: Gunakan key yang berubah (fileResetSeed) agar FileInput reset setelah unggah */}
                <FileInput key={`file-${idx}-${fileResetSeed}`} onChange={(e) => {
                  const f = e.target.files?.[0];
                  setPendingRowFile(idx, f, f ? f.name : '');
                }} />
              </div>
              <div className="flex items-center gap-2 md:pt-6">
                {form.pendingRows?.length > 1 && idx !== form.pendingRows.length - 1 && (
                  <button type="button" title="Hapus baris" onClick={() => removePendingRow(idx)} className="rounded-xl bg-red-600 px-3 py-3 text-white">
                    <TrashBinIcon className="h-4 w-4 text-white" />
                  </button>
                )}
                {idx === form.pendingRows.length - 1 && (
                  <button type="button" title="Tambah baris" onClick={addPendingRow} className="rounded-xl bg-green-600 px-3 py-3 text-white">
                    <Plus size={16} />
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
                  <TableCell className="px-6 py-4 text-sm">{getDocumentTypeLabel(String(r.tipeFile))}</TableCell>
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
