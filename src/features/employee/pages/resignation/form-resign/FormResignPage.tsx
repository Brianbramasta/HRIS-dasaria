import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../components/ui/button/Button';
import usePengunduranDiri from '../../../hooks/resignation/usePengunduranDiri';
import { addNotification } from '../../../../../stores/notificationStore';
import Form from '../../../../../components/form/Form';
import Input from '../../../../../components/form/input/InputField';
import DatePicker from '../../../../../components/form/date-picker';
import Select from '../../../../../components/form/Select';
import FileInput from '../../../../../components/shared/form/FileInput';
import { useCompanies } from '../../../../structure-and-organize/hooks/useCompanies';
import { useDirectorates } from '../../../../structure-and-organize/hooks/useDirectorates';
import { useDivisions } from '../../../../structure-and-organize/hooks/useDivisions';
import { useDepartments } from '../../../../structure-and-organize/hooks/useDepartments';
import { usePositions } from '../../../../structure-and-organize/hooks/useJobTitle';
import { useFileStore } from '@/stores/fileStore';
import { IconShare } from '@/icons/components/icons';

export default function FormResignPage() {
  const navigate = useNavigate();
  const { createPengunduranDiri, loading } = usePengunduranDiri({ autoFetch: false });
  const { companies } = useCompanies();
  const { directorates } = useDirectorates();
  const { divisions } = useDivisions();
  const { departments } = useDepartments();
  const { positions } = usePositions();
  const skFile = useFileStore((s) => s.skFile);

  const [form, setForm] = useState({
    idKaryawan: '',
    name: '',
    tanggalPengajuan: '',
    perusahaanId: '',
    direktoratId: '',
    divisiId: '',
    departmentId: '',
    posisiId: '',
    alasan: '',
    status: 'Pending',
  });

  const companyOptions = useMemo(() => (companies || []).map(c => ({ value: (c as any).id ?? '', label: (c as any).name ?? '' })), [companies]);
  const directorateOptions = useMemo(() => (directorates || []).map(d => ({ value: (d as any).id ?? '', label: (d as any).name ?? '' })), [directorates]);
  const divisionOptions = useMemo(() => (divisions || []).map(d => ({ value: (d as any).id ?? '', label: (d as any).name ?? '' })), [divisions]);
  const departmentOptions = useMemo(() => (departments || []).map(d => ({ value: (d as any).id ?? '', label: (d as any).name ?? '' })), [departments]);
  const positionOptions = useMemo(() => (positions || []).map(p => ({ value: (p as any).id ?? '', label: (p as any).name ?? '' })), [positions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = () => {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.idKaryawan ||
      !form.name ||
      !form.departmentId ||
      !form.tanggalPengajuan ||
      !form.alasan ||
      !skFile?.name
    ) {
      addNotification({
        title: 'Form belum lengkap',
        description: 'Lengkapi semua field dan unggah dokumen sebelum submit.',
        variant: 'warning',
      });
      return;
    }

    try {
      const selectedDepartment = departmentOptions.find(d => d.value === form.departmentId)?.label || '';
      const selectedPosition = positionOptions.find(p => p.value === form.posisiId)?.label || '';
      const payload = {
        idKaryawan: form.idKaryawan,
        name: form.name,
        posisi: selectedPosition || undefined,
        department: selectedDepartment,
        departmentId: form.departmentId,
        tanggalPengajuan: form.tanggalPengajuan,
        alasan: form.alasan,
      } as any;
      await createPengunduranDiri(payload);
      addNotification({
        title: 'Berhasil',
        description: 'Pengajuan pengunduran diri tersimpan.',
        variant: 'success',
      });
      navigate('/pengunduran-diri');
    } catch (err) {
        console.log('error',err)
      addNotification({
        title: 'Gagal menyimpan',
        description: 'Terjadi kesalahan saat menyimpan data.',
        variant: 'error',
      });
    }
  };

  return (<>
    <img src="/images/icons/form/dasaria-logo.png" alt="logo" className="h-12 w-auto" />
    <div className="space-y-6 bg-white p-6 rounded-md shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Pengunduran Diri</h1>
        <Button variant="custom" size="sm" onClick={() => {
          const url = `${window.location.origin}/pengunduran-diri/form`;
          navigator.clipboard.writeText(url);
          addNotification({ title: 'Tautan dibagikan', description: 'Link formulir disalin ke clipboard.', variant: 'info' });
        }}>
          <IconShare/>
          Bagikan</Button>
      </div>

      <div className=" border-b-[1px] border-[#000]  pb-4">
        <div className="text-sm text-red-700 space-y-1">
          <div>Ketentuan Unggah Dokumen:</div>
          <ul className="list-disc pl-5">
            <li>Harap menyerahkan dokumen wajib yang diminta, yaitu: <b>Surat Pengunduran Diri</b>, <b>Surat Keterangan Bebas Hutang</b> dan <b>Surat Keterangan Bebas Aset Perusahaan</b>.</li>
            <li>Hanya format JPG dan PDF yang diperbolehkan. Ukuran maksimum masing-masing dokumen <b>10MB</b>.</li>
            <li>Contoh <b>Surat Pengunduran Diri</b> bisa <a href="https://example.com/surat-pengunduran-diri" className='text-blue-600' target="_blank" rel="noopener noreferrer">klik di sini</a>.</li>
          </ul>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">NIP</label>
            <Input name="idKaryawan" value={form.idKaryawan} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Nama Lengkap</label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <DatePicker
              id="tanggal-pengajuan"
              label="Tanggal Pengajuan"
              placeholder="hh/bb/tttt"
              defaultDate={form.tanggalPengajuan as any}
              onChange={(_d:any, dateStr?:string) => setForm(prev => ({ ...prev, tanggalPengajuan: dateStr || '' }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Perusahaan</label>
            <Select
              options={companyOptions}
              placeholder="Pilih Perusahaan"
              defaultValue={form.perusahaanId}
              onChange={(v) => setForm(prev => ({ ...prev, perusahaanId: v }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Direktorat</label>
            <Select
              options={directorateOptions}
              placeholder="Pilih Direktorat"
              defaultValue={form.direktoratId}
              onChange={(v) => setForm(prev => ({ ...prev, direktoratId: v }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Divis</label>
            <Select
              options={divisionOptions}
              placeholder="Pilih Divis"
              defaultValue={form.divisiId}
              onChange={(v) => setForm(prev => ({ ...prev, divisiId: v }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Departement</label>
            <Select
              options={departmentOptions}
              placeholder="Pilih Departement"
              defaultValue={form.departmentId}
              onChange={(v) => setForm(prev => ({ ...prev, departmentId: v }))}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Posisi</label>
            <Select
              options={positionOptions}
              placeholder="Pilih Posisi"
              defaultValue={form.posisiId}
              onChange={(v) => setForm(prev => ({ ...prev, posisiId: v }))}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Alasan Pengunduran diri</label>
          <textarea name="alasan" value={form.alasan} onChange={handleChange} className="w-full rounded border px-3 py-2" rows={4} required />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Surat Pengunduran Diri</label>
          <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} isLabel={false} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={loading}>Submit</Button>
        </div>
      </Form>
    </div>
    </>
  );
}
