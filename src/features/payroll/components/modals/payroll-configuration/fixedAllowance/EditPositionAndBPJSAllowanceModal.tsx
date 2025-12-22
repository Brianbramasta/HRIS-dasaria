// Dokumentasi: Modal Edit/Detail Tunjangan Jabatan & BPJS
import React, { useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import DocumentsTable from '@/features/structure-and-organize/components/table/TableGlobal';
import Checkbox from '@/components/form/input/Checkbox';

type BpjsRow = { id: string; jenisBpjs: string; selected?: boolean; tt?: boolean; pt?: boolean };

type FormValues = {
  jabatan: string;
  percent: string;
  nominal: string;
  ketenagakerjaan: BpjsRow[];
  kesehatan: BpjsRow[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode: 'detail' | 'edit';
  defaultValues?: Partial<FormValues> | null;
  onSave?: (values: FormValues) => void;
}

// Dokumentasi: Komponen utama modal. Judul menyesuaikan mode (detail/edit)
const EditDetailTunjanganJabatanDanBpjsModal: React.FC<Props> = ({ isOpen, onClose, mode, defaultValues, onSave }) => {
  const jabatanOptions = useMemo(() => [
    { value: 'Entry Level', label: 'Entry Level' },
    { value: 'Officer', label: 'Officer' },
    { value: 'Senior Officer', label: 'Senior Officer' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Direktur', label: 'Direktur' },
  ], []);

  const initial: FormValues = useMemo(() => ({
    jabatan: defaultValues?.jabatan ?? '',
    percent: defaultValues?.percent ?? '',
    nominal: defaultValues?.nominal ?? '',
    ketenagakerjaan: defaultValues?.ketenagakerjaan ?? [
      { id: 'JKK', jenisBpjs: 'JKK', selected: false, tt: false, pt: false },
      { id: 'JKM', jenisBpjs: 'JKM', selected: false, tt: false, pt: false },
      { id: 'JHT', jenisBpjs: 'JHT', selected: false, tt: false, pt: false },
      { id: 'JP', jenisBpjs: 'JP', selected: false, tt: false, pt: false },
    ],
    kesehatan: defaultValues?.kesehatan ?? [
      { id: 'JKN', jenisBpjs: 'JKN', selected: false, tt: false, pt: false },
    ],
  }), [defaultValues]);

  const [form, setForm] = useState<FormValues>(initial);

  // Dokumentasi: helper format angka ke ribuan
  const formatRupiah = (val: string) => {
    const cleaned = (val || '').replace(/[^0-9]/g, '');
    if (!cleaned) return '';
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const setField = (key: keyof FormValues, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === 'nominal' ? formatRupiah(String(value)) : value,
    }));
  };

  const updateBpjs = (group: 'ketenagakerjaan' | 'kesehatan', id: string, field: keyof BpjsRow, value: boolean) => {
    setForm((prev) => ({
      ...prev,
      [group]: prev[group].map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

  const content = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Label>Jabatan</Label>
          <Select options={jabatanOptions} defaultValue={form.jabatan} onChange={(v) => setField('jabatan', v)} placeholder="Pilih Jabatan" />
        </div>
        <div>
          <Label>% Persentase</Label>
          <Input placeholder="Contoh: 10" value={form.percent} onChange={(e) => setField('percent', e.target.value)} />
        </div>
        <div>
          <Label>Nominal</Label>
          <Input placeholder="Contoh: 4.100.000" value={form.nominal} onChange={(e) => setField('nominal', e.target.value)} />
        </div>
      </div>

      <ExpandCard title="Detail BPJS Ketenagakerjaan" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={form.ketenagakerjaan as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'jenisBpjs', label: 'Jenis BPJS', render: (_v: any, row: BpjsRow) => (
              <Checkbox label={row.jenisBpjs} checked={!!row.selected} onChange={(c) => updateBpjs('ketenagakerjaan', row.id, 'selected', c)} />
            ) },
            { id: 'tt', label: 'Tunjangan Tetap', align: 'center', render: (_v: any, row: BpjsRow) => (
              <div className="flex justify-center"><Checkbox checked={!!row.tt} onChange={(c) => updateBpjs('ketenagakerjaan', row.id, 'tt', c)} /></div>
            ) },
            { id: 'pt', label: 'Potongan Tetap', align: 'center', render: (_v: any, row: BpjsRow) => (
              <div className="flex justify-center"><Checkbox checked={!!row.pt} onChange={(c) => updateBpjs('ketenagakerjaan', row.id, 'pt', c)} /></div>
            ) },
          ] as any}
          actionsForRow={() => []}
          isAction={false}
        />
      </ExpandCard>

      <ExpandCard title="Detail BPJS Kesehatan" withHeaderDivider defaultOpen>
        <DocumentsTable
          items={form.kesehatan as any}
          columns={[
            { id: 'no', label: 'No.', align: 'center', render: (_v: any, _r: any, idx: number) => idx + 1 },
            { id: 'jenisBpjs', label: 'Jenis BPJS', render: (_v: any, row: BpjsRow) => (
              <Checkbox label={row.jenisBpjs} checked={!!row.selected} onChange={(c) => updateBpjs('kesehatan', row.id, 'selected', c)} />
            ) },
            { id: 'tt', label: 'Tunjangan Tetap', align: 'center', render: (_v: any, row: BpjsRow) => (
              <div className="flex justify-center"><Checkbox checked={!!row.tt} onChange={(c) => updateBpjs('kesehatan', row.id, 'tt', c)} /></div>
            ) },
            { id: 'pt', label: 'Potongan Tetap', align: 'center', render: (_v: any, row: BpjsRow) => (
              <div className="flex justify-center"><Checkbox checked={!!row.pt} onChange={(c) => updateBpjs('kesehatan', row.id, 'pt', c)} /></div>
            ) },
          ] as any}
          actionsForRow={() => []}
          isAction={false}
        />
      </ExpandCard>
    </div>
  );

  const handleSubmit = () => {
    if (onSave) onSave(form);
    onClose();
  };

  return (
    <ModalAddEdit
      title={mode === 'detail' ? 'Detail Tunjangan Jabatan' : 'Edit Tunjangan Jabatan'}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={handleSubmit}
      submitting={false}
      maxWidth="max-w-4xl"
      confirmTitleButton="Simpan Perubahan"
      closeTitleButton="Tutup"
    />
  );
};

export default EditDetailTunjanganJabatanDanBpjsModal;

